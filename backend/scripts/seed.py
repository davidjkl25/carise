import asyncio
from decimal import Decimal

from sqlalchemy import func, select

from src.infrastructure.db.session import SessionLocal
from src.infrastructure.models import (
    CategoriaModel,
    ConfiguracionTiendaModel,
    EscenaVideoModel,
    MultimediaProductoModel,
    ProductoModel,
    VarianteModel,
)


async def seed() -> None:
    async with SessionLocal() as session:
        existentes = await session.scalar(
            select(func.count()).select_from(ConfiguracionTiendaModel)
        )
        if existentes:
            print("Seed omitido: la base ya contiene configuración.")
            return

        session.add(
            ConfiguracionTiendaModel(
                id=1,
                whatsapp="573001234567",
                correo_contacto="hola@carise.example",
                direccion="Calle 10 #20-30, Bogotá",
                video_landing_url=(
                    "/media/videos/movimiento.mp4"
                ),
                video_landing_url_mobile=(
                    "/media/videos/flor.mp4"
                ),
                video_landing_poster_url="/media/poster.jpg",
            )
        )

        categorias = {
            "vestidos": CategoriaModel(nombre="Vestidos", slug="vestidos", orden=1),
            "blusas": CategoriaModel(nombre="Blusas", slug="blusas", orden=2),
            "accesorios": CategoriaModel(
                nombre="Accesorios", slug="accesorios", orden=3
            ),
        }
        session.add_all(categorias.values())
        await session.flush()

        productos = [
            ProductoModel(
                categoria_id=categorias["vestidos"].id,
                nombre="Vestido Lino",
                slug="vestido-lino",
                descripcion="Vestido largo en lino fresco con caída fluida.",
                precio=Decimal("189900.00"),
                moneda="COP",
                cuidado="Lavar a mano en agua fría. Secar a la sombra.",
                activo=True,
                orden=1,
            ),
            ProductoModel(
                categoria_id=categorias["vestidos"].id,
                nombre="Vestido Midi Seda",
                slug="vestido-midi-seda",
                descripcion="Vestido midi de seda con tirantes ajustables.",
                precio=Decimal("249900.00"),
                moneda="COP",
                cuidado="Limpieza en seco. Planchar a baja temperatura.",
                activo=True,
                orden=2,
            ),
            ProductoModel(
                categoria_id=categorias["blusas"].id,
                nombre="Blusa Gasa",
                slug="blusa-gasa",
                descripcion="Blusa de gasa ligera con mangas amplias.",
                precio=Decimal("119900.00"),
                moneda="COP",
                cuidado="Lavar a mano y planchar a baja temperatura.",
                activo=True,
                orden=3,
            ),
            ProductoModel(
                categoria_id=categorias["blusas"].id,
                nombre="Blusa Oversize",
                slug="blusa-oversize",
                descripcion="Blusa oversize de algodón para uso diario.",
                precio=Decimal("139900.00"),
                moneda="COP",
                cuidado="Lavar en máquina con programa suave.",
                activo=True,
                orden=4,
            ),
            ProductoModel(
                categoria_id=categorias["accesorios"].id,
                nombre="Cinturón Trenzado",
                slug="cinturon-trenzado",
                descripcion="Cinturón de cuero trenzado con hebilla metálica.",
                precio=Decimal("79900.00"),
                moneda="COP",
                cuidado="Limpiar con paño húmedo. Evitar la humedad.",
                activo=True,
                orden=5,
            ),
            ProductoModel(
                categoria_id=categorias["accesorios"].id,
                nombre="Pañuelo Seda",
                slug="panuelo-seda",
                descripcion="Pañuelo de seda estampado de 70 x 70 cm.",
                precio=Decimal("59900.00"),
                moneda="COP",
                cuidado="Lavar a mano en agua fría y secar al aire.",
                activo=True,
                orden=6,
            ),
        ]
        session.add_all(productos)
        await session.flush()
        por_slug = {producto.slug: producto for producto in productos}

        variantes = [
            VarianteModel(
                producto_id=por_slug["vestido-lino"].id,
                talla="S",
                color="Arena",
                disponible=True,
                orden=1,
            ),
            VarianteModel(
                producto_id=por_slug["vestido-lino"].id,
                talla="M",
                color="Arena",
                disponible=True,
                orden=2,
            ),
            VarianteModel(
                producto_id=por_slug["vestido-midi-seda"].id,
                talla="M",
                color="Terracota",
                disponible=True,
                orden=1,
            ),
            VarianteModel(
                producto_id=por_slug["vestido-midi-seda"].id,
                talla="L",
                color="Terracota",
                disponible=True,
                orden=2,
            ),
            VarianteModel(
                producto_id=por_slug["blusa-gasa"].id,
                talla="S",
                color="Blanco",
                disponible=True,
                orden=1,
            ),
            VarianteModel(
                producto_id=por_slug["blusa-gasa"].id,
                talla="M",
                color="Blanco",
                disponible=True,
                orden=2,
            ),
            VarianteModel(
                producto_id=por_slug["blusa-oversize"].id,
                talla="M",
                color="Oliva",
                disponible=False,
                orden=1,
            ),
            VarianteModel(
                producto_id=por_slug["blusa-oversize"].id,
                talla="L",
                color="Oliva",
                disponible=False,
                orden=2,
            ),
            VarianteModel(
                producto_id=por_slug["cinturon-trenzado"].id,
                talla="Única",
                color="Café",
                disponible=True,
                orden=1,
            ),
            VarianteModel(
                producto_id=por_slug["panuelo-seda"].id,
                talla="Única",
                color="Multicolor",
                disponible=True,
                orden=1,
            ),
        ]
        session.add_all(variantes)

        multimedia = [
            MultimediaProductoModel(
                producto_id=por_slug["vestido-lino"].id,
                tipo="imagen",
                url="/media/products/vestido-lino-1.jpg",
                alt_texto="Vestido de lino color arena",
                orden=1,
            ),
            MultimediaProductoModel(
                producto_id=por_slug["vestido-lino"].id,
                tipo="imagen",
                url="/media/products/vestido-lino-2.jpg",
                alt_texto="Detalle del lino del vestido arena",
                orden=2,
            ),
            MultimediaProductoModel(
                producto_id=por_slug["vestido-midi-seda"].id,
                tipo="imagen",
                url="/media/products/vestido-midi-seda-1.jpg",
                alt_texto="Vestido midi de seda terracota",
                orden=1,
            ),
            MultimediaProductoModel(
                producto_id=por_slug["vestido-midi-seda"].id,
                tipo="imagen",
                url="/media/products/vestido-midi-seda-2.jpg",
                alt_texto="Detalle de la seda del vestido terracota",
                orden=2,
            ),
            MultimediaProductoModel(
                producto_id=por_slug["blusa-gasa"].id,
                tipo="imagen",
                url="/media/products/blusa-gasa-1.jpg",
                alt_texto="Blusa de gasa blanca",
                orden=1,
            ),
            MultimediaProductoModel(
                producto_id=por_slug["blusa-gasa"].id,
                tipo="imagen",
                url="/media/products/blusa-gasa-2.jpg",
                alt_texto="Detalle de la gasa de la blusa blanca",
                orden=2,
            ),
            MultimediaProductoModel(
                producto_id=por_slug["blusa-oversize"].id,
                tipo="imagen",
                url="/media/products/blusa-oversize-1.jpg",
                alt_texto="Blusa oversize oliva",
                orden=1,
            ),
            MultimediaProductoModel(
                producto_id=por_slug["blusa-oversize"].id,
                tipo="imagen",
                url="/media/products/blusa-oversize-2.jpg",
                alt_texto="Detalle del algodón de la blusa oliva",
                orden=2,
            ),
            MultimediaProductoModel(
                producto_id=por_slug["cinturon-trenzado"].id,
                tipo="imagen",
                url="/media/products/cinturon-1.jpg",
                alt_texto="Cinturón de cuero trenzado café",
                orden=1,
            ),
            MultimediaProductoModel(
                producto_id=por_slug["cinturon-trenzado"].id,
                tipo="imagen",
                url="/media/products/cinturon-2.jpg",
                alt_texto="Detalle de la hebilla del cinturón",
                orden=2,
            ),
            MultimediaProductoModel(
                producto_id=por_slug["panuelo-seda"].id,
                tipo="imagen",
                url="/media/products/panuelo-1.jpg",
                alt_texto="Pañuelo de seda estampado",
                orden=1,
            ),
            MultimediaProductoModel(
                producto_id=por_slug["panuelo-seda"].id,
                tipo="imagen",
                url="/media/products/panuelo-2.jpg",
                alt_texto="Detalle del estampado del pañuelo",
                orden=2,
            ),
            MultimediaProductoModel(
                producto_id=por_slug["vestido-lino"].id,
                tipo="video",
                url=(
                    "/media/videos/flor.mp4"
                ),
                alt_texto=None,
                orden=10,
            ),
            MultimediaProductoModel(
                producto_id=por_slug["vestido-midi-seda"].id,
                tipo="video",
                url="/media/videos/movimiento.mp4",
                alt_texto=None,
                orden=10,
            ),
            MultimediaProductoModel(
                producto_id=por_slug["blusa-gasa"].id,
                tipo="video",
                url=(
                    "/media/videos/flor.mp4"
                ),
                alt_texto=None,
                orden=10,
            ),
            MultimediaProductoModel(
                producto_id=por_slug["blusa-oversize"].id,
                tipo="video",
                url="/media/videos/movimiento.mp4",
                alt_texto=None,
                orden=10,
            ),
            MultimediaProductoModel(
                producto_id=por_slug["cinturon-trenzado"].id,
                tipo="video",
                url="/media/videos/movimiento.mp4",
                alt_texto=None,
                orden=10,
            ),
            MultimediaProductoModel(
                producto_id=por_slug["panuelo-seda"].id,
                tipo="video",
                url="/media/videos/movimiento.mp4",
                alt_texto=None,
                orden=10,
            ),
        ]
        session.add_all(multimedia)

        escenas = [
            EscenaVideoModel(
                producto_id=por_slug["vestido-lino"].id,
                inicio_seg=Decimal("0.000"),
                fin_seg=Decimal("10.000"),
                orden=1,
            ),
            EscenaVideoModel(
                producto_id=por_slug["vestido-midi-seda"].id,
                inicio_seg=Decimal("10.000"),
                fin_seg=Decimal("20.000"),
                orden=2,
            ),
            EscenaVideoModel(
                producto_id=por_slug["blusa-gasa"].id,
                inicio_seg=Decimal("20.000"),
                fin_seg=Decimal("30.000"),
                orden=3,
            ),
            EscenaVideoModel(
                producto_id=por_slug["blusa-oversize"].id,
                inicio_seg=Decimal("30.000"),
                fin_seg=Decimal("40.000"),
                orden=4,
            ),
            EscenaVideoModel(
                producto_id=por_slug["cinturon-trenzado"].id,
                inicio_seg=Decimal("40.000"),
                fin_seg=Decimal("50.000"),
                orden=5,
            ),
            EscenaVideoModel(
                producto_id=por_slug["panuelo-seda"].id,
                inicio_seg=Decimal("50.000"),
                fin_seg=Decimal("60.000"),
                orden=6,
            ),
        ]
        session.add_all(escenas)

        await session.commit()

    print(
        "Seed completado: 1 configuración, 3 categorías, 6 productos, "
        "10 variantes, 12 imágenes, 6 videos y 6 escenas."
    )


if __name__ == "__main__":
    asyncio.run(seed())
