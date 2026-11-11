from dataclasses import dataclass


@dataclass(slots=True)
class ConfiguracionTienda:
    id: int
    whatsapp: str
    correo_contacto: str
    direccion: str
    video_landing_url: str
    video_landing_url_mobile: str | None
    video_landing_poster_url: str | None
