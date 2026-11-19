const colors = ["#d8b4fe", "#a855f7", "#e879f9", "#d8b4fe", "#67e8f9"] as const;

function starField(count: number, seed: number) {
  let state = seed;
  function next() {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return state / 4294967296;
  }
  return Array.from({ length: count }, () => {
    const x = (next() - .5) * 102;
    const y = (next() - .5) * 96;
    const color = colors[Math.floor(next() * colors.length)];
    const spread = next() > .85 ? 1 : 0;
    return x.toFixed(2) + "vw " + y.toFixed(2) + "svh " + spread + "px " + color;
  }).join(",");
}

const stars = starField(64, 719);
const dust = starField(23, 2701);

export function HeroGalaxy() {
  return <div className="hero-atmosphere" aria-hidden="true">
    <div className="hero-air">
      <i className="galaxy-cloud" />
      <i className="galaxy-wave" />
      <i className="galaxy-stars" style={{ boxShadow: stars }} />
      <i className="galaxy-dust" style={{ boxShadow: dust }} />
      <i className="galaxy-bokeh" />
    </div>
    <canvas className="galaxy-sheet galaxy-sheet-far" data-galaxy-sheet />
    <canvas className="galaxy-sheet galaxy-sheet-mid" data-galaxy-sheet />
    <canvas className="galaxy-sheet galaxy-sheet-near" data-galaxy-sheet />
    <canvas className="galaxy-canvas" data-galaxy-canvas />
    <canvas className="galaxy-butterflies" data-energy-butterflies />
  </div>;
}
