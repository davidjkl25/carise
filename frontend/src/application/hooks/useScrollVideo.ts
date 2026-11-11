"use client";

import { useMotionValueEvent, useScroll } from "framer-motion";
import { useCallback, useMemo, useState, type RefObject } from "react";

import type { Escena } from "@/domain/catalog";

interface UseScrollVideoOptions {
  containerRef: RefObject<HTMLElement | null>;
  escenas: Escena[];
  reduceMotion: boolean;
}

interface UseScrollVideoResult {
  activeIndex: number;
  sceneProgress: number;
  scrollToScene: (index: number, behavior?: ScrollBehavior) => void;
}

export function useScrollVideo({
  containerRef,
  escenas,
  reduceMotion,
}: UseScrollVideoOptions): UseScrollVideoResult {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const ordered = useMemo(() => [...escenas].sort((a, b) => a.orden - b.orden), [escenas]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [sceneProgress, setSceneProgress] = useState(0);

  const timeline = useMemo(() => {
    if (ordered.length === 0) {
      return { start: 0, end: 0 };
    }

    return {
      start: Math.min(...ordered.map((escena) => escena.inicio_seg)),
      end: Math.max(...ordered.map((escena) => escena.fin_seg)),
    };
  }, [ordered]);

  const applyProgress = useCallback(
    (progress: number) => {
      if (ordered.length === 0) {
        return;
      }

      const clamped = Math.min(Math.max(progress, 0), 1);
      const time = timeline.start + clamped * (timeline.end - timeline.start);

      let index = 0;
      for (let position = 0; position < ordered.length; position += 1) {
        if (time >= ordered[position].inicio_seg) {
          index = position;
        }
      }

      const scene = ordered[index];
      const range = scene.fin_seg - scene.inicio_seg;
      const localProgress = range > 0 ? (time - scene.inicio_seg) / range : 0;

      setActiveIndex(index);
      setSceneProgress(Math.min(Math.max(localProgress, 0), 1));
    },
    [ordered, timeline],
  );

  useMotionValueEvent(scrollYProgress, "change", applyProgress);

  const scrollToScene = useCallback(
    (index: number, behavior?: ScrollBehavior) => {
      const container = containerRef.current;
      const scene = ordered[index];
      if (container === null || scene === undefined) {
        return;
      }

      const range = timeline.end - timeline.start;
      const progress = range > 0 ? (scene.inicio_seg - timeline.start) / range : 0;
      const containerTop = window.scrollY + container.getBoundingClientRect().top;
      const scrollable = Math.max(container.offsetHeight - window.innerHeight, 0);

      window.scrollTo({
        top: containerTop + progress * scrollable,
        behavior: behavior ?? (reduceMotion ? "auto" : "smooth"),
      });
    },
    [containerRef, ordered, reduceMotion, timeline],
  );

  return { activeIndex, sceneProgress, scrollToScene };
}
