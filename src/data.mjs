// Single source of truth for every FACT shown on the site.
// Prose lives in copy.mjs and reads these values through {placeholders},
// so a version, a count or a link can never disagree between a card, a dialog, a stat and the meta tags.
//
// Versions were checked against release tags and changelogs on 2026-11-20 (tags win over READMEs).

export const site = {
  url: 'https://tissbyte.github.io',
  org: 'TissByte',
  orgUrl: 'https://github.com/TissByte',
  // The public contact address, kept in two halves on purpose: the page joins them in the browser, so neither the
  // generated HTML nor this file contains a ready-made "name@domain" string for address harvesters to match.
  emailUser: 'tissbyte',
  emailDomain: 'gmail.com',
  year: 2026,
};

// accent = glow / dot colour only (never used for text, so contrast is unaffected)
// public:true shows a "View on GitHub" link to https://github.com/TissByte/<repo>; false shows a "Private repository" label instead.
export const projects = [
  {
    id: 'castlebomb',
    kind: 'game',
    status: 'development',
    version: '0.1.1',
    repo: 'CastleBomb',
    public: true,
    accent: '#ee8a3c',
    chips: ['Godot 4', 'GDScript', 'macOS'],
    code: ['GDScript'],
    layout: 'wide',
    art: { kind: 'img', name: 'castlebomb', w: 1920, h: 1080, small: 960, pos: '50% 50%', ratio: '16 / 9' },
  },
  {
    id: 'supervisor',
    kind: 'app',
    status: 'released',
    version: '0.2.1',
    repo: 'claude-ai-supervisor',
    public: true,
    accent: '#6fb0f2',
    chips: ['Swift + Python', 'macOS 14+', 'Menu bar + CLI'], // the app's own About window credits Swift, SwiftUI and Python
    code: ['Python', 'Swift'],
    layout: 'narrow',
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
    id: 'dock',
    kind: 'app',
    status: 'released',
    version: '0.6.1',
    repo: 'MacOS-Dock',
    public: true,
    accent: '#e0b25e',
    chips: ['Swift 6', 'macOS 13+', 'Liquid Glass'],
    code: ['Swift'],
    interfaceLanguages: 7,
    layout: 'wide',
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
    public: true,
    accent: '#4cc2ff',
    chips: ['Shell', 'macOS', 'Android'],
    code: ['Shell'],
    layout: 'narrow',
    art: { kind: 'icon', name: 'mobimount', w: 400, h: 400, ratio: '2 / 1' },
    gallery: [{ name: 'mobimount-flow', kind: 'svg', w: 960, h: 400 }], // an illustration: the project has no screenshots
  },
  {
    id: 'studio',
    kind: 'lab',
    status: 'lab',
    version: null,
    repo: 'tissbyte-gaming-studio',
    public: true,
    accent: '#a99dff',
    chips: ['AI agents', 'Claude Code', 'Godot'],
    code: [],
    layout: 'full',
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
