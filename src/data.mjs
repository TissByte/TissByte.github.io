// Single source of truth for every FACT shown on the site.
// Prose lives in copy.en.mjs / copy.fr.mjs and reads these values through {placeholders},
// so a version, a count or a link can never disagree between a card, a dialog, a stat and the meta tags.
//
// Versions were checked against release tags and changelogs on 2026-11-20 (tags win over READMEs).

export const site = {
  url: 'https://tissbyte.github.io',
  org: 'TissByte',
  orgUrl: 'https://github.com/TissByte',
  year: 2026,
  defaultLang: 'en',
  langs: ['en', 'fr'],
  // Shown in the "find us" block. Turn off if you'd rather not mention that repos are private.
  mentionPrivateRepos: true,
};

// accent = glow / dot colour only (never used for text, so contrast is unaffected)
// public:true turns the "private repository" label into a real GitHub link.
export const projects = [
  {
    id: 'castlebomb',
    kind: 'game',
    status: 'development',
    version: '0.1.1',
    repo: 'CastleBomb',
    public: false,
    accent: '#ee8a3c',
    chips: ['Godot 4', 'GDScript', 'macOS'],
    code: ['GDScript'],
    layout: 'wide',
    art: { kind: 'img', name: 'castlebomb', w: 1400, h: 933, small: 760, pos: '50% 34%', ratio: '16 / 9' },
  },
  {
    id: 'supervisor',
    kind: 'app',
    status: 'released',
    version: '0.2.0',
    repo: 'claude-ai-supervisor',
    public: false,
    accent: '#6fb0f2',
    chips: ['Python', 'macOS 14+', 'CLI + menu bar'],
    code: ['Python'],
    layout: 'narrow',
    art: { kind: 'img', name: 'supervisor-cockpit', w: 1400, h: 984, small: 760, pos: '0% 0%', ratio: '3 / 2' },
  },
  {
    id: 'dock',
    kind: 'app',
    status: 'released',
    version: '0.6.1',
    repo: 'MacOS-Dock',
    public: false,
    accent: '#e0b25e',
    chips: ['Swift 6', 'macOS 13+', 'Liquid Glass'],
    code: ['Swift'],
    interfaceLanguages: 7,
    layout: 'wide',
    art: { kind: 'img', name: 'dock-banner', w: 1400, h: 467, small: 760, pos: '50% 50%', ratio: '3 / 1' },
  },
  {
    id: 'mobimount',
    kind: 'utility',
    status: 'personal',
    version: null,
    repo: 'MobiMount',
    public: false,
    accent: '#4cc2ff',
    chips: ['Shell', 'macOS', 'Android'],
    code: ['Shell'],
    layout: 'narrow',
    art: { kind: 'icon', name: 'mobimount', w: 400, h: 400, ratio: '2 / 1' },
  },
  {
    id: 'studio',
    kind: 'lab',
    status: 'lab',
    version: null,
    repo: 'tissbyte-gaming-studio',
    public: false,
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
