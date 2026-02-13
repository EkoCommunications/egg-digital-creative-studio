"""
Health check endpoint.

GET /api/health -> {"status": "ok", "version": "1.0.0"}
"""

from http.server import BaseHTTPRequestHandler
import json
import sys
import os

# Add parent directory to path for shared lib imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from _lib.cors import send_json, handle_preflight


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        send_json(self, {
            "status": "ok",
            "version": "1.0.0",
            "service": "Egg Digital Dynamic Creative Intelligence Platform",
        })

    def do_OPTIONS(self):
        handle_preflight(self)

    def log_message(self, format, *args):
        """Suppress default stderr logging in Vercel environment."""
        pass
