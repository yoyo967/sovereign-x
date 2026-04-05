from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
import time
from collections import defaultdict

# Simple In-Memory Rate Limiting for the AI Endpoints
# In production, use Redis!
REQUEST_LIMIT = 50
TIME_WINDOW = 60 # seconds

ip_requests = defaultdict(list)

class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if "/v2/ai" in request.url.path:
            ip = request.client.host
            now = time.time()
            
            # Clean up old requests
            ip_requests[ip] = [t for t in ip_requests[ip] if now - t < TIME_WINDOW]
            
            if len(ip_requests[ip]) >= REQUEST_LIMIT:
                return JSONResponse(status_code=429, content={"detail": "Too Many Requests, AI endpoints throttled."})
                
            ip_requests[ip].append(now)
            
        response = await call_next(request)
        return response
