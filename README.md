# TissByte.github.io

The website of [TissByte](https://github.com/TissByte), served by GitHub Pages at **https://tissbyte.github.io**.

*Hand-woven software. Built for fun.* · English at `/`, French at `/fr/`.

A static site with **no dependencies and no runtime requests**: plain HTML, one CSS file, one small JS file, system fonts, local images. No cookies, no analytics, no third-party calls.

## Run it

Needs Node 20+ (nothing to `npm install`).

```bash
npm run dev        # build, serve on http://localhost:4173 and rebuild on every change in src/
npm run build      # build once into dist/
npm run contrast   # WCAG 2.2 AAA contrast audit of the design tokens
```

## Where things live

| Path | What it is |
|---|---|
| `src/data.mjs` | **Every fact**: versions, repo names, statuses, public/private, counts. The single source of truth. |
| `src/copy.en.mjs` · `src/copy.fr.mjs` | All the words. Facts are inserted with `{placeholders}` (`{version}`, `{projects}`, `{dockLanguages}`…), never retyped. |
| `src/render.mjs` | HTML for one language. |
| `src/styles.css` | The "Chrome & Glass" design system (tokens at the top). |
| `src/main.js` | Progressive enhancement only (reveal, nav, dialogs, pointer light). The page works without it. |
| `src/assets/` | Optimised images (see *Image sources*). |
| `scripts/build.mjs` | `src/` → `dist/`, with the consistency checks below. |
| `.github/workflows/pages.yml` | Build, audit and deploy to GitHub Pages. |

## Consistency guard rails

The build **fails** when:

- the English and French copy do not have exactly the same structure (same keys, same list lengths);
- a `{placeholder}` is unknown, or a project in `data.mjs` has no copy in one language;
- a referenced image is missing, an in-page `#anchor` or `aria-*` reference points nowhere, an `id` is duplicated, or a page has not exactly one `<h1>`.

It warns about unused images. CI also runs `npm run contrast`.

Figures shown in several places (project count, languages, Dock's 7 interface languages, versions) are **derived** from `data.mjs`, so a card, a dialog, a stat and the meta tags cannot disagree.

## Updating content

- **A new release** (say Claude AI Supervisor 0.3.0): change `version` in `src/data.mjs`. Done: chips, dialog and specs follow.
- **A repository becomes public**: set `public: true` on the project in `src/data.mjs`. The "Private repository" label becomes a GitHub link.
- **Stop mentioning private repositories** in the "Find us" block: `site.mentionPrivateRepos = false`.
- **A new project**: add it to `projects` in `data.mjs`, add its image(s) to `src/assets/`, and add the same entry under `projects.items` in **both** copy files.
- **Wording**: edit the copy files. French typography (no-break spaces before `: ; ! ?`, around `« »`) is applied automatically.

## Design

- **Liquid glass**, in layers: backdrop blur and saturation, a dark-tinted translucent fill (keeps text legible), a lit specular rim, an edge light that turns toward the pointer, and a soft spotlight that follows it. Behind it, slow-drifting halos in the colours of the banner and the French tricolour (blue, red, brass) give the glass something to bend. Glass never nests (nested `backdrop-filter` can't see past its parent).
- **Palette** sampled from the org banner: warm black `#0f0e0c`, chrome `#e9e4d6`, champagne `#f7e2b4`, brass `#c69339`, with navy `#0a1f5c` and red `#c8102e` from the org profile.
- **Type**: system fonts only (SF Pro and New York on Apple devices), so there is no font request. Display headings use the serif to echo the monogram's italic.

## Accessibility (WCAG 2.2 AAA target)

- Text contrast ≥ 7:1 (large text ≥ 4.5:1) **on the worst-case backdrop**: the peak of every colour halo, with and without glass (`npm run contrast`).
- 3px white focus ring with a dark halo, visible on glass, chrome and metal; interactive targets ≥ 44px; skip link; landmarks; one `<h1>`; native `<dialog>` for details (focus trap, Esc, focus return); `lang` on every page and language link; `hreflang` alternates.
- Honours `prefers-reduced-motion`, `prefers-reduced-transparency` (opaque surfaces), `prefers-contrast: more` and `forced-colors`; prints cleanly.
- Fully usable without JavaScript (details open inline) and without `backdrop-filter` (opaque fallback).
- One theme on purpose: dark, like the banner.

## Deploy

1. Create the repository **`TissByte/TissByte.github.io`** (the name is what makes it the organization site).
2. Push this project to `main`.
3. In the repository: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. The workflow builds and deploys; the site is live at https://tissbyte.github.io.

A custom domain later: add a `src/CNAME` file, copy it in `scripts/build.mjs`, and set the domain in Settings → Pages.

## Image sources

All images are TissByte's own: the organization banner and avatar, the TB monogram, and the key art, screenshots and logos of its projects. They are re-encoded to WebP (originals untouched) into `src/assets/`.

## Content

Project facts (versions, platforms, requirements) were checked against each project's own repository, release tags and changelog. Where a README lags behind (for instance a version number), the tag and changelog win. Only public-facing information is on the site: no internal planning, dates or work items.

© TissByte. Hand-woven software. Built for fun.
