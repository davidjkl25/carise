const preguntas = [
  {
    pregunta: "¿Cómo compro una prenda?",
    respuesta:
      "Elige la prenda en la vitrina, selecciona talla y color en el detalle y pulsa “Comprar por WhatsApp”. El pago y la entrega se acuerdan por ese canal.",
  },
  {
    pregunta: "¿Cómo sé qué talla elegir?",
    respuesta:
      "Cada prenda muestra las tallas y colores disponibles. Si tienes dudas, escríbenos por WhatsApp y te ayudamos con las medidas.",
  },
  {
    pregunta: "¿Hacen envíos?",
    respuesta: "Sí. Enviamos a todo el país y coordinamos la entrega por WhatsApp según tu ciudad.",
  },
  {
    pregunta: "¿Puedo cambiar o devolver una prenda?",
    respuesta:
      "Escríbenos dentro de los primeros días después de recibirla para revisar el caso y acordar el cambio.",
  },
  {
    pregunta: "¿Los pagos se hacen en la página?",
    respuesta:
      "No. La landing no procesa pagos ni carrito; la compra se cierra directamente por WhatsApp.",
  },
  {
    pregunta: "¿Qué pasa si una prenda está agotada?",
    respuesta:
      "Se marca como “Agotado” y no permite generar la compra. Puedes escribirnos para consultar una reposición.",
  },
];

export function FaqSection() {
  return (
    <section
      id="preguntas-frecuentes"
      aria-labelledby="faq-title"
      className="border-y border-brand-ink/5 bg-brand-sand/45 px-5 py-20 md:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-4xl">
        <div className="max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.24em] text-brand-clay">Ayuda</p>
          <h2
            id="faq-title"
            className="mt-3 font-display text-4xl leading-tight text-brand-ink sm:text-5xl"
          >
            Preguntas frecuentes
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-brand-ink/70 sm:text-base">
            Todo lo que necesitas saber antes de elegir tu próxima prenda.
          </p>
        </div>

        <div className="mt-8 space-y-3">
          {preguntas.map((item) => (
            <details
              key={item.pregunta}
              className="group rounded-brand border border-brand-ink/10 bg-brand-cream/70 px-5 py-4 open:bg-brand-cream"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-display text-lg leading-tight text-brand-ink transition marker:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-clay [&::-webkit-details-marker]:hidden">
                <span>{item.pregunta}</span>
                <span
                  aria-hidden="true"
                  className="text-2xl leading-none text-brand-clay transition-transform duration-200 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-brand-ink/70">
                {item.respuesta}
              </p>
            </details>
          ))}
        </div>

        <p className="mt-6 text-sm text-brand-ink/65">
          ¿Tienes otra duda?{" "}
          <a
            href="#contacto"
            className="font-medium text-brand-clay underline underline-offset-4 transition hover:text-brand-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-clay"
          >
            Escríbenos por WhatsApp
          </a>{" "}
          y te ayudamos.
        </p>
      </div>
    </section>
  );
}
