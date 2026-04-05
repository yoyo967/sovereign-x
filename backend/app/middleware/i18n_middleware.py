from typing import Optional
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse
from ..config import config

class I18nMiddleware(BaseHTTPMiddleware):
    """
    Middleware fängt den Accept-Language Header ab und speichert die
    bevorzugte Sprache des Users im request.state ab, um sie an die KI
    oder Fehlerübersetzer weiterzugeben.
    Unterstützt: de, en, tr, ru, ar (RTL)
    """
    
    async def dispatch(self, request: Request, call_next):
        accept_language = request.headers.get("Accept-Language", "")
        
        selected_lang = config.DEFAULT_LANGUAGE
        if accept_language:
            langs = [lang.split(";")[0][:2].lower() for lang in accept_language.split(",")]
            for l in langs:
                if l in config.SUPPORTED_LANGUAGES:
                    selected_lang = l
                    break
        
        # Inject it into the state
        request.state.language = selected_lang
        
        # Determine RTL
        request.state.is_rtl = selected_lang in ["ar"]
        
        try:
            response = await call_next(request)
            # Kann Header hinzufügen wie Content-Language
            response.headers["Content-Language"] = selected_lang
            return response
        except Exception as exc:
            # Zentrale Fehlerübersetzung könnte hier stattfinden.
            return JSONResponse(
                status_code=500,
                content={
                    "error": "Internal Server Error",
                    "code": 500,
                    "lang": selected_lang
                }
            )
