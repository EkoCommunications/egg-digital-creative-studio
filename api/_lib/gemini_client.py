"""
Google Gemini API client for image generation.

Uses the Generative AI REST API with the gemini-2.0-flash-exp model
which supports image generation via responseModalities.
"""

import base64
import json
import logging
import os
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

logger = logging.getLogger(__name__)

GEMINI_MODEL = "gemini-2.0-flash-exp"
GEMINI_BASE_URL = "https://generativelanguage.googleapis.com"
GENERATE_ENDPOINT = f"/v1beta/models/{GEMINI_MODEL}:generateContent"

# Timeout for API calls in seconds
REQUEST_TIMEOUT = 120


class GeminiClientError(Exception):
    """Raised when the Gemini API returns an error or is unreachable."""

    def __init__(self, message, status_code=None, details=None):
        super().__init__(message)
        self.status_code = status_code
        self.details = details


def _get_api_key():
    """Retrieve the Gemini API key from environment variables."""
    key = os.environ.get("GOOGLE_AI_STUDIO_API_KEY")
    if not key:
        raise GeminiClientError(
            "GOOGLE_AI_STUDIO_API_KEY environment variable is not set.",
            status_code=500,
        )
    return key


def _build_request_body(prompt, reference_image_base64, reference_image_mime, brand_ci_base64=None):
    """
    Build the Gemini API request body.

    Args:
        prompt: The text prompt for generation.
        reference_image_base64: Base64-encoded reference image data.
        reference_image_mime: MIME type of the reference image.
        brand_ci_base64: Optional base64-encoded brand CI PDF.

    Returns:
        Dict representing the JSON request body.
    """
    parts = [
        {"text": prompt},
        {
            "inline_data": {
                "mime_type": reference_image_mime,
                "data": reference_image_base64,
            }
        },
    ]

    # If brand CI PDF is provided, include it as an additional part
    if brand_ci_base64:
        parts.append(
            {
                "inline_data": {
                    "mime_type": "application/pdf",
                    "data": brand_ci_base64,
                }
            }
        )

    return {
        "contents": [
            {
                "parts": parts,
            }
        ],
        "generationConfig": {
            "responseModalities": ["IMAGE", "TEXT"],
            "temperature": 0.8,
            "topP": 0.95,
        },
    }


def _parse_response(response_data):
    """
    Parse the Gemini API response and extract generated image data.

    Args:
        response_data: Parsed JSON response from the API.

    Returns:
        Dict with 'image_base64', 'image_mime', and optionally 'text'.

    Raises:
        GeminiClientError: If no image is found in the response.
    """
    result = {"image_base64": None, "image_mime": None, "text": None}

    candidates = response_data.get("candidates", [])
    if not candidates:
        # Check for prompt feedback / blocking
        prompt_feedback = response_data.get("promptFeedback", {})
        block_reason = prompt_feedback.get("blockReason")
        if block_reason:
            raise GeminiClientError(
                f"Generation blocked by safety filter: {block_reason}",
                status_code=422,
                details=prompt_feedback,
            )
        raise GeminiClientError(
            "No candidates returned from Gemini API.",
            status_code=502,
        )

    # Extract parts from the first candidate
    content = candidates[0].get("content", {})
    parts = content.get("parts", [])

    for part in parts:
        if "inlineData" in part:
            inline = part["inlineData"]
            result["image_base64"] = inline.get("data")
            result["image_mime"] = inline.get("mimeType", "image/png")
        elif "text" in part:
            result["text"] = part["text"]

    if not result["image_base64"]:
        # Check finish reason
        finish_reason = candidates[0].get("finishReason", "UNKNOWN")
        raise GeminiClientError(
            f"No image generated. Finish reason: {finish_reason}",
            status_code=502,
            details={"finish_reason": finish_reason, "text": result.get("text")},
        )

    return result


def generate_image(prompt, reference_image_base64, reference_image_mime, brand_ci_base64=None):
    """
    Call the Gemini API to generate a modified image.

    Args:
        prompt: The generation prompt.
        reference_image_base64: Base64-encoded reference image.
        reference_image_mime: MIME type of the reference image (e.g. 'image/png').
        brand_ci_base64: Optional base64-encoded brand CI PDF.

    Returns:
        Dict with keys: image_base64, image_mime, text (optional description).

    Raises:
        GeminiClientError: On API errors or missing configuration.
    """
    api_key = _get_api_key()
    url = f"{GEMINI_BASE_URL}{GENERATE_ENDPOINT}?key={api_key}"

    body = _build_request_body(prompt, reference_image_base64, reference_image_mime, brand_ci_base64)
    body_bytes = json.dumps(body).encode("utf-8")

    request = Request(
        url,
        data=body_bytes,
        headers={"Content-Type": "application/json"},
        method="POST",
    )

    try:
        logger.info("Calling Gemini API for image generation...")
        with urlopen(request, timeout=REQUEST_TIMEOUT) as response:
            response_body = response.read()
            response_data = json.loads(response_body)
    except HTTPError as e:
        error_body = ""
        try:
            error_body = e.read().decode("utf-8")
            error_data = json.loads(error_body)
            error_message = error_data.get("error", {}).get("message", error_body)
        except Exception:
            error_message = error_body or str(e)

        logger.error("Gemini API HTTP error %d: %s", e.code, error_message)
        raise GeminiClientError(
            f"Gemini API error: {error_message}",
            status_code=e.code,
            details=error_message,
        )
    except URLError as e:
        logger.error("Gemini API connection error: %s", e.reason)
        raise GeminiClientError(
            f"Failed to connect to Gemini API: {e.reason}",
            status_code=502,
        )
    except Exception as e:
        logger.error("Unexpected error calling Gemini API: %s", str(e))
        raise GeminiClientError(
            f"Unexpected error: {str(e)}",
            status_code=500,
        )

    return _parse_response(response_data)
