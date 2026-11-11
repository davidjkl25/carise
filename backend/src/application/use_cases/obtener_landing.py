from src.application.dto.landing import LandingDTO
from src.application.dto.mappers import to_configuracion_dto, to_escena_dto
from src.domain.repositories.landing_repository import LandingRepository


class ObtenerLanding:
    def __init__(self, repository: LandingRepository) -> None:
        self._repository = repository

    async def execute(self) -> LandingDTO | None:
        configuracion = await self._repository.get_configuracion()
        escenas = await self._repository.get_escenas()

        if configuracion is None or not escenas:
            return None

        escenas_dto = [
            to_escena_dto(escena)
            for escena in sorted(escenas, key=lambda item: item.orden)
            if escena.producto is not None
        ]

        if not escenas_dto:
            return None

        return LandingDTO(
            tienda=to_configuracion_dto(configuracion),
            escenas=escenas_dto,
        )
