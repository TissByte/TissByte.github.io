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
  ink2: hex('#f0ebdf'),
  champagne: hex('#fbe9c0'),
  metalText: hex('#1b1408'),
  metalDark: hex('#efd69d'), // darkest stop of the champagne key
};
const LIT = [255, 244, 226];
// The woven texture (body::before) only shows on the bare page: plates and wells are opaque and cover it. Its brightest
// pixel: a thread (.028 white) under both noise layers (.05 each, at 90 % brightness at the very most).
const WEAVE = 0.028 + 2 * 0.04 * 0.9;
const RIM = 0.1; // the brightest inner rim / hover highlight under or near text
const lift = (base, a = RIM) => over(LIT, a, base); // plates and wells: the brightest rim or hover highlight
const weave = (base) => over([255, 255, 255], WEAVE, base);

const rows = [];
const check = (label, fg, bg, target) => {
  const r = ratio(fg, bg);
  rows.push({ label, r, target, ok: r >= target });
};

// the light (body::after): three tinted glows, evaluated geometrically. Each is a radial gradient fixed to the viewport
// (radii in vmax, centre in % of the viewport, linear fade to transparent at `stop`), so we walk a grid of points over
// several viewport shapes, composite the glows exactly as the browser does (first listed on top) and keep the brightest
// pixel. The dark corner only ever darkens, so it is left out (worst case). Keep in sync with body::after in styles.css.
const GLOWS = [
  { cx: 0.08, cy: -0.06, rx: 70, ry: 52, color: [226, 124, 44], a: 0.22, stop: 0.64 },  // amber, top left
  { cx: 1.0, cy: 0.3, rx: 60, ry: 50, color: [150, 40, 96], a: 0.26, stop: 0.66 },    // rose, right
  { cx: 0.0, cy: 1.05, rx: 70, ry: 55, color: [52, 56, 150], a: 0.30, stop: 0.64 },   // indigo, bottom left
];
const brightestLight = () => {
  let best = T.surface;
  for (const [W, H] of [[1440, 900], [1920, 1080], [2560, 1440], [390, 844], [820, 1180], [1024, 768]]) {
    const vmax = Math.max(W, H) / 100;
    for (let y = 0; y <= H; y += H / 60) for (let x = 0; x <= W; x += W / 60) {
      let c = T.surface;
      for (const g of [...GLOWS].reverse()) { // paint the bottom layer first
        const r = Math.hypot((x - g.cx * W) / (g.rx * vmax), (y - g.cy * H) / (g.ry * vmax));
        if (r < g.stop) c = over(g.color, g.a * (1 - r / g.stop), c);
      }
      if (lum(c) > lum(best)) best = c;
    }
  }
  return best;
};
const tinted = brightestLight();
const onSurface = weave(tinted);
const onPlate = lift(T.plateLight);
const onWell = lift(T.wellLight);
// a card's plate catches its project's colour: at most 7 % of the accent, in the bottom-left corner
const ACCENTS = { castlebomb: '#ee8a3c', supervisor: '#6fb0f2', cleaning: '#5ad1c4', dock: '#e0b25e', mobimount: '#4cc2ff', studio: '#a99dff' };
for (const [name, h] of Object.entries(ACCENTS)) {
  const bg = lift(over(hex(h), 0.07, T.plateLight));
  check(`ink-2 on the ${name} card (accent glow)`, T.ink2, bg, 7);
  check(`champagne on the ${name} card (accent glow)`, T.champagne, bg, 7);
}

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
