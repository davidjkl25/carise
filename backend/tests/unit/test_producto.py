from decimal import Decimal

from src.domain.entities.categoria import Categoria
from src.domain.entities.multimedia import MultimediaProducto
from src.domain.entities.producto import Producto
from src.domain.entities.variante import Variante
from src.domain.enums import TipoMultimedia


def build_variante(ident: int, disponible: bool) -> Variante:
    return Variante(
        id=ident,
        producto_id=1,
        talla="M",
        color="Arena",
        disponible=disponible,
        orden=ident,
    )


def build_multimedia(
    ident: int, tipo: TipoMultimedia, url: str, orden: int
) -> MultimediaProducto:
    return MultimediaProducto(
        id=ident,
        producto_id=1,
        tipo=tipo,
        url=url,
        alt_texto=None,
        orden=orden,
    )


def build_producto(
    variantes: list[Variante] | None = None,
    multimedia: list[MultimediaProducto] | None = None,
) -> Producto:
    return Producto(
        id=1,
        categoria_id=1,
        nombre="Vestido Lino",
        slug="vestido-lino",
        descripcion="Vestido largo en lino fresco.",
        precio=Decimal("189900.00"),
        moneda="COP",
        cuidado="Lavar a mano en agua fría.",
        activo=True,
        orden=1,
        categoria=Categoria(id=1, nombre="Vestidos", slug="vestidos", orden=1),
        variantes=variantes or [],
        multimedia=multimedia or [],
    )


def test_agotado_cuando_no_hay_variantes() -> None:
    assert build_producto().agotado is True


def test_no_agotado_con_una_variante_disponible() -> None:
    producto = build_producto(
        variantes=[build_variante(1, disponible=False), build_variante(2, disponible=True)]
    )

    assert producto.agotado is False


def test_agotado_cuando_todas_las_variantes_no_estan_disponibles() -> None:
    producto = build_producto(
        variantes=[build_variante(1, disponible=False), build_variante(2, disponible=False)]
    )

    assert producto.agotado is True


def test_imagen_principal_elige_la_de_menor_orden() -> None:
    producto = build_producto(
        multimedia=[
            build_multimedia(2, TipoMultimedia.IMAGEN, "/media/segunda.jpg", orden=2),
            build_multimedia(1, TipoMultimedia.IMAGEN, "/media/primera.jpg", orden=1),
        ]
    )

    assert producto.imagen_principal is not None
    assert producto.imagen_principal.url == "/media/primera.jpg"


def test_imagen_principal_ignora_los_videos() -> None:
    producto = build_producto(
        multimedia=[
            build_multimedia(1, TipoMultimedia.VIDEO, "/media/video.mp4", orden=1),
            build_multimedia(2, TipoMultimedia.IMAGEN, "/media/imagen.jpg", orden=2),
        ]
    )

    assert producto.imagen_principal is not None
    assert producto.imagen_principal.url == "/media/imagen.jpg"


def test_video_principal_elige_el_de_menor_orden() -> None:
    producto = build_producto(
        multimedia=[
            build_multimedia(1, TipoMultimedia.VIDEO, "/media/segundo.mp4", orden=10),
            build_multimedia(2, TipoMultimedia.VIDEO, "/media/primero.mp4", orden=5),
        ]
    )

    assert producto.video_principal is not None
    assert producto.video_principal.url == "/media/primero.mp4"


def test_producto_sin_multimedia_no_tiene_principal() -> None:
    producto = build_producto()

    assert producto.imagen_principal is None
    assert producto.video_principal is None
