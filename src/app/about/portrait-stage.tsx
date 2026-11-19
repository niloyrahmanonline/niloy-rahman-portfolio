"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function PortraitStage({ className, children }: { className: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = ref.current;
    if (!stage) return;

    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    const observer = typeof IntersectionObserver === "undefined" ? undefined : new IntersectionObserver(([entry]) => {
      stage.toggleAttribute("data-motion-paused", !entry.isIntersecting);
      if (!entry.isIntersecting) reset();
    });
    observer?.observe(stage);

    let bounds: DOMRect | undefined;
    let x = 0;
    let y = 0;
    let targetX = 0;
    let targetY = 0;
    let frame = 0;
    let previous = 0;

    function reset() {
      cancelAnimationFrame(frame);
      frame = previous = 0;
      x = y = targetX = targetY = 0;
      bounds = undefined;
      stage?.style.removeProperty("--tilt-x");
      stage?.style.removeProperty("--tilt-y");
    }

    function animate(time: number) {
      const dt = previous ? Math.min(48, time - previous) : 16;
      previous = time;
      const blend = 1 - Math.exp(-dt / 110);
      x += (targetX - x) * blend;
      y += (targetY - y) * blend;
      stage?.style.setProperty("--tilt-x", x.toFixed(3));
      stage?.style.setProperty("--tilt-y", y.toFixed(3));

      if (Math.abs(x - targetX) + Math.abs(y - targetY) > 0.008) {
        frame = requestAnimationFrame(animate);
      } else {
        frame = previous = 0;
      }
    }

    function invalidateBounds() {
      bounds = undefined;
    }

    function move(event: PointerEvent) {
      if (!finePointer.matches || event.pointerType !== "mouse" || !stage) return;
      bounds ??= stage.getBoundingClientRect();
      targetX = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
      targetY = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
      if (!frame) frame = requestAnimationFrame(animate);
    }

    function leave() {
      targetX = targetY = 0;
      bounds = undefined;
      if (!frame && (x || y)) frame = requestAnimationFrame(animate);
    }

    stage.addEventListener("pointermove", move, { passive: true });
    stage.addEventListener("pointerleave", leave);
    window.addEventListener("scroll", invalidateBounds, { passive: true });
    window.addEventListener("resize", invalidateBounds);
    finePointer.addEventListener("change", reset);
    window.addEventListener("blur", reset);

    return () => {
      observer?.disconnect();
      reset();
      stage.removeEventListener("pointermove", move);
      stage.removeEventListener("pointerleave", leave);
      window.removeEventListener("scroll", invalidateBounds);
      window.removeEventListener("resize", invalidateBounds);
      finePointer.removeEventListener("change", reset);
      window.removeEventListener("blur", reset);
    };
  }, []);

  return <div className={className} ref={ref}>{children}</div>;
}
