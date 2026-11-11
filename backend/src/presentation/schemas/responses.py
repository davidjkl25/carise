from typing import Literal

from pydantic import BaseModel, ConfigDict


class CategoriaSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    slug: str


class MultimediaSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    tipo: Literal["imagen", "video"]
    url: str
    alt_texto: str | None = None
    orden: int


class VarianteSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    talla: str
    color: str
    disponible: bool


class ProductoResumenSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    slug: str
    categoria: CategoriaSchema
    precio: float
    moneda: str
    agotado: bool
    imagen_principal: MultimediaSchema | None = None
    video_principal: MultimediaSchema | None = None


class ProductoDetalleSchema(ProductoResumenSchema):
    descripcion: str
    cuidado: str
    variantes: list[VarianteSchema]
    multimedia: list[MultimediaSchema]


class ConfiguracionTiendaSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    whatsapp: str
    correo_contacto: str
    direccion: str
    video_landing_url: str
    video_landing_url_mobile: str | None = None
    video_landing_poster_url: str | None = None


class EscenaSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    orden: int
    inicio_seg: float
    fin_seg: float
    producto: ProductoResumenSchema


class LandingResponseSchema(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    tienda: ConfiguracionTiendaSchema
    escenas: list[EscenaSchema]


class ErrorSchema(BaseModel):
    detail: str
