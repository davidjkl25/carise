from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.application.use_cases.obtener_producto import ObtenerProducto
from src.infrastructure.db.session import get_session
from src.infrastructure.repositories.producto_repository import (
    SqlAlchemyProductoRepository,
)
from src.presentation.schemas import ErrorSchema, ProductoDetalleSchema

router = APIRouter(tags=["Productos"])

SessionDep = Annotated[AsyncSession, Depends(get_session)]


@router.get(
    "/productos/{id}",
    response_model=ProductoDetalleSchema,
    responses={
        status.HTTP_404_NOT_FOUND: {"model": ErrorSchema},
    },
)
async def get_producto(
    id: Annotated[int, Path(ge=1)],
    session: SessionDep,
) -> ProductoDetalleSchema:
    repository = SqlAlchemyProductoRepository(session)
    producto = await ObtenerProducto(repository).execute(id)

    if producto is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Producto no encontrado",
        )

    return ProductoDetalleSchema.model_validate(producto)
