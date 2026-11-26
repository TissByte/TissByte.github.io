// Single source of truth for every FACT shown on the site.
// Prose lives in copy.mjs and reads these values through {placeholders},
// so a version, a count or a link can never disagree between a card, a dialog, a stat and the meta tags.
//
// Versions were checked against release tags and changelogs on 2026-11-22 (tags win over READMEs).

export const site = {
  url: 'https://tissbyte.github.io',
  org: 'TissByte',
  orgUrl: 'https://github.com/TissByte',
  // While the project repositories are private, their GitHub links answer "404" to visitors: a small notice above
  // the cards says so. Set this to false the day the repositories are opened and the notice disappears.
  reposPrivate: true,
  // The public contact address, kept in two halves on purpose: the page joins them in the browser, so neither the
  // generated HTML nor this file contains a ready-made "name@domain" string for address harvesters to match.
  emailUser: 'tissbyte',
  emailDomain: 'gmail.com',
  year: 2026,
};

// accent = the card's glow (never used for text, so contrast is unaffected).
// The status badge does not use it: its colour belongs to the status (released, development, lab), not to the project.
// public:true shows a "View on GitHub" link to https://github.com/TissByte/<repo>; false shows a "Private repository" label instead.
export const projects = [
  {
    id: 'castlebomb',
    kind: 'game',
    status: 'development',
    version: '0.1.1',
    repo: 'CastleBomb',
    public: false,
    accent: '#ee8a3c',
    stack: ['Godot 4', 'GDScript', 'macOS'],
    code: ['GDScript'],
    art: { kind: 'img', name: 'castlebomb', w: 1920, h: 1080, small: 960, pos: '50% 0%', ratio: '16 / 9' },
  },
  {
    id: 'supervisor',
    kind: 'app',
    status: 'released',
    version: '0.2.2',
    repo: 'claude-ai-supervisor',
    public: false,
    accent: '#6fb0f2',
    stack: ['Swift + Python', 'macOS 14+', 'Menu bar + CLI'], // the app's own About window credits Swift, SwiftUI and Python
    code: ['Python', 'Swift'],
    art: { kind: 'img', name: 'supervisor-cockpit', w: 1400, h: 984, small: 760, pos: '0% 0%', ratio: '3 / 2' },
    // the screenshots from the project's README (wide = windows, tall = the menu-bar panel); captions live in copy.mjs
    gallery: [
      { name: 'sup-first-launch', kind: 'wide', thumb: 900, full: 1800, w: 1800, h: 1265 },
      { name: 'sup-cockpit-lower', kind: 'wide', thumb: 900, full: 1800, w: 1800, h: 1265 },
      { name: 'sup-stats', kind: 'wide', thumb: 900, full: 1800, w: 1800, h: 1265 },
      { name: 'sup-tuning', kind: 'wide', thumb: 900, full: 1800, w: 1800, h: 1265 },
      { name: 'sup-panel0', kind: 'tall', thumb: 480, full: 952, w: 952, h: 1392 },
      { name: 'sup-panel1', kind: 'tall', thumb: 480, full: 952, w: 952, h: 1392 },
      { name: 'sup-panel2', kind: 'tall', thumb: 480, full: 952, w: 952, h: 1392 },
      { name: 'sup-about', kind: 'tall', thumb: 480, full: 960, w: 960, h: 1274 },
    ],
  },
  {
    id: 'cleaning',
    kind: 'app',
    status: 'released',
    version: '0.1.0',
    repo: 'TissByte-MacOs-Cleaning',
    public: false,
    accent: '#5ad1c4',
    stack: ['Swift', 'macOS 14+', 'App + CLI'],
    code: ['Swift'],
    art: { kind: 'img', name: 'cleaning-banner', w: 1280, h: 426, small: 760, pos: '50% 50%', ratio: '3 / 1' },
    // the screenshots from the project's README (all on its demo data); captions live in the copy files
    gallery: [
      { name: 'cln-smartscan', kind: 'wide', thumb: 900, full: 1600, w: 1600, h: 1041 },
      { name: 'cln-panel', kind: 'tall', thumb: 480, full: 928, w: 928, h: 1344 },
      { name: 'cln-about', kind: 'tall', thumb: 480, full: 960, w: 960, h: 1316 },
      { name: 'cln-why', kind: 'wide', thumb: 900, full: 1600, w: 1600, h: 1041 },
      { name: 'cln-tiers', kind: 'wide', thumb: 900, full: 1600, w: 1600, h: 1041 },
      { name: 'cln-safetynet', kind: 'wide', thumb: 900, full: 1600, w: 1600, h: 1041 },
      { name: 'cln-spacelens', kind: 'wide', thumb: 900, full: 1600, w: 1600, h: 1041 },
      { name: 'cln-developer', kind: 'wide', thumb: 900, full: 1600, w: 1600, h: 1041 },
      { name: 'cln-stats', kind: 'wide', thumb: 900, full: 1600, w: 1600, h: 1041 },
    ],
  },
  {
    id: 'dock',
    kind: 'app',
    status: 'released',
    version: '0.6.1',
    repo: 'MacOS-Dock',
    public: false,
    accent: '#e0b25e',
    stack: ['Swift 6', 'macOS 13+', 'Liquid Glass'],
    code: ['Swift'],
    interfaceLanguages: 7,
    art: { kind: 'img', name: 'dock-banner', w: 1400, h: 467, small: 760, pos: '50% 50%', ratio: '3 / 1' },
    // illustrations: drawn for this site (dock-bar) and by the project itself (dock-screens, made for a light page)
    gallery: [
      { name: 'dock-bar', kind: 'svg', w: 960, h: 420 },
      { name: 'dock-screens', kind: 'svg', light: true, w: 960, h: 410 },
    ],
  },
  {
    id: 'mobimount',
    kind: 'utility',
    status: 'development',
    version: null,
    repo: 'MobiMount',
    public: false,
    accent: '#4cc2ff',
    stack: ['Shell', 'macOS', 'Android'],
    code: ['Shell'],
    art: { kind: 'icon', name: 'mobimount', w: 400, h: 400, ratio: '2 / 1' },
    gallery: [{ name: 'mobimount-flow', kind: 'svg', w: 960, h: 400 }], // an illustration: the project has no screenshots
  },
  {
    id: 'studio',
    kind: 'lab',
    status: 'lab',
    version: null,
    repo: 'tissbyte-gaming-studio',
    public: false,
    accent: '#a99dff',
    stack: ['AI agents', 'Claude Code', 'Godot'],
    code: [],
    art: { kind: 'pipeline', ratio: '3 / 1' },
  },
];

// Derived values: never typed by hand anywhere else.
export const derived = (() => {
  const languages = [...new Set(projects.flatMap((p) => p.code))];
  const dock = projects.find((p) => p.id === 'dock');
  return {
    projects: projects.length,
    languages: languages.length,
    languageList: languages.join(', '),
    dockLanguages: dock.interfaceLanguages,
    year: site.year,
  };
})();

export const byId = Object.fromEntries(projects.map((p) => [p.id, p]));
