from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from typing import Literal, TypedDict

import structlog
from fastapi import FastAPI, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.home import router as home_router
from app.api.watchlist import router as watchlist_router
from app.core.exceptions import ApplicationException
from app.database.database import initialize_database

logger = structlog.get_logger()


class HealthData(TypedDict):
    status: Literal["ok"]
    app: Literal["AlphaMind OS"]


class HealthResponse(TypedDict):
    success: Literal[True]
    data: HealthData


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    await initialize_database()
    logger.info("application_started", app="AlphaMind OS")
    yield
    logger.info("application_stopped", app="AlphaMind OS")


app = FastAPI(title="AlphaMind OS API", version="0.1.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5173",
        "http://localhost:5173",
        "null",
    ],
    allow_credentials=False,
    allow_methods=["GET", "POST", "DELETE"],
    allow_headers=["*"],
)
app.include_router(home_router)
app.include_router(watchlist_router)


@app.exception_handler(ApplicationException)
async def handle_application_exception(
    _: Request,
    exception: ApplicationException,
) -> JSONResponse:
    return JSONResponse(
        status_code=exception.status_code,
        content={"success": False, "message": exception.message},
    )


@app.exception_handler(RequestValidationError)
async def handle_request_validation_error(
    _: Request,
    __: RequestValidationError,
) -> JSONResponse:
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"success": False, "message": "Validation Error"},
    )


@app.middleware("http")
async def log_request(request: Request, call_next):  # type: ignore[no-untyped-def]
    response = await call_next(request)
    logger.info(
        "request_completed",
        method=request.method,
        path=request.url.path,
        status_code=response.status_code,
    )
    return response


@app.get("/api/v1/health", response_model=HealthResponse)
async def health() -> HealthResponse:
    return {
        "success": True,
        "data": {
            "status": "ok",
            "app": "AlphaMind OS",
        },
    }
