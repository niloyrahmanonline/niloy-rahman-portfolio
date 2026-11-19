"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { finePointerQuery, reducedMotionQuery } from "@/lib/pointer-effects";
import { createOrbitRenderer } from "@/lib/orbit-renderer";
import { createOrbitQualityMonitor } from "@/lib/orbit-quality";
import { createGalaxyRenderer } from "@/lib/galaxy-renderer";
import { createEnergyButterflies } from "@/lib/energy-butterflies";

export function HeroMotion({ children }: { children: ReactNode }) {
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = stage.current;
    const hero = element?.parentElement;
    const back = element?.querySelector<HTMLCanvasElement>('[data-orbit-canvas="back"]');
    const front = element?.querySelector<HTMLCanvasElement>('[data-orbit-canvas="front"]');
    const portrait = element?.querySelector<HTMLImageElement>(".cinematic-portrait img");
    if (!element || !hero || !back || !front || !portrait) return;

    const depth = element;
    const section = hero;
    const subject = portrait;
    const renderer = createOrbitRenderer(back, front);
    const quality = createOrbitQualityMonitor();
    const atmosphere = hero.querySelector<HTMLElement>(".hero-atmosphere");
    const galaxyCanvas = atmosphere?.querySelector<HTMLCanvasElement>("[data-galaxy-canvas]");
    const galaxy = galaxyCanvas && atmosphere
      ? createGalaxyRenderer(galaxyCanvas, atmosphere.querySelectorAll<HTMLCanvasElement>("[data-galaxy-sheet]"))
      : null;
    const butterflyCanvas = atmosphere?.querySelector<HTMLCanvasElement>("[data-energy-butterflies]");
    const butterflies = butterflyCanvas ? createEnergyButterflies(butterflyCanvas) : null;
    const fine = window.matchMedia(finePointerQuery);
    const reduced = window.matchMedia(reducedMotionQuery);
    let visible = true;
    let orbitVisible = true;
    let frame = 0;
    let lastTime: number | null = null;
    let elapsed = 0;
    let balanced = false;
    let bounds: DOMRect | null = null;
    const target = { x: 0, y: 0 };
    const pointer = { x: 0, y: 0 };

    const canPlay = () => visible && !document.hidden && !reduced.matches;

    function resize() {
      const { width, height, top, left } = depth.getBoundingClientRect();
      if (!width || !height) return;
      const image = subject.getBoundingClientRect();
      renderer?.resize(width, height, balanced);
      renderer?.setPortrait(subject, { left: image.left - left, top: image.top - top, width: image.width, height: image.height });
      renderer?.draw(reduced.matches ? 0 : elapsed, pointer);
      if (renderer) depth.dataset.rendered = "true";
      if ((galaxy || butterflies) && atmosphere) {
        const area = atmosphere.getBoundingClientRect();
        galaxy?.resize(area.width, area.height, balanced);
        galaxy?.draw(reduced.matches ? 0 : elapsed, pointer);
        if (galaxy) atmosphere.dataset.rendered = "true";
        if (butterflies) {
          const protectedAreas = [...section.querySelectorAll(".cinematic-role, .cinematic-title span, .cinematic-intro, .hero-counts, .hero-location, .hero-feature")]
            .map((item) => {
              const rect = item.getBoundingClientRect();
              return { left: rect.left - area.left, top: rect.top - area.top, right: rect.right - area.left, bottom: rect.bottom - area.top };
            });
          protectedAreas.push({ left: 0, top: 0, right: area.width, bottom: 86 });
          butterflies.resize(area.width, area.height, balanced, protectedAreas);
          butterflies.draw(reduced.matches ? 0 : elapsed, pointer, reduced.matches);
        }
      }
      bounds = null;
    }

    function draw(now: number) {
      frame = 0;
      if (!canPlay()) return;
      const dt = lastTime === null ? 0 : (now - lastTime) / 1000;
      lastTime = now;
      elapsed += dt;
      if (!balanced && quality.sample(dt * 1000)) {
        balanced = true;
        resize();
      }
      const blend = 1 - Math.exp(-dt * 8);
      const beforeX = pointer.x, beforeY = pointer.y;
      pointer.x += (target.x - pointer.x) * blend;
      pointer.y += (target.y - pointer.y) * blend;
      if (Math.abs(target.x - pointer.x) < .0005) pointer.x = target.x;
      if (Math.abs(target.y - pointer.y) < .0005) pointer.y = target.y;
      if (beforeX !== pointer.x || beforeY !== pointer.y) {
        atmosphere?.style.setProperty("--atmo-x", (pointer.x * 12).toFixed(2) + "px");
        atmosphere?.style.setProperty("--atmo-y", (pointer.y * 8).toFixed(2) + "px");
      }
      if (orbitVisible) renderer?.draw(elapsed, pointer);
      galaxy?.draw(elapsed, pointer);
      butterflies?.draw(elapsed, pointer);
      frame = requestAnimationFrame(draw);
    }

    function resetPointer() {
      bounds = null;
      target.x = target.y = 0;
    }

    function updatePlayback() {
      const playing = canPlay();
      section.dataset.atmosphere = playing ? "playing" : "paused";
      if (playing && (butterflies || galaxy || (renderer && orbitVisible))) {
        if (!frame) frame = requestAnimationFrame(draw);
      } else {
        cancelAnimationFrame(frame);
        frame = 0;
        lastTime = null;
        quality.reset();
        resetPointer();
        pointer.x = pointer.y = 0;
        atmosphere?.style.removeProperty("--atmo-x");
        atmosphere?.style.removeProperty("--atmo-y");
        if (reduced.matches) {
          renderer?.draw(0, pointer);
          galaxy?.draw(0, pointer);
          butterflies?.draw(0, pointer, true);
        }
      }
    }

    function aim(event: PointerEvent) {
      if (!fine.matches || reduced.matches || event.pointerType !== "mouse" || !canPlay()) return;
      bounds ??= section.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      target.x = ((event.clientX - bounds.left) / bounds.width - .5) * 2;
      target.y = ((event.clientY - bounds.top) / bounds.height - .5) * 2;
    }

    const intersection = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === section) visible = entry.isIntersecting;
        if (entry.target === depth) orbitVisible = entry.isIntersecting;
      }
      updatePlayback();
    });
    intersection?.observe(depth);
    intersection?.observe(section);

    const observation = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(resize);
    observation?.observe(depth);
    observation?.observe(subject);
    observation?.observe(section);
    subject.addEventListener("load", resize);

    section.addEventListener("pointermove", aim, { passive: true });
    section.addEventListener("pointerleave", resetPointer);
    window.addEventListener("scroll", resetPointer, { passive: true });
    window.addEventListener("resize", resize, { passive: true });
    document.addEventListener("visibilitychange", updatePlayback);
    fine.addEventListener("change", resetPointer);
    reduced.addEventListener("change", updatePlayback);
    resize();
    updatePlayback();

    return () => {
      cancelAnimationFrame(frame);
      intersection?.disconnect();
      observation?.disconnect();
      subject.removeEventListener("load", resize);
      section.removeEventListener("pointermove", aim);
      section.removeEventListener("pointerleave", resetPointer);
      window.removeEventListener("scroll", resetPointer);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", updatePlayback);
      fine.removeEventListener("change", resetPointer);
      reduced.removeEventListener("change", updatePlayback);
      delete section.dataset.atmosphere;
      delete depth.dataset.rendered;
      atmosphere?.style.removeProperty("--atmo-x");
      atmosphere?.style.removeProperty("--atmo-y");
      if (atmosphere) delete atmosphere.dataset.rendered;
    };
  }, []);

  return <div className="cinematic-depth" ref={stage}><div className="cinematic-tilt">{children}</div></div>;
}
