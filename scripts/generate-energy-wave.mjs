import { fileURLToPath } from "node:url";
import sharp from "sharp";

const width = 900;
const height = 560;
const pixels = Buffer.alloc(width * height * 4);
const bands = [
  { x: .57, y: .16, rx: .49, ry: .39, angle: -.22, width: .08, tint: [191, 77, 243] },
  { x: .35, y: .76, rx: .58, ry: .32, angle: -.29, width: .10, tint: [202, 94, 230] },
  { x: .70, y: .66, rx: .43, ry: .22, angle: -.35, width: .14, tint: [121, 94, 226] },
].map((band) => ({ ...band, cos: Math.cos(band.angle), sin: Math.sin(band.angle) }));

function smoothEdge(coordinate) {
  const t = Math.min(1, 6 * Math.min(coordinate, 1 - coordinate));
  return t * t * (3 - 2 * t);
}

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const u = x / (width - 1), v = y / (height - 1);
    const channels = [0, 0, 0];
    let total = 0;
    for (const band of bands) {
      const dx = u - band.x, dy = v - band.y;
      const sx = (dx * band.cos - dy * band.sin) / band.rx;
      const sy = (dx * band.sin + dy * band.cos) / band.ry;
      const distance = Math.hypot(sx, sy) - 1;
      const intensity = .29 * Math.exp(-((distance / band.width) ** 2))
        + .09 * Math.exp(-(((distance - .09) / (band.width * .55)) ** 2));
      const shift = (.72 + .28 * Math.sin((u * 2.4 + v * 1.7) * Math.PI)) * intensity;
      total += shift;
      for (let c = 0; c < 3; c++) channels[c] += band.tint[c] * shift;
    }
    const i = (y * width + x) * 4;
    for (let c = 0; c < 3; c++) pixels[i + c] = total ? Math.round(channels[c] / total) : 0;
    pixels[i + 3] = Math.round(255 * Math.min(.55, total) * smoothEdge(u) * smoothEdge(v));
  }
}

await sharp(pixels, { raw: { width, height, channels: 4 } })
  .webp({ quality: 81, alphaQuality: 78 })
  .toFile(fileURLToPath(new URL("../public/images/energy-wave.webp", import.meta.url)));