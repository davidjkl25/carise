import type { ConfiguracionTienda } from "@/domain/catalog";

import { BrandLogo } from "@/components/brand/BrandLogo";

interface FooterProps {
  tienda: ConfiguracionTienda;
}

const redes = [
  {
    nombre: "Instagram",
    url: "https://www.instagram.com/explore/tags/carise/",
  },
  {
    nombre: "TikTok",
    url: "https://www.tiktok.com/search?q=carise",
  },
  {
    nombre: "Facebook",
    url: "https://www.facebook.com/search/top?q=carise",
  },
];

const enlaces = [
  { nombre: "Sobre nosotros", href: "#sobre-nosotros" },
  { nombre: "Preguntas frecuentes", href: "#preguntas-frecuentes" },
  { nombre: "Contacto", href: "#contacto" },
];

export function Footer({ tienda }: FooterProps) {
  const anio = new Date().getFullYear();
  const whatsappUrl = `https://wa.me/${tienda.whatsapp.replace(/\D/g, "")}`;
  const mailtoUrl = `mailto:${tienda.correo_contacto}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    tienda.direccion,
  )}`;

  return (
    <footer className="border-t border-brand-cream/10 bg-brand-ink px-5 pb-8 pt-12 text-brand-cream md:px-10 lg:px-16">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[minmax(0,1.2fr)_repeat(3,minmax(0,0.6fr))]">
        <div>
          <a
            href="#inicio"
            aria-label="Carise, ir al inicio"
            className="inline-block rounded-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-sand"
          >
            <BrandLogo variant="on-dark" />
          </a>
          <p className="font-accent text-xl text-brand-sand">nueva colección</p>
          <p className="mt-4 max-w-xs text-xs leading-relaxed text-brand-cream/60">
            Una vitrina de prendas pensadas para acompañarte con calma, textura y color.
          </p>
        </div>

        <nav aria-label="Explorar">
          <h2 className="text-[10px] uppercase tracking-[0.22em] text-brand-sand">Explorar</h2>
          <ul className="mt-3 space-y-2 text-xs text-brand-cream/70">
            {enlaces.map((enlace) => (
              <li key={enlace.href}>
                <a
                  href={enlace.href}
                  className="transition hover:text-brand-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-sand"
                >
                  {enlace.nombre}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-[10px] uppercase tracking-[0.22em] text-brand-sand">Contacto</h2>
          <ul className="mt-3 space-y-2 text-xs text-brand-cream/70">
            <li>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="break-words transition hover:text-brand-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-sand"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <a
                href={mailtoUrl}
                className="break-words transition hover:text-brand-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-sand"
              >
                {tienda.correo_contacto}
              </a>
            </li>
            <li>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="break-words transition hover:text-brand-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-sand"
              >
                {tienda.direccion}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-[10px] uppercase tracking-[0.22em] text-brand-sand">Síguenos</h2>
          <ul className="mt-3 space-y-2 text-xs text-brand-cream/70">
            {redes.map((red) => (
              <li key={red.nombre}>
                <a
                  href={red.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 transition hover:text-brand-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-sand"
                >
                  {red.nombre}
                  <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-3 border-t border-brand-cream/10 pt-5 text-[11px] text-brand-cream/45 sm:flex-row sm:items-center sm:justify-between">
        <p>© {anio} Carise. Todos los derechos reservados.</p>
        <a
          href="#inicio"
          className="w-fit transition hover:text-brand-cream focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-sand"
        >
          Volver al inicio ↑
        </a>
      </div>
    </footer>
  );
}
