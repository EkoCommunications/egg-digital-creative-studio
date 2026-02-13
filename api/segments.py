"""
Audience segments endpoint.

GET /api/segments -> Returns all available audience segments.
GET /api/segments?id=segment_id -> Returns a single segment by ID.
"""

from http.server import BaseHTTPRequestHandler
import sys
import os
from urllib.parse import urlparse, parse_qs

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _lib.cors import send_json, send_error, handle_preflight
from _lib.segments_data import get_all_segments, get_segment_by_id


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)
        params = parse_qs(parsed.query)

        # If an 'id' query parameter is provided, return a single segment
        segment_id = params.get("id", [None])[0]

        if segment_id:
            segment = get_segment_by_id(segment_id)
            if segment is None:
                send_error(self, f"Segment not found: {segment_id}", status_code=404)
                return
            send_json(self, {"segment": segment})
        else:
            segments = get_all_segments()
            send_json(self, {
                "segments": segments,
                "total": len(segments),
            })

    def do_OPTIONS(self):
        handle_preflight(self)

    def log_message(self, format, *args):
        pass
