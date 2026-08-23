import sharp from "sharp";
import { mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const logoPath = path.join(root, "src/assets/logo.svg");
const outDir = path.join(root, "public/icons");

mkdirSync(outDir, { recursive: true });

const bgGradientSvg = (size, contentScale) => {
  const pad = Math.round((size * (1 - contentScale)) / 2);
  const inner = size - pad * 2;
  return Buffer.from(`
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0" stop-color="#2bb7a6"/>
          <stop offset="1" stop-color="#4d7ef6"/>
        </linearGradient>
      </defs>
      <rect width="${size}" height="${size}" fill="url(#g)" />
    </svg>
  `);
};

async function run() {
  // Standard "any" purpose icons: logo fills the canvas (source already has its own rounded bg)
  for (const size of [192, 512]) {
    await sharp(logoPath).resize(size, size).png().toFile(path.join(outDir, `icon-${size}.png`));
    console.log(`wrote icon-${size}.png`);
  }

  // Maskable icon: gradient background + logo glyph scaled into the safe zone (~70%)
  for (const size of [192, 512]) {
    const bg = bgGradientSvg(size, 1);
    const glyphSize = Math.round(size * 0.65);
    const glyph = await sharp(logoPath).resize(glyphSize, glyphSize).png().toBuffer();
    const offset = Math.round((size - glyphSize) / 2);
    await sharp(bg)
      .composite([{ input: glyph, left: offset, top: offset }])
      .png()
      .toFile(path.join(outDir, `maskable-${size}.png`));
    console.log(`wrote maskable-${size}.png`);
  }

  // Apple touch icon (iOS ignores maskable safe-zone/transparency conventions, wants a filled square)
  await sharp(logoPath).resize(180, 180).png().toFile(path.join(outDir, "apple-touch-icon.png"));
  console.log("wrote apple-touch-icon.png");

  // Favicon
  await sharp(logoPath).resize(32, 32).png().toFile(path.join(outDir, "favicon-32.png"));
  console.log("wrote favicon-32.png");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
