import Image from "next/image";

const valores = [
  {
    titulo: "Producción pequeña",
    detalle: "Colecciones cortas para cuidar cada detalle y evitar excesos.",
  },
  {
    titulo: "Materiales con intención",
    detalle: "Telas frescas, cómodas y proveedores de confianza.",
  },
  {
    titulo: "Atención cercana",
    detalle: "Te acompañamos por WhatsApp antes y después de comprar.",
  },
];

export function AboutSection() {
  return (
    <section
      id="sobre-nosotros"
      aria-labelledby="about-title"
      className="bg-brand-cream px-5 py-20 md:px-10 lg:px-16"
    >
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] md:items-center md:gap-14">
        <div>
          <p className="text-[10px] uppercase tracking-[0.24em] text-brand-clay">
            Nuestra historia
          </p>
          <h2
            id="about-title"
            className="mt-3 font-display text-4xl leading-tight text-brand-ink sm:text-5xl"
          >
            Sobre nosotros
          </h2>
          <div className="mt-5 space-y-4 text-sm leading-relaxed text-brand-ink/75 sm:text-base">
            <p>
              Carise nace de una idea sencilla: que elegir una prenda se sienta como recorrer una
              vitrina, con calma y sin ruido. Cada colección se piensa para acompañar el día a día
              con materiales frescos, cortes cómodos y detalles que duran.
            </p>
            <p>
              Trabajamos con talleres locales y producciones pequeñas. Nos gusta conocer la historia
              de cada prenda y contarla tal como es: su tela, su cuidado y la persona que la va a
              usar.
            </p>
          </div>

          <dl className="mt-8 grid gap-4 sm:grid-cols-3">
            {valores.map((valor) => (
              <div
                key={valor.titulo}
                className="rounded-brand border border-brand-ink/10 bg-brand-sand/35 p-4"
              >
                <dt className="font-display text-lg leading-tight text-brand-ink">
                  {valor.titulo}
                </dt>
                <dd className="mt-1 text-xs leading-relaxed text-brand-ink/65">{valor.detalle}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-brand bg-brand-sand">
            <Image
              src="/media/about.jpg"
              alt="Telas y prendas de la colección Carise"
              fill
              sizes="(max-width: 767px) 90vw, 42vw"
              className="object-cover"
            />
          </div>
          <p className="absolute bottom-4 left-4 rounded-full bg-brand-cream/90 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-brand-ink backdrop-blur">
            Hecho con calma
          </p>
        </div>
      </div>
    </section>
  );
}
