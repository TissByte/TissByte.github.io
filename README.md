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
| `src/styles.css` | The design system ("Soft Hardware"), tokens at the top. |
| `src/main.js` | Progressive enhancement only: reveal, nav, project sheets, contact menu, the logo glint. The page works without it. |
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

- **Soft hardware (neumorphism, made precise).** One warm graphite surface, lit from the top left. Whatever can be pressed stands out of it (plates, keys, round buttons); whatever holds information is cut into it (labels, displays, specs, screenshots). Every shadow falls the same way and every edge catches the same 1px light, so it reads as one object instead of blurry blobs. The surface is woven, like the name: fine threads one way and the other, a little uneven, under a single warm light from the top left that falls off toward the bottom right. Both are static CSS (no image file), kept quiet enough for the contrast audit, which counts the texture at its brightest on the bare page (plates and wells are opaque). All of it is CSS custom properties (`--raise-*`, `--cut-*`, `--convex`, `--concave`) in `src/styles.css`.
- **The banner.** The monogram sits in a recessed window with a warm backlight behind it. A slow sweep of light crosses the chrome, and a glint follows the pointer (fine pointers only; both are off with reduced motion).
- **Navigation.** Two small floating plates: the menu (Home, Projects, Principles) and the language switch. The section you're reading is the key that's pushed in, with its LED lit.
- **Status as an LED.** "Released" is a steady green LED; "In development" and "In the lab" send out a slow halo. The word is always there: colour never carries the meaning alone.
- **Languages.** English at `/`, French at `/fr/`, switched with a small `EN | FR` pill at the top right of the menu. They're plain links between real pages: there's no automatic redirect, no cookie and no stored choice (the site keeps its "nothing stored" promise), and the link keeps the section you were reading. Each page declares `hreflang` alternates, and the sitemap lists both. The 404 page speaks both languages, since the visitor's is unknown.
- **Contact.** "Contact us" opens a small menu: write an email, copy the address (with a confirmation) or open it in Gmail. The address is never written in the HTML: `data.mjs` holds it, the page splits it into two attributes and `main.js` joins them, so address harvesters find nothing. Without JavaScript a plain "name [at] domain [dot] com" line takes over.
- **Portable by design.** Every URL in the page is relative, so `dist/` works from any folder, from a `file://` path and under a sub-path, with no image repository or CDN involved. All images live in this repository, copied from the projects' own repos (including private ones) at authoring time, so the site never depends on those repos being reachable. A base64-inlined single file exists as an export (`npm run standalone`) but not as the live format: inlined images can't be cached or loaded in parallel and make the page about a third heavier.
- **Screenshots.** A project's detail sheet can carry the screenshots from its own README (Claude AI Supervisor has eight, TissByte Cleaning nine, MacOS Dock its two-display illustration). They're lazy-loaded thumbnails; click one to see it full size. Add them under `gallery` in `data.mjs` and put one caption each in every copy file (the build checks the counts match).
- **Motion with a purpose.** Words rise into the headline one after another, cards lift a few pixels on hover and keys sink when pressed, and a project's artwork flies from its card into the detail sheet (View Transitions) and back. Nothing bounces or flashes.
- **Palette**: graphite `#26231f` for the surface, ink `#fbf8f0`, champagne `#f7e2b4` as the only accent. The only blue, white and red left is the small flag beside "Made in France".
- **Type**: system fonts only (SF Pro and New York on Apple devices), so there is no font request.

## Accessibility

The target is WCAG 2.2 AAA.

- Text contrast is at least 7:1 (large text at least 4.5:1) on the lightest plate and the darkest well, with the grain and the brightest highlight counted in. `npm run contrast` proves it. Controls are identified by their label or icon, never by a shadow alone, and every plate turns into an outlined shape under `prefers-contrast: more`.
- A 3px white focus ring set off by a 3px gap, targets of at least 44px, a skip link, landmarks, one `<h1>`, and a native `<dialog>` for the details (focus trap, Esc, focus returns to where it came from).
- It respects `prefers-reduced-motion` (no animation at all), `prefers-contrast: more` and `forced-colors`.
- It works without JavaScript (the details show inline).
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

All images are TissByte's own: the organisation banner and avatar, the TB monogram, and the artwork, screenshots and logos of its projects, re-encoded to WebP into `src/assets/`. The CastleBomb picture is the one in that project's README, and so are the TissByte Cleaning banner and screenshots (the latter are captured on the app's demo data, invented file names, and the sheet says so). MacOS Dock and MobiMount have no screenshots in their repositories, so their sheets carry **illustrations** (labelled as such): the Dock bar and the MobiMount flow are drawn for this site as SVG, and the two-display schematic is the Dock project's own. Real screenshots can replace them: add the files to `src/assets/gallery/`, list them under `gallery` in `data.mjs` and give each a caption in each copy file.

Project facts were checked against each repository, its release tags and its changelog. Where a README lags behind, the tag and the changelog win.

© TissByte. Hand-woven software. Built for fun.
