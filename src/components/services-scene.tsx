"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function ServicesScene({ className, headingId, children }: { className: string; headingId: string; children: ReactNode }) {
  const scene = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = scene.current;
    if (!section || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      section.toggleAttribute("data-in-view", entry.isIntersecting);
    }, { threshold: 0 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return <section className={className} ref={scene} aria-labelledby={headingId}>{children}</section>;
}