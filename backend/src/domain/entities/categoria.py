from dataclasses import dataclass


@dataclass(slots=True)
class Categoria:
    id: int
    nombre: str
    slug: str
    orden: int
