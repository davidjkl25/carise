from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.domain.entities.configuracion import ConfiguracionTienda
from src.domain.entities.escena import EscenaVideo
from src.infrastructure.models.catalog import (
    ConfiguracionTiendaModel,
    EscenaVideoModel,
    ProductoModel,
)
from src.infrastructure.repositories.mappers import to_configuracion, to_escena


class SqlAlchemyLandingRepository:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def get_configuracion(self) -> ConfiguracionTienda | None:
        model = await self._session.get(ConfiguracionTiendaModel, 1)
        return to_configuracion(model) if model is not None else None

    async def get_escenas(self) -> list[EscenaVideo]:
        statement = (
            select(EscenaVideoModel)
            .join(ProductoModel, EscenaVideoModel.producto_id == ProductoModel.id)
            .where(ProductoModel.activo.is_(True))
            .options(
                selectinload(EscenaVideoModel.producto).selectinload(
                    ProductoModel.categoria
                ),
                selectinload(EscenaVideoModel.producto).selectinload(
                    ProductoModel.variantes
                ),
                selectinload(EscenaVideoModel.producto).selectinload(
                    ProductoModel.multimedia
                ),
            )
            .order_by(EscenaVideoModel.orden)
        )

        models = (await self._session.scalars(statement)).all()
        return [to_escena(model) for model in models]
