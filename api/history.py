"""
Generation history endpoint.

GET /api/history -> Returns generation history (empty for now, no persistent storage on Vercel).

In a production deployment, this would connect to a database or external storage
service to retrieve past generation records.
"""

from http.server import BaseHTTPRequestHandler
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _lib.cors import send_json, handle_preflight


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        send_json(self, {
            "history": [],
            "total": 0,
            "message": "History is not persisted in the current serverless deployment. "
                       "Connect a database for persistent history.",
        })

    def do_OPTIONS(self):
        handle_preflight(self)

    def log_message(self, format, *args):
        pass
