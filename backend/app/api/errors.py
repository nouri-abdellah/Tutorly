from __future__ import annotations

import uuid
from typing import Any

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException


class ApiError(Exception):
    def __init__(
        self,
        status_code: int,
        code: str,
        message_key: str,
        *,
        headers: dict[str, str] | None = None,
    ) -> None:
        super().__init__(code)
        self.status_code = status_code
        self.code = code
        self.message_key = message_key
        self.headers = headers or {}


def _request_id(request: Request) -> str:
    value = getattr(request.state, "request_id", None)
    if isinstance(value, str) and value:
        return value
    return str(uuid.uuid4())


def _error_body(request: Request, code: str, message_key: str) -> dict[str, Any]:
    return {
        "error": {
            "code": code,
            "message_key": message_key,
            "request_id": _request_id(request),
        }
    }


async def api_error_handler(request: Request, exc: ApiError) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content=_error_body(request, exc.code, exc.message_key),
        headers=exc.headers,
    )


async def validation_error_handler(
    request: Request, _exc: RequestValidationError
) -> JSONResponse:
    return JSONResponse(
        status_code=422,
        content=_error_body(request, "VALIDATION_ERROR", "errors.validation"),
    )


async def http_error_handler(
    request: Request, exc: StarletteHTTPException
) -> JSONResponse:
    if exc.status_code == 404:
        code, message_key = "NOT_FOUND", "errors.not_found"
    elif exc.status_code == 405:
        code, message_key = "METHOD_NOT_ALLOWED", "errors.method_not_allowed"
    else:
        code, message_key = "HTTP_ERROR", "errors.http"
    return JSONResponse(
        status_code=exc.status_code,
        content=_error_body(request, code, message_key),
        headers=exc.headers,
    )


def register_error_handlers(app: FastAPI) -> None:
    app.add_exception_handler(ApiError, api_error_handler)
    app.add_exception_handler(RequestValidationError, validation_error_handler)
    app.add_exception_handler(StarletteHTTPException, http_error_handler)
