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
npm run standalone # one self-contained HTML file, images inlined as base64, in standalone/ (not deployed)
```

## Where things live

| Path | What it is |
|---|---|
| `src/data.mjs` | Every fact: versions, repo names, statuses, counts. The single source of truth. |
| `src/copy.en.mjs`, `src/copy.fr.mjs` | All the words, one file per language. Facts are pulled in with `{placeholders}` (`{version}`, `{projects}`, `{dockLanguages}`…), never retyped. |
| `src/langs.mjs` | The list of languages (English at the root, French in `/fr/`) and the French typography pass. |
| `src/render.mjs` | The HTML. |
| `src/styles.css` | The design system ("Chrome & Glass"), tokens at the top. |
| `src/main.js` | Progressive enhancement only: reveal, nav, project sheets, pointer light, refraction. The page works without it. |
| `src/assets/` | Optimised images (see below). |
| `scripts/build.mjs` | `src/` to `dist/`, plus the consistency checks. |
| `scripts/contrast.mjs` | The contrast audit CI runs. |
| `scripts/standalone.mjs` | Exports the built page as a single HTML file with every image inlined, for sharing or previewing anywhere. |
| `.github/workflows/pages.yml` | Build, audit, deploy. |

## Keeping it consistent

The build fails if a project has no copy, a `{placeholder}` is unknown, an image or `#anchor` or `aria-*` reference points nowhere, an `id` is duplicated, or a page doesn't have exactly one `<h1>`. It also compares every language with English: a missing or extra key, a list of a different length, different `{placeholders}`, an empty string or a long paragraph left untranslated all fail the build. It warns about unused images. CI also runs the contrast audit.

Anything shown in several places (project count, language list, the Dock's number of languages, every version) is derived from `data.mjs`, so a card, a sheet, a stat and the meta tags can't disagree.

## Updating the content

- **A new release** (say Claude AI Supervisor 0.3.0): change `version` in `src/data.mjs`. Chips, sheet and specs follow.
- **The repositories are private for now**: a small notice above the project cards says the GitHub links won't work yet. Set `reposPrivate: false` in `src/data.mjs` once they're public and the notice disappears.
- **A repository goes private again**: set `public: false` on its project in `src/data.mjs`. The "View on GitHub" link becomes a "Private repository" label.
- **A new project**: add it to `projects` in `data.mjs`, add its image(s) to `src/assets/`, and add its entry under `projects.items` in **both** `copy.en.mjs` and `copy.fr.mjs`.
- **Wording**: edit `copy.en.mjs` and `copy.fr.mjs`. Keep the voice plain and specific, and skip the slogans. In the French file, write ordinary spaces before `: ; ! ? %` and around `« »`: the build turns them into non-breaking spaces.
- **A new language**: add it to `src/langs.mjs`, write `src/copy.<code>.mjs` with the same structure as the English file, and build. The switch, the `hreflang` links and the sitemap follow.

## Design

- **Liquid glass, in layers.** Backdrop blur and saturation, a dark-tinted translucent fill (so text stays legible), a lit specular rim, an edge light that turns toward the pointer, and a soft spotlight that follows it. In Chromium the rim also **refracts** what's behind it: an SVG displacement map bends the backdrop like a convex lens. Elsewhere you get the blur and nothing breaks.
- **Something for the glass to bend.** Slow-drifting halos in the banner's colours and the French tricolour (blue, red, brass), and a faint light that trails the pointer.
- **The banner.** The organisation banner is shown whole, never cropped, and a slow highlight sweeps across the monogram from right to left.
- **Navigation.** No bar, no logo: a centred menu (Home, Projects, Principles). The section you're reading turns champagne and a small light glides under its entry. A soft scrim fades in behind it as you scroll so it stays readable.
- **Languages.** English at `/`, French at `/fr/`, switched with a small `EN | FR` pill at the top right of the menu. They're plain links between real pages: there's no automatic redirect, no cookie and no stored choice (the site keeps its "nothing stored" promise), and the link keeps the section you were reading. Each page declares `hreflang` alternates, and the sitemap lists both. The 404 page speaks both languages, since the visitor's is unknown.
- **Contact.** "Contact us" opens a small menu: write an email, copy the address (with a confirmation) or open it in Gmail. The address is never written in the HTML: `data.mjs` holds it, the page splits it into two attributes and `main.js` joins them, so address harvesters find nothing. Without JavaScript a plain "name [at] domain [dot] com" line takes over.
- **Portable by design.** Every URL in the page is relative, so `dist/` works from any folder, from a `file://` path and under a sub-path, with no image repository or CDN involved. All images live in this repository, copied from the projects' own repos (including private ones) at authoring time, so the site never depends on those repos being reachable. A base64-inlined single file exists as an export (`npm run standalone`) but not as the live format: inlined images can't be cached or loaded in parallel and make the page about a third heavier.
- **Screenshots.** A project's detail sheet can carry the screenshots from its own README (Claude AI Supervisor has eight, MacOS Dock its two-display illustration). They're lazy-loaded thumbnails; click one to see it full size. Add them under `gallery` in `data.mjs` and put one caption each in every copy file (the build checks the counts match).
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

## Security

A static page with no backend, no accounts, no forms and no third-party code, so the attack surface is small. What is in place:

- **Content-Security-Policy** (as a `<meta>`, since GitHub Pages can't set headers): only this site's own script and stylesheet, one inline script allowed by hash, images from this site and `data:`, no network requests, no fonts, no frames, no plugins, no forms, no `<base>`. Verified in a browser: an injected inline script, an external image and an iframe are all refused.
- **No third-party requests at all**, no analytics, no cookies, no storage. The only outbound navigations are links the visitor clicks (GitHub, and "Open in Gmail", which carries `noopener noreferrer`).
- **No injection paths.** All copy is written in this repository and escaped where it enters an attribute; the page's JavaScript never reads the URL, cookies or storage, never uses `eval`, and builds DOM from constants.
- **Contact address.** Not present as a ready-made `name@domain` string in the HTML or in the source, so address harvesters find nothing. (It is of course public once the page runs.)
- **CI.** The workflow has no secrets and no dependencies to install; third-party actions are pinned to commit SHAs (Dependabot keeps them current); permissions are none by default, the build job is read-only so a pull request can never publish, and a pull-request run can't cancel a production deploy.
- **Dev server** listens on `127.0.0.1` only and refuses paths outside `dist/`.
- **Repository hygiene.** The history carries one identity (the GitHub no-reply address) and no secrets or personal data; images are re-encoded to strip metadata; `.claude/` and the standalone export are git-ignored.

Not possible on GitHub Pages: response headers such as `X-Frame-Options` / `frame-ancestors` (so the page can be framed by another site), HSTS (GitHub enforces HTTPS, and a custom domain can use a CDN to add headers).

## Deploy

Pushing to `main` deploys. The repository is `TissByte/TissByte.github.io` (that name is what makes it the organisation site), with **Settings, Pages, Source: GitHub Actions**.

## Image sources

All images are TissByte's own: the organisation banner and avatar, the TB monogram, and the artwork, screenshots and logos of its projects, re-encoded to WebP into `src/assets/`. The CastleBomb picture is the one in that project's README. MacOS Dock and MobiMount have no screenshots in their repositories, so their sheets carry **illustrations** (labelled as such): the Dock bar and the MobiMount flow are drawn for this site as SVG, and the two-display schematic is the Dock project's own. Real screenshots can replace them: add the files to `src/assets/gallery/`, list them under `gallery` in `data.mjs` and give each a caption in each copy file.

Project facts were checked against each repository, its release tags and its changelog. Where a README lags behind, the tag and the changelog win.

© TissByte. Hand-woven software. Built for fun.
