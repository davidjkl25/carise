from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.application.use_cases.obtener_landing import ObtenerLanding
from src.infrastructure.db.session import get_session
from src.infrastructure.repositories.landing_repository import (
    SqlAlchemyLandingRepository,
)
from src.presentation.schemas import ErrorSchema, LandingResponseSchema

router = APIRouter(tags=["Landing"])

SessionDep = Annotated[AsyncSession, Depends(get_session)]


@router.get(
    "/landing",
    response_model=LandingResponseSchema,
    responses={
        status.HTTP_503_SERVICE_UNAVAILABLE: {"model": ErrorSchema},
    },
)
async def get_landing(session: SessionDep) -> LandingResponseSchema:
    repository = SqlAlchemyLandingRepository(session)
    landing = await ObtenerLanding(repository).execute()

    if landing is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Landing sin configuración o sin escenas publicadas",
        )

    return LandingResponseSchema.model_validate(landing)
