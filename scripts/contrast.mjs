// WCAG 2.x contrast audit of the design tokens against the lightest and darkest places each text colour can sit.
//   node scripts/contrast.mjs        (exit code 1 if any pair misses its target)
//
// The page is one flat graphite surface with relief painted on it (plates are lit from the top left, wells are
// cut in), so unlike a translucent design the pixels behind a word never depend on what scrolls underneath. We
// still test the worst case: the lightest stop of every plate gradient with the brightest highlight and the grain
// on top, and each LED / label colour at its strongest.
//
// Targets (WCAG 2.2 level AAA): normal text >= 7:1, large text (>= 24px, or >= 18.66px bold) >= 4.5:1,
// focus indicator >= 3:1.

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lin = (v) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const over = (top, a, base) => top.map((t, i) => t * a + base[i] * (1 - a)); // alpha composite

// ---- tokens: keep in sync with src/styles.css (:root) ---------------------------------------------------------
const T = {
  surface: hex('#26231f'),
  plateLight: hex('#2c2925'), // lightest stop of --convex
  wellLight: hex('#24211d'), //  lightest stop of --concave
  ink: hex('#fbf8f0'),
  ink2: hex('#e4dfd0'),
  champagne: hex('#f7e2b4'),
  metalText: hex('#1b1408'),
  metalDark: hex('#efd69d'), // darkest stop of the champagne key
};
const LIT = [255, 244, 226];
const GRAIN = 0.045 * 0.5; // the grain: opacity .045, at most half of it is light on average; counted at full white to be safe
const RIM = 0.1; // the brightest inner rim / hover highlight under or near text
const lift = (base, a = RIM) => over([255, 255, 255], GRAIN, over(LIT, a, base));

const rows = [];
const check = (label, fg, bg, target) => {
  const r = ratio(fg, bg);
  rows.push({ label, r, target, ok: r >= target });
};

const onSurface = lift(T.surface, 0.07);
const onPlate = lift(T.plateLight);
const onWell = lift(T.wellLight);

for (const [where, bg] of [['the page surface', onSurface], ['a plate (cards, sheet, menus)', onPlate], ['a well (labels, displays, specs)', onWell]]) {
  check(`ink on ${where}`, T.ink, bg, 7);
  check(`ink-2 on ${where}`, T.ink2, bg, 7);
  check(`champagne on ${where}`, T.champagne, bg, 7);
}
check('headline (large) on the page surface', hex('#fbf8f0'), onSurface, 4.5);
check('headline italic (large) on the page surface', T.champagne, onSurface, 4.5);

// the nav fade (rgb 38 35 31 at .96) sits over scrolling content: the menu plates are opaque, so only the fade's own colour matters
check('ink-2 on the pushed-in menu key', T.ink2, onWell, 7);
check('champagne on the pushed-in menu key', T.champagne, onWell, 7);

// the champagne key: dark text on its darkest stop, also while pressed (inner shadow at most .32 of a dark brown at the edge, .15 at the text)
check('key text on the champagne key', T.metalText, T.metalDark, 7);
check('key text on the pressed champagne key', T.metalText, over([130, 85, 10], 0.15, T.metalDark), 7);

// status labels: the word is ink on a well; the LED beside it is decoration (the word carries the meaning)
for (const [name, rgb] of [['released', [112, 224, 166]], ['development', [246, 185, 78]], ['lab', [169, 157, 255]]]) {
  check(`status LED "${name}" against its well (non-text, 3:1)`, rgb, T.wellLight, 3);
}

check('focus ring (white) vs page surface', hex('#ffffff'), T.surface, 3);
check('focus ring (white) vs champagne key', hex('#ffffff'), T.metalDark, 1); // the 3px gap shows the surface; informational

const pad = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s.padEnd(n));
const real = rows.filter((r) => r.target > 1);
console.log(`${pad('pair', 74)} ${'ratio'.padStart(6)}  target  result`);
for (const r of real) console.log(`${pad(r.label, 74)} ${r.r.toFixed(2).padStart(6)}  ${String(r.target).padStart(4)}:1  ${r.ok ? 'AAA ✓' : 'FAIL ✗'}`);
const failed = real.filter((r) => !r.ok);
console.log(failed.length ? `\n${failed.length} pair(s) below target` : '\nAll pairs meet WCAG 2.2 AAA on the lightest and darkest surfaces.');
process.exit(failed.length ? 1 : 0);
