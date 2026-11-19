type Offset = { x: number; y: number };
const TAU = Math.PI * 2;
const layers = [
  { share: .54, tint: "#dbb9ff", point: .64 },
  { share: .32, tint: "#c18cff", point: .92 },
  { share: .14, tint: "#f2a3ef", point: 1.23 },
] as const;

function seeded(seed: number) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function makeSprite() {
  const sprite = document.createElement("canvas");
  sprite.width = sprite.height = 16;
  const context = sprite.getContext("2d");
  if (!context) return null;
  const glow = context.createRadialGradient(8, 8, 0, 8, 8, 8);
  glow.addColorStop(0, "#f7deff");
  glow.addColorStop(.22, "#dfb8ff");
  glow.addColorStop(.55, "rgba(164,107,240,.29)");
  glow.addColorStop(1, "rgba(164,107,240,0)");
  context.fillStyle = glow;
  context.fillRect(0, 0, 16, 16);
  return sprite;
}

function makeComet() {
  const sprite = document.createElement("canvas");
  sprite.width = 152;
  sprite.height = 16;
  const context = sprite.getContext("2d");
  if (!context) return null;
  const trail = context.createLinearGradient(0, 0, sprite.width, 0);
  trail.addColorStop(0, "rgba(92,135,255,0)");
  trail.addColorStop(.8, "rgba(151,163,250,.33)");
  trail.addColorStop(1, "#d6ebff");
  context.fillStyle = trail;
  context.fillRect(0, 7, sprite.width - 3, 2);
  context.fillStyle = "#ebedff";
  context.beginPath();
  context.arc(sprite.width - 4, 8, 1.65, 0, TAU);
  context.fill();
  return sprite;
}

export function createGalaxyRenderer(canvas: HTMLCanvasElement, sheets: NodeListOf<HTMLCanvasElement>) {
  const context = canvas.getContext("2d");
  if (!context || sheets.length !== layers.length) return null;
  const sprite = makeSprite();
  const comet = makeComet();
  if (!sprite || !comet) return null;

  const twinkles: { x: number; y: number; phase: number; size: number; lastX: number; lastY: number }[] = [];
  let width = 0, height = 0, compact = false;
  let pixelScale = 1;
  let lastCometX = 0, lastCometY = 0;
  let cometWasVisible = false;

  return {
    resize(nextWidth: number, nextHeight: number, balanced: boolean) {
      const nextCompact = balanced || nextWidth < 768 || navigator.hardwareConcurrency <= 4;
      if (!nextWidth || !nextHeight || (width === nextWidth && height === nextHeight && compact === nextCompact)) return;
      width = nextWidth;
      height = nextHeight;
      compact = nextCompact;
      pixelScale = Math.min(compact ? .68 : .84, window.devicePixelRatio || 1, Math.sqrt((compact ? 230_000 : 375_000) / (width * height)));
      canvas.width = Math.max(1, Math.round(width * pixelScale));
      canvas.height = Math.max(1, Math.round(height * pixelScale));
      cometWasVisible = false;

      const random = seeded(7319);
      const total = compact ? (width < 768 ? 118 : 174) : 276;
      for (const [index, layer] of layers.entries()) {
        const sheet = sheets[index];
        sheet.width = canvas.width;
        sheet.height = canvas.height;
        const field = sheet.getContext("2d");
        if (!field) continue;
        for (let i = 0; i < Math.round(total * layer.share); i++) {
          const x = random() * sheet.width;
          const y = random() * sheet.height;
          const size = (layer.point + random() * .78) * pixelScale;
          field.globalAlpha = .24 + random() * .61;
          field.fillStyle = i % 19 === 0 ? "#74dcea" : layer.tint;
          field.fillRect(x, y, size, size);
        }
      }
      twinkles.length = 0;
      for (let i = 0; i < (compact ? 8 : 18); i++) {
        twinkles.push({ x: random(), y: random(), phase: random() * TAU, size: 3.6 + random() * 3.7, lastX: -100, lastY: -100 });
      }
    },
    draw(time: number, pointer: Offset) {
      if (!width || !height) return;

      // Cached star sheets move on the compositor. Erase only the previous sprite bounds here.
      for (const star of twinkles) {
        const size = star.size * pixelScale;
        context.clearRect(star.lastX - 2, star.lastY - 2, size + 4, size + 4);
      }
      if (cometWasVisible) {
        context.clearRect(lastCometX - 126 * pixelScale - 2, lastCometY - 56 * pixelScale - 2,
          138 * pixelScale + 4, 72 * pixelScale + 4);
      }
      for (const star of twinkles) {
        const size = star.size * pixelScale;
        const x = star.x * canvas.width + (Math.sin(time * .25 + star.phase) * 12 + pointer.x * 24) * pixelScale;
        const y = star.y * canvas.height + (Math.cos(time * .21 + star.phase) * 9 + pointer.y * 16) * pixelScale;
        context.globalAlpha = .21 + (.5 + Math.sin(time * 1.2 + star.phase) * .5) * .48;
        star.lastX = x - size * .5;
        star.lastY = y - size * .5;
        context.drawImage(sprite, star.lastX, star.lastY, size, size);
      }

      // The comet is idle between passes. The whole trail is one cached sprite.
      const interval = compact ? 23 : 17;
      const age = time % interval - 4.5;
      cometWasVisible = age > 0 && age < 1.35;
      if (cometWasVisible) {
        const pass = Math.floor(time / interval);
        const x = canvas.width * (pass % 2 === 0 ? .58 : .22) + age * 165 * pixelScale;
        const y = canvas.height * (pass % 2 === 0 ? .20 : .32) + age * 62 * pixelScale;
        lastCometX = x;
        lastCometY = y;
        context.save();
        context.translate(x, y);
        context.rotate(.35);
        context.globalAlpha = Math.sin(age / 1.35 * Math.PI) * .58;
        context.drawImage(comet, -122 * pixelScale, -8 * pixelScale, 122 * pixelScale, 16 * pixelScale);
        context.restore();
      }
      context.globalAlpha = 1;
    },
  };
}
