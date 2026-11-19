type Offset = { x: number; y: number };
type Point = Offset & { z: number };
type Plane = { x: number; y: number; nx: number; ny: number; nz: number; radius: number };
type PortraitRect = { left: number; top: number; width: number; height: number };
const TAU = Math.PI * 2;
const CAMERA_DISTANCE = 4.7;

export const orbits = [
  { period: 24, direction: 1, phase: .12, lean: 1.16, roll: -.45, height: .47, size: .247 },
  { period: 32, direction: -1, phase: -.38, lean: 1.27, roll: -.29, height: .69, size: .268 },
] as const;
type Orbit = (typeof orbits)[number];

export function projectOrbit(
  ring: Orbit, time: number, width: number, height: number, pointer: Offset, circle: readonly Offset[],
  points: Point[] = [], plane?: Plane,
): Point[] {
  const angle = ring.phase + ring.direction * (time % ring.period) / ring.period * TAU;
  const yaw = angle + pointer.x * .07;
  const tilt = ring.lean + Math.sin(angle) * .13 + pointer.y * .06;
  const roll = ring.roll + Math.sin(angle) * .15;
  const mobile = width <= 767;
  const radius = Math.min(width * (mobile ? ring.size * 1.45 : ring.size), height * (mobile ? .64 : .40));
  const camera = radius * CAMERA_DISTANCE;
  const cosTilt = Math.cos(tilt), sinTilt = Math.sin(tilt);
  const cosYaw = Math.cos(yaw), sinYaw = Math.sin(yaw);
  const cosRoll = Math.cos(roll), sinRoll = Math.sin(roll);
  const centerX = width * .53 + pointer.x * 7;
  const centerY = height * ring.height + pointer.y * 5;

  if (plane) {
    // Apply the same Euler rotations to the orbit plane's original (0, 0, 1) normal.
    const normalX = cosTilt * sinYaw;
    const normalY = -sinTilt;
    plane.x = centerX;
    plane.y = centerY;
    plane.nx = normalX * cosRoll - normalY * sinRoll;
    plane.ny = normalX * sinRoll + normalY * cosRoll;
    plane.nz = cosTilt * cosYaw;
    plane.radius = radius;
  }

  for (let i = 0; i < circle.length; i++) {
    const { x, y } = circle[i];
    const pitchedY = y * cosTilt;
    const pitchedZ = y * sinTilt;
    const yawedX = x * cosYaw + pitchedZ * sinYaw;
    const z = (-x * sinYaw + pitchedZ * cosYaw) * radius;
    const scale = radius * camera / (camera - z);
    const point = points[i] ?? (points[i] = { x: 0, y: 0, z: 0 });
    point.x = centerX + (yawedX * cosRoll - pitchedY * sinRoll) * scale;
    point.y = centerY + (yawedX * sinRoll + pitchedY * cosRoll) * scale;
    point.z = z;
  }
  return points;
}

function buildPaths(points: Point[], plane: Plane, time: number, ring: Orbit, thin: boolean) {
  const loop = new Path2D(), inner = new Path2D(), outer = new Path2D(), edge = new Path2D();
  const reflection = new Path2D(), cyanPulse = new Path2D();
  const violetDust = new Path2D(), cyanDust = new Path2D();
  const count = points.length;
  const cycle = (time % ring.period) / ring.period * ring.direction;
  const camera = plane.radius * CAMERA_DISTANCE;

  // Each strand changes radius inside the rotating plane before perspective projection.
  function projectedScale(point: Point, scale: number) {
    return scale * (camera - point.z) / (camera - point.z * scale);
  }

  for (let i = 0; i < count; i++) {
    const point = points[i];
    const phase = i / count * TAU;
    const wave = Math.sin(phase * 3 + cycle * TAU);
    const offsetX = point.x - plane.x;
    const offsetY = point.y - plane.y;
    const inset = projectedScale(point, .965 - wave * .004);
    const outset = projectedScale(point, 1.035 + wave * .005);
    const filament = projectedScale(point, 1.065 + wave * .006);
    if (i === 0) {
      loop.moveTo(point.x, point.y);
      inner.moveTo(plane.x + offsetX * inset, plane.y + offsetY * inset);
      outer.moveTo(plane.x + offsetX * outset, plane.y + offsetY * outset);
      edge.moveTo(plane.x + offsetX * filament, plane.y + offsetY * filament);
    } else {
      loop.lineTo(point.x, point.y);
      inner.lineTo(plane.x + offsetX * inset, plane.y + offsetY * inset);
      outer.lineTo(plane.x + offsetX * outset, plane.y + offsetY * outset);
      edge.lineTo(plane.x + offsetX * filament, plane.y + offsetY * filament);
    }
  }
  loop.closePath();
  inner.closePath();
  outer.closePath();
  edge.closePath();

  const wrap = (fraction: number) => (fraction % 1 + 1) % 1;
  const phase = cycle + .24 + ring.phase;
  function pulse(path: Path2D, start: number, length: number, radius: number) {
    const first = wrap(start) * count;
    const last = first + length * count;
    for (let i = Math.floor(first); i < last; i++) {
      const a = points[i % count], b = points[(i + 1) % count];
      const scaleA = projectedScale(a, radius), scaleB = projectedScale(b, radius);
      const ax = plane.x + (a.x - plane.x) * scaleA, bx = plane.x + (b.x - plane.x) * scaleB;
      const ay = plane.y + (a.y - plane.y) * scaleA, by = plane.y + (b.y - plane.y) * scaleB;
      if (i === Math.floor(first)) {
        const from = first - i;
        path.moveTo(ax + (bx - ax) * from, ay + (by - ay) * from);
      }
      const to = Math.min(1, last - i);
      path.lineTo(ax + (bx - ax) * to, ay + (by - ay) * to);
    }
  }
  pulse(reflection, phase, .16, 1);
  pulse(cyanPulse, phase + .46, .087, .966);

  const particles = thin ? 7 : 15;
  for (let i = 0; i < particles; i++) {
    const offset = wrap(i * .61803398875 + cycle * (i % 2 ? 1 : 2)) * count;
    const a = points[Math.floor(offset)], b = points[(Math.floor(offset) + 1) % count];
    const mix = offset % 1;
    const radius = projectedScale(a, .93 + (i % 5) * .031);
    const x = plane.x + (a.x + (b.x - a.x) * mix - plane.x) * radius;
    const y = plane.y + (a.y + (b.y - a.y) * mix - plane.y) * radius;
    const r = (thin ? .62 : .8) + (i % 4) * .26;
    const dust = i % 6 === 0 ? cyanDust : violetDust;
    dust.moveTo(x + r, y);
    dust.arc(x, y, r, 0, TAU);
  }
  return { loop, inner, outer, edge, reflection, cyanPulse, violetDust, cyanDust };
}
type Paths = ReturnType<typeof buildPaths>;

const materials = [
  { core: "247,223,255", body: "178,69,253", glow: "133,34,244", magenta: "232,121,249", scale: 1 },
  { core: "235,219,255", body: "157,83,255", glow: "125,45,234", magenta: "224,115,249", scale: .9 },
] as const;

function paint(context: CanvasRenderingContext2D, paths: Paths, plane: Plane, index: number, thin: boolean, depthColors?: Map<string, CanvasGradient>) {
  const material = materials[index];
  const width = material.scale * (thin ? .64 : 1);
  const front = Boolean(depthColors);
  const normal = Math.max(.001, Math.hypot(plane.nx, plane.ny));
  const fade = Math.max(16, plane.radius * .19);
  const nx = -Math.sign(plane.nz) * plane.nx / normal;
  const ny = -Math.sign(plane.nz) * plane.ny / normal;
  const opacity = front ? Math.min(1, Math.abs(plane.nz) / .10) : .74;
  if (opacity === 0) return;
  depthColors?.clear();

  // Every strand, pulse, and particle uses the same soft projected depth transition.
  function color(rgb: string) {
    if (!depthColors) return "rgb(" + rgb + ")";
    const cached = depthColors.get(rgb);
    if (cached) return cached;
    const depth = context.createLinearGradient(plane.x, plane.y, plane.x + nx * fade, plane.y + ny * fade);
    depth.addColorStop(0, "rgba(" + rgb + ",0)");
    depth.addColorStop(.43, "rgba(" + rgb + ",.22)");
    depth.addColorStop(1, "rgb(" + rgb + ")");
    depthColors.set(rgb, depth);
    return depth;
  }

  function stroke(path: Path2D, rgb: string, thickness: number, alpha: number) {
    context.globalAlpha = alpha * opacity;
    context.lineWidth = thickness * width;
    context.strokeStyle = color(rgb);
    context.stroke(path);
  }

  if (!thin) stroke(paths.loop, material.glow, 63, .027);
  stroke(paths.loop, material.glow, 43, .077);
  stroke(paths.loop, material.body, 17, .21);
  stroke(paths.loop, material.body, 7.8, .74);
  if (front) stroke(paths.loop, material.core, 1.8, .97);
  else {
    // The same projected depth direction shades the closed rear core without splitting its path.
    const contrast = Math.min(1, Math.abs(plane.nz) / .12);
    const sheen = context.createLinearGradient(plane.x - nx * plane.radius, plane.y - ny * plane.radius,
      plane.x + nx * plane.radius, plane.y + ny * plane.radius);
    sheen.addColorStop(0, "rgba(" + material.core + "," + (.88 - .21 * contrast) + ")");
    sheen.addColorStop(.5, "rgba(" + material.core + ",.88)");
    sheen.addColorStop(1, "rgba(" + material.core + "," + (.88 + .12 * contrast) + ")");
    context.globalAlpha = .73;
    context.lineWidth = 1.8 * width;
    context.strokeStyle = sheen;
    context.stroke(paths.loop);
  }
  stroke(paths.inner, "128,154,255", 2.7, .51);
  stroke(paths.outer, material.magenta, 3.8, .66);
  stroke(paths.edge, material.magenta, .72, .30);
  stroke(paths.reflection, material.magenta, 17, .21);
  stroke(paths.reflection, "251,234,255", 3.7, .99);
  if (!thin) stroke(paths.cyanPulse, "34,211,238", 9, .16);
  stroke(paths.cyanPulse, "129,229,251", 2.3, .79);
  context.globalAlpha = .74 * opacity;
  context.fillStyle = color("232,167,255");
  context.fill(paths.violetDust);
  context.globalAlpha = .83 * opacity;
  context.fillStyle = color("103,232,249");
  context.fill(paths.cyanDust);
  context.globalAlpha = 1;
}


export function createOrbitRenderer(back: HTMLCanvasElement, front: HTMLCanvasElement) {
  if (typeof Path2D === "undefined") return null;
  const rear = back.getContext("2d");
  const near = front.getContext("2d");
  const mask = document.createElement("canvas");
  const silhouette = mask.getContext("2d");
  if (!rear || !near || !silhouette) return null;

  let width = 0, height = 0, thin = false;
  let circle: Offset[] = [];
  let portraitBounds: PortraitRect | null = null;
  const points: Point[] = [];
  const depthColors = new Map<string, CanvasGradient>();
  const plane: Plane = { x: 0, y: 0, nx: 0, ny: 0, nz: 0, radius: 0 };

  return {
    resize(nextWidth: number, nextHeight: number, balanced = false) {
      const nextThin = balanced || nextWidth < 768 || navigator.hardwareConcurrency <= 4;
      if (width === nextWidth && height === nextHeight && thin === nextThin) return;
      width = nextWidth;
      height = nextHeight;
      thin = nextThin;
      const pixels = thin ? 740_000 : 1_090_000;
      const ratio = Math.min(window.devicePixelRatio || 1, thin ? 1 : 1.25, Math.sqrt(pixels / (width * height)));
      for (const [canvas, context] of [[back, rear], [front, near]] as const) {
        canvas.width = Math.max(1, Math.round(width * ratio));
        canvas.height = Math.max(1, Math.round(height * ratio));
        context.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
        context.lineCap = "round";
        context.lineJoin = "round";
      }
      const samples = thin ? 58 : 88;
      points.length = 0;
      circle = Array.from({ length: samples }, (_, i) => {
        const angle = i / samples * TAU;
        return { x: Math.cos(angle), y: Math.sin(angle) };
      });
    },
    setPortrait(image: HTMLImageElement, bounds: PortraitRect) {
      portraitBounds = null;
      if (!image.complete || !image.naturalWidth || !bounds.width || !bounds.height || !width || !height) return;

      // Cache only the part of the real PNG alpha within the visible lower portrait.
      const top = Math.max(0, bounds.top + bounds.height * .55);
      const bottom = Math.min(height, bounds.top + bounds.height);
      const left = Math.max(0, bounds.left);
      const right = Math.min(width, bounds.left + bounds.width);
      if (top >= bottom || left >= right) return;

      // Align the cropped alpha cache to the front canvas pixel grid to avoid resampling its edge.
      const scaleX = front.width / width;
      const scaleY = front.height / height;
      const pixelLeft = Math.floor(left * scaleX);
      const pixelTop = Math.ceil(top * scaleY);
      mask.width = Math.max(1, Math.ceil(right * scaleX) - pixelLeft);
      mask.height = Math.max(1, Math.ceil(bottom * scaleY) - pixelTop);
      const area = { left: pixelLeft / scaleX, top: pixelTop / scaleY, width: mask.width / scaleX, height: mask.height / scaleY };
      silhouette.setTransform(scaleX, 0, 0, scaleY, 0, 0);
      silhouette.drawImage(image, bounds.left - area.left, bounds.top - area.top, bounds.width, bounds.height);
      const fade = silhouette.createLinearGradient(0, 0, 0, Math.max(16, bounds.height * .075));
      fade.addColorStop(0, "transparent");
      fade.addColorStop(.43, "rgba(0,0,0,.27)");
      fade.addColorStop(1, "#000");
      silhouette.globalCompositeOperation = "destination-in";
      silhouette.fillStyle = fade;
      silhouette.fillRect(0, 0, area.width, area.height);
      portraitBounds = area;
    },
    draw(time: number, pointer: Offset) {
      if (!width || !height) return;
      rear.clearRect(0, 0, width, height);
      near.clearRect(0, 0, width, height);
      for (const [index, ring] of orbits.entries()) {
        projectOrbit(ring, time, width, height, pointer, circle, points, plane);
        const paths = buildPaths(points, plane, time, ring, thin);
        paint(rear, paths, plane, index, thin);
        if (portraitBounds) paint(near, paths, plane, index, thin, depthColors);
      }
      if (portraitBounds) {
        const { left, top, width: w, height: h } = portraitBounds;
        near.globalCompositeOperation = "destination-in";
        near.drawImage(mask, left, top, w, h);
        near.globalCompositeOperation = "source-over";
      }
    },
  };
}
