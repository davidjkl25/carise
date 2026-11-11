from src.domain.entities.categoria import Categoria
from src.domain.entities.configuracion import ConfiguracionTienda
from src.domain.entities.escena import EscenaVideo
from src.domain.entities.multimedia import MultimediaProducto
from src.domain.entities.producto import Producto
from src.domain.entities.variante import Variante
from src.domain.enums import TipoMultimedia
from src.infrastructure.models.catalog import (
    CategoriaModel,
    ConfiguracionTiendaModel,
    EscenaVideoModel,
    MultimediaProductoModel,
    ProductoModel,
    VarianteModel,
)


def to_categoria(model: CategoriaModel) -> Categoria:
    return Categoria(
        id=model.id,
        nombre=model.nombre,
        slug=model.slug,
        orden=model.orden,
    )


def to_variante(model: VarianteModel) -> Variante:
    return Variante(
        id=model.id,
        producto_id=model.producto_id,
        talla=model.talla,
        color=model.color,
        disponible=model.disponible,
        orden=model.orden,
    )


def to_multimedia(model: MultimediaProductoModel) -> MultimediaProducto:
    return MultimediaProducto(
        id=model.id,
        producto_id=model.producto_id,
        tipo=TipoMultimedia(model.tipo),
        url=model.url,
        alt_texto=model.alt_texto,
        orden=model.orden,
    )


def to_producto(model: ProductoModel) -> Producto:
    return Producto(
        id=model.id,
        categoria_id=model.categoria_id,
        nombre=model.nombre,
        slug=model.slug,
        descripcion=model.descripcion,
        precio=model.precio,
        moneda=model.moneda,
        cuidado=model.cuidado,
        activo=model.activo,
        orden=model.orden,
        categoria=to_categoria(model.categoria) if model.categoria else None,
        variantes=[to_variante(variante) for variante in model.variantes],
        multimedia=[to_multimedia(item) for item in model.multimedia],
    )


def to_escena(model: EscenaVideoModel) -> EscenaVideo:
    return EscenaVideo(
        id=model.id,
        producto_id=model.producto_id,
        inicio_seg=model.inicio_seg,
        fin_seg=model.fin_seg,
        orden=model.orden,
        producto=to_producto(model.producto) if model.producto else None,
    )


def to_configuracion(model: ConfiguracionTiendaModel) -> ConfiguracionTienda:
    return ConfiguracionTienda(
        id=model.id,
        whatsapp=model.whatsapp,
        correo_contacto=model.correo_contacto,
        direccion=model.direccion,
        video_landing_url=model.video_landing_url,
        video_landing_url_mobile=model.video_landing_url_mobile,
        video_landing_poster_url=model.video_landing_poster_url,
    )
