"""
Local development server that mimics Vercel's serverless function routing.
Routes /api/* requests to the appropriate Python handler modules.
"""

import json
import sys
import os
from http.server import HTTPServer, BaseHTTPRequestHandler
from io import BytesIO
from urllib.parse import urlparse, parse_qs
import importlib

# Add api directory to path
API_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "api")
sys.path.insert(0, API_DIR)

PORT = 3000


class FakeHandler:
    """Mimics BaseHTTPRequestHandler interface for Vercel handlers."""
    
    def __init__(self, method, path, headers, body=None):
        self.command = method
        self.path = path
        self.headers = headers
        self.body = body
        self.rfile = BytesIO(body.encode('utf-8') if isinstance(body, str) else (body or b''))
        self.wfile = BytesIO()
        self._response_code = 200
        self._response_headers = {}
        self._headers_sent = False
    
    def send_response(self, code):
        self._response_code = code
    
    def send_header(self, key, value):
        self._response_headers[key] = value
    
    def end_headers(self):
        self._headers_sent = True
    
    def get_response(self):
        return self._response_code, self._response_headers, self.wfile.getvalue()


class LocalDevHandler(BaseHTTPRequestHandler):
    """Routes requests to the appropriate Vercel serverless handler."""
    
    ROUTE_MAP = {
        '/api/health': 'health',
        '/api/segments': 'segments',
        '/api/generate': 'generate',
        '/api/history': 'history',
    }
    
    def _get_handler_module(self, path):
        parsed = urlparse(path)
        route = parsed.path.rstrip('/')
        module_name = self.ROUTE_MAP.get(route)
        if module_name:
            try:
                mod = importlib.import_module(module_name)
                importlib.reload(mod)  # Hot reload for dev
                return mod
            except Exception as e:
                print(f"Error importing module {module_name}: {e}")
                return None
        return None
    
    def _proxy_to_handler(self, method):
        mod = self._get_handler_module(self.path)
        if not mod:
            self.send_response(404)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Not found"}).encode())
            return
        
        # Read body for POST/PUT
        body = None
        content_length = int(self.headers.get('Content-Length', 0))
        if content_length > 0:
            body = self.rfile.read(content_length)
        
        # Create a fake handler that mimics BaseHTTPRequestHandler
        fake = FakeHandler(method, self.path, self.headers, body)
        
        # Get the handler class and invoke
        handler_class = mod.handler
        
        # We need to actually create the proper handler - the Vercel handlers
        # use BaseHTTPRequestHandler methods directly, so let's just forward
        # the request using the real handler
        
        # Instead, let's use a simpler approach - directly call the handler methods
        # We'll monkey-patch our actual handler to act as the Vercel handler
        original_wfile = self.wfile
        original_rfile = self.rfile
        
        if body:
            self.rfile = BytesIO(body)
        
        try:
            # Create an instance that shares our socket
            h = handler_class.__new__(handler_class)
            h.rfile = BytesIO(body) if body else BytesIO()
            h.wfile = self.wfile
            h.headers = self.headers
            h.path = self.path
            h.command = method
            h.request_version = self.request_version
            h.client_address = self.client_address
            h.server = self.server
            h.close_connection = True
            h.requestline = f"{method} {self.path} {self.request_version}"
            h.responses = self.responses
            
            method_fn = getattr(h, f'do_{method}', None)
            if method_fn:
                method_fn()
            else:
                self.send_response(405)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Method not allowed"}).encode())
        except Exception as e:
            print(f"Handler error: {e}")
            import traceback
            traceback.print_exc()
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())
        finally:
            self.rfile = original_rfile
    
    def do_GET(self):
        self._proxy_to_handler('GET')
    
    def do_POST(self):
        self._proxy_to_handler('POST')
    
    def do_OPTIONS(self):
        self._proxy_to_handler('OPTIONS')
    
    def log_message(self, format, *args):
        print(f"[API] {args[0]}" if args else "")


def main():
    server = HTTPServer(('0.0.0.0', PORT), LocalDevHandler)
    print(f"Local API server running at http://localhost:{PORT}")
    print(f"Routes: {list(LocalDevHandler.ROUTE_MAP.keys())}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down...")
        server.server_close()


if __name__ == '__main__':
    main()
