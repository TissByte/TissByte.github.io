// Zero-dependency static build: src/ -> dist/. Node 20+.
//   node scripts/build.mjs
// Fails (non-zero exit) on: a project without copy, unknown {placeholders}, missing assets, broken #anchors,
// duplicate ids, or a page without exactly one <h1>.
import { readFile, writeFile, mkdir, cp, rm, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { site, projects } from '../src/data.mjs';
import { renderPage, renderNotFound } from '../src/render.mjs';
import copy from '../src/copy.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = (...p) => path.join(root, 'src', ...p);
const dist = (...p) => path.join(root, 'dist', ...p);

function validateCopy() {
  const errors = [];
  for (const p of projects) if (!copy.projects.items[p.id]) errors.push(`no copy for project "${p.id}"`);
  for (const id of Object.keys(copy.projects.items)) {
    if (!projects.some((p) => p.id === id)) errors.push(`copy for unknown project "${id}"`);
  }
  if (errors.length) throw new Error('Copy validation failed:\n  - ' + errors.join('\n  - '));
}

const md5 = (s) => createHash('md5').update(s).digest('hex').slice(0, 8);

async function checkOutput(files) {
  const errors = [];
  for (const [name, html] of Object.entries(files)) {
    if (!name.endsWith('.html')) continue;
    for (const m of html.matchAll(/(?:src|href|srcset)="([^"]+)"/g)) {
      for (const part of m[1].split(',')) {
        const u = part.trim().split(/\s+/)[0];
        if (u.startsWith('/') && !u.startsWith('//')) {
          const file = u.split('?')[0].split('#')[0];
          if (file === '/') continue;
          if (!existsSync(dist(file))) errors.push(`${name}: missing file ${file}`);
        }
      }
    }
    const idList = [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]);
    const ids = new Set(idList);
    for (const m of html.matchAll(/href="#([^"]+)"/g)) if (!ids.has(m[1])) errors.push(`${name}: broken anchor #${m[1]}`);
    for (const m of html.matchAll(/aria-(?:controls|labelledby)="([^"]+)"/g)) {
      for (const id of m[1].split(/\s+/)) if (!ids.has(id)) errors.push(`${name}: aria reference to missing id "${id}"`);
    }
    for (const m of html.matchAll(/data-open="([^"]+)"/g)) if (!ids.has(m[1])) errors.push(`${name}: data-open → missing #${m[1]}`);
    const seen = new Set();
    for (const id of idList) { if (seen.has(id)) errors.push(`${name}: duplicate id "${id}"`); seen.add(id); }
    if (name !== '404.html' && (html.match(/<h1[\s>]/g) || []).length !== 1) errors.push(`${name}: expected exactly one <h1>`);
  }
  if (errors.length) throw new Error('Output validation failed:\n  - ' + errors.join('\n  - '));
}

export async function build({ quiet = false } = {}) {
  validateCopy();
  await rm(dist(), { recursive: true, force: true });
  await mkdir(dist('assets'), { recursive: true });
  await cp(src('assets'), dist('assets'), { recursive: true });

  const css = await readFile(src('styles.css'), 'utf8');
  const js = await readFile(src('main.js'), 'utf8');
  await writeFile(dist('styles.css'), css);
  await writeFile(dist('main.js'), js);
  const hashes = { css: md5(css), js: md5(js) };

  const files = {
    'index.html': renderPage(copy, hashes),
    '404.html': renderNotFound(copy, hashes),
  };
  for (const [name, html] of Object.entries(files)) await writeFile(dist(name), html);
  await checkOutput(files);

  const today = new Date().toISOString().slice(0, 10);
  await writeFile(
    dist('sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${site.url}/</loc>\n    <lastmod>${today}</lastmod>\n  </url>\n</urlset>\n`,
  );
  await writeFile(dist('robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);
  await writeFile(dist('.nojekyll'), '');

  // assets nobody references any more are dead weight: say so (does not fail the build)
  const used = new Set();
  for (const text of [...Object.values(files), css, js]) for (const m of text.matchAll(/\/assets\/([\w.-]+)/g)) used.add(m[1]);
  const all = await readdir(dist('assets'));
  const unused = all.filter((f) => !used.has(f));

  if (!quiet) {
    console.log(`built dist/  ·  ${Object.keys(files).length} pages  ·  ${all.length} assets  ·  css ${hashes.css}  js ${hashes.js}`);
    if (unused.length) console.warn(`warning: unused assets in src/assets: ${unused.join(', ')}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  build().catch((e) => { console.error(e.message); process.exit(1); });
}
