export function HeroOrbitLayer({ side }: { side: "back" | "front" }) {
  return <div className={"hero-orbits orbits-" + side} aria-hidden="true">
    {side === "back" && <div className="orbit-fallback"><i /><i /></div>}
    <canvas data-orbit-canvas={side} />
  </div>;
}