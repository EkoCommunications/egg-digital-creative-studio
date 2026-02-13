"""
CORS utility for Vercel serverless function handlers.

Provides helpers to add CORS headers and handle preflight OPTIONS requests.
"""

# Allowed origins - '*' for development; restrict in production as needed.
ALLOWED_ORIGIN = "*"
ALLOWED_METHODS = "GET, POST, PUT, DELETE, OPTIONS"
ALLOWED_HEADERS = "Content-Type, Authorization, X-Requested-With"
MAX_AGE = "86400"  # 24 hours


def add_cors_headers(handler_instance):
    """Add standard CORS headers to a BaseHTTPRequestHandler response."""
    handler_instance.send_header("Access-Control-Allow-Origin", ALLOWED_ORIGIN)
    handler_instance.send_header("Access-Control-Allow-Methods", ALLOWED_METHODS)
    handler_instance.send_header("Access-Control-Allow-Headers", ALLOWED_HEADERS)
    handler_instance.send_header("Access-Control-Max-Age", MAX_AGE)


def handle_preflight(handler_instance):
    """
    Handle an OPTIONS preflight request. Sends 204 No Content with CORS headers.
    Call this from do_OPTIONS in your handler.
    """
    handler_instance.send_response(204)
    add_cors_headers(handler_instance)
    handler_instance.end_headers()


def send_json(handler_instance, data, status_code=200):
    """
    Send a JSON response with CORS headers.

    Args:
        handler_instance: The BaseHTTPRequestHandler instance.
        data: A JSON-serializable Python object.
        status_code: HTTP status code (default 200).
    """
    import json

    body = json.dumps(data, ensure_ascii=False).encode("utf-8")
    handler_instance.send_response(status_code)
    handler_instance.send_header("Content-Type", "application/json; charset=utf-8")
    add_cors_headers(handler_instance)
    handler_instance.end_headers()
    handler_instance.wfile.write(body)


def send_error(handler_instance, message, status_code=400, details=None):
    """
    Send a JSON error response with CORS headers.

    Args:
        handler_instance: The BaseHTTPRequestHandler instance.
        message: Human-readable error message.
        status_code: HTTP status code (default 400).
        details: Optional additional error details.
    """
    payload = {"error": message}
    if details is not None:
        payload["details"] = details
    send_json(handler_instance, payload, status_code)
