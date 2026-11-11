from src.application.dto.landing import (
    CategoriaDTO,
    ConfiguracionTiendaDTO,
    EscenaDTO,
    MultimediaDTO,
    ProductoResumenDTO,
)
from src.application.dto.producto import ProductoDetalleDTO, VarianteDTO
from src.domain.entities.categoria import Categoria
from src.domain.entities.configuracion import ConfiguracionTienda
from src.domain.entities.escena import EscenaVideo
from src.domain.entities.multimedia import MultimediaProducto
from src.domain.entities.producto import Producto
from src.domain.entities.variante import Variante


def to_categoria_dto(categoria: Categoria) -> CategoriaDTO:
    return CategoriaDTO(id=categoria.id, nombre=categoria.nombre, slug=categoria.slug)


def to_multimedia_dto(multimedia: MultimediaProducto) -> MultimediaDTO:
    return MultimediaDTO(
        id=multimedia.id,
        tipo=multimedia.tipo.value,
        url=multimedia.url,
        alt_texto=multimedia.alt_texto,
        orden=multimedia.orden,
    )


def to_variante_dto(variante: Variante) -> VarianteDTO:
    return VarianteDTO(
        id=variante.id,
        talla=variante.talla,
        color=variante.color,
        disponible=variante.disponible,
    )


def to_producto_resumen_dto(producto: Producto) -> ProductoResumenDTO:
    if producto.categoria is None:
        raise ValueError(f"El producto {producto.id} no tiene categoría")

    imagen_principal = producto.imagen_principal
    video_principal = producto.video_principal

    return ProductoResumenDTO(
        id=producto.id,
        nombre=producto.nombre,
        slug=producto.slug,
        categoria=to_categoria_dto(producto.categoria),
        precio=producto.precio,
        moneda=producto.moneda,
        agotado=producto.agotado,
        imagen_principal=(
            to_multimedia_dto(imagen_principal) if imagen_principal is not None else None
        ),
        video_principal=(
            to_multimedia_dto(video_principal) if video_principal is not None else None
        ),
    )


def to_producto_detalle_dto(producto: Producto) -> ProductoDetalleDTO:
    resumen = to_producto_resumen_dto(producto)

    return ProductoDetalleDTO(
        id=resumen.id,
        nombre=resumen.nombre,
        slug=resumen.slug,
        categoria=resumen.categoria,
        precio=resumen.precio,
        moneda=resumen.moneda,
        agotado=resumen.agotado,
        imagen_principal=resumen.imagen_principal,
        video_principal=resumen.video_principal,
        descripcion=producto.descripcion,
        cuidado=producto.cuidado,
        variantes=[
            to_variante_dto(variante)
            for variante in sorted(producto.variantes, key=lambda item: item.orden)
        ],
        multimedia=[
            to_multimedia_dto(multimedia)
            for multimedia in sorted(producto.multimedia, key=lambda item: item.orden)
        ],
    )


def to_escena_dto(escena: EscenaVideo) -> EscenaDTO:
    if escena.producto is None:
        raise ValueError(f"La escena {escena.id} no tiene producto")

    return EscenaDTO(
        id=escena.id,
        orden=escena.orden,
        inicio_seg=escena.inicio_seg,
        fin_seg=escena.fin_seg,
        producto=to_producto_resumen_dto(escena.producto),
    )


def to_configuracion_dto(configuracion: ConfiguracionTienda) -> ConfiguracionTiendaDTO:
    return ConfiguracionTiendaDTO(
        whatsapp=configuracion.whatsapp,
        correo_contacto=configuracion.correo_contacto,
        direccion=configuracion.direccion,
        video_landing_url=configuracion.video_landing_url,
        video_landing_url_mobile=configuracion.video_landing_url_mobile,
        video_landing_poster_url=configuracion.video_landing_poster_url,
    )
