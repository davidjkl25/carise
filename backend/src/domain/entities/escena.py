from dataclasses import dataclass
from decimal import Decimal

from src.domain.entities.producto import Producto


@dataclass(slots=True)
class EscenaVideo:
    id: int
    producto_id: int
    inicio_seg: Decimal
    fin_seg: Decimal
    orden: int
    producto: Producto | None = None
