type Offset = { x: number; y: number };
type Rect = { left: number; top: number; right: number; bottom: number };
type Flight = readonly [x: number, y: number, spanX: number, spanY: number, seconds: number, phase: number, direction: number, size: number];
type Placement = readonly [x: number, y: number, spanX: number, spanY: number, size: number];
const TAU = Math.PI * 2;
const SIDES = [-1, 1] as const;

// The longer lanes pass beyond the frame at both ends; the others bank back in the galaxy.
const flights: readonly Flight[] = [
  [.39, .172, .13, .029, 15, -.22, 1, 96],
  [.72, .174, .12, .039, 17, -.21, -1, 100],
  [.86, .451, .11, .074, 19, .28, 1, 84],
  [.15, .755, .14, .075, 17, .70, -1, 59],
  [.32, .48, .18, .070, 15, -.40, 1, 49],
  [.88, .92, .15, .055, 19, .90, -1, 52],
  [.55, .12, .62, .039, 25, -1.09, 1, 27],
  [.5, .89, .62, .085, 26, 1.35, -1, 29],
  [.1, .44, .12, .085, 13, -.67, -1, 26],
  [.98, .55, .20, .13, 23, -1.04, 1, 27],
  [.62, .14, .28, .047, 21, .78, 1, 31],
];
// The same creatures keep their phase, pace and direction as their lanes reflow.
const narrowPlacements: readonly Placement[] = [
  [.18, .30, .13, .046, 54],
  [.84, .34, .105, .049, 57],
  [.17, .405, .13, .049, 44],
  [.86, .443, .11, .041, 42],
];
const tabletPlacements: readonly Placement[] = [
  [.53, .183, .11, .024, 72],
  [.90, .153, .085, .018, 65],
  [.92, .432, .055, .062, 61],
  [.18, .91, .12, .047, 49],
];
const palettes = [
  { highlight: "#e4fdff", edge: "#91d9ff", mid: "#6280ec", bloom: "#528eff" },
  { highlight: "#f7ddff", edge: "#d99fff", mid: "#a45cf3", bloom: "#a855f7" },
  { highlight: "#ffedff", edge: "#f4a9fd", mid: "#b66bf3", bloom: "#df64ef" },
] as const;

function makeAtlas() {
  if (typeof Path2D === "undefined") return null;
  const forewing = new Path2D("M0 1 C16 -26 46 -58 81 -70 C105 -79 139 -83 149 -72 C158 -62 142 -50 135 -40 C121 -23 126 -9 112 -2 C92 9 48 -2 0 1Z");
  const hindwing = new Path2D("M0 2 C33 -2 68 3 93 14 C115 23 117 38 104 53 C99 63 92 62 84 71 C71 78 62 70 53 75 C39 76 33 57 24 45 C15 30 6 20 0 2Z");
  const veins = new Path2D("M1 1 Q53 -57 142 -71 M1 1 Q65 -41 135 -53 M2 0 Q72 -31 128 -34 M17 -13 Q62 -18 119 -17 M1 2 Q59 -9 110 -5 M31 -26 Q58 -50 95 -64 M42 -34 Q67 -35 112 -45 M2 3 Q43 8 104 23 M2 3 Q61 19 104 40 M3 4 Q52 29 90 61 M4 5 Q39 45 68 71 M4 6 Q25 50 44 68 M35 13 Q61 12 83 15 M27 23 Q51 26 73 39");
  const atlases = [];
  for (const palette of palettes) {
    const wing = document.createElement("canvas");
    wing.width = 178;
    wing.height = 184;
    const ink = wing.getContext("2d");
    const body = document.createElement("canvas");
    body.width = 52;
    body.height = 114;
    const center = body.getContext("2d");
    const spark = document.createElement("canvas");
    spark.width = spark.height = 20;
    const dust = spark.getContext("2d");
    if (!ink || !center || !dust) return null;

    ink.translate(8, 91);
    const glass = ink.createLinearGradient(6, 14, 132, -55);
    glass.addColorStop(0, palette.edge + "0a");
    glass.addColorStop(.38, palette.mid + "61");
    glass.addColorStop(.80, palette.bloom + "9e");
    glass.addColorStop(1, palette.highlight + "bb");
    for (const shape of [forewing, hindwing]) {
      ink.shadowColor = palette.bloom;
      ink.shadowBlur = 10;
      ink.fillStyle = glass;
      ink.fill(shape);
      ink.strokeStyle = palette.edge;
      ink.lineWidth = 3.6;
      ink.stroke(shape);
      ink.shadowBlur = 0;
      ink.strokeStyle = palette.highlight;
      ink.lineWidth = 1.15;
      ink.stroke(shape);
    }
    ink.strokeStyle = palette.highlight + "bd";
    ink.lineCap = "round";
    ink.lineWidth = 1.25;
    ink.stroke(veins);
    // Tiny nuclei give the translucent surface structure without a noisy texture.
    ink.save();
    const wingArea = new Path2D();
    wingArea.addPath(forewing);
    wingArea.addPath(hindwing);
    ink.clip(wingArea);
    for (let i = 0; i < 34; i++) {
      const x = 17 + (i * 53 % 130), y = -70 + (i * 71 % 147);
      ink.fillStyle = i % 4 === 0 ? palette.highlight + "bc" : palette.edge + "5e";
      ink.fillRect(x, y, i % 5 === 0 ? 2.2 : 1.2, i % 7 === 0 ? 2 : 1);
    }
    ink.restore();

    center.translate(26, 59);
    center.strokeStyle = palette.edge;
    center.fillStyle = palette.highlight;
    center.lineWidth = 1.25;
    center.shadowBlur = 5;
    center.shadowColor = palette.bloom;
    center.stroke(new Path2D("M-2 -9 Q-12 -24 -22 -36 M2 -9 Q12 -24 22 -36"));
    center.fill(new Path2D("M0 -17 C9 -12 6 21 0 36 C-6 21 -9 -12 0 -17Z"));
    center.fill(new Path2D("M0 -20 A4.5 4.5 0 1 1 .01 -20Z"));

    const glow = dust.createRadialGradient(10, 10, 0, 10, 10, 10);
    glow.addColorStop(0, palette.highlight);
    glow.addColorStop(.26, palette.edge + "dc");
    glow.addColorStop(.55, palette.bloom + "48");
    glow.addColorStop(1, palette.bloom + "00");
    dust.fillStyle = glow;
    dust.fillRect(0, 0, 20, 20);
    atlases.push({ wing, body, spark });
  }
  return atlases;
}

export function createEnergyButterflies(canvas: HTMLCanvasElement) {
  const ink = canvas.getContext("2d");
  if (!ink) return null;
  const atlas = makeAtlas();
  if (!atlas) return null;

  let width = 0, height = 0, compact = false, mobileLayout = false;
  let avoid: readonly Rect[] = [];
  const routes: Flight[] = [];
  const dirty = new Float32Array(flights.length * 4 * 4);
  let dirtyCount = 0;
  const sample = { x: 0, y: 0, bank: 0, depth: 0 };

  function flight(route: Flight, time: number, pointer: Offset) {
    const [x, y, spanX, spanY, duration, start, direction, size] = route;
    const cycle = time / duration * TAU * direction + start;
    const depth = .5 + .5 * Math.sin(cycle + start + .7);
    const sway = size / 100;
    sample.x = width * (x + spanX * Math.sin(cycle) + .017 * Math.sin(2 * cycle + start)) + pointer.x * 18 * sway;
    sample.y = height * (y + spanY * Math.sin(cycle * 2 + start + .8)) + Math.sin(time * 3.1 + start) * 3.5 + pointer.y * 12 * sway;
    sample.depth = depth;
    sample.bank = Math.cos(cycle) * direction * .22 + Math.sin(cycle * 2 + start) * .12;
  }

  function visibility(x: number, y: number, padding: number) {
    let available = Infinity;
    for (const rect of avoid) {
      const dx = Math.max(rect.left - x, 0, x - rect.right);
      const dy = Math.max(rect.top - y, 0, y - rect.bottom);
      available = Math.min(available, Math.hypot(dx, dy));
    }
    const fade = Math.max(0, Math.min(1, (available - padding * .89) / 19));
    return fade * fade * (3 - 2 * fade);
  }

  function damage(x: number, y: number, radius: number) {
    dirty[dirtyCount++] = x - radius;
    dirty[dirtyCount++] = y - radius;
    dirty[dirtyCount++] = radius * 2;
    dirty[dirtyCount++] = radius * 2;
  }

  return {
    resize(nextWidth: number, nextHeight: number, balanced: boolean, protectedAreas: readonly Rect[]) {
      const nextCompact = balanced || nextWidth < 768 || navigator.hardwareConcurrency <= 4;
      avoid = protectedAreas;
      if (!nextWidth || !nextHeight || (width === nextWidth && height === nextHeight && compact === nextCompact)) return;
      width = nextWidth;
      height = nextHeight;
      compact = nextCompact;
      mobileLayout = width < 768;
      const mix = mobileLayout ? Math.max(0, (width - 570) / 198) : Math.max(0, Math.min(1, (width - 800) / 360));
      // Layout clearance changes before density does. Timing stays independent of width.
      for (const [index, flight] of flights.entries()) {
        const placement = (mobileLayout ? narrowPlacements : tabletPlacements)[index];
        if (!placement) { routes[index] = flight; continue; }
        const blend = (compactValue: number, wideValue: number) => compactValue + (wideValue - compactValue) * mix;
        routes[index] = [
          blend(placement[0], flight[0]), blend(placement[1], flight[1]),
          blend(placement[2], flight[2]), blend(placement[3], flight[3]),
          flight[4], flight[5], flight[6], blend(placement[4], flight[7]),
        ];
      }
      const ratio = Math.min(window.devicePixelRatio || 1, compact ? .78 : 1, Math.sqrt((compact ? 370_000 : 760_000) / (width * height)));
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      ink.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
      dirtyCount = 0;
    },
    draw(time: number, pointer: Offset, still = false) {
      if (!width || !height) return;
      for (let i = 0; i < dirtyCount; i += 4) ink.clearRect(dirty[i], dirty[i + 1], dirty[i + 2], dirty[i + 3]);
      dirtyCount = 0;

      const count = mobileLayout ? (still ? 3 : 4) : still ? 5 : compact ? 8 : routes.length;
      for (let i = count - 1; i >= 0; i--) {
        const route = routes[i];
        const sprite = atlas[i % atlas.length];
        const scale = Math.max(.94, Math.min(1.14, width / 1440));
        const size = route[7] * scale;

        const particles = still ? 0 : compact ? 1 : i < 5 ? 3 : 1;
        for (let trail = particles; trail > 0; trail--) {
          flight(route, time - trail * .105, pointer);
          const { x, y, depth } = sample;
          if (x < -12 || x > width + 12 || y < -12 || y > height + 12) continue;
          const glow = (2.5 + size * .08) * (1 - trail * .15);
          ink.globalAlpha = visibility(x, y, glow) * (.43 - trail * .09) * (.7 + depth * .3);
          if (ink.globalAlpha < .025) continue;
          ink.drawImage(sprite.spark, x - glow, y - glow, glow * 2, glow * 2);
          damage(x, y, glow + 2);
        }

        flight(route, time, pointer);
        const { x, y, depth, bank } = sample;
        const span = size * (.82 + depth * .24);
        const radius = span * .67 + 4;
        if (x < -radius || x > width + radius || y < -radius || y > height + radius) continue;
        const alpha = visibility(x, y, radius) * (.63 + depth * .31);
        if (alpha < .025) continue;

        const beat = time * TAU * (1.72 + i % 5 * .19) + i * 1.7;
        const hinge = still ? .36 : .13 + (.5 - Math.cos(beat) * .5) * 1.18;
        const yaw = bank * .62;
        ink.globalAlpha = alpha;
        ink.save();
        ink.translate(x, y);
        ink.rotate(bank);
        for (const side of SIDES) {
          const spread = Math.max(.14, Math.cos(hinge + side * yaw));
          ink.save();
          ink.transform(side * spread, Math.sin(hinge) * (.10 + side * bank * .17), 0, 1, 0, 0);
          ink.drawImage(sprite.wing, -span * .026, -span * .332, span * .57, span * .69);
          ink.restore();
        }
        ink.drawImage(sprite.body, -span * .096, -span * .245, span * .192, span * .47);
        ink.restore();
        damage(x, y, radius);
      }
      ink.globalAlpha = 1;
    },
  };
}
