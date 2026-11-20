// WCAG 2.x contrast audit of the design tokens against the WORST-CASE backdrop.
//   node scripts/contrast.mjs        (exit code 1 if any pair misses its target)
//
// Why a model and not "just look at it": the page sits on drifting colour halos (the "orbs") and the
// glass is translucent, so the pixels behind a given word change over time. We therefore test every
// text colour on the brightest background it could ever meet: the PEAK of each halo, with the glass
// fill (and its brightest realistic highlight) on top, or with no glass at all for text that sits
// directly on the page.
//
// Targets (WCAG 2.2 level AAA): normal text >= 7:1, large text (>= 24px, or >= 18.66px bold) >= 4.5:1,
// UI boundaries / focus indicator >= 3:1.

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
  bg: hex('#0f0e0c'),
  ink: hex('#fbf8f0'),
  ink2: hex('#e4dfd0'),
  champagne: hex('#f7e2b4'),
  metalText: hex('#1b1408'),
  metalFill: hex('#deb870'), // darkest stop of the metal button gradient (worst case for dark text)
  heroLow: hex('#cfc7b2'), // darkest stop of the headline gradient
  heroEmLow: hex('#e8c88c'),
};
// halos: rgb + PEAK alpha (src/styles.css .orb--*)
const ORBS = [
  { name: 'navy', c: [32, 78, 190], a: 0.66 },
  { name: 'red', c: [214, 24, 54], a: 0.42 },
  { name: 'brass', c: [212, 156, 62], a: 0.28 },
  { name: 'ice', c: [120, 184, 246], a: 0.18 },
];
const GLASS_BASE = { c: [19, 17, 14], a: 0.6 }; // --glass-fill dark layer
const GLASS_BASE_STRONG = { c: [17, 15, 12], a: 0.84 };
const WHITE_IN_TEXT_AREA = 0.1; // brightest realistic white sheen under a paragraph (gradient mid + spotlight)
const BLUR_LIFT = 1.06; // backdrop-filter brightness()
const SAT = 1.75; // backdrop-filter saturate()

const saturate = (rgb, s) => {
  const y = 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
  return rgb.map((v) => Math.min(255, Math.max(0, y + (v - y) * s)));
};

// every backdrop we must survive: each halo at its peak, and the strongest halo with a 35 % bleed of each other one
const backdrops = [];
for (const o of ORBS) {
  backdrops.push({ name: `${o.name} peak`, rgb: over(o.c, o.a, T.bg) });
  for (const p of ORBS) {
    if (p === o) continue;
    backdrops.push({ name: `${o.name} peak + ${p.name} bleed`, rgb: over(p.c, p.a * 0.35, over(o.c, o.a, T.bg)) });
  }
}

// the soft light that trails the pointer (.cursor-light, alpha .06) can sit on top of ANY halo at full strength
const LIGHT = { c: [247, 226, 180], a: 0.06 };
for (const o of ORBS) {
  backdrops.push({ name: `${o.name} peak + cursor light`, rgb: over(LIGHT.c, LIGHT.a, over(o.c, o.a, T.bg)) });
}
backdrops.push({ name: 'cursor light on bare page', rgb: over(LIGHT.c, LIGHT.a, T.bg) });

const rows = [];
const check =(label, fg, bg, target) => {
  const r = ratio(fg, bg);
  rows.push({ label, r, target, ok: r >= target });
};
const worst = (fg, makeBg) => {
  let min = Infinity;
  let at = '';
  for (const b of backdrops) {
    const r = ratio(fg, makeBg(b.rgb));
    if (r < min) { min = r; at = b.name; }
  }
  return { min, at };
};
const add = (label, fg, makeBg, target) => {
  const { min, at } = worst(fg, makeBg);
  rows.push({ label: `${label}  [worst: ${at}]`, r: min, target, ok: min >= target });
};

const onPage = (b) => b;
const onGlass = (b) => {
  const lifted = saturate(b.map((v) => v * BLUR_LIFT), SAT);
  const base = over(GLASS_BASE.c, GLASS_BASE.a, lifted);
  return over([255, 255, 255], WHITE_IN_TEXT_AREA, base);
};
const onGlassStrong = (b) => {
  const lifted = saturate(b.map((v) => v * BLUR_LIFT), SAT);
  const base = over(GLASS_BASE_STRONG.c, GLASS_BASE_STRONG.a, lifted);
  return over([255, 255, 255], WHITE_IN_TEXT_AREA, base);
};

add('ink on page', T.ink, onPage, 7);
add('ink-2 on page', T.ink2, onPage, 7);
add('champagne (eyebrows, links) on page', T.champagne, onPage, 7);
add('ink on glass', T.ink, onGlass, 7);
add('ink-2 on glass', T.ink2, onGlass, 7);
add('champagne on glass', T.champagne, onGlass, 7);
add('ink on strong glass (dialog, scrolled nav)', T.ink, onGlassStrong, 7);
add('ink-2 on strong glass', T.ink2, onGlassStrong, 7);
add('champagne on strong glass', T.champagne, onGlassStrong, 7);
add('headline (large) lowest gradient stop on page', T.heroLow, onPage, 4.5);
add('headline italic (large) lowest gradient stop on page', T.heroEmLow, onPage, 4.5);
check('metal button text on its darkest fill', T.metalText, T.metalFill, 7);
check('focus ring (white) vs page bg', hex('#ffffff'), T.bg, 3);
check('focus halo vs white ring (dark halo)', hex('#000000'), hex('#ffffff'), 3);

const pad = (s, n) => (s.length > n ? s.slice(0, n - 1) + '…' : s.padEnd(n));
console.log(`${pad('pair', 74)} ${'ratio'.padStart(6)}  target  result`);
for (const r of rows) console.log(`${pad(r.label, 74)} ${r.r.toFixed(2).padStart(6)}  ${String(r.target).padStart(4)}:1  ${r.ok ? 'AAA ✓' : 'FAIL ✗'}`);
const failed = rows.filter((r) => !r.ok);
console.log(failed.length ? `\n${failed.length} pair(s) below target` : '\nAll pairs meet WCAG 2.2 AAA on the worst-case backdrop.');
process.exit(failed.length ? 1 : 0);
