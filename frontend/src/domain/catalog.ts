export type TipoMultimedia = "imagen" | "video";

export interface Categoria {
  id: number;
  nombre: string;
  slug: string;
}

export interface Multimedia {
  id: number;
  tipo: TipoMultimedia;
  url: string;
  alt_texto: string | null;
  orden: number;
}

export interface Variante {
  id: number;
  talla: string;
  color: string;
  disponible: boolean;
}

export interface Producto {
  id: number;
  nombre: string;
  slug: string;
  categoria: Categoria;
  precio: number;
  moneda: string;
  agotado: boolean;
  imagen_principal: Multimedia | null;
  video_principal: Multimedia | null;
}

export interface ProductoDetalle extends Producto {
  descripcion: string;
  cuidado: string;
  variantes: Variante[];
  multimedia: Multimedia[];
}

export interface ConfiguracionTienda {
  whatsapp: string;
  correo_contacto: string;
  direccion: string;
  video_landing_url: string;
  video_landing_url_mobile: string | null;
  video_landing_poster_url: string | null;
}

export interface Escena {
  id: number;
  orden: number;
  inicio_seg: number;
  fin_seg: number;
  producto: Producto;
}

export interface LandingResponse {
  tienda: ConfiguracionTienda;
  escenas: Escena[];
}
