// English copy. Values are trusted HTML (authored here): only <abbr>, <code>, <em>, <strong>, &amp; are used.
// Placeholders: {projects} {languages} {languageList} {dockLanguages} {year} {version} {name}
// Keep the exact same keys as copy.fr.mjs: the build fails if the two drift apart.

export default {
  lang: 'en',
  locale: 'en_US',
  switchCode: 'EN',

  meta: {
    title: 'TissByte — Hand-woven software. Built for fun.',
    description:
      'TissByte is a small French software factory making macOS tools and games: CastleBomb, Claude AI Supervisor, MacOS Dock and MobiMount.',
    ogAlt: 'TissByte: a chrome italic “TB” monogram on a black background.',
  },

  a11y: {
    skip: 'Skip to content',
    mainNav: 'Main navigation',
    language: 'Language',
    langName: { en: 'English', fr: 'Français' },
    menuOpen: 'Open the menu',
    menuClose: 'Close the menu',
    close: 'Close',
    home: 'TissByte, back to the top',
    orgLink: 'TissByte on GitHub',
    details: 'Learn more about {name}',
    opensDialog: 'opens a details window',
  },

  nav: { projects: 'Projects', approach: 'Approach', studio: 'Studio', github: 'GitHub' },

  hero: {
    eyebrow: 'Small French software factory',
    title1: 'Hand-woven software.',
    title2: 'Built for fun.',
    lead: 'We make macOS tools and games for the fun of it, and to make our own lives easier. Small, native and carefully finished.',
    ctaPrimary: 'See what we make',
    ctaSecondary: 'TissByte on GitHub',
    bannerAlt: 'TissByte: a chrome, italic “TB” monogram on a black background traced with fine circuit lines.',
    stats: [
      { value: '{projects}', label: 'projects in the workshop' },
      { value: '{languages}', label: 'programming languages: {languageList}' },
      { value: '0', label: 'trackers, cookies or third-party requests on this site' },
    ],
  },

  about: {
    eyebrow: 'Who we are',
    title: 'A small workshop, woven by hand.',
    intro:
      'TissByte is a small French software factory. We build macOS tools and games for the fun of it, and because we wanted them ourselves. Each project starts with a real itch: a second display with no Dock, a Claude Code quota nobody could see, a phone that would not talk to a Mac.',
    pillars: [
      {
        icon: 'weave',
        title: 'Hand-woven',
        text: 'Small on purpose. Each tool is built, checked and finished one thread at a time, then looked at again.',
      },
      {
        icon: 'spark',
        title: 'Built for fun',
        text: 'We make what we enjoy making and what we would use ourselves. The pleasure shows in the details.',
      },
      {
        icon: 'flag',
        title: 'Made in France',
        text: 'A French workshop with a taste for craft. Interfaces in English and French, and in up to {dockLanguages} languages when it matters.',
      },
    ],
  },

  projects: {
    eyebrow: 'The workshop',
    title: 'What we are making.',
    intro: '{projects} projects: two apps, a game, a utility and a lab. All of it Mac-first.',
    more: 'Learn more',
    highlights: 'Highlights',
    glance: 'At a glance',
    sourceLabel: 'Source',
    privateRepo: 'Private repository',
    viewRepo: 'View on GitHub',
    kinds: { game: 'Game', app: 'macOS app', utility: 'Utility', lab: 'Lab' },
    statuses: {
      development: 'In development',
      released: 'Released',
      personal: 'Personal project',
      lab: 'In the lab',
    },
    labels: { version: 'Version', status: 'Status' },
    items: {
      castlebomb: {
        name: 'CastleBomb',
        tagline: 'Raise a walled city, haul your siege engines across the field and storm the rival castle.',
        summary:
          'CastleBomb is TissByte’s first game: a real-time, medieval city-siege strategy game against the computer. You begin with a castle and a few huts, grow a living city, train companies, breach the walls and storm the castle until the rival king falls. It grew out of a turn-based castle-artillery duel, whose first release is still playable.',
        artAlt:
          'CastleBomb key art: a wooden cannon fires on a stone castle that bursts into flames, with snowy mountains and a stone bridge behind.',
        versionLabel: 'Latest release',
        versionNote: 'the turn-based artillery prototype',
        highlights: [
          ['A city that lives', 'Houses, farms and trades are built during the battle, each at its cost. A destroyed building loses its trade at once.'],
          ['Armies that read and fight', 'Companies are trained from your own people. Classes, formations and morale decide who holds the line.'],
          ['Sieges that tell the story', 'Engines are hauled by crews, deployed, then fire on their own, their arcs bent by the wind. You win by a real siege: breach, ram, climb or mine.'],
          ['A world to discover', 'Every battle is seeded: relief, water, woods, weather and season. Fog hides whatever you have not scouted.'],
          ['Fair by design', 'A deterministic engine runs on a fixed 10 Hz tick. The <abbr title="computer opponent">CPU</abbr> plays on the same economy, rules and fog, with no cheats.'],
          ['Looks the part', 'A stylised, hand-painted cartoon look with warm light, judged against an approved image bank before it ships.'],
        ],
        specs: [
          ['Engine', 'Godot 4.7.2 · statically typed GDScript'],
          ['Platforms', 'macOS first (Apple silicon and Intel), Android later'],
        ],
      },
      supervisor: {
        name: 'Claude AI Supervisor',
        tagline: 'The control tower for Claude Code: every agent, every model, every token, one glance.',
        summary:
          'Claude AI Supervisor watches every Claude Code project running on your Mac and lets you steer them: how much of your weekly quota each one may use, which agents are working right now, and when everything resets. It is a menu-bar app, the cockpit, on top of a small command-line tool called <code>sup</code>.',
        artAlt:
          'The cockpit window: the weekly usage curve, the list of what Claude is doing right now, and the project controls, on a glass window over a purple wallpaper.',
        highlights: [
          ['See', 'The week and the 5-hour session, as <code>/usage</code> shows them, with a live countdown. Every session and sub-agent in detail: task, model, tokens, speed and how full its context is.'],
          ['Share', 'Split the week between projects with a draggable bar each, and spot who will run out before the reset.'],
          ['Steer', 'Change a project’s model, sub-agent model, effort or permissions in one click. Let an autopilot lighten a project that runs short, or pick a mode: Economy, Balanced, Performance or Auto.'],
          ['Advice you can act on', 'Slow down, run <code>/compact</code> on a heavy context, resume a sleeping session.'],
          ['Costs nothing', 'It reads files on your Mac, opens no network connection and calls no model, so it uses no tokens. Uninstalling removes everything.'],
          ['Honest about limits', 'The app is signed ad hoc, not notarized, so macOS asks you to confirm once on first launch. The steps are in the README.'],
        ],
        specs: [
          ['Requires', 'macOS 14 or later · Claude Code · python3 3.9+'],
          ['Dependencies', 'None'],
          ['Languages', 'English and French'],
          ['Install', 'App (DMG), build from source, or command line only'],
        ],
      },
      dock: {
        name: 'MacOS Dock',
        tagline: 'A Dock for every other screen of your Mac.',
        summary:
          'macOS shows its Dock on one display at a time. MacOS Dock keeps a Dock-like bar on every display that is not the main one, so your apps are always one click away, on every screen. It never changes the macOS Dock itself.',
        artAlt: 'MacOS Dock: a navy app icon with a silver gear, beside the chrome name, over a miniature of the bar.',
        highlights: [
          ['Liquid Glass', 'The material of the macOS 26 Dock, with adjustable transparency (a blur on earlier systems) and the colour you pick.'],
          ['Your apps, already there', 'The apps pinned in your Dock on first launch, plus every running app, with a dot under the running ones.'],
          ['Moves like the Dock', 'Magnification, bouncing launches, icons that slide to make room, folders as stacks, the Trash, auto-hide and recent apps.'],
          ['Optional helpers', 'Keep maximized windows clear of the bar, give minimized windows a tile, show notification badges. They need the Accessibility permission, which you grant.'],
          ['Speaks {dockLanguages} languages', 'English, French, German, Spanish, Italian, Japanese and Simplified Chinese.'],
          ['Leaves no trace', 'It writes only its own preferences and crash reports on your Mac, and <code>make uninstall</code> removes everything.'],
        ],
        specs: [
          ['Requires', 'macOS 13 or later · Apple silicon or Intel · at least two displays'],
          ['Tested on', 'macOS 26'],
          ['Built with', 'Swift 6 · Command Line Tools only, no Xcode'],
          ['Install', 'Build from source, release download or Homebrew'],
        ],
      },
      mobimount: {
        name: 'MobiMount',
        tagline: 'Android to Mac by drag and drop. No kernel extension, no admin password, no lowered security.',
        summary:
          'macOS has no built-in Android support. Phones share files over MTP (a file-transfer protocol), not as a plain disk, and mounting one in Finder normally needs a FUSE kernel extension, a real security trade-off. MobiMount skips that. It installs OpenMTP, an open-source app that speaks MTP in plain user space, and gives you a two-pane window to drag files in and out of, like a light Finder.',
        artAlt: 'The MobiMount icon: a blue phone connected by a cable to a blue folder with a drive symbol.',
        highlights: [
          ['One command in, one command out', '<code>install.sh</code> installs OpenMTP. <code>uninstall.sh</code> removes it and its saved preferences.'],
          ['No admin password', 'OpenMTP is a plain, signed app installed through Homebrew. Nothing needs <code>sudo</code>.'],
          ['You stay in control', 'Nothing is written to the phone without an action from you.'],
          ['Plug in, drag, done', 'Choose “File transfer” on the phone, then drag files between it and your Mac. A troubleshooting table covers cables, locked phones and empty folders.'],
        ],
        specs: [
          ['Requires', 'macOS and Homebrew · a USB-C data cable'],
          ['Built with', 'Shell, around OpenMTP (third-party, open source)'],
          ['Status', 'Personal project, provided as is'],
        ],
      },
      studio: {
        name: 'TissByte Gaming Studio',
        tagline: 'An AI game studio: specialised agent roles, one pipeline and a visual quality bar.',
        summary:
          'A set of specialised agent roles, one shared process and a quality bar that build games under the direction of a human owner. It is being developed inside CastleBomb and will move into its own repository once a second project needs it.',
        artAlt: 'A diagram of the studio pipeline in six steps: direct, build, review, gate, sign off and merge.',
        highlights: [
          ['The owner decides, the studio builds', 'The human owner gives guidelines and chooses between rendered options. The studio challenges, designs, builds, reviews and ships.'],
          ['Roles, not one assistant', 'About sixty roles (directors, designers, artists, programmers, reviewers, <abbr title="quality assurance">QA</abbr>, judges), each with its own instructions, tools and model.'],
          ['One pipeline', 'Build, independent review, merge gate, sign-off, squash-merged pull request. Nothing merges on a builder’s word.'],
          ['A visual bar', 'Visual work is judged against an approved image bank, criterion by criterion, and ships only at 9 out of 10.'],
        ],
        specs: [
          ['Status', 'Placeholder: extraction from CastleBomb is planned'],
          ['Lives today in', 'CastleBomb’s <code>.studio</code> folder'],
          ['Will provide', 'An installable studio, a merge gate for Godot projects, visual judging and a licence-safe asset pipeline'],
        ],
      },
    },
  },

  approach: {
    eyebrow: 'Our approach',
    title: 'How we build.',
    intro: 'The same habits show up in every project.',
    items: [
      {
        icon: 'chip',
        title: 'Native and light',
        text: 'Swift and AppKit, built with Apple’s Command Line Tools: no Xcode needed. Where a script is enough, it runs on stock Python with no dependencies.',
      },
      {
        icon: 'lock',
        title: 'Private by design',
        text: 'MacOS Dock and Claude AI Supervisor never open a network connection. Anything they change on your Mac is shown first, and uninstalling removes everything.',
      },
      {
        icon: 'check',
        title: 'Honest about limits',
        text: 'Every README has a limits section. Our builds are signed ad hoc, not notarized, and we say so up front, with the exact steps to open them.',
      },
      {
        icon: 'flask',
        title: 'Tested before it is shown',
        text: 'Game rules live in a pure, deterministic engine, covered by headless unit tests and computer-versus-computer balance simulations. In the game’s code, every warning counts as an error.',
      },
      {
        icon: 'globe',
        title: 'Speaks your language',
        text: 'MacOS Dock comes in {dockLanguages} languages. Claude AI Supervisor speaks English and French.',
      },
      {
        icon: 'people',
        title: 'Human-led, agent-built',
        text: 'A human owner sets the direction. A studio of specialised <abbr title="artificial intelligence">AI</abbr> agents builds, reviews and gates the work.',
        link: { href: '#studio', label: 'Meet the studio' },
      },
    ],
  },

  studio: {
    eyebrow: 'The studio',
    title: 'Many agents. One human in charge.',
    intro:
      'TissByte’s game studio is a set of specialised AI roles, one shared process and a visual quality bar. It is being built inside CastleBomb and will move into its own repository when a second game needs it.',
    stepsLabel: 'The pipeline, step by step',
    steps: [
      { title: 'Direct', text: 'The human owner gives guidelines and chooses between rendered options.' },
      { title: 'Build', text: 'A specialised role builds, with its own instructions, tools and model.' },
      { title: 'Review', text: 'An independent role reviews the work. Nothing merges on a builder’s word.' },
      { title: 'Gate', text: 'A local merge gate checks the exact commit: tests, lint, privacy and offline checks.' },
      { title: 'Sign off', text: 'A studio chief signs off. Visual work ships only at 9 out of 10 beside the image bank.' },
      { title: 'Merge', text: 'One squash-merged pull request lands the change.' },
    ],
    stats: [
      { value: '≈ 60', label: 'specialised roles' },
      { value: '9/10', label: 'minimum visual score to ship' },
      { value: '1', label: 'human owner who decides' },
    ],
    note: 'Lean by default: short delta reviews, a single judge until a score of 8, and token budgets tracked every day.',
  },

  contact: {
    eyebrow: 'Find us',
    title: 'Come and see the workshop.',
    text: 'Everything TissByte makes lives on GitHub.',
    privateNote: 'Most repositories are private for now. The organization profile is where public work will appear.',
    cta: 'TissByte on GitHub',
  },

  footer: {
    tagline: 'Hand-woven software. Built for fun.',
    privacy: 'No cookies, no analytics, no third-party requests.',
    madeIn: 'Made in France',
    rights: '© {year} TissByte',
    top: 'Back to top',
  },

  notFound: {
    title: 'Page not found — TissByte',
    heading: 'This thread leads nowhere.',
    text: 'The page you were looking for does not exist, or has moved.',
    cta: 'Back to the home page',
  },
};
