// One self-contained HTML file: the CSS, the JS and every image (as a base64 data URI) inlined.
//   npm run standalone   ->   standalone/tissbyte.html
// Handy to preview the site anywhere, or to send it as a single attachment. It is NOT what the live site serves:
// the real site ships plain image files, which browsers cache and decode in parallel (base64 would make every
// page load about a third heavier and block rendering). Run `node scripts/build.mjs` first (the npm script does).
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = (...p) => path.join(root, 'dist', ...p);
const MIME = { '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml' };

let html = await readFile(dist('index.html'), 'utf8');
// one image per <img>: drop the responsive candidates (each would be inlined again, and a file has no bandwidth to save)
html = html.replace(/ srcset="[^"]*"/g, '').replace(/ sizes="[^"]*"/g, '');
const css = await readFile(dist('styles.css'), 'utf8');
const js = await readFile(dist('main.js'), 'utf8');

// every relative assets/... image reference (the lookbehind skips absolute URLs such as the og:image)
const IMG = /(?<![/\w])assets\/[\w./-]+\.(?:webp|png|jpe?g|svg)/g;
const uris = new Map();
for (const rel of new Set(html.match(IMG) ?? [])) {
  const buf = await readFile(dist(rel));
  uris.set(rel, `data:${MIME[path.extname(rel)]};base64,${buf.toString('base64')}`);
}
html = html.replace(IMG, (rel) => uris.get(rel));

html = html
  .replace(/<meta http-equiv="Content-Security-Policy"[^>]*>\n?/, '') // this copy is inline by design, so the site's policy cannot apply
  .replace(/<link rel="preload"[^>]*>\n?/g, '') // preloading a data URI is pointless
  .replace(/<link rel="stylesheet" href="styles\.css[^"]*">/, () => `<style>${css}</style>`)
  .replace(/<script src="main\.js[^"]*" defer><\/script>/, () => `<script>${js}</script>`);

await mkdir(path.join(root, 'standalone'), { recursive: true });
const out = path.join(root, 'standalone', 'tissbyte.html');
await writeFile(out, html);
console.log(`standalone/tissbyte.html  ·  ${(html.length / 1024 / 1024).toFixed(2)} MB  ·  ${uris.size} images inlined`);
