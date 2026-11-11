"""Esquema inicial de la tienda Carise.

Revision ID: 0001_initial_schema
Revises:
Create Date: 2026-11-08
"""

from collections.abc import Sequence

import sqlalchemy as sa

from alembic import op

revision: str = "0001_initial_schema"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "categorias",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("nombre", sa.String(length=120), nullable=False),
        sa.Column("slug", sa.String(length=140), nullable=False),
        sa.Column("orden", sa.Integer(), server_default="0", nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id", name="pk_categorias"),
        sa.UniqueConstraint("slug", name="uq_categorias_slug"),
    )

    op.create_table(
        "productos",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("categoria_id", sa.BigInteger(), nullable=False),
        sa.Column("nombre", sa.String(length=160), nullable=False),
        sa.Column("slug", sa.String(length=180), nullable=False),
        sa.Column("descripcion", sa.Text(), nullable=False),
        sa.Column("precio", sa.Numeric(precision=12, scale=2), nullable=False),
        sa.Column(
            "moneda", sa.CHAR(length=3), server_default="COP", nullable=False
        ),
        sa.Column("cuidado", sa.Text(), nullable=False),
        sa.Column(
            "activo", sa.Boolean(), server_default=sa.text("true"), nullable=False
        ),
        sa.Column("orden", sa.Integer(), server_default="0", nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.CheckConstraint(
            "precio >= 0", name="precio_no_negativo"
        ),
        sa.ForeignKeyConstraint(
            ["categoria_id"],
            ["categorias.id"],
            name="fk_productos_categoria_id_categorias",
            ondelete="RESTRICT",
        ),
        sa.PrimaryKeyConstraint("id", name="pk_productos"),
        sa.UniqueConstraint("slug", name="uq_productos_slug"),
    )
    op.create_index(
        "ix_productos_activo_orden", "productos", ["activo", "orden"], unique=False
    )
    op.create_index(
        "ix_productos_categoria_id", "productos", ["categoria_id"], unique=False
    )

    op.create_table(
        "variantes",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("producto_id", sa.BigInteger(), nullable=False),
        sa.Column("talla", sa.String(length=20), nullable=False),
        sa.Column("color", sa.String(length=40), nullable=False),
        sa.Column(
            "disponible", sa.Boolean(), server_default=sa.text("true"), nullable=False
        ),
        sa.Column("orden", sa.Integer(), server_default="0", nullable=False),
        sa.ForeignKeyConstraint(
            ["producto_id"],
            ["productos.id"],
            name="fk_variantes_producto_id_productos",
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name="pk_variantes"),
        sa.UniqueConstraint(
            "producto_id",
            "talla",
            "color",
            name="uq_variantes_producto_talla_color",
        ),
    )
    op.create_index(
        "ix_variantes_producto_id_disponible",
        "variantes",
        ["producto_id", "disponible"],
        unique=False,
    )

    op.create_table(
        "multimedia_producto",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("producto_id", sa.BigInteger(), nullable=False),
        sa.Column("tipo", sa.String(length=20), nullable=False),
        sa.Column("url", sa.Text(), nullable=False),
        sa.Column("alt_texto", sa.String(length=255), nullable=True),
        sa.Column("orden", sa.Integer(), server_default="0", nullable=False),
        sa.CheckConstraint(
            "tipo IN ('imagen', 'video')", name="tipo_valido"
        ),
        sa.ForeignKeyConstraint(
            ["producto_id"],
            ["productos.id"],
            name="fk_multimedia_producto_producto_id_productos",
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name="pk_multimedia_producto"),
    )
    op.create_index(
        "ix_multimedia_producto_id_orden",
        "multimedia_producto",
        ["producto_id", "orden"],
        unique=False,
    )

    op.create_table(
        "escenas_video",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("producto_id", sa.BigInteger(), nullable=False),
        sa.Column("inicio_seg", sa.Numeric(precision=8, scale=3), nullable=False),
        sa.Column("fin_seg", sa.Numeric(precision=8, scale=3), nullable=False),
        sa.Column("orden", sa.Integer(), nullable=False),
        sa.CheckConstraint(
            "inicio_seg >= 0", name="inicio_no_negativo"
        ),
        sa.CheckConstraint(
            "fin_seg > inicio_seg", name="rango_valido"
        ),
        sa.ForeignKeyConstraint(
            ["producto_id"],
            ["productos.id"],
            name="fk_escenas_video_producto_id_productos",
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id", name="pk_escenas_video"),
    )
    op.create_index(
        "ix_escenas_video_orden", "escenas_video", ["orden"], unique=False
    )

    op.create_table(
        "configuracion_tienda",
        sa.Column("id", sa.SmallInteger(), autoincrement=False, nullable=False),
        sa.Column("whatsapp", sa.String(length=30), nullable=False),
        sa.Column("correo_contacto", sa.String(length=160), nullable=False),
        sa.Column("direccion", sa.String(length=255), nullable=False),
        sa.Column("video_landing_url", sa.Text(), nullable=False),
        sa.Column("video_landing_url_mobile", sa.Text(), nullable=True),
        sa.Column("video_landing_poster_url", sa.Text(), nullable=True),
        sa.Column(
            "updated_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.CheckConstraint(
            "id = 1", name="singleton"
        ),
        sa.PrimaryKeyConstraint("id", name="pk_configuracion_tienda"),
    )


def downgrade() -> None:
    op.drop_table("configuracion_tienda")
    op.drop_index("ix_escenas_video_orden", table_name="escenas_video")
    op.drop_table("escenas_video")
    op.drop_index("ix_multimedia_producto_id_orden", table_name="multimedia_producto")
    op.drop_table("multimedia_producto")
    op.drop_index("ix_variantes_producto_id_disponible", table_name="variantes")
    op.drop_table("variantes")
    op.drop_index("ix_productos_categoria_id", table_name="productos")
    op.drop_index("ix_productos_activo_orden", table_name="productos")
    op.drop_table("productos")
    op.drop_table("categorias")
