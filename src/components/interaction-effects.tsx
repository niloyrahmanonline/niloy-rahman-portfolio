"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { mountPointerEffects, reducedMotionQuery } from "@/lib/pointer-effects";

const showFps = process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_SHOW_FPS === "1";

export function InteractionEffects() {
  const pathname = usePathname();
  const cursor = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const meter = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cursor.current || !ring.current || !dot.current) return;
    return mountPointerEffects(cursor.current, ring.current, dot.current);
  }, [pathname]);

  useEffect(() => {
    const reducedMotion = window.matchMedia(reducedMotionQuery);
    if (!("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        if (!isIntersecting) continue;
        if (!reducedMotion.matches) target.classList.add("has-revealed");
        observer.unobserve(target);
      }
    }, { threshold: 0.12 });

    document.querySelectorAll(".section-heading, .service-card, .catalog-card").forEach((element) => {
      if (!element.classList.contains("has-revealed")) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    const display = meter.current;
    if (!display) return;
    let frame = 0;
    let start = 0;
    let intervals = 0;

    function sample(now: number) {
      if (!start) start = now;
      else {
        intervals++;
        const elapsed = now - start;
        if (elapsed >= 750) {
          if (display) display.textContent = Math.round(intervals * 1000 / elapsed) + " FPS";
          start = now;
          intervals = 0;
        }
      }
      frame = requestAnimationFrame(sample);
    }

    function syncSampling() {
      cancelAnimationFrame(frame);
      start = 0;
      intervals = 0;
      if (document.visibilityState === "visible") frame = requestAnimationFrame(sample);
    }

    document.addEventListener("visibilitychange", syncSampling);
    syncSampling();
    return () => {
      document.removeEventListener("visibilitychange", syncSampling);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <>
    <div className="desktop-cursor" ref={cursor} aria-hidden="true">
      <div className="cursor-ring" ref={ring}><span /></div>
      <div className="cursor-dot" ref={dot} />
    </div>
    {showFps && <div className="fps-meter" ref={meter} aria-hidden="true">Sampling FPS…</div>}
  </>;
}
