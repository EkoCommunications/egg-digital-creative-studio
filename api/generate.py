"""
Creative generation endpoint.

POST /api/generate
Accepts JSON body with:
  - reference_image_base64 (str, required): Base64-encoded reference image
  - reference_image_mime (str, required): MIME type (e.g. "image/png")
  - segments (list[str], required): List of segment IDs to generate for
  - aspect_ratio (str, optional): "auto", "1:1", "16:9", "9:16" (default "auto")
  - edit_areas (list[str], optional): Areas to modify - "actor", "background", "text"
  - brand_ci_base64 (str, optional): Base64-encoded brand CI PDF

Returns JSON with generated images per segment.
"""

from http.server import BaseHTTPRequestHandler
import json
import logging
import sys
import os
import time
import traceback

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _lib.cors import send_json, send_error, handle_preflight
from _lib.segments_data import get_segments_by_ids, get_segment_by_id
from _lib.prompt_builder import build_prompt
from _lib.gemini_client import generate_image, GeminiClientError

logger = logging.getLogger(__name__)

# Validation constants
VALID_ASPECT_RATIOS = {"auto", "1:1", "16:9", "9:16"}
VALID_EDIT_AREAS = {"actor", "background", "text"}
VALID_IMAGE_MIMES = {"image/png", "image/jpeg", "image/jpg", "image/webp", "image/gif"}
MAX_IMAGE_SIZE_BYTES = 20 * 1024 * 1024  # 20 MB base64 limit (generous)
MAX_SEGMENTS_PER_REQUEST = 8


def _read_body(handler_instance):
    """Read and parse the JSON request body."""
    content_length = int(handler_instance.headers.get("Content-Length", 0))
    if content_length == 0:
        return None
    raw = handler_instance.rfile.read(content_length)
    return json.loads(raw.decode("utf-8"))


def _validate_request(body):
    """
    Validate the incoming request body.

    Returns:
        (is_valid: bool, error_message: str or None)
    """
    if not body:
        return False, "Request body is required."

    # Required fields
    if not body.get("reference_image_base64"):
        return False, "reference_image_base64 is required."

    if not body.get("reference_image_mime"):
        return False, "reference_image_mime is required."

    if body["reference_image_mime"] not in VALID_IMAGE_MIMES:
        return False, (
            f"Invalid reference_image_mime. Must be one of: {', '.join(sorted(VALID_IMAGE_MIMES))}"
        )

    # Check base64 size (rough estimate)
    img_size = len(body["reference_image_base64"])
    if img_size > MAX_IMAGE_SIZE_BYTES:
        return False, f"Reference image too large. Max base64 size: {MAX_IMAGE_SIZE_BYTES} bytes."

    # Segments
    segments = body.get("segments")
    if not segments or not isinstance(segments, list):
        return False, "segments must be a non-empty array of segment IDs."

    if len(segments) > MAX_SEGMENTS_PER_REQUEST:
        return False, f"Maximum {MAX_SEGMENTS_PER_REQUEST} segments per request."

    # Validate segment IDs exist
    for sid in segments:
        if not isinstance(sid, str):
            return False, f"Invalid segment ID: {sid}. Must be a string."
        if get_segment_by_id(sid) is None:
            return False, f"Unknown segment ID: {sid}"

    # Aspect ratio
    aspect_ratio = body.get("aspect_ratio", "auto")
    if aspect_ratio not in VALID_ASPECT_RATIOS:
        return False, (
            f"Invalid aspect_ratio. Must be one of: {', '.join(sorted(VALID_ASPECT_RATIOS))}"
        )

    # Edit areas
    edit_areas = body.get("edit_areas", [])
    if edit_areas:
        if not isinstance(edit_areas, list):
            return False, "edit_areas must be an array."
        invalid = set(edit_areas) - VALID_EDIT_AREAS
        if invalid:
            return False, (
                f"Invalid edit_areas: {', '.join(invalid)}. "
                f"Must be from: {', '.join(sorted(VALID_EDIT_AREAS))}"
            )

    return True, None


class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        start_time = time.time()

        # Parse request body
        try:
            body = _read_body(self)
        except json.JSONDecodeError as e:
            send_error(self, f"Invalid JSON in request body: {str(e)}")
            return
        except Exception as e:
            send_error(self, f"Failed to read request body: {str(e)}", status_code=500)
            return

        # Validate
        is_valid, error_msg = _validate_request(body)
        if not is_valid or body is None:
            send_error(self, error_msg or "Request body is required", status_code=400)
            return

        # Extract fields (body is guaranteed non-None after validation)
        reference_image_base64 = body["reference_image_base64"]
        reference_image_mime = body["reference_image_mime"]
        segment_ids = body["segments"]
        aspect_ratio = body.get("aspect_ratio", "auto")
        edit_areas = body.get("edit_areas", ["actor", "background", "text"])
        brand_ci_base64 = body.get("brand_ci_base64")

        # Resolve segments
        segments = get_segments_by_ids(segment_ids)

        has_brand_ci = brand_ci_base64 is not None and len(brand_ci_base64) > 0

        # Generate for each segment
        results = []
        errors = []

        for segment in segments:
            segment_start = time.time()
            try:
                prompt = build_prompt(
                    segment=segment,
                    edit_areas=edit_areas,
                    aspect_ratio=aspect_ratio,
                    has_brand_ci=has_brand_ci,
                )

                generation_result = generate_image(
                    prompt=prompt,
                    reference_image_base64=reference_image_base64,
                    reference_image_mime=reference_image_mime,
                    brand_ci_base64=brand_ci_base64 if has_brand_ci else None,
                )

                segment_duration = round(time.time() - segment_start, 2)

                results.append({
                    "segment_id": segment["id"],
                    "segment_name": segment["name"],
                    "image_base64": generation_result["image_base64"],
                    "image_mime": generation_result["image_mime"],
                    "description": generation_result.get("text"),
                    "prompt_used": prompt,
                    "generation_time_seconds": segment_duration,
                    "status": "success",
                })

            except GeminiClientError as e:
                segment_duration = round(time.time() - segment_start, 2)
                logger.error(
                    "Gemini error for segment %s: %s", segment["id"], str(e)
                )
                errors.append({
                    "segment_id": segment["id"],
                    "segment_name": segment["name"],
                    "error": str(e),
                    "details": e.details,
                    "generation_time_seconds": segment_duration,
                    "status": "error",
                })

            except Exception as e:
                segment_duration = round(time.time() - segment_start, 2)
                logger.error(
                    "Unexpected error for segment %s: %s\n%s",
                    segment["id"],
                    str(e),
                    traceback.format_exc(),
                )
                errors.append({
                    "segment_id": segment["id"],
                    "segment_name": segment["name"],
                    "error": f"Internal error: {str(e)}",
                    "generation_time_seconds": segment_duration,
                    "status": "error",
                })

        total_duration = round(time.time() - start_time, 2)

        # Determine overall status
        if len(results) == 0 and len(errors) > 0:
            overall_status = "failed"
            status_code = 502
        elif len(errors) > 0:
            overall_status = "partial"
            status_code = 207  # Multi-Status
        else:
            overall_status = "success"
            status_code = 200

        response = {
            "status": overall_status,
            "results": results,
            "errors": errors,
            "metadata": {
                "total_segments": len(segments),
                "successful": len(results),
                "failed": len(errors),
                "total_time_seconds": total_duration,
                "aspect_ratio": aspect_ratio,
                "edit_areas": edit_areas,
            },
        }

        send_json(self, response, status_code=status_code)

    def do_OPTIONS(self):
        handle_preflight(self)

    def log_message(self, format, *args):
        pass
