export const reducedMotionQuery = "(prefers-reduced-motion: reduce)";
export const finePointerQuery = "(any-hover: hover) and (any-pointer: fine)";
const actionable = "a[href], button:not(:disabled), [role='button']";
const nativeCursor = "input, textarea, select, label, video, audio, iframe, [contenteditable]:not([contenteditable='false']), [data-native-cursor]";
const text = "p, h1, h2, h3, h4, li, blockquote, pre";
const passive = { passive: true } as const;

export function spring(value: number, velocity: number, target: number, time: number, response = 25) {
  const displacement = value - target;
  const combined = velocity + response * displacement;
  const decay = Math.exp(-response * time);
  return {
    value: target + (displacement + combined * time) * decay,
    velocity: (velocity - response * combined * time) * decay,
  };
}

export function mountPointerEffects(cursor: HTMLElement, ring: HTMLElement, dot: HTMLElement) {
  const finePointer = window.matchMedia(finePointerQuery);
  const reducedMotion = window.matchMedia(reducedMotionQuery);
  const forcedColors = window.matchMedia("(forced-colors: active)");
  const root = document.documentElement;
  let unbind: (() => void) | undefined;

  function bind() {
    let frame = 0;
    let previous: number | null = null;
    let moved = false;
    let visible = false;
    let x = 0;
    let y = 0;
    let ringX = { value: 0, velocity: 0 };
    let ringY = { value: 0, velocity: 0 };
    let pointerTarget: Element | null = null;
    let glass: HTMLElement | null = null;
    let reflection: HTMLElement | null = null;
    let bounds: DOMRect | null = null;
    let magnet: HTMLElement | null = null;
    let magneticX = { value: 0, velocity: 0 };
    let magneticY = { value: 0, velocity: 0 };

    function schedule() {
      if (!frame) frame = requestAnimationFrame(draw);
    }

    function clearGlass() {
      if (glass) delete glass.dataset.reflecting;
      glass = null;
      reflection = null;
      bounds = null;
    }

    function clearMagnet() {
      magnet?.style.removeProperty("translate");
      magnet = null;
      magneticX = { value: 0, velocity: 0 };
      magneticY = { value: 0, velocity: 0 };
    }

    function reset() {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = null;
      moved = false;
      visible = false;
      pointerTarget = null;
      delete root.dataset.cursorActive;
      cursor.removeAttribute("data-interactive");
      clearGlass();
      clearMagnet();
    }

    function draw(now: number) {
      frame = 0;
      const seconds = previous === null ? 0 : Math.max(0, Math.min((now - previous) / 1000, 0.05));
      previous = now;
      let targetX = 0;
      let targetY = 0;

      if (moved) {
        const link = pointerTarget?.closest(actionable);
        const native = !pointerTarget || pointerTarget.closest(nativeCursor) ||
          (!link && pointerTarget.closest(text)) || window.getSelection()?.isCollapsed === false;
        if (native) {
          delete root.dataset.cursorActive;
          visible = false;
          clearGlass();
        } else {
          const nextGlass = pointerTarget?.closest<HTMLElement>("[data-glass-reflection]") ?? null;
          if (glass !== nextGlass) {
            clearGlass();
            glass = nextGlass;
            reflection = glass?.querySelector<HTMLElement>(":scope > .glass-reflection > span") ?? null;
            const nextMagnet = glass?.querySelector<HTMLElement>("[data-magnet-content]");
            if (nextMagnet && nextMagnet !== magnet) { clearMagnet(); magnet = nextMagnet; }
          }
          if (glass && !bounds) bounds = glass.getBoundingClientRect();

          if (!visible) {
            ringX = { value: x, velocity: 0 };
            ringY = { value: y, velocity: 0 };
            root.dataset.cursorActive = "true";
          }
          visible = true;
          cursor.toggleAttribute("data-interactive", Boolean(link));
          dot.style.transform = "translate3d(" + x + "px," + y + "px,0)";
        }
      }

      if (glass && bounds && bounds.width && bounds.height) {
        const relativeX = Math.max(0, Math.min(1, (x - bounds.left) / bounds.width));
        const relativeY = Math.max(0, Math.min(1, (y - bounds.top) / bounds.height));
        if (moved && reflection) {
          reflection.style.transform = `translate3d(${relativeX * bounds.width}px,${relativeY * bounds.height}px,0)`;
          glass.dataset.reflecting = "true";
        }
        if (magnet && glass.contains(magnet)) {
          targetX = (relativeX - 0.5) * 7;
          targetY = (relativeY - 0.5) * 5;
        }
      }
      moved = false;

      if (visible) {
        const distance = Math.hypot(x - ringX.value, y - ringY.value);
        if (distance > 26) {
          const ratio = 26 / distance;
          ringX = { value: x + (ringX.value - x) * ratio, velocity: 0 };
          ringY = { value: y + (ringY.value - y) * ratio, velocity: 0 };
        }
        ringX = spring(ringX.value, ringX.velocity, x, seconds, 52);
        ringY = spring(ringY.value, ringY.velocity, y, seconds, 52);
        ring.style.transform = `translate3d(${ringX.value}px,${ringY.value}px,0)`;
      }
      if (magnet) {
        magneticX = spring(magneticX.value, magneticX.velocity, targetX, seconds);
        magneticY = spring(magneticY.value, magneticY.velocity, targetY, seconds);
        magnet.style.translate = magneticX.value.toFixed(2) + "px " + magneticY.value.toFixed(2) + "px";
      }

      const ringMoving = visible && (Math.hypot(x - ringX.value, y - ringY.value) > 0.2 ||
        Math.hypot(ringX.velocity, ringY.velocity) > 2);
      const magnetMoving = Math.hypot(targetX - magneticX.value, targetY - magneticY.value) > 0.025 ||
        Math.hypot(magneticX.velocity, magneticY.velocity) > 0.15;
      if (ringMoving || magnetMoving) schedule();
      else {
        previous = null;
        if (!glass?.contains(magnet)) clearMagnet();
      }
    }

    function move(event: PointerEvent) {
      if (event.pointerType !== "mouse") { reset(); return; }
      pointerTarget = event.target instanceof Element ? event.target : null;
      x = event.clientX;
      y = event.clientY;
      moved = true;
      previous ??= event.timeStamp;
      schedule();
    }

    function invalidateBounds() {
      clearGlass();
      if (magnet) schedule();
    }

    function release(event: PointerEvent) {
      if (!event.relatedTarget) reset();
    }

    function resetOnTouch(event: PointerEvent) {
      if (event.pointerType !== "mouse") reset();
    }

    function restoreOnKeyboard(event: KeyboardEvent) {
      if (event.key === "Tab") reset();
    }

    function restoreOnSelection() {
      if (window.getSelection()?.isCollapsed === false) reset();
    }

    window.addEventListener("pointermove", move, passive);
    window.addEventListener("pointerout", release, passive);
    window.addEventListener("pointerdown", resetOnTouch, passive);
    window.addEventListener("pointercancel", reset, passive);
    window.addEventListener("keydown", restoreOnKeyboard);
    window.addEventListener("scroll", invalidateBounds, { passive: true, capture: true });
    window.addEventListener("resize", invalidateBounds, passive);
    window.addEventListener("blur", reset);
    document.addEventListener("visibilitychange", reset);
    document.addEventListener("selectionchange", restoreOnSelection);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerout", release);
      window.removeEventListener("pointerdown", resetOnTouch);
      window.removeEventListener("pointercancel", reset);
      window.removeEventListener("keydown", restoreOnKeyboard);
      window.removeEventListener("scroll", invalidateBounds, true);
      window.removeEventListener("resize", invalidateBounds);
      window.removeEventListener("blur", reset);
      document.removeEventListener("visibilitychange", reset);
      document.removeEventListener("selectionchange", restoreOnSelection);
      reset();
    };
  }

  function sync() {
    unbind?.();
    unbind = finePointer.matches && !reducedMotion.matches && !forcedColors.matches ? bind() : undefined;
  }

  finePointer.addEventListener("change", sync);
  reducedMotion.addEventListener("change", sync);
  forcedColors.addEventListener("change", sync);
  sync();
  return () => {
    finePointer.removeEventListener("change", sync);
    reducedMotion.removeEventListener("change", sync);
    forcedColors.removeEventListener("change", sync);
    unbind?.();
  };
}
