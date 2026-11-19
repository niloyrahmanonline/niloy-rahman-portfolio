import sharp from "sharp";
import { fileURLToPath } from "node:url";

const width = 960;
const height = 640;
const rgba = Buffer.alloc(width * height * 4);
const fade = (t) => t * t * (3 - 2 * t);
const mix = (a, b, t) => a + (b - a) * t;

function hash(x, y) {
  let key = Math.imul(x, 374761393) ^ Math.imul(y, 668265263);
  key = Math.imul(key ^ (key >>> 13), 1274126177);
  return ((key ^ (key >>> 16)) >>> 0) / 4294967295;
}

function noise(x, y) {
  const left = Math.floor(x);
  const top = Math.floor(y);
  const u = fade(x - left);
  const v = fade(y - top);
  return mix(mix(hash(left, top), hash(left + 1, top), u),
    mix(hash(left, top + 1), hash(left + 1, top + 1), u), v);
}

function clouds(x, y) {
  return noise(x * 3.8, y * 3.8) * .53
    + noise(x * 8.4 + 11, y * 8.4) * .26
    + noise(x * 17.2, y * 17.2 + 9) * .14
    + noise(x * 38, y * 38) * .07;
}

for (let row = 0; row < height; row++) {
  for (let column = 0; column < width; column++) {
    const x = column / (width - 1);
    const y = row / (height - 1);
    const warp = (clouds(x - 2.1, y + 1.3) - .5) * .3;
    const density = clouds(x + warp, y - warp);
    const ridge = y - (.51 - (x - .43) * .59 + warp);
    const stream = Math.exp(-(ridge ** 2) / .058);
    const edge = Math.max(0, 1 - ((x - .5) / .59) ** 2 - ((y - .5) / .63) ** 2);
    const mist = Math.max(0, density - .22) * stream * fade(edge);
    const pink = clouds(x + 1.9, y - 1.7);
    const index = (row * width + column) * 4;
    rgba[index] = Math.round(mix(91, 222, pink));
    rgba[index + 1] = Math.round(mix(47, 86, pink));
    rgba[index + 2] = Math.round(mix(212, 239, density));
    rgba[index + 3] = Math.round(Math.min(1, mist * 2.15) * 255);
  }
}

await sharp(rgba, { raw: { width, height, channels: 4 } })
  .webp({ quality: 80, alphaQuality: 76 })
  .toFile(fileURLToPath(new URL("../public/images/nebula-field.webp", import.meta.url)));