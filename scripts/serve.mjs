// Tiny dev server: builds, serves dist/ on :4173 and rebuilds when src/ changes.
// The build runs in a fresh process each time, so edited ES modules are never served stale.
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { watch } from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const port = Number(process.env.PORT || 4173);
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.webp': 'image/webp', '.woff2': 'font/woff2', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8',
};

let building = Promise.resolve();
const rebuild = () => {
  building = building.then(
    () =>
      new Promise((resolve) => {
        const p = spawn(process.execPath, [path.join(root, 'scripts', 'build.mjs')], { cwd: root, stdio: 'inherit' });
        p.on('close', resolve);
      }),
  );
  return building;
};

await rebuild();

http
  .createServer(async (req, res) => {
    await building; // never serve a half-written dist/
    try {
      const p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
      let file = path.join(dist, p);
      // stay strictly inside dist/ ("/a/dist-other" also starts with "/a/dist", so compare with a separator)
      if (file !== dist && !file.startsWith(dist + path.sep)) throw new Error('outside dist');
      if ((await stat(file).catch(() => null))?.isDirectory()) file = path.join(file, 'index.html');
      const body = await readFile(file);
      res.writeHead(200, { 'content-type': types[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' });
      res.end(body);
    } catch {
      const body = await readFile(path.join(dist, '404.html')).catch(() => 'Not found');
      res.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
      res.end(body);
    }
  })
  .listen(port, '127.0.0.1', () => console.log(`http://localhost:${port}`)); // this machine only, never the local network

let timer;
watch(path.join(root, 'src'), { recursive: true }, () => {
  clearTimeout(timer);
  timer = setTimeout(rebuild, 150);
});
