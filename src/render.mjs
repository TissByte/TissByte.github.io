// HTML rendering. Pure functions: (copy, data, asset hashes) -> string.
import { site, projects, derived } from './data.mjs';

// ---------------------------------------------------------------- helpers
const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Replace {placeholders}; an unknown placeholder is a build error, never a silent typo. */
export function fmt(str, vars) {
  return str.replace(/\{(\w+)\}/g, (m, k) => {
    if (!(k in vars)) throw new Error(`Unknown placeholder ${m} in: ${str.slice(0, 80)}`);
    return vars[k];
  });
}

const A = '/assets/';

const ICONS = {
  weave: '<path d="M3 8c2.2-3.4 4.6-3.4 7 0s4.8 3.4 7 0 2.4-2.8 4-2.8M3 14c2.2-3.4 4.6-3.4 7 0s4.8 3.4 7 0 2.4-2.8 4-2.8M3 20c2.2-3.4 4.6-3.4 7 0s4.8 3.4 7 0 2.4-2.8 4-2.8"/>',
  spark:
    '<path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z"/><path d="m19 16.5.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8Z"/>',
  flag: '<path d="M5 21V4"/><path d="M5 4h12l-2.2 4L17 12H5"/>',
  chip: '<rect x="7" y="7" width="10" height="10" rx="2.2"/><path d="M9.5 3v2.5M14.5 3v2.5M9.5 18.5V21M14.5 18.5V21M3 9.5h2.5M3 14.5h2.5M18.5 9.5H21M18.5 14.5H21"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.4"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5"/><path d="M12 14.5v2"/>',
  check: '<circle cx="12" cy="12" r="9"/><path d="m8.2 12.4 2.6 2.6 5-5.4"/>',
  flask: '<path d="M9.5 3h5M10.5 3v5.6L5 18.2A1.8 1.8 0 0 0 6.6 21h10.8a1.8 1.8 0 0 0 1.6-2.8l-5.5-9.6V3"/><path d="M7.8 15h8.4"/>',
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.6 2.8 3.9 5.8 3.9 9S14.600 18.200 12 21c-2.600-2.800-3.900-5.800-3.900-9S9.400 5.800 12 3Z"/>',
  people:
    '<circle cx="9" cy="8.500" r="3.200"/><path d="M3.200 19.500c.5-3.400 2.800-5.300 5.800-5.300s5.300 1.900 5.800 5.300"/><circle cx="17.200" cy="9.500" r="2.300"/><path d="M16.400 14.400c2.700-.4 4.700 1.200 5.200 4.200"/>',
  arrow: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
  out: '<path d="M7 17 17 7"/><path d="M8.500 7H17v8.500"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  menu: '<path d="M4 8h16M4 16h16"/>',
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
      <article class="card card--${p.layout} glass reveal" style="--accent:${p.accent};--ar:${p.art.ratio}" data-project="${p.id}">
        <div class="card__art">${art}</div>
        <div class="card__body">
          ${chips(p, c, vars)}
          <h3 class="card__title">${esc(t.name)}</h3>
          <p class="card__tag">${fmt(t.tagline, vars)}</p>
          <ul class="meta" aria-label="${esc(c.projects.glance)}">${p.chips.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>
          <div class="card__foot">
            ${repoNote(p, c)}
            <button class="btn btn--glass btn--sm card__more" type="button" data-open="dlg-${p.id}" aria-haspopup="dialog" aria-label="${esc(fmt(c.a11y.details, vars))}">
              <span aria-hidden="true">${c.projects.more}</span>${icon('arrow', 'icon--sm')}
            </button>
          </div>
        </div>
      </article>`;
}

function specRows(p, c, t, vars) {
  const L = c.projects;
  const rows = [[L.labels.status, L.statuses[p.status]]];
  if (p.version) {
    rows.push([t.versionLabel || L.labels.version, `v${p.version}${t.versionNote ? ` · ${t.versionNote}` : ''}`]);
  }
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
      <div class="sheet__panel glass glass--strong">
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
              <dl class="specs">${specRows(p, c, t, vars)}</dl>
              <p class="sheet__source"><span class="sheet__h sheet__h--inline">${L.sourceLabel}</span> ${repoNote(p, c)}</p>
            </aside>
          </div>
        </div>
        </div>
      </div>
    </dialog>`;
}

// ---------------------------------------------------------------- page
export function renderPage(c, hashes) {
  const lang = c.lang;
  const vars = { ...derived };
  const canonical = site.url + '/';
  const studioTitles = c.studio.steps.map((s) => s.title);
  const ogImage = `${site.url}${A}og-image.jpg`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.org,
    url: site.url + '/',
    logo: `${site.url}${A}icon-192.png`,
    slogan: c.footer.tagline,
    description: c.meta.description,
    sameAs: [site.orgUrl],
    address: { '@type': 'PostalAddress', addressCountry: 'FR' },
    inLanguage: lang,
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
<meta name="theme-color" content="#0f0e0c">
<link rel="canonical" href="${canonical}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${site.org}">
<meta property="og:title" content="${esc(c.meta.title)}">
<meta property="og:description" content="${esc(c.meta.description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:locale" content="${c.locale}">
<meta property="og:image" content="${ogImage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(c.meta.ogAlt)}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" type="image/png" sizes="32x32" href="${A}favicon-32.png">
<link rel="apple-touch-icon" href="${A}apple-touch-icon.png">
<link rel="preload" as="image" href="${A}banner-1800.webp" type="image/webp" fetchpriority="high">
<link rel="stylesheet" href="/styles.css?v=${hashes.css}">
<script>document.documentElement.classList.add('js')</script>
<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
<a class="skip" href="#main">${c.a11y.skip}</a>

<div class="backdrop" aria-hidden="true">
  <span class="orb orb--navy"></span><span class="orb orb--red"></span><span class="orb orb--brass"></span><span class="orb orb--ice"></span>
  <span class="cursor-light"></span><span class="grid-lines"></span><span class="grain"></span>
</div>

<header class="nav-wrap">
  <nav class="nav glass" aria-label="${c.a11y.mainNav}" data-nav data-lens>
    <a class="nav__brand" href="#top" aria-label="${esc(c.a11y.home)}">
      <span class="wordmark" aria-hidden="true">
        <span class="wordmark__text">${site.org}</span>
        <svg class="wordmark__swash" viewBox="0 0 172 16" focusable="false"><defs><linearGradient id="tb-swash" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#dcb878" stop-opacity=".15"/><stop offset=".4" stop-color="#fff3d4"/><stop offset="1" stop-color="#f7e2b4" stop-opacity=".9"/></linearGradient></defs><path fill="url(#tb-swash)" d="M2 11C20 6 52 3.4 92 4.2c32 .6 56 2 76-2-18 7-44 8.2-76 8.4C54 10.8 24 12.6 2 11Z"/></svg>
      </span>
    </a>
    <ul class="nav__links" id="nav-links">
      <li><a href="#projects">${c.nav.projects}</a></li>
      <li><a href="#approach">${c.nav.approach}</a></li>
      <li><a href="#studio">${c.nav.studio}</a></li>
      <li><a href="${site.orgUrl}" class="nav__ext">${GITHUB_MARK}<span>${c.nav.github}</span></a></li>
    </ul>
    <button class="nav__toggle btn btn--icon" type="button" aria-expanded="false" aria-controls="nav-links" aria-label="${c.a11y.menuOpen}" data-label-open="${esc(c.a11y.menuOpen)}" data-label-close="${esc(c.a11y.menuClose)}">${icon('menu')}</button>
  </nav>
</header>

<main id="main">

  <section class="hero" id="top" aria-labelledby="hero-title">
    <div class="hero__stage">
      <div class="hero__banner" data-parallax>
        <div class="hero__art">
          <img src="${A}banner-1800.webp" width="1800" height="600" alt="${esc(c.hero.bannerAlt)}" fetchpriority="high" decoding="async">
          <div class="hero__traces" aria-hidden="true">
            <img src="${A}banner-traces.webp" width="1800" height="600" alt="" decoding="async">
            <img class="pulse" src="${A}banner-traces.webp" width="1800" height="600" alt="" decoding="async">
          </div>
          <span class="hero__sheen" aria-hidden="true"></span>
        </div>
      </div>
    </div>
    <div class="container hero__copy">
      <p class="eyebrow-chip glass reveal" data-lens>${tricolor}<span>${c.hero.eyebrow}</span></p>
      <h1 id="hero-title" class="hero__title reveal" style="--d:60ms"><span class="hero__line">${words(c.hero.title1, 0)}</span> <em class="hero__line hero__line--em">${words(c.hero.title2, c.hero.title1.split(' ').length)}</em></h1>
      <p class="hero__lead reveal" style="--d:120ms">${c.hero.lead}</p>
      <div class="hero__cta reveal" style="--d:180ms">
        <a class="btn btn--metal" href="#projects"><span>${c.hero.ctaPrimary}</span>${icon('arrow')}</a>
        <a class="btn btn--glass" data-lens href="${site.orgUrl}">${GITHUB_MARK}<span>${c.hero.ctaSecondary}</span></a>
      </div>
    </div>
    <div class="container">
      <ul class="stats glass reveal" style="--d:240ms" data-lens>
        ${c.hero.stats.map((s) => `<li><strong>${fmt(s.value, vars)}</strong><span>${fmt(s.label, vars)}</span></li>`).join('')}
      </ul>
    </div>
  </section>

  <section class="section" id="about" aria-labelledby="about-title">
    <div class="container">
      <header class="section-head reveal">
        <p class="eyebrow">${c.about.eyebrow}</p>
        <h2 id="about-title">${c.about.title}</h2>
        <p class="section-intro">${c.about.intro}</p>
      </header>
      <ul class="pillars">
        ${c.about.pillars
          .map(
            (p, i) => `<li class="pillar glass reveal" style="--d:${i * 90}ms">
          <span class="roundel">${icon(p.icon)}</span>
          <h3>${p.title}</h3>
          <p>${fmt(p.text, vars)}</p>
        </li>`,
          )
          .join('')}
      </ul>
    </div>
  </section>

  <section class="section" id="projects" aria-labelledby="projects-title">
    <div class="container">
      <header class="section-head reveal">
        <p class="eyebrow">${c.projects.eyebrow}</p>
        <h2 id="projects-title">${c.projects.title}</h2>
        <p class="section-intro">${fmt(c.projects.intro, vars)}</p>
      </header>
      <div class="bento">${cardsHtml}
      </div>
    </div>
    ${dialogsHtml}
  </section>

  <section class="section" id="approach" aria-labelledby="approach-title">
    <div class="container">
      <header class="section-head reveal">
        <p class="eyebrow">${c.approach.eyebrow}</p>
        <h2 id="approach-title">${c.approach.title}</h2>
        <p class="section-intro">${c.approach.intro}</p>
      </header>
      <ul class="tiles">
        ${c.approach.items
          .map(
            (it, i) => `<li class="tile glass reveal" style="--d:${(i % 3) * 80}ms">
          <span class="roundel">${icon(it.icon)}</span>
          <h3>${it.title}</h3>
          <p>${fmt(it.text, vars)}</p>
          ${it.link ? `<a class="tile__link" href="${it.link.href}"><span>${it.link.label}</span>${icon('arrow', 'icon--sm')}</a>` : ''}
        </li>`,
          )
          .join('')}
      </ul>
    </div>
  </section>

  <section class="section" id="studio" aria-labelledby="studio-title">
    <div class="container">
      <header class="section-head reveal">
        <p class="eyebrow">${c.studio.eyebrow}</p>
        <h2 id="studio-title">${c.studio.title}</h2>
        <p class="section-intro">${c.studio.intro}</p>
      </header>
      <ul class="stats stats--studio glass reveal">
        ${c.studio.stats.map((s) => `<li><strong>${s.value}</strong><span>${s.label}</span></li>`).join('')}
      </ul>
      <ol class="steps" aria-label="${esc(c.studio.stepsLabel)}">
        ${c.studio.steps
          .map(
            (s, i) => `<li class="step glass reveal" style="--d:${i * 70}ms">
          <span class="step__num" aria-hidden="true">${i + 1}</span>
          <h3>${s.title}</h3>
          <p>${s.text}</p>
        </li>`,
          )
          .join('')}
      </ol>
      <p class="studio__note reveal">${c.studio.note}</p>
    </div>
  </section>

  <section class="section section--last" id="contact" aria-labelledby="contact-title">
    <div class="container">
      <div class="cta-panel glass glass--strong reveal">
        <img class="cta-panel__mark" src="${A}mark-480.webp" width="240" height="160" alt="" loading="lazy" decoding="async">
        <div class="cta-panel__copy">
          <p class="eyebrow">${c.contact.eyebrow}</p>
          <h2 id="contact-title">${c.contact.title}</h2>
          <p>${c.contact.text}</p>
        </div>
        <a class="btn btn--metal" href="${site.orgUrl}">${GITHUB_MARK}<span>${c.contact.cta}</span>${icon('out', 'icon--sm')}</a>
      </div>
    </div>
  </section>

</main>

<footer class="footer">
  <div class="tricolor-line" aria-hidden="true"></div>
  <div class="container footer__grid">
    <div class="footer__brand">
      <img src="${A}mark-160.webp" width="81" height="54" alt="" loading="lazy" decoding="async">
      <p>${c.footer.tagline}</p>
    </div>
    <p class="footer__privacy">${c.footer.privacy}</p>
    <ul class="footer__links">
      <li><a href="#projects">${c.nav.projects}</a></li>
      <li><a href="#approach">${c.nav.approach}</a></li>
      <li><a href="#studio">${c.nav.studio}</a></li>
      <li><a href="${site.orgUrl}">${c.nav.github}</a></li>
    </ul>
  </div>
  <div class="container footer__base">
    <span>${fmt(c.footer.rights, vars)}</span>
    <span class="madein">${tricolor}<span>${c.footer.madeIn}</span></span>
    <a href="#top">${c.footer.top}</a>
  </div>
</footer>

<script src="/main.js?v=${hashes.js}" defer></script>
</body>
</html>
`;
}

export function renderNotFound(c, hashes) {
  return `<!doctype html>
<html lang="${c.lang}" dir="ltr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(c.notFound.title)}</title>
<meta name="robots" content="noindex">
<meta name="color-scheme" content="dark">
<meta name="theme-color" content="#0f0e0c">
<link rel="icon" type="image/png" sizes="32x32" href="${A}favicon-32.png">
<link rel="stylesheet" href="/styles.css?v=${hashes.css}">
</head>
<body>
<div class="backdrop" aria-hidden="true"><span class="orb orb--navy"></span><span class="orb orb--red"></span><span class="orb orb--brass"></span><span class="grain"></span></div>
<main class="lost" id="main">
  <div class="lost__panel glass glass--strong">
    <img src="${A}mark-480.webp" width="240" height="160" alt="">
    <h1>${c.notFound.heading}</h1>
    <p>${c.notFound.text}</p>
    <a class="btn btn--metal" href="/">${c.notFound.cta}</a>
  </div>
</main>
</body>
</html>
`;
}
