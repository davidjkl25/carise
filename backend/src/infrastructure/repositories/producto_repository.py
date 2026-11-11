from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.domain.entities.producto import Producto
from src.infrastructure.models.catalog import ProductoModel
from src.infrastructure.repositories.mappers import to_producto


class SqlAlchemyProductoRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_by_id(self, producto_id: int) -> Producto | None:
        statement = (
            select(ProductoModel)
            .where(
                ProductoModel.id == producto_id,
                ProductoModel.activo.is_(True),
            )
            .options(
                selectinload(ProductoModel.categoria),
                selectinload(ProductoModel.variantes),
                selectinload(ProductoModel.multimedia),
            )
        )

        model = await self._session.scalar(statement)
        return to_producto(model) if model is not None else None
