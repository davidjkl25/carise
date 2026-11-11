from src.application.dto.mappers import to_producto_detalle_dto
from src.application.dto.producto import ProductoDetalleDTO
from src.domain.repositories.producto_repository import ProductoRepository


class ObtenerProducto:
    def __init__(self, repository: ProductoRepository) -> None:
        self._repository = repository

    async def execute(self, producto_id: int) -> ProductoDetalleDTO | None:
        producto = await self._repository.get_by_id(producto_id)

        if producto is None:
            return None

        return to_producto_detalle_dto(producto)
