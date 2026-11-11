from typing import Protocol

from src.domain.entities.configuracion import ConfiguracionTienda
from src.domain.entities.escena import EscenaVideo


class LandingRepository(Protocol):
    async def get_configuracion(self) -> ConfiguracionTienda | None: ...

    async def get_escenas(self) -> list[EscenaVideo]: ...
