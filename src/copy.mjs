// All the words on the site (English only). Values are trusted HTML written here: only <abbr>, <code>, <em>, <strong>, &amp; are used.
// Placeholders: {projects} {languages} {languageList} {dockLanguages} {year} {version} {name}
// Facts (versions, counts, platforms) come from data.mjs; never retype them here.
//
// Voice: plain, a little dry, first person plural. Say the specific thing. Skip the slogans.

export default {
  lang: 'en',
  locale: 'en_US',

  meta: {
    title: 'TissByte — Hand-woven software. Built for fun.',
    description:
      'TissByte is a small software workshop in France. We make Mac tools and games: CastleBomb, Claude AI Supervisor, MacOS Dock and MobiMount.',
    ogAlt: 'TissByte: a chrome italic “TB” monogram on a black background.',
  },

  a11y: {
    skip: 'Skip to content',
    mainNav: 'Main navigation',
    close: 'Close',
    home: 'TissByte, back to the top',
    details: 'More about {name}',
  },

  nav: { projects: 'Projects', approach: 'How we work', studio: 'Studio', github: 'GitHub' },

  hero: {
    eyebrow: 'A small workshop in France',
    title1: 'Hand-woven software.',
    title2: 'Built for fun.',
    lead: 'We make Mac tools and games for the fun of it, and to make our own days a bit easier.',
    ctaPrimary: 'See what we make',
    ctaSecondary: 'Find us on GitHub',
    bannerAlt: 'TissByte: a chrome, italic “TB” monogram on a black background traced with fine circuit lines.',
    stats: [
      { value: '{projects}', label: 'projects on the bench' },
      { value: '{languages}', label: 'programming languages: {languageList}' },
      { value: '0', label: 'trackers or cookies on this site' },
    ],
  },

  projects: {
    eyebrow: 'The workshop',
    title: 'What’s on the bench.',
    intro: 'Two apps, a game, a small utility and an experiment. All of it starts from the Mac.',
    more: 'More',
    highlights: 'Highlights',
    glance: 'At a glance',
    sourceLabel: 'Source',
    privateRepo: 'Private repository',
    viewRepo: 'View on GitHub',
    kinds: { game: 'Game', app: 'macOS app', utility: 'Utility', lab: 'Experiment' },
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
        tagline: 'Raise a walled town, drag your siege engines across the map and knock down the other king’s castle.',
        summary:
          'CastleBomb is our first game, a real-time siege strategy game played against the computer. You start with a castle and a few huts, grow a town around it, train troops and push your siege engines up to the enemy walls until the other king falls. It began life as a turn-based cannon duel, and that first version is still around.',
        artAlt:
          'CastleBomb: a walled medieval town of red-tiled towers and timber houses at golden hour, a lake behind it, a dirt road leading to a rival walled city, and the CastleBomb title above.',
        versionLabel: 'Latest release',
        versionNote: 'the turn-based prototype',
        highlights: [
          ['The town is the economy', 'Houses, farms and workshops go up while the battle is running. Lose a building and you lose whatever it was making.'],
          ['Soldiers are your own people', 'Every company you train is a few fewer hands at home, so you can’t just have an army and a town. You have to choose.'],
          ['Siege engines aim themselves', 'You haul them into position and give them a target. They fire on their own, and the wind bends every shot.'],
          ['Fog of war', 'You only see what your people see. Scout first, or arrive blind.'],
          ['No cheating', 'The <abbr title="computer opponent">CPU</abbr> plays with the same economy, rules and fog that you do.'],
          ['Never the same map twice', 'Every battle is generated: hills, water, woods, weather and season.'],
        ],
        specs: [
          ['Engine', 'Godot 4.7.2, statically typed GDScript'],
          ['Platforms', 'macOS first (Apple silicon and Intel), Android later'],
        ],
      },
      supervisor: {
        name: 'Claude AI Supervisor',
        tagline: 'The control tower for Claude Code: every agent, every model, every token, at a glance.',
        summary:
          'Claude AI Supervisor keeps an eye on every Claude Code project running on your Mac. It shows how much of your weekly quota each one is using, which agents are busy right now and when the quota resets, and it lets you change settings project by project. It’s a menu-bar app, the cockpit, sitting on top of a small command-line tool called <code>sup</code>.',
        artAlt:
          'The cockpit window: the weekly usage curve, the list of what Claude is doing right now, and the project controls, on a glass window over a purple wallpaper.',
        highlights: [
          ['See it all', 'The week and the 5-hour session, as <code>/usage</code> shows them, with a live countdown. Every session and sub-agent too: its task, model, tokens, speed and how full its context is.'],
          ['Split the week', 'Give each project a share of the quota with a draggable bar, and spot the ones that will run dry before the reset.'],
          ['Steer', 'Change a project’s model, sub-agent model, effort or permissions in one click. Or let the autopilot go easy on a project that’s running short.'],
          ['Advice you can act on', 'Slow down. Run <code>/compact</code> on a bloated context. Wake up a sleeping session.'],
          ['It costs nothing to run', 'It reads files on your Mac. No network connection, no model calls, so it uses no tokens at all. Uninstalling removes everything.'],
          ['A word on signing', 'The app is signed ad hoc, not notarized, so macOS asks you to confirm the first launch. The README walks you through it.'],
        ],
        specs: [
          ['Requires', 'macOS 14 or later, Claude Code, python3 3.9+'],
          ['Dependencies', 'None'],
          ['Languages', 'English and French'],
          ['Install', 'The app (DMG), a build from source, or just the command line'],
        ],
      },
      dock: {
        name: 'MacOS Dock',
        tagline: 'A Dock for every other screen of your Mac.',
        summary:
          'macOS only shows its Dock on one display at a time. MacOS Dock puts a Dock-style bar on every other display, so your apps stay one click away wherever you’re working. The real Dock is left alone.',
        artAlt: 'MacOS Dock: a navy app icon with a silver gear, beside the chrome name, over a miniature of the bar.',
        highlights: [
          ['Liquid Glass', 'The same material as the macOS 26 Dock, with adjustable transparency (a plain blur on older systems) and a tint of your choice.'],
          ['Your apps are already there', 'Whatever is pinned in your Dock on first launch, plus everything that’s running, with a dot under the running ones.'],
          ['Behaves like the real thing', 'Magnification, bouncing icons, stacks, the Trash, auto-hide and recent apps.'],
          ['Optional extras', 'Keep maximized windows clear of the bar, give minimized windows a tile, show notification badges. They need the Accessibility permission, and granting it is up to you.'],
          ['{dockLanguages} languages', 'English, French, German, Spanish, Italian, Japanese and Simplified Chinese.'],
          ['Leaves nothing behind', 'It only writes its own preferences and crash reports, and <code>make uninstall</code> removes all of it.'],
        ],
        specs: [
          ['Requires', 'macOS 13 or later, Apple silicon or Intel, at least two displays'],
          ['Tested on', 'macOS 26'],
          ['Built with', 'Swift 6 and the Command Line Tools, no Xcode'],
          ['Install', 'Build from source, download a release, or use Homebrew'],
        ],
      },
      mobimount: {
        name: 'MobiMount',
        tagline: 'Android to Mac by drag and drop. No kernel extension, no admin password, no lowered security.',
        summary:
          'macOS can’t talk to an Android phone out of the box. Phones share files over MTP (a file-transfer protocol) rather than as a plain disk, and mounting one in Finder normally takes a FUSE kernel extension, which is a real security trade-off. MobiMount skips that. It installs OpenMTP, an open-source app that speaks MTP in plain user space, and you drag files between two panes, a bit like a small Finder.',
        artAlt: 'The MobiMount icon: a blue phone connected by a cable to a blue folder with a drive symbol.',
        highlights: [
          ['One command in, one out', '<code>install.sh</code> installs OpenMTP. <code>uninstall.sh</code> removes it along with its saved preferences.'],
          ['No admin password', 'OpenMTP is a regular signed app installed with Homebrew. Nothing needs <code>sudo</code>.'],
          ['You stay in charge', 'Nothing is written to the phone unless you do it.'],
          ['Plug in and drag', 'Choose “File transfer” on the phone, then drag. The README has a short troubleshooting table for the usual suspects: charge-only cables, locked phones, empty folders.'],
        ],
        specs: [
          ['Requires', 'macOS and Homebrew, plus a USB-C data cable'],
          ['Built with', 'Shell, around OpenMTP (third-party, open source)'],
          ['Status', 'A personal project, provided as is'],
        ],
      },
      studio: {
        name: 'TissByte Gaming Studio',
        tagline: 'An AI game studio: specialised agents, one pipeline and a visual quality bar.',
        summary:
          'A set of specialised agent roles with one shared process and a quality bar, making games under the direction of a human. It lives inside CastleBomb for now, and will get its own repository once a second project needs it.',
        artAlt: 'A diagram of the studio pipeline in six steps: direct, build, review, gate, sign off and merge.',
        highlights: [
          ['The owner decides', 'A human sets the direction and picks between rendered options. The studio challenges, designs, builds, reviews and ships.'],
          ['Lots of roles', 'Around sixty: directors, designers, artists, programmers, reviewers, <abbr title="quality assurance">QA</abbr> and judges, each with its own instructions, tools and model.'],
          ['One pipeline', 'Build, independent review, merge gate, sign-off, squash-merged pull request. Nothing merges because a builder said so.'],
          ['A visual bar', 'Art is judged against an approved image bank, and it ships at 9 out of 10 or not at all.'],
        ],
        specs: [
          ['Status', 'A placeholder for now; the move out of CastleBomb is planned'],
          ['Lives today in', 'CastleBomb’s <code>.studio</code> folder'],
          ['Will provide', 'An installable studio, a merge gate for Godot projects, visual judging and a licence-safe asset pipeline'],
        ],
      },
    },
  },

  approach: {
    eyebrow: 'How we work',
    title: 'A few habits.',
    intro: 'They show up in every project, whether we planned it or not.',
    items: [
      {
        icon: 'chip',
        title: 'Native, and light',
        text: 'Swift and AppKit, built with Apple’s Command Line Tools, so there’s no Xcode to install. When a script will do, it’s plain Python with no dependencies.',
      },
      {
        icon: 'lock',
        title: 'Nothing phones home',
        text: 'MacOS Dock and Claude AI Supervisor never open a network connection. If they change something on your Mac, they show you first. Uninstalling removes everything.',
      },
      {
        icon: 'check',
        title: 'We say what doesn’t work',
        text: 'Every README has a section on limits. Our builds are signed ad hoc rather than notarized, and we tell you so up front, with the exact steps to open them.',
      },
      {
        icon: 'flask',
        title: 'Tested before we show it',
        text: 'The game’s rules sit in a plain, deterministic engine with headless unit tests and computer-versus-computer balance runs. In the game’s code, a warning counts as an error.',
      },
      {
        icon: 'globe',
        title: 'Your language, if we can',
        text: 'MacOS Dock speaks {dockLanguages} languages. Claude AI Supervisor speaks English and French.',
      },
      {
        icon: 'people',
        title: 'A human in charge',
        text: 'A person sets the direction. A studio of specialised <abbr title="artificial intelligence">AI</abbr> agents does the building, the reviewing and the gatekeeping.',
        link: { href: '#studio', label: 'Meet the studio' },
      },
    ],
  },

  studio: {
    eyebrow: 'The studio',
    title: 'Lots of agents, one human.',
    intro:
      'Our game studio is a set of specialised AI roles, one shared process and a visual quality bar. It’s being worked out inside CastleBomb, and it will move into its own repository when a second game needs it.',
    stepsLabel: 'The pipeline, step by step',
    steps: [
      { title: 'Direct', text: 'A human sets the direction and chooses between rendered options.' },
      { title: 'Build', text: 'A specialised role does the work, with its own instructions, tools and model.' },
      { title: 'Review', text: 'A different role reviews it. Nothing merges on the builder’s say-so.' },
      { title: 'Gate', text: 'A local merge gate checks the exact commit: tests, lint, privacy and offline checks.' },
      { title: 'Sign off', text: 'A studio chief signs off. Visual work ships at 9 out of 10 against the image bank, or it doesn’t ship.' },
      { title: 'Merge', text: 'One squash-merged pull request lands the change.' },
    ],
    stats: [
      { value: '≈ 60', label: 'specialised roles' },
      { value: '9/10', label: 'minimum visual score to ship' },
      { value: '1', label: 'human who decides' },
    ],
    note: 'We keep it lean: short reviews that only look at what changed, a single judge until the score reaches 8, and token budgets tracked every day.',
  },

  contact: {
    eyebrow: 'Find us',
    title: 'Come and have a look.',
    text: 'Everything TissByte makes lives on GitHub.',
    mail: 'Want to get in touch? Write to',
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
    text: 'The page you were looking for doesn’t exist, or it has moved.',
    cta: 'Back to the home page',
  },
};
