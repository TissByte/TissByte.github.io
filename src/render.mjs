// HTML rendering. Pure functions: (copy, data, asset hashes) -> string.
import { createHash } from 'node:crypto';
import { site, projects, derived } from './data.mjs';
import { languages, defaultLanguage } from './langs.mjs';

// ---------------------------------------------------------------- helpers
const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** A section title with its last word in italic, like the headline ("What's on the bench." / "Built for fun."). */
const emph = (s) => {
  const m = s.match(/^([\s\S]*[\s  ])(\S+)$/);
  return m ? `${m[1]}<em>${m[2]}</em>` : s;
};

/** Replace {placeholders}; an unknown placeholder is a build error, never a silent typo. */
export function fmt(str, vars) {
  return str.replace(/\{(\w+)\}/g, (m, k) => {
    if (!(k in vars)) throw new Error(`Unknown placeholder ${m} in: ${str.slice(0, 80)}`);
    return vars[k];
  });
}

// Content-Security-Policy, delivered as a <meta> because GitHub Pages cannot set response headers.
// Nothing is allowed except: our own scripts and stylesheet, images from this site and data: URIs, inline style
// attributes (the design passes its custom properties that way), and the one tiny inline script below, by hash.
// No network requests (connect-src falls back to 'none'), no fonts, no frames, no plugins, no forms, no <base>.
const JS_FLAG = "document.documentElement.classList.add('js')";
const sha = (s) => `'sha256-${createHash('sha256').update(s).digest('base64')}'`;
const csp = (inlineScripts = []) =>
  [
    "default-src 'none'",
    "img-src 'self' data:",
    "style-src 'self'",
    "style-src-attr 'unsafe-inline'",
    `script-src 'self'${inlineScripts.map((s) => ` ${sha(s)}`).join('')}`,
    "base-uri 'none'",
    "form-action 'none'",
    "object-src 'none'",
    'upgrade-insecure-requests',
  ].join('; ');

// Relative on purpose: the page works from any folder, from a file:// path, or under a sub-path.
// Pages of other languages sit one folder down ("fr/"), so renderPage() points this at "../assets/" for them.
let A = 'assets/';

const ICONS = {
  arrow: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2.6"/><path d="m4 8 8 5.8L20 8"/>',
  chip: '<rect x="7" y="7" width="10" height="10" rx="2.2"/><path d="M9.5 3v2.5M14.5 3v2.5M9.5 18.5V21M14.5 18.5V21M3 9.5h2.5M3 14.5h2.5M18.5 9.5H21M18.5 14.5H21"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.4"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/><path d="M12 14.5v2"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m8.2 12.4 2.6 2.6 5-5.4"/>',
  flask: '<path d="M9.5 3h5M10.5 3v5.6L5 18.2A1.8 1.8 0 0 0 6.6 21h10.8a1.8 1.8 0 0 0 1.6-2.8l-5.5-9.6V3"/><path d="M7.8 15h8.4"/>',
  out: '<path d="M7 17 17 7"/><path d="M8.500 7H17v8.500"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  down: '<path d="M12 5v14"/><path d="m6 13 6 6 6-6"/>',
  lockSm: '<rect x="5" y="10.500" width="14" height="10" rx="2.400"/><path d="M8.500 10.500V8a3.500 3.500 0 0 1 7 0v2.500"/>',
};
const icon = (name, cls = '') =>
  `<svg class="icon ${cls}" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${ICONS[name]}</svg>`;

const GITHUB_MARK =
  '<svg class="icon" viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true" focusable="false"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-1.96c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg>';

/** Wrap each word in a span (own chrome gradient, staggered entrance). Spaces stay real spaces, so lines wrap and screen readers read normally. */
const words = (s, from = 0) => s.split(' ').map((w, i) => `<span class="w" style="--i:${from + i}">${w}</span>`).join(' ');

const tricolor ='<span class="tricolor" aria-hidden="true"><i></i><i></i><i></i></span>';

// ---------------------------------------------------------------- pieces
function projectArt(p, t, { sizes, eager = false }) {
  const a = p.art;
  if (a.kind === 'img') {
    return `<img src="${A}${a.name}-${a.w}.webp" srcset="${A}${a.name}-${a.small}.webp ${a.small}w, ${A}${a.name}-${a.w}.webp ${a.w}w" sizes="${sizes}" width="${a.w}" height="${a.h}" alt="${esc(t.artAlt)}" loading="${eager ? 'eager' : 'lazy'}" decoding="async" style="object-position:${a.pos}">`;
  }
  if (a.kind === 'icon') {
    return `<span class="art-tile" role="img" aria-label="${esc(t.artAlt)}"><img src="${A}${a.name}-${a.w}.webp" width="${a.w}" height="${a.h}" alt="" loading="lazy" decoding="async"></span>`;
  }
  return pipelineArt(t);
}

function pipelineArt(t, labels = []) {
  const n = 6;
  const xs = Array.from({ length: n }, (_, i) => 60 + (i * 480) / (n - 1));
  const nodes = xs
    .map(
      (x, i) =>
        `<g><circle class="pn-ring" cx="${x}" cy="84" r="19"/><circle class="pn-dot" cx="${x}" cy="84" r="7"/><text class="pn-num" x="${x}" y="40" text-anchor="middle">${i + 1}</text>${labels[i] ? `<text class="pn-label" x="${x}" y="134" text-anchor="middle">${esc(labels[i])}</text>` : ''}</g>`,
    )
    .join('');
  return `<svg class="pipeline-art" viewBox="0 0 600 168" role="img" aria-label="${esc(t.artAlt)}" focusable="false"><line class="pn-line" x1="60" y1="84" x2="540" y2="84"/><line class="pn-pulse" x1="60" y1="84" x2="540" y2="84" pathLength="100"/><g aria-hidden="true">${nodes}</g></svg>`;
}

function chips(p, c, vars) {
  const L = c.projects;
  const out = [`<span class="chip chip--status" data-status="${p.status}"><span class="dot" aria-hidden="true"></span>${L.statuses[p.status]}</span>`];
  out.push(`<span class="chip">${L.kinds[p.kind]}</span>`);
  if (p.version) out.push(`<span class="chip chip--mono">v${p.version}</span>`);
  return `<div class="chips">${out.join('')}</div>`;
}

function repoNote(p, c) {
  const L = c.projects;
  if (p.public) {
    return `<a class="repo-note repo-note--link" href="${site.orgUrl}/${p.repo}">${GITHUB_MARK}<span>${L.viewRepo}</span></a>`;
  }
  return `<span class="repo-note">${icon('lockSm', 'icon--sm')}<span>${L.privateRepo}</span></span>`;
}

function card(p, c, studioStepTitles) {
  const t = c.projects.items[p.id];
  const vars = { ...derived, version: p.version ?? '', name: t.name };
  const sizes =
    p.layout === 'wide' ? '(min-width: 1000px) 640px, 92vw' : p.layout === 'full' ? '(min-width: 1000px) 520px, 92vw' : '(min-width: 1000px) 440px, 92vw';
  const art = p.art.kind === 'pipeline' ? pipelineArt(t, studioStepTitles) : projectArt(p, t, { sizes });
  return `
      <article class="card card--${p.layout} plate reveal" style="--accent:${p.accent};--ar:${p.art.ratio}" data-project="${p.id}">
        <div class="card__art">${art}</div>
        <div class="card__body">
          ${chips(p, c, vars)}
          <h3 class="card__title">${esc(t.name)}</h3>
          <p class="card__tag">${fmt(t.tagline, vars)}</p>
          <ul class="meta" aria-label="${esc(c.projects.glance)}">${p.chips.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>
          <div class="card__foot">
            ${repoNote(p, c)}
            <button class="btn btn--soft btn--sm card__more" type="button" data-open="dlg-${p.id}" aria-haspopup="dialog" aria-label="${esc(fmt(c.a11y.details, vars))}">
              <span aria-hidden="true">${c.projects.more}</span>${icon('arrow', 'icon--sm')}
            </button>
          </div>
        </div>
      </article>`;
}

function specRows(p, c, t, vars) {
  const L = c.projects;
  // Status and version are already in the chips above the title: only repeat the version when it needs a note.
  const rows = [];
  if (p.version && t.versionNote) rows.push([t.versionLabel || L.labels.version, `v${p.version}, ${t.versionNote}`]);
  for (const [k, v] of t.specs) rows.push([k, fmt(v, vars)]);
  return rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
}

function dialog(p, c, studioStepTitles) {
  const t = c.projects.items[p.id];
  const L = c.projects;
  const vars = { ...derived, version: p.version ?? '', name: t.name };
  const art =
    p.art.kind === 'pipeline'
      ? pipelineArt(t, studioStepTitles)
      : projectArt(p, t, { sizes: '(min-width: 1000px) 980px, 96vw' });
  return `
    <dialog class="sheet" id="dlg-${p.id}" aria-labelledby="dlg-${p.id}-title" style="--accent:${p.accent};--ar:${p.art.ratio};--arn:${(() => { const [a, b] = p.art.ratio.split('/').map(Number); return (a / b).toFixed(4); })()}">
      <div class="sheet__panel plate">
        <button class="sheet__close btn btn--icon" type="button" data-close aria-label="${c.a11y.close}">${icon('close')}</button>
        <div class="sheet__scroll">
        <div class="sheet__art art--${p.art.kind}">${art}</div>
        <div class="sheet__body">
          ${chips(p, c, vars)}
          <h3 id="dlg-${p.id}-title" class="sheet__title">${esc(t.name)}</h3>
          <p class="sheet__tag">${fmt(t.tagline, vars)}</p>
          <p class="sheet__summary">${fmt(t.summary, vars)}</p>
          <div class="sheet__cols">
            <section aria-labelledby="dlg-${p.id}-hl">
              <h4 id="dlg-${p.id}-hl" class="sheet__h">${L.highlights}</h4>
              <ul class="ticks">${t.highlights.map(([lead, text]) => `<li><strong>${fmt(lead, vars)}</strong><span>${fmt(text, vars)}</span></li>`).join('')}</ul>
            </section>
            <aside aria-labelledby="dlg-${p.id}-gl">
              <h4 id="dlg-${p.id}-gl" class="sheet__h">${L.glance}</h4>
              <dl class="specs well">${specRows(p, c, t, vars)}</dl>
              <p class="sheet__source"><span class="sheet__h sheet__h--inline">${L.sourceLabel}</span> ${repoNote(p, c)}</p>
            </aside>
          </div>
          ${gallery(p, c, t)}
        </div>
        </div>
      </div>
    </dialog>`;
}

/** The project's README screenshots. Thumbnails load lazily (a closed dialog is display:none, so nothing is fetched until it opens). */
function gallery(p, c, t) {
  if (!p.gallery?.length) return '';
  const L = c.projects;
  const figures = p.gallery
    .map((g, i) => {
      const caption = t.gallery[i];
      if (g.kind === 'svg') {
        return `<figure class="shot shot--svg${g.light ? ' shot--light' : ''}"><span class="shot__frame"><img src="${A}gallery/${g.name}.svg" width="${g.w}" height="${g.h}" alt="${esc(caption)}" loading="lazy" decoding="async"></span><figcaption>${caption}</figcaption></figure>`;
      }
      const thumb = `${A}gallery/${g.name}-${g.thumb}.webp`;
      const full = `${A}gallery/${g.name}-${g.full}.webp`;
      const sizes = g.kind === 'wide' ? '(min-width: 820px) 460px, 92vw' : '(min-width: 820px) 220px, 46vw';
      return `<figure class="shot shot--${g.kind}">
            <button class="shot__open shot__frame" type="button" data-zoom="${full}" data-zoom-alt="${esc(caption)}" data-zoom-w="${g.w}" data-zoom-h="${g.h}" aria-haspopup="dialog" aria-label="${esc(caption)} (${L.enlarge})">
              <img src="${thumb}" srcset="${thumb} ${g.thumb}w, ${full} ${g.full}w" sizes="${sizes}" width="${g.w}" height="${g.h}" alt="" loading="lazy" decoding="async">
            </button>
            <figcaption aria-hidden="true">${caption}</figcaption>
          </figure>`;
    })
    .join('');
  const label = t.galleryLabel || L.screenshots;
  return `<section class="sheet__gallery" aria-label="${esc(label)}">
            <h4 class="sheet__h">${label}</h4>
            <div class="gallery">${figures}</div>
          </section>`;
}

/**
 * The contact entry. The address is NOT written in the HTML: it is split in two data attributes and joined by
 * main.js, so address harvesters find nothing. The button opens a small menu (write, copy, open in Gmail).
 * Without JavaScript a plain "name [at] domain [dot] com" line takes its place.
 */
function contactMenu(c) {
  const user = site.emailUser;
  const domain = site.emailDomain;
  const L = c.contact;
  const labels = { label: L.label, write: L.write, copy: L.copy, copied: L.copied, gmail: L.gmail, subject: L.subject };
  return `<span class="contact" data-contact data-u="${user}" data-d="${domain}" data-labels="${esc(JSON.stringify(labels))}">
          <button class="btn btn--soft contact__btn" type="button" aria-expanded="false" aria-controls="contact-panel" aria-haspopup="true">${icon('mail')}<span>${c.hero.ctaContact}</span></button>
          <span class="contact__plain">${L.plain} ${user} [at] ${domain.replace(/\./g, ' [dot] ')}</span>
          <div class="contact__panel plate" id="contact-panel" role="group" aria-label="${esc(L.label)}" hidden></div>
        </span>`;
}

// ---------------------------------------------------------------- page
/** The EN | FR switch. Plain links between real pages: no script, no cookie, no stored choice. */
function languageSwitch(c, here, up) {
  const items = languages
    .map((l) => {
      const href = l === here ? './' : `${up}${l.path}` || './';
      const current = l === here ? ' aria-current="page"' : '';
      return `<a href="${href}" lang="${l.code}" hreflang="${l.code}" aria-label="${esc(l.native)} (${l.short})"${current}><span aria-hidden="true">${l.short}</span></a>`;
    })
    .join('');
  return `<div class="lang" role="group" aria-label="${esc(c.a11y.language)}" data-lang>${items}</div>`;
}

export function renderPage(c, hashes) {
  const lang = c.lang;
  const here = languages.find((l) => l.code === lang);
  const up = '../'.repeat(here.path.split('/').filter(Boolean).length); // how far this page is from the site root
  A = `${up}assets/`;
  const vars = { ...derived };
  const canonical = `${site.url}/${here.path}`;
  const studioTitles = c.projects.items.studio.pipeline; // labels of the studio's pipeline diagram
  const ogImage = `${site.url}/assets/og-image.jpg`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.org,
    url: site.url + '/',
    logo: `${site.url}/assets/icon-192.png`,
    slogan: `${c.hero.title1} ${c.hero.title2}`,
    description: c.meta.description,
    sameAs: [site.orgUrl],
    address: { '@type': 'PostalAddress', addressCountry: 'FR' },
    knowsLanguage: languages.map((l) => l.code),
  };

  const cardsHtml = projects.map((p) => card(p, c, studioTitles)).join('');
  const dialogsHtml = projects.map((p) => dialog(p, c, studioTitles)).join('');

  return `<!doctype html>
<html lang="${lang}" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(c.meta.title)}</title>
<meta name="description" content="${esc(c.meta.description)}">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<meta http-equiv="Content-Security-Policy" content="${csp([JS_FLAG])}">
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta name="theme-color" content="#26231f">
<link rel="canonical" href="${canonical}">
${languages.map((l) => `<link rel="alternate" hreflang="${l.code}" href="${site.url}/${l.path}">`).join('\n')}
<link rel="alternate" hreflang="x-default" href="${site.url}/${defaultLanguage.path}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${site.org}">
<meta property="og:title" content="${esc(c.meta.title)}">
<meta property="og:description" content="${esc(c.meta.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="${here.locale}">
${languages.filter((l) => l !== here).map((l) => `<meta property="og:locale:alternate" content="${l.locale}">`).join('\n')}
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(c.meta.ogAlt)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" sizes="32x32" href="${A}favicon-32.png">
<link rel="apple-touch-icon" href="${A}apple-touch-icon.png">
<link rel="preload" as="image" href="${A}banner-1800.webp" type="image/webp" fetchpriority="high">
<link rel="stylesheet" href="${up}styles.css?v=${hashes.css}">
<script>${JS_FLAG}</script>
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
<a class="skip" href="#main">${c.a11y.skip}</a>

<header class="nav-wrap">
  <nav class="nav" aria-label="${c.a11y.mainNav}" data-nav>
    <ul class="nav__links">
      <li><a href="#top">${c.nav.home}</a></li>
      <li><a href="#projects">${c.nav.projects}</a></li>
      <li><a href="#promises">${c.nav.principles}</a></li>
    </ul>
    ${languageSwitch(c, here, up)}
  </nav>
</header>

<main id="main">

  <section class="hero" id="top" aria-labelledby="hero-title">
    <div class="hero__stage">
      <div class="container">
        <div class="hero__window well">
          <img src="${A}banner-1800.webp" width="1800" height="600" alt="${esc(c.hero.bannerAlt)}" fetchpriority="high" decoding="async">
          <span class="hero__sheen" aria-hidden="true"></span>
          <span class="hero__glint" aria-hidden="true"></span>
        </div>
      </div>
    </div>
    <div class="container hero__copy">
      <h1 id="hero-title" class="hero__title reveal" style="--d:60ms"><span class="hero__line">${words(c.hero.title1, 0)}</span> <em class="hero__line hero__line--em">${words(c.hero.title2, c.hero.title1.split(' ').length)}</em></h1>
      <p class="hero__lead reveal" style="--d:120ms">${c.hero.lead}</p>
      <div class="hero__cta reveal" style="--d:180ms">
        <a class="btn btn--metal" href="#projects"><span>${c.hero.ctaProjects}</span>${icon('down')}</a>
        ${contactMenu(c)}
      </div>
    </div>
  </section>

  <section class="section" id="projects" aria-labelledby="projects-title">
    <div class="container">
      <header class="section-head reveal">
        <p class="eyebrow">${c.projects.eyebrow}</p>
        <h2 id="projects-title">${emph(c.projects.title)}</h2>
        <div class="section-head__aside">
          <p class="section-intro">${fmt(c.projects.intro, vars)}</p>
        </div>
        ${site.reposPrivate ? `<p class="notice well" role="note">${icon('lockSm', 'icon--sm')}<span>${c.projects.notice}</span></p>` : ''}
      </header>
      <div class="bento">${cardsHtml}
      </div>
      <ul class="stats plate reveal">
        ${c.hero.stats.map((s) => `<li><strong>${fmt(s.value, vars)}</strong><span>${fmt(s.label, vars)}</span></li>`).join('')}
      </ul>
    </div>
    ${dialogsHtml}
    <dialog class="lightbox" id="lightbox" aria-label="${esc(c.projects.screenshots)}">
      <button class="lightbox__close btn btn--icon" type="button" data-close-lightbox aria-label="${c.a11y.close}">${icon('close')}</button>
      <img class="lightbox__img" alt="" decoding="async">
    </dialog>
  </section>

  <section class="section section--last" id="promises" aria-labelledby="promises-title">
    <div class="container">
      <header class="section-head section-head--solo reveal">
        <p class="eyebrow">${c.nav.principles}</p>
        <h2 id="promises-title">${emph(c.promises.title)}</h2>
      </header>
      <ul class="promises plate reveal">
        ${c.promises.items
          .map(
            (it) => `<li>
          <span class="roundel">${icon(it.icon)}</span>
          <h3>${it.title}</h3>
          <p>${fmt(it.text, vars)}</p>
        </li>`,
          )
          .join('')}
      </ul>
    </div>
  </section>

</main>

<footer class="footer">
  <div class="container footer__base">
    <span class="footer__mark"><img src="${A}mark-160.webp" width="54" height="36" alt="" loading="lazy" decoding="async"><span>${fmt(c.footer.rights, vars)}</span></span>
    <span class="madein">${tricolor}<span>${c.footer.madeIn}</span></span>
    <span class="footer__links">
      <a href="${site.orgUrl}">${GITHUB_MARK}<span>${c.footer.github}</span></a>
      <a href="#top">${c.footer.top}</a>
    </span>
  </div>
</footer>

<script src="${up}main.js?v=${hashes.js}" defer></script>
</body>
</html>
`;
}

/** The 404 page speaks every language of the site: the visitor's language is not known, and we keep no state to find out. */
export function renderNotFound(copies, hashes) {
  const [first] = copies;
  const blocks = copies
    .map((c) => {
      const l = languages.find((x) => x.code === c.lang);
      return `<section lang="${c.lang}"${c === first ? '' : ' class="lost__alt"'}>
      ${c === first ? `<h1>${c.notFound.heading}</h1>` : `<h2>${c.notFound.heading}</h2>`}
      <p>${c.notFound.text}</p>
      <a class="btn ${c === first ? 'btn--metal' : 'btn--soft'}" href="/${l.path}">${c.notFound.cta}</a>
    </section>`;
    })
    .join('\n    ');
  return `<!doctype html>
<html lang="${first.lang}" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(copies.map((c) => c.notFound.title).join(' · '))}</title>
<meta name="robots" content="noindex">
<meta name="color-scheme" content="dark">
<meta http-equiv="Content-Security-Policy" content="${csp()}">
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta name="theme-color" content="#26231f">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png">
<link rel="stylesheet" href="/styles.css?v=${hashes.css}">
</head>
<body>
<main class="lost" id="main">
  <div class="lost__panel plate">
    <img src="/assets/mark-480.webp" width="240" height="160" alt="">
    ${blocks}
  </div>
</main>
</body>
</html>
`;
}
