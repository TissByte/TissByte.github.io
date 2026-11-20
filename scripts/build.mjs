// Zero-dependency static build: src/ -> dist/. Node 20+.
//   node scripts/build.mjs
// Fails (non-zero exit) on: a project without copy, a language whose copy differs in shape from English (missing key,
// different list length, different {placeholders}, untranslated paragraph), unknown {placeholders}, missing assets,
// broken #anchors, duplicate ids, or a page without exactly one <h1>.
import { readFile, writeFile, mkdir, cp, rm, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { site, projects } from '../src/data.mjs';
import { renderPage, renderNotFound } from '../src/render.mjs';
import { languages, defaultLanguage, typeset } from '../src/langs.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = (...p) => path.join(root, 'src', ...p);
const dist = (...p) => path.join(root, 'dist', ...p);

/** Every string of a copy object as { "a.b[0][1]": "text" }, so two languages can be compared leaf by leaf. */
function leaves(v, at = '', out = {}) {
  if (typeof v === 'string') out[at] = v;
  else if (Array.isArray(v)) {
    out[`${at}.length`] = String(v.length);
    v.forEach((x, i) => leaves(x, `${at}[${i}]`, out));
  } else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) leaves(x, at ? `${at}.${k}` : k, out);
  return out;
}
const placeholders = (str) => [...str.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(',');
// Copy that is the same in every language on purpose (names, versions, code, units). Anything else this long that is
// identical to the English text is an untranslated string.
const SAME_OK = new Set(['lang']);

function validateCopy(copies) {
  const errors = [];
  for (const [code, copy] of Object.entries(copies)) {
    for (const p of projects) if (!copy.projects.items[p.id]) errors.push(`[${code}] no copy for project "${p.id}"`);
    for (const p of projects) {
      const n = p.gallery?.length ?? 0;
      const m = copy.projects.items[p.id]?.gallery?.length ?? 0;
      if (n !== m) errors.push(`[${code}] "${p.id}": ${n} gallery images in data.mjs but ${m} captions`);
    }
    for (const id of Object.keys(copy.projects.items)) {
      if (!projects.some((p) => p.id === id)) errors.push(`[${code}] copy for unknown project "${id}"`);
    }
  }
  // every other language must have exactly the shape of the default one
  const base = leaves(copies[defaultLanguage.code]);
  for (const [code, copy] of Object.entries(copies)) {
    if (code === defaultLanguage.code) continue;
    const other = leaves(copy);
    for (const k of Object.keys(base)) if (!(k in other)) errors.push(`[${code}] missing "${k}"`);
    for (const k of Object.keys(other)) if (!(k in base)) errors.push(`[${code}] "${k}" does not exist in ${defaultLanguage.code}`);
    for (const k of Object.keys(base)) {
      if (!(k in other)) continue;
      if (k.endsWith('.length')) {
        if (base[k] !== other[k]) errors.push(`[${code}] "${k.slice(0, -7)}" has ${other[k]} items, ${defaultLanguage.code} has ${base[k]}`);
        continue;
      }
      if (!other[k].trim()) errors.push(`[${code}] "${k}" is empty`);
      if (placeholders(base[k]) !== placeholders(other[k])) errors.push(`[${code}] "${k}": placeholders differ ({${placeholders(other[k])}} vs {${placeholders(base[k])}})`);
      if (!SAME_OK.has(k) && base[k] === other[k] && base[k].length > 24) errors.push(`[${code}] "${k}" is identical to ${defaultLanguage.code}: untranslated?`);
    }
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
        if (!u || /^(https?:|data:|mailto:|#|\/\/)/.test(u)) continue;
        // a root-absolute URL starts at dist/; a relative one starts at the folder of the page that holds it ("fr/")
        const clean = u.split('?')[0].split('#')[0];
        const file = path.posix.normalize(clean.startsWith('/') ? clean.slice(1) : path.posix.join(path.posix.dirname(name), clean));
        if (file.startsWith('..')) { errors.push(`${name}: ${u} points outside the site`); continue; }
        const target = /(^|\/)\.?$/.test(file) || clean.endsWith('/') ? path.posix.join(file, 'index.html') : file; // a folder link means its index page
        if (!existsSync(dist(target))) errors.push(`${name}: missing file ${target}`);
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
  const copies = {};
  for (const l of languages) copies[l.code] = (await l.copy()).default;
  validateCopy(copies);
  const typeset_ = languages.map((l) => typeset(copies[l.code], l.code)); // French typography (no-break spaces) applied to the text

  await rm(dist(), { recursive: true, force: true });
  await mkdir(dist('assets'), { recursive: true });
  await cp(src('assets'), dist('assets'), { recursive: true });

  const css = await readFile(src('styles.css'), 'utf8');
  const js = await readFile(src('main.js'), 'utf8');
  await writeFile(dist('styles.css'), css);
  await writeFile(dist('main.js'), js);
  const hashes = { css: md5(css), js: md5(js) };

  const files = { '404.html': renderNotFound(typeset_, hashes) };
  languages.forEach((l, i) => { files[`${l.path}index.html`] = renderPage(typeset_[i], hashes); });
  for (const [name, html] of Object.entries(files)) {
    await mkdir(path.dirname(dist(name)), { recursive: true });
    await writeFile(dist(name), html);
  }
  await checkOutput(files);

  // one <url> per language, each listing all its alternates (and the default one as x-default)
  const today = new Date().toISOString().slice(0, 10);
  const alternates = [
    ...languages.map((l) => `    <xhtml:link rel="alternate" hreflang="${l.code}" href="${site.url}/${l.path}"/>`),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${site.url}/${defaultLanguage.path}"/>`,
  ].join('\n');
  const urls = languages.map((l) => `  <url>\n    <loc>${site.url}/${l.path}</loc>\n    <lastmod>${today}</lastmod>\n${alternates}\n  </url>`).join('\n');
  await writeFile(
    dist('sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`,
  );
  await writeFile(dist('robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);
  await writeFile(dist('.nojekyll'), '');

  // assets nobody references any more are dead weight: say so (does not fail the build)
  const used = new Set();
  for (const text of [...Object.values(files), css, js]) for (const m of text.matchAll(/assets\/([\w./-]+)/g)) used.add(m[1]);
  const all = (await readdir(dist('assets'), { recursive: true, withFileTypes: true })).filter((e) => e.isFile()).map((e) => path.relative(dist('assets'), path.join(e.parentPath, e.name)));
  const unused = all.filter((f) => !used.has(f));

  if (!quiet) {
    console.log(`built dist/  ·  ${Object.keys(files).length} pages  ·  ${all.length} assets  ·  css ${hashes.css}  js ${hashes.js}`);
    if (unused.length) console.warn(`warning: unused assets in src/assets: ${unused.join(', ')}`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  build().catch((e) => { console.error(e.message); process.exit(1); });
}
