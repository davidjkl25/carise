from dataclasses import dataclass
from decimal import Decimal


@dataclass(frozen=True, slots=True)
class CategoriaDTO:
    id: int
    nombre: str
    slug: str


@dataclass(frozen=True, slots=True)
class MultimediaDTO:
    id: int
    tipo: str
    url: str
    alt_texto: str | None
    orden: int


@dataclass(frozen=True, slots=True)
class ProductoResumenDTO:
    id: int
    nombre: str
    slug: str
    categoria: CategoriaDTO
    precio: Decimal
    moneda: str
    agotado: bool
    imagen_principal: MultimediaDTO | None
    video_principal: MultimediaDTO | None


@dataclass(frozen=True, slots=True)
class EscenaDTO:
    id: int
    orden: int
    inicio_seg: Decimal
    fin_seg: Decimal
    producto: ProductoResumenDTO


@dataclass(frozen=True, slots=True)
class ConfiguracionTiendaDTO:
    whatsapp: str
    correo_contacto: str
    direccion: str
    video_landing_url: str
    video_landing_url_mobile: str | None
    video_landing_poster_url: str | None


@dataclass(frozen=True, slots=True)
class LandingDTO:
    tienda: ConfiguracionTiendaDTO
    escenas: list[EscenaDTO]
