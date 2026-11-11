from typing import Protocol

from src.domain.entities.producto import Producto


class ProductoRepository(Protocol):
    async def get_by_id(self, producto_id: int) -> Producto | None: ...
