# TissByte.github.io

The website of [TissByte](https://github.com/TissByte), served by GitHub Pages at **https://tissbyte.github.io**.

*Hand-woven software. Built for fun.*

It's a static site with no dependencies and no runtime requests: plain HTML, one CSS file, one small JS file, system fonts and local images. No cookies, no analytics, no third-party calls.

## Run it

Needs Node 20 or later. There's nothing to `npm install`.

```bash
npm run dev        # build, serve on http://localhost:4173, rebuild on every change in src/
npm run build      # build once into dist/
npm run contrast   # WCAG 2.2 AAA contrast audit of the design tokens
```

## Where things live

| Path | What it is |
|---|---|
| `src/data.mjs` | Every fact: versions, repo names, statuses, counts. The single source of truth. |
| `src/copy.mjs` | All the words. Facts are pulled in with `{placeholders}` (`{version}`, `{projects}`, `{dockLanguages}`…), never retyped. |
| `src/render.mjs` | The HTML. |
| `src/styles.css` | The design system ("Chrome & Glass"), tokens at the top. |
| `src/main.js` | Progressive enhancement only: reveal, nav, project sheets, pointer light, refraction. The page works without it. |
| `src/assets/` | Optimised images (see below). |
| `scripts/build.mjs` | `src/` to `dist/`, plus the consistency checks. |
| `scripts/contrast.mjs` | The contrast audit CI runs. |
| `.github/workflows/pages.yml` | Build, audit, deploy. |

## Keeping it consistent

The build fails if a project has no copy, a `{placeholder}` is unknown, an image or `#anchor` or `aria-*` reference points nowhere, an `id` is duplicated, or the page doesn't have exactly one `<h1>`. It warns about unused images. CI also runs the contrast audit.

Anything shown in several places (project count, language list, the Dock's number of languages, every version) is derived from `data.mjs`, so a card, a sheet, a stat and the meta tags can't disagree.

## Updating the content

- **A new release** (say Claude AI Supervisor 0.3.0): change `version` in `src/data.mjs`. Chips, sheet and specs follow.
- **A repository goes private again**: set `public: false` on its project in `src/data.mjs`. The "View on GitHub" link becomes a "Private repository" label.
- **A new project**: add it to `projects` in `data.mjs`, add its image(s) to `src/assets/`, and add its entry under `projects.items` in `copy.mjs`.
- **Wording**: edit `copy.mjs`. Keep the voice plain and specific, and skip the slogans.

## Design

- **Liquid glass, in layers.** Backdrop blur and saturation, a dark-tinted translucent fill (so text stays legible), a lit specular rim, an edge light that turns toward the pointer, and a soft spotlight that follows it. In Chromium the rim also **refracts** what's behind it: an SVG displacement map bends the backdrop like a convex lens. Elsewhere you get the blur and nothing breaks.
- **Something for the glass to bend.** Slow-drifting halos in the banner's colours and the French tricolour (blue, red, brass), and a faint light that trails the pointer.
- **The banner.** The organisation banner is shown whole, never cropped, and a slow highlight sweeps across the monogram from right to left.
- **Navigation.** No bar, no logo: a centred menu (Home, Projects, Principles). The section you're reading turns champagne and a small light glides under its entry. A soft scrim fades in behind it as you scroll so it stays readable.
- **Section surfaces.** Each section has its own texture so you always know where you are: a drafting grid for the projects and engraved rings for the closing strip, each with a tint and a hairline with a lit node at the top. Pure CSS, kept inside the contrast budget.
- **Motion with a purpose.** Words rise into the headline one after another, the banner recedes as you scroll, cards tilt a few degrees toward the pointer, and a project's artwork flies from its card into the detail sheet (View Transitions) and back.
- **Palette** sampled from the banner: warm black `#0f0e0c`, chrome `#e9e4d6`, champagne `#f7e2b4`, brass `#c69339`, plus the navy `#0a1f5c` and red `#c8102e` of the organisation profile.
- **Type**: system fonts only (SF Pro and New York on Apple devices), so there is no font request.

## Accessibility

The target is WCAG 2.2 AAA.

- Text contrast is at least 7:1 (large text at least 4.5:1) **on the worst-case backdrop**: the peak of every colour halo, with the pointer light on top, with and without glass. `npm run contrast` proves it.
- A 3px white focus ring with a dark halo, targets of at least 44px, a skip link, landmarks, one `<h1>`, and a native `<dialog>` for the details (focus trap, Esc, focus returns to where it came from).
- It respects `prefers-reduced-motion` (no animation at all), `prefers-reduced-transparency` (opaque surfaces, no refraction), `prefers-contrast: more` and `forced-colors`.
- It works without JavaScript (the details show inline) and without `backdrop-filter` (opaque fallback).
- One theme on purpose: dark, like the banner.

## Deploy

Pushing to `main` deploys. The repository is `TissByte/TissByte.github.io` (that name is what makes it the organisation site), with **Settings, Pages, Source: GitHub Actions**.

## Image sources

All images are TissByte's own: the organisation banner and avatar, the TB monogram, and the artwork, screenshots and logos of its projects, re-encoded to WebP into `src/assets/`. The CastleBomb picture is the one in that project's README.

Project facts were checked against each repository, its release tags and its changelog. Where a README lags behind, the tag and the changelog win.

© TissByte. Hand-woven software. Built for fun.
