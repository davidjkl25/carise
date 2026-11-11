"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { useReducedMotion } from "@/application/hooks/useReducedMotion";
import { useScrollVideo } from "@/application/hooks/useScrollVideo";
import { formatPrice } from "@/application/whatsapp/buildWhatsAppUrl";
import { BrandLogo } from "@/components/brand/BrandLogo";
import { ProductDetailDialog } from "@/components/product-detail/ProductDetailDialog";
import { ProductList } from "@/components/product-list/ProductList";
import { StaticGallery } from "@/components/video-scene/StaticGallery";
import type { ConfiguracionTienda, Escena } from "@/domain/catalog";

interface VideoSceneProps {
  tienda: ConfiguracionTienda;
  escenas: Escena[];
}

type SceneMode = "movimiento" | "estatico";

function seekVideo(video: HTMLVideoElement | null | undefined, progress: number): void {
  if (video === null || video === undefined || video.readyState < 1) {
    return;
  }

  const duration = Number.isFinite(video.duration) ? video.duration : 0;
  if (duration <= 0) {
    return;
  }

  const target = Math.min(Math.max(progress, 0), 1) * duration;
  if (Math.abs(video.currentTime - target) > 0.04) {
    video.currentTime = target;
  }
}

function BrandHomeLink() {
  return (
    <a
      href="#inicio"
      aria-label="Carise, ir al inicio"
      className="rounded-brand focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-sand"
    >
      <BrandLogo variant="on-dark" />
    </a>
  );
}

interface ModeSwitchProps {
  checked: boolean;
  onToggle: () => void;
}

function ModeSwitch({ checked, onToggle }: ModeSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label="Movimiento"
      title={checked ? "Desactivar movimiento" : "Activar movimiento"}
      onClick={onToggle}
      className="inline-flex items-center gap-2 rounded-full border border-brand-cream/25 bg-black/30 px-2.5 py-1.5 text-[9px] uppercase tracking-[0.18em] text-brand-cream/85 backdrop-blur transition hover:bg-black/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-sand"
    >
      <span className="hidden sm:inline">Movimiento</span>
      <span
        aria-hidden="true"
        className={`relative inline-flex h-4 w-8 shrink-0 items-center rounded-full transition-colors ${
          checked ? "bg-brand-sand" : "bg-brand-cream/30"
        }`}
      >
        <span
          className={`inline-block h-3 w-3 rounded-full transition-transform ${
            checked ? "translate-x-4 bg-brand-ink" : "translate-x-0.5 bg-brand-cream"
          }`}
        />
      </span>
    </button>
  );
}

export function VideoScene({ tienda, escenas }: VideoSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);
  const frameRef = useRef<number | null>(null);
  const wasStaticRef = useRef(false);
  const [modo, setModo] = useState<SceneMode>("movimiento");
  const [failedScenes, setFailedScenes] = useState<number[]>([]);
  const [staticIndex, setStaticIndex] = useState(0);
  const [detalleId, setDetalleId] = useState<number | null>(null);
  const [loadedIndexes, setLoadedIndexes] = useState<number[]>([0]);
  const prefersReducedMotion = useReducedMotion();

  const showStatic = modo === "estatico";
  const reduceMotion = showStatic || prefersReducedMotion;
  const {
    activeIndex: scrollIndex,
    sceneProgress,
    scrollToScene,
  } = useScrollVideo({
    containerRef,
    escenas,
    reduceMotion,
  });

  const activeIndex = showStatic ? staticIndex : scrollIndex;
  const ordenadas = [...escenas].sort((a, b) => a.orden - b.orden);
  const activa = ordenadas[activeIndex];
  const altura = `${Math.max(escenas.length, 1) * 100}vh`;

  useEffect(() => {
    const wasStatic = wasStaticRef.current;
    wasStaticRef.current = showStatic;

    if (showStatic && !wasStatic) {
      const targetIndex = scrollIndex;
      setStaticIndex(targetIndex);

      requestAnimationFrame(() => {
        const container = containerRef.current;
        const card = container?.querySelector<HTMLElement>(`[data-scene-index="${targetIndex}"]`);
        if (!card) {
          return;
        }

        const top = window.scrollY + card.getBoundingClientRect().top - 88;
        window.scrollTo({ top: Math.max(top, 0), behavior: "auto" });
      });
      return;
    }

    if (!showStatic && wasStatic) {
      requestAnimationFrame(() => scrollToScene(staticIndex, "auto"));
    }
  }, [showStatic, scrollIndex, staticIndex, scrollToScene]);

  useEffect(() => {
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      seekVideo(videoRefs.current[activeIndex], sceneProgress);
    });

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [activeIndex, sceneProgress]);

  useEffect(() => {
    videoRefs.current.forEach((video) => video?.pause());
  }, [activeIndex]);

  useEffect(() => {
    setLoadedIndexes((current) => {
      const next = new Set(current);
      const from = Math.max(activeIndex - 1, 0);
      const to = Math.min(activeIndex + 2, ordenadas.length);
      for (let index = from; index < to; index += 1) {
        next.add(index);
      }
      return [...next].sort((a, b) => a - b);
    });
  }, [activeIndex, ordenadas.length]);

  const handleToggleMotion = () => {
    if (showStatic) {
      setFailedScenes([]);
      setModo("movimiento");
      return;
    }

    setModo("estatico");
  };

  const handleSelect = (index: number) => {
    const escena = ordenadas[index];

    if (escena === undefined) {
      return;
    }

    if (showStatic) {
      setStaticIndex(index);
    } else {
      scrollToScene(index, "auto");
    }

    setDetalleId(escena.producto.id);
  };

  if (showStatic) {
    return (
      <section
        ref={containerRef}
        className="relative bg-brand-ink text-brand-cream"
        aria-label="Vitrina de prendas"
      >
        <div className="sticky top-0 z-30 border-b border-brand-cream/10 bg-brand-ink/95 backdrop-blur">
          <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
            <BrandHomeLink />
            <div className="flex items-center gap-3">
              <span className="hidden font-accent text-2xl text-brand-sand sm:inline">
                nueva colección
              </span>
              <ModeSwitch checked={false} onToggle={handleToggleMotion} />
            </div>
          </header>
        </div>

        <div className="mx-auto w-full max-w-6xl px-3 pb-16 pt-6 md:px-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <p
              role="status"
              aria-live="polite"
              className="rounded-full bg-brand-cream/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-brand-cream/80"
            >
              Modo sin movimiento
            </p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-brand-cream/45">
              {ordenadas.length} prendas
            </p>
          </div>
          <StaticGallery escenas={ordenadas} activeIndex={activeIndex} onSelect={handleSelect} />
        </div>

        <ProductDetailDialog
          open={detalleId !== null}
          productoId={detalleId}
          whatsapp={tienda.whatsapp}
          onClose={() => setDetalleId(null)}
        />
      </section>
    );
  }

  return (
    <section
      ref={containerRef}
      className="relative"
      style={{ height: altura }}
      aria-label="Vitrina en video"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-brand-ink">
        {ordenadas.map((escena, index) => {
          const shouldLoad = loadedIndexes.includes(index);
          const failed = failedScenes.includes(index);
          const imagen = escena.producto.imagen_principal;
          const opacity = index === activeIndex ? "opacity-100" : "opacity-0";

          if (failed) {
            return (
              <Image
                key={escena.id}
                src={imagen?.url ?? "/brand/placeholder.svg"}
                alt=""
                aria-hidden="true"
                fill
                sizes="100vw"
                className={`object-cover transition-opacity duration-700 ${opacity}`}
              />
            );
          }

          return (
            <video
              key={escena.id}
              ref={(element) => {
                videoRefs.current[index] = element;
              }}
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${opacity}`}
              src={
                shouldLoad
                  ? (escena.producto.video_principal?.url ?? tienda.video_landing_url)
                  : undefined
              }
              poster={
                escena.producto.imagen_principal?.url ??
                tienda.video_landing_poster_url ??
                undefined
              }
              muted
              playsInline
              preload={shouldLoad ? (index === activeIndex ? "auto" : "metadata") : "none"}
              onLoadedMetadata={(event) => {
                if (index === activeIndex) {
                  seekVideo(event.currentTarget, sceneProgress);
                }
              }}
              onError={() => {
                setFailedScenes((current) =>
                  current.includes(index) ? current : [...current, index],
                );
              }}
              aria-hidden="true"
            />
          );
        })}

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-black/45" />

        <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-4 px-5 py-4 text-brand-cream">
          <BrandHomeLink />
          <div className="flex items-center gap-3">
            <span className="hidden font-accent text-2xl text-brand-sand sm:inline">
              nueva colección
            </span>
            <ModeSwitch checked onToggle={handleToggleMotion} />
          </div>
        </header>

        <ProductList escenas={ordenadas} activeIndex={activeIndex} onSelect={handleSelect} />

        {activa ? (
          <p className="sr-only" role="status" aria-live="polite">
            {`${activa.producto.nombre}${activa.producto.agotado ? ", agotado" : ""}${
              failedScenes.includes(activeIndex) ? ", video no disponible" : ""
            }`}
          </p>
        ) : null}

        {activa ? (
          <div className="pointer-events-none absolute bottom-10 left-8 z-10 hidden max-w-sm text-brand-cream md:block">
            <p className="font-accent text-3xl text-brand-sand">
              {activa.producto.categoria.nombre}
            </p>
            <h2 className="font-display text-4xl leading-tight">{activa.producto.nombre}</h2>
            <p className="mt-1 text-sm opacity-80">
              {formatPrice(activa.producto.precio, activa.producto.moneda)}
              {activa.producto.agotado ? " · Agotado" : ""}
            </p>
            <button
              type="button"
              onClick={() => setDetalleId(activa.producto.id)}
              className="pointer-events-auto mt-4 rounded-brand border border-brand-cream/60 bg-black/25 px-4 py-2 text-xs uppercase tracking-[0.18em] text-brand-cream transition hover:bg-black/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-sand"
            >
              Ver prenda
            </button>
          </div>
        ) : null}

        {activa ? (
          <div className="absolute inset-x-0 bottom-24 z-10 flex justify-center md:hidden">
            <button
              type="button"
              onClick={() => setDetalleId(activa.producto.id)}
              className="max-w-[85vw] truncate rounded-full border border-brand-cream/70 bg-black/45 px-4 py-2 text-xs uppercase tracking-[0.16em] text-brand-cream backdrop-blur transition hover:bg-black/65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-sand"
            >
              Ver {activa.producto.nombre}
            </button>
          </div>
        ) : null}
      </div>

      <ProductDetailDialog
        open={detalleId !== null}
        productoId={detalleId}
        whatsapp={tienda.whatsapp}
        onClose={() => setDetalleId(null)}
      />
    </section>
  );
}
