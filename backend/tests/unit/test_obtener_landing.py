import asyncio
from decimal import Decimal

from src.application.use_cases.obtener_landing import ObtenerLanding
from src.domain.entities.categoria import Categoria
from src.domain.entities.configuracion import ConfiguracionTienda
from src.domain.entities.escena import EscenaVideo
from src.domain.entities.producto import Producto


def build_configuracion() -> ConfiguracionTienda:
    return ConfiguracionTienda(
        id=1,
        whatsapp="573001234567",
        correo_contacto="hola@carise.example",
        direccion="Calle 10 #20-30, Bogotá",
        video_landing_url="/media/videos/movimiento.mp4",
        video_landing_url_mobile="/media/videos/flor.mp4",
        video_landing_poster_url="/media/poster.jpg",
    )


def build_producto(ident: int) -> Producto:
    return Producto(
        id=ident,
        categoria_id=1,
        nombre=f"Prenda {ident}",
        slug=f"prenda-{ident}",
        descripcion="Descripción",
        precio=Decimal("100000.00"),
        moneda="COP",
        cuidado="Cuidado",
        activo=True,
        orden=ident,
        categoria=Categoria(id=1, nombre="Vestidos", slug="vestidos", orden=1),
    )


def build_escena(
    ident: int, orden: int, producto: Producto | None
) -> EscenaVideo:
    return EscenaVideo(
        id=ident,
        producto_id=producto.id if producto is not None else 99,
        inicio_seg=Decimal(orden * 10),
        fin_seg=Decimal(orden * 10 + 10),
        orden=orden,
        producto=producto,
    )


class FakeLandingRepository:
    def __init__(
        self,
        configuracion: ConfiguracionTienda | None,
        escenas: list[EscenaVideo],
    ) -> None:
        self._configuracion = configuracion
        self._escenas = escenas

    async def get_configuracion(self) -> ConfiguracionTienda | None:
        return self._configuracion

    async def get_escenas(self) -> list[EscenaVideo]:
        return self._escenas


def execute(repository: FakeLandingRepository):
    return asyncio.run(ObtenerLanding(repository).execute())


def test_devuelve_none_sin_configuracion() -> None:
    repository = FakeLandingRepository(None, [build_escena(1, 1, build_producto(1))])

    assert execute(repository) is None


def test_devuelve_none_sin_escenas() -> None:
    repository = FakeLandingRepository(build_configuracion(), [])

    assert execute(repository) is None


def test_ordena_escenas_por_orden() -> None:
    repository = FakeLandingRepository(
        build_configuracion(),
        [
            build_escena(2, 2, build_producto(2)),
            build_escena(1, 1, build_producto(1)),
        ],
    )

    landing = execute(repository)

    assert landing is not None
    assert [escena.orden for escena in landing.escenas] == [1, 2]


def test_descarta_escenas_sin_producto() -> None:
    repository = FakeLandingRepository(
        build_configuracion(),
        [
            build_escena(1, 1, build_producto(1)),
            build_escena(2, 2, None),
        ],
    )

    landing = execute(repository)

    assert landing is not None
    assert len(landing.escenas) == 1
    assert landing.escenas[0].producto.id == 1


def test_devuelve_none_si_todas_las_escenas_carecen_de_producto() -> None:
    repository = FakeLandingRepository(
        build_configuracion(), [build_escena(1, 1, None)]
    )

    assert execute(repository) is None
