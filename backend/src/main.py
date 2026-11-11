from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.infrastructure.config.settings import get_settings
from src.presentation.api.landing import router as landing_router
from src.presentation.api.productos import router as productos_router


def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(title="Carise Public API", version="1.0.0")
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=False,
        allow_methods=["GET"],
        allow_headers=["*"],
    )
    app.include_router(landing_router)
    app.include_router(productos_router)

    return app


app = create_app()
