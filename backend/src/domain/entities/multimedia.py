from dataclasses import dataclass

from src.domain.enums import TipoMultimedia


@dataclass(slots=True)
class MultimediaProducto:
    id: int
    producto_id: int
    tipo: TipoMultimedia
    url: str
    alt_texto: str | None
    orden: int
