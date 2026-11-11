from dataclasses import dataclass

from src.application.dto.landing import MultimediaDTO, ProductoResumenDTO


@dataclass(frozen=True, slots=True)
class VarianteDTO:
    id: int
    talla: str
    color: str
    disponible: bool


@dataclass(frozen=True, slots=True)
class ProductoDetalleDTO(ProductoResumenDTO):
    descripcion: str
    cuidado: str
    variantes: list[VarianteDTO]
    multimedia: list[MultimediaDTO]
