// Copie française. Mêmes clés que copy.en.mjs (le build échoue si elles divergent).
// Les espaces insécables avant « : ; ! ? » et autour des guillemets sont ajoutées automatiquement par le build.
// Valeurs = HTML de confiance : seulement <abbr>, <code>, <em>, <strong>, &amp;.
// Vocabulaire aligné sur le README.fr de Claude AI Supervisor (cockpit, tokens, reset, Économie / Équilibré / Performance / Auto).

export default {
  lang: 'fr',
  locale: 'fr_FR',
  switchCode: 'FR',

  meta: {
    title: 'TissByte — Des logiciels tissés main. Faits pour le plaisir.',
    description:
      'TissByte est une petite fabrique de logiciels française qui crée des outils macOS et des jeux : CastleBomb, Claude AI Supervisor, MacOS Dock et MobiMount.',
    ogAlt: 'TissByte : un monogramme « TB » chromé en italique sur fond noir.',
  },

  a11y: {
    skip: 'Aller au contenu',
    mainNav: 'Navigation principale',
    language: 'Langue',
    langName: { en: 'English', fr: 'Français' },
    menuOpen: 'Ouvrir le menu',
    menuClose: 'Fermer le menu',
    close: 'Fermer',
    home: 'TissByte, retour en haut de page',
    orgLink: 'TissByte sur GitHub',
    details: 'En savoir plus sur {name}',
    opensDialog: 'ouvre une fenêtre de détails',
  },

  nav: { projects: 'Projets', approach: 'Approche', studio: 'Studio', github: 'GitHub' },

  hero: {
    eyebrow: 'Petite fabrique de logiciels française',
    title1: 'Des logiciels tissés main.',
    title2: 'Faits pour le plaisir.',
    lead: 'Nous créons des outils macOS et des jeux pour le plaisir, et pour nous simplifier la vie. Petits, natifs, soigneusement finis.',
    ctaPrimary: 'Voir nos créations',
    ctaSecondary: 'TissByte sur GitHub',
    bannerAlt: 'TissByte : un monogramme « TB » chromé en italique sur un fond noir parcouru de fins circuits.',
    stats: [
      { value: '{projects}', label: 'projets à l’atelier' },
      { value: '{languages}', label: 'langages de programmation : {languageList}' },
      { value: '0', label: 'traceur, cookie ou requête tierce sur ce site' },
    ],
  },

  about: {
    eyebrow: 'Qui sommes-nous',
    title: 'Un petit atelier, tissé à la main.',
    intro:
      'TissByte est une petite fabrique de logiciels française. Nous créons des outils macOS et des jeux pour le plaisir, et parce que nous en avions envie nous-mêmes. Chaque projet naît d’une vraie gêne du quotidien : un second écran sans Dock, un quota Claude Code que personne ne voyait, un téléphone qui refusait de parler à un Mac.',
    pillars: [
      {
        icon: 'weave',
        title: 'Tissé main',
        text: 'Petit par choix. Chaque outil est construit, vérifié et fini fil après fil, puis regardé une dernière fois.',
      },
      {
        icon: 'spark',
        title: 'Fait pour le plaisir',
        text: 'Nous fabriquons ce que nous aimons fabriquer et ce que nous utiliserions nous-mêmes. Le plaisir se voit dans les détails.',
      },
      {
        icon: 'flag',
        title: 'Made in France',
        text: 'Un atelier français qui aime le travail bien fait. Des interfaces en anglais et en français, et jusqu’à {dockLanguages} langues quand il le faut.',
      },
    ],
  },

  projects: {
    eyebrow: 'L’atelier',
    title: 'Ce que nous fabriquons.',
    intro: '{projects} projets : deux apps, un jeu, un utilitaire et un labo. Le tout pensé d’abord pour le Mac.',
    more: 'En savoir plus',
    highlights: 'Points forts',
    glance: 'En bref',
    sourceLabel: 'Code source',
    privateRepo: 'Dépôt privé',
    viewRepo: 'Voir sur GitHub',
    kinds: { game: 'Jeu', app: 'App macOS', utility: 'Utilitaire', lab: 'Labo' },
    statuses: {
      development: 'En développement',
      released: 'Publié',
      personal: 'Projet personnel',
      lab: 'Au labo',
    },
    labels: { version: 'Version', status: 'Statut' },
    items: {
      castlebomb: {
        name: 'CastleBomb',
        tagline: 'Bâtissez une cité fortifiée, acheminez vos engins de siège à travers la plaine et prenez d’assaut le château rival.',
        summary:
          'CastleBomb est le premier jeu de TissByte : un jeu de stratégie en temps réel, au siège de cité médiévale, contre l’ordinateur. Vous démarrez avec un château et quelques huttes, faites grandir une cité vivante, entraînez des compagnies, ouvrez des brèches et donnez l’assaut jusqu’à la chute du roi rival. Il est né d’un duel d’artillerie de château au tour par tour, dont la première version reste jouable.',
        artAlt:
          'Illustration de CastleBomb : un canon en bois tire sur un château de pierre qui explose en flammes, avec des montagnes enneigées et un pont de pierre au fond.',
        versionLabel: 'Dernière version publiée',
        versionNote: 'le prototype d’artillerie au tour par tour',
        highlights: [
          ['Une cité qui vit', 'Maisons, fermes et métiers se construisent pendant la bataille, chacun à son coût. Un bâtiment détruit perd son métier aussitôt.'],
          ['Des armées qui se lisent et se battent', 'Les compagnies sont formées à partir de votre propre population. Classes, formations et moral décident de qui tient la ligne.'],
          ['Des sièges qui racontent une histoire', 'Les engins sont acheminés par des équipages, déployés, puis tirent seuls, leurs trajectoires courbées par le vent. On gagne par un vrai siège : brèche, bélier, escalade ou mine.'],
          ['Un monde à découvrir', 'Chaque bataille est générée : relief, eau, bois, météo et saison. Le brouillard cache tout ce que vous n’avez pas exploré.'],
          ['Équitable par conception', 'Un moteur déterministe tourne sur un pas fixe de 10 Hz. Le <abbr title="adversaire contrôlé par l’ordinateur">CPU</abbr> joue avec la même économie, les mêmes règles et le même brouillard, sans tricher.'],
          ['À la hauteur visuellement', 'Un style cartoon stylisé, peint à la main, sous une lumière chaude, jugé face à une banque d’images validée avant publication.'],
        ],
        specs: [
          ['Moteur', 'Godot 4.7.2 · GDScript typé statiquement'],
          ['Plateformes', 'macOS d’abord (Apple silicon et Intel), Android ensuite'],
        ],
      },
      supervisor: {
        name: 'Claude AI Supervisor',
        tagline: 'Le poste de pilotage de Claude Code : chaque agent, chaque modèle, chaque token, d’un coup d’œil.',
        summary:
          'Claude AI Supervisor surveille tous les projets Claude Code qui tournent sur votre Mac et vous laisse les piloter : quelle part de votre quota hebdomadaire chacun peut utiliser, quels agents travaillent en ce moment, et quand tout se réinitialise. C’est une app de barre de menus, le cockpit, posée sur un petit outil en ligne de commande, <code>sup</code>.',
        artAlt:
          'La fenêtre du cockpit : la courbe d’usage de la semaine, la liste de ce que fait Claude en ce moment et les commandes des projets, sur une fenêtre de verre devant un fond d’écran violet.',
        highlights: [
          ['Voir', 'La semaine et la session de 5 h comme <code>/usage</code> les montre, avec un compte à rebours en direct. Chaque session et sous-agent en détail : tâche, modèle, tokens, vitesse et remplissage du contexte.'],
          ['Répartir', 'Partagez la semaine entre vos projets avec une barre à tirer par projet, et repérez ceux qui vont épuiser leur part avant le reset.'],
          ['Piloter', 'Changez en un clic le modèle d’un projet, celui de ses sous-agents, l’effort ou les permissions. Laissez un autopilote alléger un projet qui manque de part, ou choisissez un mode : Économie, Équilibré, Performance ou Auto.'],
          ['Des conseils exploitables', 'Ralentir, lancer <code>/compact</code> sur un contexte lourd, reprendre une session endormie.'],
          ['Ne coûte rien', 'Il lit des fichiers sur votre Mac, n’ouvre aucune connexion réseau et n’appelle aucun modèle : aucun token consommé. La désinstallation retire tout.'],
          ['Honnête sur ses limites', 'L’app est signée ad hoc, non notarisée : macOS demande donc une confirmation au premier lancement. Les étapes sont dans le README.'],
        ],
        specs: [
          ['Prérequis', 'macOS 14 ou plus récent · Claude Code · python3 3.9+'],
          ['Dépendances', 'Aucune'],
          ['Langues', 'Anglais et français'],
          ['Installation', 'App (DMG), compilation depuis les sources, ou ligne de commande seule'],
        ],
      },
      dock: {
        name: 'MacOS Dock',
        tagline: 'Un Dock pour chaque autre écran de votre Mac.',
        summary:
          'macOS n’affiche son Dock que sur un écran à la fois. MacOS Dock garde une barre façon Dock sur chaque écran qui n’est pas l’écran principal : vos apps restent à un clic, sur tous vos écrans. Il ne modifie jamais le Dock de macOS lui-même.',
        artAlt: 'MacOS Dock : une icône d’app bleu marine avec un engrenage argenté, à côté du nom chromé, au-dessus d’une miniature de la barre.',
        highlights: [
          ['Liquid Glass', 'La matière du Dock de macOS 26, avec une transparence réglable (un flou sur les systèmes plus anciens) et la couleur de votre choix.'],
          ['Vos apps, déjà là', 'Les apps épinglées dans votre Dock au premier lancement, plus toutes les apps ouvertes, avec un point sous celles qui tournent.'],
          ['Se comporte comme le Dock', 'Agrandissement, rebond au lancement, icônes qui s’écartent, dossiers en piles, Corbeille, masquage automatique et apps récentes.'],
          ['Aides facultatives', 'Garder les fenêtres agrandies à l’écart de la barre, donner une tuile aux fenêtres réduites, afficher les pastilles de notification. Elles demandent l’autorisation d’accessibilité, que vous accordez.'],
          ['Parle {dockLanguages} langues', 'Anglais, français, allemand, espagnol, italien, japonais et chinois simplifié.'],
          ['Ne laisse aucune trace', 'Il n’écrit que ses propres préférences et rapports de plantage sur votre Mac, et <code>make uninstall</code> retire tout.'],
        ],
        specs: [
          ['Prérequis', 'macOS 13 ou plus récent · Apple silicon ou Intel · au moins deux écrans'],
          ['Testé sur', 'macOS 26'],
          ['Réalisé avec', 'Swift 6 · Command Line Tools seuls, sans Xcode'],
          ['Installation', 'Compilation depuis les sources, version téléchargée ou Homebrew'],
        ],
      },
      mobimount: {
        name: 'MobiMount',
        tagline: 'D’Android vers le Mac par glisser-déposer. Sans extension du noyau, sans mot de passe administrateur, sans baisser la sécurité.',
        summary:
          'macOS ne gère pas Android de façon native. Les téléphones partagent leurs fichiers en MTP (un protocole de transfert de fichiers), pas comme un simple disque, et les monter dans le Finder demande normalement une extension du noyau FUSE, un vrai compromis de sécurité. MobiMount évite tout cela. Il installe OpenMTP, une app open source qui parle MTP en espace utilisateur, et vous donne une fenêtre à deux panneaux où glisser vos fichiers, comme un Finder léger.',
        artAlt: 'L’icône de MobiMount : un téléphone bleu relié par un câble à un dossier bleu portant un symbole de disque.',
        highlights: [
          ['Une commande pour installer, une pour retirer', '<code>install.sh</code> installe OpenMTP. <code>uninstall.sh</code> le retire avec ses préférences enregistrées.'],
          ['Pas de mot de passe administrateur', 'OpenMTP est une app signée, installée par Homebrew. Rien ne demande <code>sudo</code>.'],
          ['Vous gardez la main', 'Rien n’est écrit sur le téléphone sans une action de votre part.'],
          ['On branche, on glisse, c’est fait', 'Choisissez « Transfert de fichiers » sur le téléphone, puis glissez vos fichiers entre lui et votre Mac. Un tableau de dépannage couvre les câbles, les téléphones verrouillés et les dossiers vides.'],
        ],
        specs: [
          ['Prérequis', 'macOS et Homebrew · un câble USB-C de données'],
          ['Réalisé avec', 'Shell, autour d’OpenMTP (tiers, open source)'],
          ['Statut', 'Projet personnel, fourni tel quel'],
        ],
      },
      studio: {
        name: 'TissByte Gaming Studio',
        tagline: 'Un studio de jeu piloté par IA : des rôles d’agents spécialisés, un pipeline et une exigence visuelle.',
        summary:
          'Un ensemble de rôles d’agents spécialisés, un processus commun et une barre de qualité, qui construisent des jeux sous la direction d’un humain. Il se développe au sein de CastleBomb et aura son propre dépôt dès qu’un deuxième projet en aura besoin.',
        artAlt: 'Un schéma du pipeline du studio en six étapes : diriger, construire, relire, contrôler, valider et fusionner.',
        highlights: [
          ['Le propriétaire décide, le studio construit', 'L’humain donne les orientations et choisit entre des options rendues. Le studio conteste, conçoit, construit, relit et livre.'],
          ['Des rôles, pas un seul assistant', 'Une soixantaine de rôles (directeurs, concepteurs, artistes, développeurs, relecteurs, <abbr title="assurance qualité">QA</abbr>, juges), chacun avec ses instructions, ses outils et son modèle.'],
          ['Un seul pipeline', 'Construction, relecture indépendante, contrôle de fusion, validation, pull request fusionnée en squash. Rien n’est fusionné sur la parole d’un constructeur.'],
          ['Une exigence visuelle', 'Le travail visuel est jugé face à une banque d’images validée, critère par critère, et ne sort qu’à partir de 9 sur 10.'],
        ],
        specs: [
          ['Statut', 'Emplacement réservé : l’extraction depuis CastleBomb est prévue'],
          ['Vit aujourd’hui dans', 'le dossier <code>.studio</code> de CastleBomb'],
          ['Fournira', 'Un studio installable, un contrôle de fusion pour les projets Godot, un jugement visuel et une chaîne d’assets sûre côté licences'],
        ],
      },
    },
  },

  approach: {
    eyebrow: 'Notre approche',
    title: 'Notre façon de construire.',
    intro: 'Les mêmes habitudes se retrouvent dans chaque projet.',
    items: [
      {
        icon: 'chip',
        title: 'Natif et léger',
        text: 'Swift et AppKit, compilés avec les Command Line Tools d’Apple : pas besoin de Xcode. Quand un script suffit, il tourne sur le Python livré avec le Mac, sans dépendance.',
      },
      {
        icon: 'lock',
        title: 'Privé par conception',
        text: 'MacOS Dock et Claude AI Supervisor n’ouvrent jamais de connexion réseau. Tout ce qu’ils modifient sur votre Mac vous est montré d’abord, et la désinstallation retire tout.',
      },
      {
        icon: 'check',
        title: 'Honnêtes sur les limites',
        text: 'Chaque README a sa section sur les limites. Nos versions sont signées ad hoc, non notarisées, et nous le disons d’emblée, avec les étapes exactes pour les ouvrir.',
      },
      {
        icon: 'flask',
        title: 'Testé avant d’être montré',
        text: 'Les règles du jeu vivent dans un moteur pur et déterministe, couvert par des tests unitaires sans interface et des simulations d’équilibrage ordinateur contre ordinateur. Dans le code du jeu, chaque avertissement compte comme une erreur.',
      },
      {
        icon: 'globe',
        title: 'Parle votre langue',
        text: 'MacOS Dock existe en {dockLanguages} langues. Claude AI Supervisor parle anglais et français.',
      },
      {
        icon: 'people',
        title: 'Dirigé par un humain, construit par des agents',
        text: 'Un humain fixe la direction. Un studio d’agents d’<abbr title="intelligence artificielle">IA</abbr> spécialisés construit, relit et contrôle le travail.',
        link: { href: '#studio', label: 'Découvrir le studio' },
      },
    ],
  },

  studio: {
    eyebrow: 'Le studio',
    title: 'De nombreux agents. Un humain aux commandes.',
    intro:
      'Le studio de jeu de TissByte, c’est un ensemble de rôles d’IA spécialisés, un processus commun et une exigence de qualité visuelle. Il se construit au sein de CastleBomb et aura son propre dépôt quand un deuxième jeu en aura besoin.',
    stepsLabel: 'Le pipeline, étape par étape',
    steps: [
      { title: 'Diriger', text: 'L’humain donne les orientations et choisit entre des options rendues.' },
      { title: 'Construire', text: 'Un rôle spécialisé construit, avec ses propres instructions, outils et modèle.' },
      { title: 'Relire', text: 'Un rôle indépendant relit le travail. Rien n’est fusionné sur la parole d’un constructeur.' },
      { title: 'Contrôler', text: 'Un contrôle de fusion local vérifie le commit exact : tests, lint, confidentialité et fonctionnement hors ligne.' },
      { title: 'Valider', text: 'Un chef de studio valide. Le travail visuel ne sort qu’à 9 sur 10 face à la banque d’images.' },
      { title: 'Fusionner', text: 'Une seule pull request fusionnée en squash intègre le changement.' },
    ],
    stats: [
      { value: '≈ 60', label: 'rôles spécialisés' },
      { value: '9/10', label: 'note visuelle minimale pour sortir' },
      { value: '1', label: 'humain qui décide' },
    ],
    note: 'Sobre par défaut : des relectures courtes sur les seuls changements, un seul juge jusqu’à la note de 8, et des budgets de tokens suivis chaque jour.',
  },

  contact: {
    eyebrow: 'Nous trouver',
    title: 'Venez voir l’atelier.',
    text: 'Tout ce que fabrique TissByte vit sur GitHub.',
    privateNote: 'La plupart des dépôts sont privés pour l’instant. Le profil de l’organisation est l’endroit où apparaîtront les travaux publics.',
    cta: 'TissByte sur GitHub',
  },

  footer: {
    tagline: 'Des logiciels tissés main. Faits pour le plaisir.',
    privacy: 'Aucun cookie, aucun outil d’analyse, aucune requête tierce.',
    madeIn: 'Made in France',
    rights: '© {year} TissByte',
    top: 'Retour en haut',
  },

  notFound: {
    title: 'Page introuvable — TissByte',
    heading: 'Ce fil ne mène nulle part.',
    text: 'La page que vous cherchiez n’existe pas, ou elle a été déplacée.',
    cta: 'Retour à l’accueil',
  },
};
