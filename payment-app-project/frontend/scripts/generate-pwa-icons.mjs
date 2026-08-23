import sharp from "sharp";
import { mkdirSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const logoPath = path.join(root, "src/assets/calvary-point-assembly.jpg");
const outDir = path.join(root, "public/icons");

mkdirSync(outDir, { recursive: true });

// Source photo already has a white background (matches the navbar logo), so icons reuse it as-is.
const whiteBg = (size) =>
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" fill="#ffffff" /></svg>`);

async function run() {
  // Standard "any" purpose icons: logo fills the canvas (source is already square with a white bg)
  for (const size of [192, 512]) {
    await sharp(logoPath).resize(size, size).png().toFile(path.join(outDir, `icon-${size}.png`));
    console.log(`wrote icon-${size}.png`);
  }

  // Maskable icon: white background + logo scaled into the safe zone (~80%) so Android's circular
  // crop doesn't clip the emblem/banner text
  for (const size of [192, 512]) {
    const bg = whiteBg(size);
    const glyphSize = Math.round(size * 0.8);
    const glyph = await sharp(logoPath).resize(glyphSize, glyphSize).png().toBuffer();
    const offset = Math.round((size - glyphSize) / 2);
    await sharp(bg)
      .composite([{ input: glyph, left: offset, top: offset }])
      .png()
      .toFile(path.join(outDir, `maskable-${size}.png`));
    console.log(`wrote maskable-${size}.png`);
  }

  // Apple touch icon (iOS wants a filled square, no transparency)
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
