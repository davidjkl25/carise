from dataclasses import dataclass, field
from decimal import Decimal

from src.domain.entities.categoria import Categoria
from src.domain.entities.multimedia import MultimediaProducto
from src.domain.entities.variante import Variante
from src.domain.enums import TipoMultimedia


@dataclass(slots=True)
class Producto:
    id: int
    categoria_id: int
    nombre: str
    slug: str
    descripcion: str
    precio: Decimal
    moneda: str
    cuidado: str
    activo: bool
    orden: int
    categoria: Categoria | None = None
    variantes: list[Variante] = field(default_factory=list)
    multimedia: list[MultimediaProducto] = field(default_factory=list)

    @property
    def agotado(self) -> bool:
        return not any(variante.disponible for variante in self.variantes)

    @property
    def imagen_principal(self) -> MultimediaProducto | None:
        imagenes = sorted(
            (item for item in self.multimedia if item.tipo is TipoMultimedia.IMAGEN),
            key=lambda item: item.orden,
        )
        return imagenes[0] if imagenes else None

    @property
    def video_principal(self) -> MultimediaProducto | None:
        videos = sorted(
            (item for item in self.multimedia if item.tipo is TipoMultimedia.VIDEO),
            key=lambda item: item.orden,
        )
        return videos[0] if videos else None
