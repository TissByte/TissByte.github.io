// The site's languages. English lives at the root of the site, every other language in its own folder.
// `path` is where the page sits inside dist/ (and under the site URL); `native` is the language's own name.
// Adding a language: add an entry here, write src/copy.<code>.mjs (the build compares it with English), done.
export const languages = [
  { code: 'en', short: 'EN', native: 'English', path: '', locale: 'en_US', copy: () => import('./copy.en.mjs') },
  { code: 'fr', short: 'FR', native: 'Français', path: 'fr/', locale: 'fr_FR', copy: () => import('./copy.fr.mjs') },
];

export const defaultLanguage = languages[0];

// "…de l'écran : …" -> a no-break space before : ; ! ? % and inside « », as French typography wants.
// Only text is touched, never the markup between < and >. The copy file is written with plain spaces.
export function frenchTypography(html) {
  const NBSP = ' ';
  const NNBSP = ' '; // narrow no-break space
  return html
    .split(/(<[^>]*>)/)
    .map((part) =>
      part.startsWith('<')
        ? part
        : part
            .replace(/ +([;!?%»])/g, `${NNBSP}$1`)
            .replace(/ +:/g, `${NBSP}:`)
            .replace(/«\s*/g, `«${NNBSP}`),
    )
    .join('');
}

/** Typography pass over every string of a copy object (deep), returning a new object. */
export function typeset(copy, lang) {
  if (lang !== 'fr') return copy;
  const walk = (v) => {
    if (typeof v === 'string') return frenchTypography(v);
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)]));
    return v;
  };
  return walk(copy);
}
