// Copie française. Même structure que copy.en.mjs (le build compare les deux et échoue au moindre écart).
// Les valeurs sont du HTML de confiance : seuls <abbr>, <code>, <em>, <strong>, &amp; sont utilisés.
// Placeholders : {projects} {languages} {languageList} {dockLanguages} {year} {version} {name}
//
// Voix : simple, un peu pince-sans-rire, « nous », vouvoiement. On dit la chose précise, pas de slogans.
// On écrit des espaces ordinaires avant : ; ! ? % et autour des « » : src/langs.mjs les remplace par des
// espaces insécables à la compilation (typographie française).

export default {
  lang: 'fr',

  meta: {
    title: 'TissByte : Des logiciels tissés main. Faits pour le plaisir.',
    description:
      'TissByte est une petite initiative logicielle française. Nous faisons des outils et des jeux pour Mac : CastleBomb, Claude AI Supervisor, MacOS Dock, TissByte Cleaning et MobiMount.',
    ogAlt: 'TissByte : un monogramme « TB » chromé, en italique, sur fond noir.',
  },

  a11y: {
    skip: 'Aller au contenu',
    mainNav: 'Navigation principale',
    close: 'Fermer',
    language: 'Langue',
    details: 'En savoir plus sur {name}',
  },

  nav: { home: 'Accueil', projects: 'Projets', principles: 'Principes' },

  hero: {
    title1: 'Des logiciels tissés main.',
    title2: 'Faits pour le plaisir.',
    lead: 'Nous faisons des outils et des jeux pour Mac, pour le plaisir, et pour nous simplifier un peu la vie.',
    ctaGithub: 'Nous suivre sur GitHub',
    ctaContact: 'Nous contacter',
    bannerAlt: 'TissByte : un monogramme « TB » chromé, en italique, sur fond noir.',
    stats: [
      { value: '{projects}', label: 'projets sur l’établi' },
      { value: '{languages}', label: 'langages de programmation : {languageList}' },
      { value: '0', label: 'traceur ou cookie sur ce site' },
    ],
  },

  projects: {
    eyebrow: 'Projets',
    title: 'Ce qu’il y a sur l’établi.',
    intro: 'Trois applications, un jeu, un petit utilitaire et une expérience. Tout part du Mac.',
    notice: 'Nos dépôts sont privés pour l’instant. Accès possible à des fins de débogage : contactez-nous.',
    more: 'Détails',
    highlights: 'Points forts',
    glance: 'En bref',
    sourceLabel: 'Source',
    privateRepo: 'Dépôt privé',
    viewRepo: 'Voir sur GitHub',
    kinds: { game: 'Jeu', app: 'App macOS', utility: 'Utilitaire', lab: 'Expérience' },
    statuses: {
      development: 'En développement',
      released: 'Disponible',
      lab: 'Au labo',
    },
    labels: { version: 'Version', status: 'Statut' },
    screenshots: 'Captures d’écran',
    enlarge: 'agrandir',
    items: {
      castlebomb: {
        name: 'CastleBomb',
        tagline: 'Bâtissez une cité fortifiée, traînez vos machines de siège à travers la carte et faites tomber le château du roi d’en face.',
        summary:
          'CastleBomb est notre premier jeu, un jeu de stratégie de siège en temps réel, contre l’ordinateur. Vous partez d’un château et de quelques huttes, vous faites grandir une ville tout autour, vous entraînez des troupes et vous poussez vos machines de siège jusqu’aux remparts ennemis, jusqu’à la chute de l’autre roi. Il est né comme un duel de canons au tour par tour, et cette première version existe toujours.',
        artAlt:
          'CastleBomb : une ville médiévale fortifiée, aux tours de tuiles rouges et aux maisons à colombages, dans la lumière dorée du soir, un lac derrière elle, un chemin de terre menant à une cité rivale fortifiée, et le titre CastleBomb au-dessus.',
        versionLabel: 'Dernière version',
        versionNote: 'le prototype au tour par tour',
        highlights: [
          ['La ville fait l’économie', 'Maisons, fermes et ateliers sortent de terre pendant que la bataille se déroule. Perdez un bâtiment et vous perdez ce qu’il produisait.'],
          ['Les soldats sont vos propres gens', 'Chaque compagnie entraînée, ce sont quelques bras de moins à la maison : impossible d’avoir à la fois une armée et une ville. Il faut choisir.'],
          ['Les machines de siège visent seules', 'Vous les hissez en position et leur désignez une cible. Elles tirent d’elles-mêmes, et le vent dévie chaque tir.'],
          ['Brouillard de guerre', 'Vous ne voyez que ce que voient vos gens. Envoyez des éclaireurs d’abord, ou avancez à l’aveugle.'],
          ['Pas de triche', 'L’ordinateur joue avec la même économie, les mêmes règles et le même brouillard que vous.'],
          ['Jamais deux fois la même carte', 'Chaque bataille est générée : collines, eau, forêts, météo et saison.'],
        ],
        specs: [
          ['Moteur', 'Godot 4.7.2, GDScript à typage statique'],
          ['Plateformes', 'macOS d’abord (Apple silicon et Intel), Android ensuite'],
        ],
      },
      supervisor: {
        name: 'Claude AI Supervisor',
        tagline: 'La tour de contrôle de Claude Code : chaque agent, chaque modèle, chaque token, d’un coup d’œil.',
        summary:
          'Claude AI Supervisor garde un œil sur tous les projets Claude Code qui tournent sur votre Mac. Il montre quelle part de votre quota hebdomadaire chacun consomme, quels agents sont occupés en ce moment et quand le quota se réinitialise, et il vous laisse régler les paramètres projet par projet. C’est une application de barre des menus, le cockpit, posée sur un petit outil en ligne de commande appelé <code>sup</code>.',
        artAlt:
          'La fenêtre du cockpit : la courbe d’usage hebdomadaire, la liste de ce que Claude fait en ce moment et les contrôles des projets, sur une fenêtre de verre devant un fond d’écran violet.',
        gallery: [
          'Premier lancement : une fenêtre hebdomadaire supposée, clairement signalée comme telle, et une carte de prise en main.',
          'La moitié basse du cockpit : les projets avec leurs contrôles intégrés, et les modèles avec leurs actions groupées.',
          'L’onglet des statistiques.',
          'Les réglages d’IA d’un projet, avec les profils du pilote automatique.',
          'Le panneau de la barre des menus, onglet Projets.',
          'L’onglet En cours.',
          'L’onglet Conseils.',
          'La fenêtre À propos.',
        ],
        highlights: [
          ['Tout voir', 'La semaine et la session de 5 heures, telles que les montre <code>/usage</code>, avec un compte à rebours en direct. Chaque session et chaque sous-agent aussi : sa tâche, son modèle, ses tokens, sa vitesse et le remplissage de son contexte.'],
          ['Répartir la semaine', 'Donnez à chaque projet une part du quota avec une barre à faire glisser, et repérez ceux qui seront à sec avant la réinitialisation.'],
          ['Piloter', 'Changez le modèle, le modèle des sous-agents, l’effort ou les permissions d’un projet en un clic. Ou laissez le pilote automatique ménager un projet dont le quota s’épuise.'],
          ['Des conseils concrets', 'Ralentir. Lancer <code>/compact</code> sur un contexte surchargé. Réveiller une session endormie.'],
          ['Il ne coûte rien à faire tourner', 'Il lit des fichiers sur votre Mac. Aucune connexion réseau, aucun appel à un modèle : il ne consomme donc aucun token. La désinstallation retire tout.'],
          ['Un mot sur la signature', 'L’application est signée ad hoc, pas notarisée : macOS vous demande donc de confirmer le premier lancement. Le README vous guide pas à pas.'],
        ],
        specs: [
          ['Prérequis', 'macOS 14 ou plus récent, Claude Code, python3 3.9+'],
          ['Dépendances', 'Aucune'],
          ['Langues', 'Anglais et français'],
          ['Installation', 'L’app (DMG), une compilation depuis les sources, ou simplement la ligne de commande'],
        ],
      },
      dock: {
        name: 'MacOS Dock',
        tagline: 'Un Dock pour chacun des autres écrans de votre Mac.',
        summary:
          'macOS n’affiche son Dock que sur un seul écran à la fois. MacOS Dock place une barre façon Dock sur chacun des autres écrans, pour que vos apps restent à un clic où que vous travailliez. Le vrai Dock n’est pas touché.',
        artAlt: 'MacOS Dock : une icône d’app bleu marine avec un engrenage argenté, à côté du nom en chrome, au-dessus d’une miniature de la barre.',
        galleryLabel: 'Illustrations',
        gallery: [
          'La barre : les icônes grossissent sous le pointeur, un point signale les apps ouvertes, les pastilles s’affichent, un dossier se déploie en pile, et l’engrenage ouvre tous les réglages.',
          'Le vrai Dock reste sur votre écran principal. MacOS Dock en garde un sur chacun des autres.',
        ],
        highlights: [
          ['Liquid Glass', 'Le même matériau que le Dock de macOS 26, avec une transparence réglable (un simple flou sur les systèmes plus anciens) et la teinte de votre choix.'],
          ['Vos apps y sont déjà', 'Tout ce qui est épinglé dans votre Dock au premier lancement, plus tout ce qui tourne, avec un point sous les apps ouvertes.'],
          ['Se comporte comme l’original', 'Agrandissement, icônes qui rebondissent, piles, Corbeille, masquage automatique et apps récentes.'],
          ['Extras facultatifs', 'Garder les fenêtres agrandies à l’écart de la barre, donner une vignette aux fenêtres réduites, afficher les pastilles de notification. Ils demandent l’autorisation Accessibilité, et c’est à vous de décider de l’accorder.'],
          ['{dockLanguages} langues', 'Anglais, français, allemand, espagnol, italien, japonais et chinois simplifié.'],
          ['Ne laisse rien derrière lui', 'Il n’écrit que ses propres préférences et ses rapports de plantage, et <code>make uninstall</code> retire tout.'],
        ],
        specs: [
          ['Prérequis', 'macOS 13 ou plus récent, Apple silicon ou Intel, au moins deux écrans'],
          ['Testé sur', 'macOS 26'],
          ['Compilé avec', 'Swift 6 et les Command Line Tools, sans Xcode'],
          ['Installation', 'Compilation depuis les sources, version à télécharger ou Homebrew'],
        ],
      },
      cleaning: {
        name: 'TissByte Cleaning',
        tagline: 'Un nettoyeur de Mac qui sait ce qu’il sait, dit où il doute, et peut toujours tout remettre en place.',
        summary:
          'TissByte Cleaning trouve ce dont votre Mac n’a plus besoin, vous dit à quel point il en est sûr et pourquoi, et ne supprime que ce qu’il peut remettre en place. C’est une app macOS, avec un jumeau en ligne de commande appelé <code>tbclean</code>, construite sur une idée : un nettoyeur ne mérite la confiance que s’il sait dire « j’en suis sûr » et « je n’en suis pas sûr », et le pense dans les deux cas. Tout est parti d’un vrai grand ménage, le Mac d’un développeur rempli à 92 %, dont 80 Go de traces de profilage dans un dossier temporaire qu’aucun nettoyeur n’affiche.',
        artAlt:
          'TissByte Cleaning : une icône d’app bleu marine avec un anneau chromé à moitié balayé par une brosse, à côté du nom en chrome et des quatre niveaux de confiance : Sûr, Probable, Pas sûr et Protégé.',
        galleryLabel: 'Captures d’écran (données de démonstration)',
        gallery: [
          'Smart Scan : un anneau, les quatre niveaux et la liste de ce qui est sûr à supprimer.',
          'Le panneau de la barre des menus : l’espace libre, la prévision de disque plein et un scan rapide en un clic.',
          'La fenêtre À propos.',
          'L’inspecteur « Pourquoi » : le raisonnement derrière une confiance, et un doute sérieux auquel vous répondez par oui ou par non.',
          'Pas sûr : chaque résultat avec ses doutes. Rien n’est coché pour vous, et ce que le moteur ne sait pas, il ne le propose pas.',
          'Le Safety Net : ce qui est conservé, le compte à rebours avant expiration, la restauration d’un élément ou d’un nettoyage entier.',
          'Space Lens : une carte de l’endroit où est passé le disque.',
          'Développeur : les projets, les dossiers de build et leur état git.',
          'Statistiques : six tuiles, l’espace libre dans le temps avec sa prévision, et un repère à chaque nettoyage.',
        ],
        highlights: [
          ['Quatre niveaux', 'Chaque résultat tombe dans Sûr, Probable, Pas sûr ou Protégé. Seul « Sûr » est coché pour le nettoyage en un clic, et ce que le moteur ne sait pas identifier n’est jamais proposé à la suppression.'],
          ['Il montre son raisonnement', 'Chaque résultat vient avec les indices derrière sa confiance (« son outil le régénère », « non ouvert depuis 94 jours », « un script ailleurs le mentionne ») et ses doutes nommés. Quand un oui ou un non peut en lever un, il pose la question, s’en souvient et réévalue sur-le-champ.'],
          ['Sûr par construction', 'Neuf contrôles, le Guardian, décident quand un résultat est construit, puis de nouveau, de zéro, à l’instant de la suppression. Tout ce qui n’est pas strictement régénérable va dans le Safety Net : restaurable 30 jours, annulation en un clic.'],
          ['Malin pour les développeurs', 'Dossiers de build repérés par leur fichier marqueur, conscient de git (le travail non commité protège un dossier), worktrees obsolètes, Xcode, caches de paquets, Docker et tous les modèles d’IA locaux, avec qui les référence encore.'],
          ['Où est passé le disque ?', 'Une carte de tout le disque, et de vraies statistiques : l’espace libre dans le temps avec prévision de disque plein, un score de santé, ce qui grossit et une carte de chaleur d’activité sur 52 semaines.'],
          ['Privé', 'Il lit des fichiers sur votre Mac et n’ouvre aucune connexion réseau. Pas de compte, pas de mesure d’audience, et la désinstallation retire tout ce qu’il a écrit.'],
        ],
        specs: [
          ['Prérequis', 'macOS 14 ou plus récent (le rendu Liquid Glass demande macOS 26, les systèmes plus anciens ont un flou)'],
          ['Compilé avec', 'Swift et les Command Line Tools, sans Xcode et sans dépendances'],
          ['Premier lancement', 'Signée ad hoc, pas notarisée : clic droit sur l’app, puis Ouvrir'],
          ['Installation', 'L’app (DMG), une compilation depuis les sources, ou la ligne de commande seule'],
        ],
      },
      mobimount: {
        name: 'MobiMount',
        tagline: 'Utilisez un téléphone Android sur votre Mac comme une clé USB, ce que macOS ne propose pas. Pas d’extension du noyau, pas de mot de passe administrateur.',
        summary:
          'Branchez une clé USB sur un Mac et elle apparaît toute seule. Branchez un téléphone Android et rien ne se passe : macOS ne propose pas cette expérience. Les téléphones partagent leurs fichiers en MTP (un protocole de transfert de fichiers) plutôt que comme un simple disque, et en monter un dans le Finder demande normalement une extension du noyau FUSE, ce qui est un vrai compromis de sécurité. MobiMount s’en passe. Il installe OpenMTP, une app open source qui parle MTP dans l’espace utilisateur : le stockage du téléphone s’ouvre à côté des dossiers de votre Mac et vous glissez vos fichiers de l’un à l’autre, comme avec une clé USB.',
        artAlt: 'L’icône de MobiMount : un téléphone bleu relié par un câble à un dossier bleu portant un symbole de disque.',
        galleryLabel: 'Illustration',
        gallery: ['Comment ça marche : le téléphone parle MTP à OpenMTP, qui affiche le téléphone et votre Mac côte à côte. Glissez un fichier d’un volet à l’autre.'],
        highlights: [
          ['Une commande pour installer, une pour retirer', '<code>install.sh</code> installe OpenMTP. <code>uninstall.sh</code> le retire avec ses préférences enregistrées.'],
          ['Pas de mot de passe administrateur', 'OpenMTP est une app signée ordinaire, installée avec Homebrew. Rien ne demande <code>sudo</code>.'],
          ['Vous gardez la main', 'Rien n’est écrit sur le téléphone si ce n’est pas vous qui le faites.'],
          ['Branchez et glissez', 'Choisissez « Transfert de fichiers » sur le téléphone, puis glissez. Le README contient un petit tableau de dépannage pour les suspects habituels : câbles de charge seule, téléphones verrouillés, dossiers vides.'],
        ],
        specs: [
          ['Prérequis', 'macOS et Homebrew, plus un câble USB-C de données'],
          ['Compilé avec', 'Shell, autour d’OpenMTP (tiers, open source)'],
          ['Remarque', 'Un projet personnel, fourni tel quel'],
        ],
      },
      studio: {
        name: 'TissByte Gaming Studio',
        tagline: 'Un studio de jeux à base d’IA : des agents spécialisés, un seul pipeline et un niveau d’exigence visuel.',
        summary:
          'Un ensemble de rôles d’agents spécialisés, avec un processus commun et un niveau d’exigence, qui fabriquent des jeux sous la direction d’un humain. Il vit pour l’instant dans CastleBomb, et aura son propre dépôt dès qu’un deuxième projet en aura besoin.',
        artAlt: 'Un schéma du pipeline du studio en six étapes : diriger, réaliser, relire, contrôler, valider et fusionner.',
        pipeline: ['Diriger', 'Réaliser', 'Relire', 'Contrôler', 'Valider', 'Fusionner'],
        highlights: [
          ['Le propriétaire décide', 'Un humain donne la direction et choisit entre des options rendues à l’écran. Le studio conteste, conçoit, construit, relit et livre.'],
          ['Beaucoup de rôles', 'Une soixantaine : directeurs, concepteurs, artistes, programmeurs, relecteurs, <abbr title="assurance qualité">QA</abbr> et juges, chacun avec ses propres consignes, ses outils et son modèle.'],
          ['Un seul pipeline', 'Construction, relecture indépendante, barrière de fusion, validation, pull request fusionnée en squash. Rien n’est fusionné parce qu’un constructeur l’a dit.'],
          ['Une exigence visuelle', 'L’art est jugé par rapport à une banque d’images approuvée, et il ne sort qu’à 9 sur 10, sinon pas du tout.'],
        ],
        specs: [
          ['Statut', 'Un espace réservé pour l’instant ; la sortie de CastleBomb est prévue'],
          ['Vit aujourd’hui dans', 'Le dossier <code>.studio</code> de CastleBomb'],
          ['Fournira', 'Un studio installable, une barrière de fusion pour les projets Godot, un jugement visuel et une chaîne d’assets sans risque de licence'],
        ],
      },
    },
  },

  // Le menu de contact derrière le bouton « Nous contacter ».
  contact: {
    label: 'Options de contact',
    write: 'Écrire un e-mail',
    copy: 'Copier l’adresse',
    copied: 'Adresse copiée',
    gmail: 'Ouvrir dans Gmail',
    subject: 'Bonjour TissByte',
    plain: 'Nous contacter :',
  },

  // La bande de clôture : ce sur quoi vous pouvez compter. La vie privée d’abord, exprès.
  promises: {
    title: 'Comment se comportent nos logiciels',
    items: [
      {
        icon: 'lock',
        title: 'Rien ne part sur le réseau',
        text: 'Nos apps n’ouvrent jamais de connexion réseau. Si elles modifient quelque chose sur votre Mac, elles vous le disent d’abord, et la désinstallation retire tout.',
      },
      {
        icon: 'chip',
        title: 'Natives et légères',
        text: 'Swift et AppKit, compilés avec les Command Line Tools d’Apple : pas de Xcode à installer. Quand un script suffit, c’est du Python pur, sans dépendances.',
      },
      {
        icon: 'check',
        title: 'Nous disons ce qui ne marche pas',
        text: 'Chaque README a une section sur les limites. Nos builds sont signés ad hoc plutôt que notarisés, et nous le disons d’emblée, avec les étapes pour les ouvrir.',
      },
      {
        icon: 'flask',
        title: 'Testé avant d’être montré',
        text: 'Les règles du jeu vivent dans un moteur déterministe, avec des tests unitaires et des parties d’équilibrage ordinateur contre ordinateur. Dans le code du jeu, un avertissement compte comme une erreur.',
      },
    ],
  },

  footer: {
    madeIn: 'Fait en France',
    rights: '© {year} TissByte',
    github: 'Nous suivre sur GitHub',
    top: 'Haut de page',
  },

  notFound: {
    title: 'Page introuvable | TissByte',
    heading: 'Ce fil ne mène nulle part.',
    text: 'La page que vous cherchiez n’existe pas, ou elle a été déplacée.',
    cta: 'Retour à l’accueil',
  },
};
