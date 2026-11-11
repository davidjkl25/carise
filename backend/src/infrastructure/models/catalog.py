from __future__ import annotations

from datetime import datetime
from decimal import Decimal

from sqlalchemy import (
    CHAR,
    BigInteger,
    Boolean,
    CheckConstraint,
    DateTime,
    ForeignKey,
    Index,
    Integer,
    Numeric,
    SmallInteger,
    String,
    Text,
    UniqueConstraint,
    func,
    true,
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.infrastructure.db.base import Base


class CategoriaModel(Base):
    __tablename__ = "categorias"
    __table_args__ = (UniqueConstraint("slug", name="uq_categorias_slug"),)

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(120), nullable=False)
    slug: Mapped[str] = mapped_column(String(140), nullable=False)
    orden: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    productos: Mapped[list[ProductoModel]] = relationship(back_populates="categoria")


class ProductoModel(Base):
    __tablename__ = "productos"
    __table_args__ = (
        UniqueConstraint("slug", name="uq_productos_slug"),
        CheckConstraint("precio >= 0", name="precio_no_negativo"),
        Index("ix_productos_activo_orden", "activo", "orden"),
        Index("ix_productos_categoria_id", "categoria_id"),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    categoria_id: Mapped[int] = mapped_column(
        ForeignKey("categorias.id", ondelete="RESTRICT"), nullable=False
    )
    nombre: Mapped[str] = mapped_column(String(160), nullable=False)
    slug: Mapped[str] = mapped_column(String(180), nullable=False)
    descripcion: Mapped[str] = mapped_column(Text, nullable=False)
    precio: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    moneda: Mapped[str] = mapped_column(
        CHAR(3), nullable=False, server_default="COP", default="COP"
    )
    cuidado: Mapped[str] = mapped_column(Text, nullable=False)
    activo: Mapped[bool] = mapped_column(
        Boolean, nullable=False, server_default=true(), default=True
    )
    orden: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )

    categoria: Mapped[CategoriaModel] = relationship(back_populates="productos")
    variantes: Mapped[list[VarianteModel]] = relationship(
        back_populates="producto", cascade="all, delete-orphan", passive_deletes=True
    )
    multimedia: Mapped[list[MultimediaProductoModel]] = relationship(
        back_populates="producto", cascade="all, delete-orphan", passive_deletes=True
    )
    escenas: Mapped[list[EscenaVideoModel]] = relationship(
        back_populates="producto", cascade="all, delete-orphan", passive_deletes=True
    )


class VarianteModel(Base):
    __tablename__ = "variantes"
    __table_args__ = (
        UniqueConstraint(
            "producto_id", "talla", "color", name="uq_variantes_producto_talla_color"
        ),
        Index("ix_variantes_producto_id_disponible", "producto_id", "disponible"),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    producto_id: Mapped[int] = mapped_column(
        ForeignKey("productos.id", ondelete="CASCADE"), nullable=False
    )
    talla: Mapped[str] = mapped_column(String(20), nullable=False)
    color: Mapped[str] = mapped_column(String(40), nullable=False)
    disponible: Mapped[bool] = mapped_column(
        Boolean, nullable=False, server_default=true(), default=True
    )
    orden: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")

    producto: Mapped[ProductoModel] = relationship(back_populates="variantes")


class MultimediaProductoModel(Base):
    __tablename__ = "multimedia_producto"
    __table_args__ = (
        CheckConstraint(
            "tipo IN ('imagen', 'video')", name="tipo_valido"
        ),
        Index("ix_multimedia_producto_id_orden", "producto_id", "orden"),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    producto_id: Mapped[int] = mapped_column(
        ForeignKey("productos.id", ondelete="CASCADE"), nullable=False
    )
    tipo: Mapped[str] = mapped_column(String(20), nullable=False)
    url: Mapped[str] = mapped_column(Text, nullable=False)
    alt_texto: Mapped[str | None] = mapped_column(String(255), nullable=True)
    orden: Mapped[int] = mapped_column(Integer, nullable=False, server_default="0")

    producto: Mapped[ProductoModel] = relationship(back_populates="multimedia")


class EscenaVideoModel(Base):
    __tablename__ = "escenas_video"
    __table_args__ = (
        CheckConstraint("inicio_seg >= 0", name="inicio_no_negativo"),
        CheckConstraint("fin_seg > inicio_seg", name="rango_valido"),
        Index("ix_escenas_video_orden", "orden"),
    )

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    producto_id: Mapped[int] = mapped_column(
        ForeignKey("productos.id", ondelete="CASCADE"), nullable=False
    )
    inicio_seg: Mapped[Decimal] = mapped_column(Numeric(8, 3), nullable=False)
    fin_seg: Mapped[Decimal] = mapped_column(Numeric(8, 3), nullable=False)
    orden: Mapped[int] = mapped_column(Integer, nullable=False)

    producto: Mapped[ProductoModel] = relationship(back_populates="escenas")


class ConfiguracionTiendaModel(Base):
    __tablename__ = "configuracion_tienda"
    __table_args__ = (
        CheckConstraint("id = 1", name="singleton"),
    )

    id: Mapped[int] = mapped_column(
        SmallInteger, primary_key=True, autoincrement=False
    )
    whatsapp: Mapped[str] = mapped_column(String(30), nullable=False)
    correo_contacto: Mapped[str] = mapped_column(String(160), nullable=False)
    direccion: Mapped[str] = mapped_column(String(255), nullable=False)
    video_landing_url: Mapped[str] = mapped_column(Text, nullable=False)
    video_landing_url_mobile: Mapped[str | None] = mapped_column(Text, nullable=True)
    video_landing_poster_url: Mapped[str | None] = mapped_column(Text, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )
