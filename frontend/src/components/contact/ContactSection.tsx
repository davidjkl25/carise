import type { ConfiguracionTienda } from "@/domain/catalog";

interface ContactSectionProps {
  tienda: ConfiguracionTienda;
}

interface ContactCardProps {
  etiqueta: string;
  valor: string;
  detalle: string;
  href: string;
  accion: string;
  external?: boolean;
}

function formatWhatsApp(numero: string): string {
  const digits = numero.replace(/\D/g, "");

  if (digits.length === 12 && digits.startsWith("57")) {
    return `+${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }

  return `+${digits}`;
}

function ContactCard({
  etiqueta,
  valor,
  detalle,
  href,
  accion,
  external = false,
}: ContactCardProps) {
  return (
    <div className="flex h-full flex-col justify-between rounded-brand border border-brand-cream/15 bg-brand-cream/5 p-5">
      <div>
        <p className="text-[10px] uppercase tracking-[0.22em] text-brand-sand">{etiqueta}</p>
        <p className="mt-2 break-words font-display text-xl leading-tight text-brand-cream">
          {valor}
        </p>
        <p className="mt-2 text-xs leading-relaxed text-brand-cream/60">{detalle}</p>
      </div>
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className="mt-5 inline-flex w-fit items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-brand-sand underline-offset-4 transition hover:text-brand-cream hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-sand"
      >
        {accion}
        <span aria-hidden="true">→</span>
      </a>
    </div>
  );
}

export function ContactSection({ tienda }: ContactSectionProps) {
  const whatsappDigits = tienda.whatsapp.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(
    "Hola Carise, quiero más información sobre sus prendas.",
  )}`;
  const mailtoUrl = `mailto:${tienda.correo_contacto}?subject=${encodeURIComponent("Hola Carise")}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    tienda.direccion,
  )}`;

  return (
    <section
      id="contacto"
      aria-labelledby="contact-title"
      className="bg-brand-ink px-5 py-20 text-brand-cream md:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] md:items-end">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-brand-sand">Estamos cerca</p>
            <h2 id="contact-title" className="mt-3 font-display text-4xl leading-tight sm:text-5xl">
              Hablemos
            </h2>
          </div>
          <p className="text-sm leading-relaxed text-brand-cream/70 md:text-right">
            Escríbenos para resolver dudas, confirmar disponibilidad o coordinar tu pedido.
            Respondemos de lunes a sábado.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <ContactCard
            etiqueta="WhatsApp"
            valor={formatWhatsApp(tienda.whatsapp)}
            detalle="La forma más rápida de hablar con nosotros."
            href={whatsappUrl}
            accion="Abrir WhatsApp"
            external
          />
          <ContactCard
            etiqueta="Correo"
            valor={tienda.correo_contacto}
            detalle="Para consultas, alianzas y pedidos especiales."
            href={mailtoUrl}
            accion="Enviar correo"
          />
          <ContactCard
            etiqueta="Visítanos"
            valor={tienda.direccion}
            detalle="Atendemos con cita previa."
            href={mapsUrl}
            accion="Ver en el mapa"
            external
          />
        </div>
      </div>
    </section>
  );
}
