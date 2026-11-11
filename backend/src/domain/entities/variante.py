from dataclasses import dataclass


@dataclass(slots=True)
class Variante:
    id: int
    producto_id: int
    talla: str
    color: str
    disponible: bool
    orden: int
