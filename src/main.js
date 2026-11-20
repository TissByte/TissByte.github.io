/* TissByte: progressive enhancement only. The page is fully readable and usable without this file.
   Every motion effect below is skipped when the visitor asks for reduced motion. */
(() => {
  'use strict';

  const root = document.documentElement;
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const reduceTransparency = matchMedia('(prefers-reduced-transparency: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ---------------------------------------------------------- reveal on scroll
     Content is hidden ONLY once this script has proven it can reveal it (class js-reveal).
     Anything already in the first screen is revealed shortly after load. */
  const reveals = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    root.classList.add('js-reveal');
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.05 },
    );
    reveals.forEach((el) => io.observe(el));
    // timers (not rAF) so this also runs in a throttled background tab
    setTimeout(() => {
      reveals.forEach((el) => {
        if (el.getBoundingClientRect().top < innerHeight * 0.96) el.classList.add('is-in');
      });
    }, 60);
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------------------------------------------------------- navigation */
  const nav = $('[data-nav]');
  if (nav) {
    const wrap = nav.closest('.nav-wrap');
    const dot = $('.nav__dot', nav);
    const links = new Map($$('.nav__links a[href^="#"]', nav).map((a) => [a.getAttribute('href').slice(1), a]));
    let current = null;

    // the little light glides under the shortcut of the section being read
    const place = (link) => {
      if (!dot) return;
      if (!link) {
        dot.classList.toggle('is-on', false);
        return;
      }
      const l = link.getBoundingClientRect();
      const n = nav.getBoundingClientRect();
      dot.style.setProperty('--dx', `${(l.left - n.left + l.width / 2 - 2.5).toFixed(1)}px`);
      dot.classList.toggle('is-on', true);
    };
    const setCurrent = (link) => {
      if (link === current) return;
      links.forEach((l) => l.toggleAttribute('aria-current', false));
      if (link) link.setAttribute('aria-current', 'true');
      current = link;
      place(link);
    };

    // a soft scrim fades in behind the shortcuts as the page scrolls away from the hero
    const onScroll = () => wrap?.style.setProperty('--scrim', clamp((scrollY - 120) / 260, 0, 1).toFixed(3));
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', () => place(current), { passive: true });

    if ('IntersectionObserver' in window) {
      const spy = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            const link = links.get(e.target.id);
            if (!link) continue;
            if (e.isIntersecting) setCurrent(link);
            else if (link === current) setCurrent(null);
          }
        },
        { rootMargin: '-45% 0px -50% 0px' },
      );
      links.forEach((_, id) => {
        const section = document.getElementById(id);
        if (section) spy.observe(section);
      });
    }
  }

  /* ---------------------------------------------------------- project sheets (native <dialog>)
     With View Transitions the card's artwork flies into the sheet, and back on close. */
  if (typeof HTMLDialogElement === 'function') {
    const canMorph = () => typeof document.startViewTransition === 'function' && !reduceMotion.matches;
    const cardOf = new Map();

    const morph = (dlg, fromEl, toEl, change) => {
      if (!canMorph() || !fromEl || !toEl) {
        change();
        return;
      }
      dlg.classList.add('is-morph');
      fromEl.style.viewTransitionName = 'proj-art';
      const vt = document.startViewTransition(() => {
        fromEl.style.viewTransitionName = '';
        toEl.style.viewTransitionName = 'proj-art';
        change();
      });
      vt.finished.finally(() => {
        toEl.style.viewTransitionName = '';
        fromEl.style.viewTransitionName = '';
        dlg.classList.remove('is-morph');
      });
    };
    const openSheet = (dlg) => {
      if (dlg.open) return;
      const card = cardOf.get(dlg);
      morph(dlg, card && $('.card__art', card), $('.sheet__art', dlg), () => dlg.showModal());
    };
    const closeSheet = (dlg) => {
      if (!dlg.open) return;
      const card = cardOf.get(dlg);
      morph(dlg, $('.sheet__art', dlg), card && $('.card__art', card), () => dlg.close());
    };

    $$('[data-open]').forEach((btn) => {
      const dlg = document.getElementById(btn.dataset.open);
      if (!dlg) return;
      const card = btn.closest('.card');
      cardOf.set(dlg, card);
      btn.addEventListener('click', () => {
        btn.focus({ preventScroll: true }); // Safari doesn't focus buttons on click; closing returns focus here
        openSheet(dlg);
      });
      // the whole card is clickable for pointer users (the button stays the keyboard / screen-reader path)
      card?.addEventListener('click', (e) => {
        if (e.target instanceof Element && e.target.closest('a, button')) return;
        if (getSelection()?.toString()) return; // don't hijack a text selection
        btn.focus({ preventScroll: true });
        btn.click();
      });
    });
    $$('dialog.sheet').forEach((dlg) => {
      $('[data-close]', dlg)?.addEventListener('click', () => closeSheet(dlg));
      dlg.addEventListener('click', (e) => {
        if (e.target === dlg) closeSheet(dlg); // the dimmed backdrop
      });
      dlg.addEventListener('cancel', (e) => {
        if (canMorph()) {
          e.preventDefault(); // Esc: close through the morph instead
          closeSheet(dlg);
        }
      });
      dlg.addEventListener('toggle', () => {
        if (dlg.open) $('.sheet__scroll', dlg).scrollTop = 0;
      });
    });
  } else {
    root.classList.remove('js'); // very old browsers: details show inline, as in the no-JS version
  }

  /* ---------------------------------------------------------- liquid light: edge + spotlight follow the pointer, cards tilt */
  if (finePointer.matches && !reduceMotion.matches) {
    let target = null;
    let frame = 0;
    let px = 0;
    let py = 0;
    const lit = new Set();

    const paint = () => {
      frame = 0;
      if (!target) return;
      const r = target.getBoundingClientRect();
      const x = px - r.left;
      const y = py - r.top;
      target.style.setProperty('--mx', `${x}px`);
      target.style.setProperty('--my', `${y}px`);
      // the bright arc of the rim faces the pointer
      const angle = (Math.atan2(y - r.height / 2, x - r.width / 2) * 180) / Math.PI + 90;
      target.style.setProperty('--angle', `${angle}deg`);
    };

    document.addEventListener(
      'pointermove',
      (e) => {
        if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
        const g = e.target instanceof Element ? e.target.closest('.glass') : null;
        if (g !== target) {
          target?.classList.remove('is-lit');
          target = g;
          if (g) {
            g.classList.add('is-lit');
            lit.add(g);
          }
        }
        px = e.clientX;
        py = e.clientY;
        if (target && !frame) frame = requestAnimationFrame(paint);
      },
      { passive: true },
    );
    document.addEventListener('pointerleave', () => {
      lit.forEach((g) => g.classList.remove('is-lit'));
      target = null;
    });

    // a gentle 3D tilt toward the pointer (the rect is measured once, before any tilt, to avoid feedback)
    $$('.card').forEach((card) => {
      let rect = null;
      card.addEventListener('pointerenter', (e) => {
        if (e.pointerType === 'mouse') rect = card.getBoundingClientRect();
      });
      card.addEventListener(
        'pointermove',
        (e) => {
          if (!rect || e.pointerType !== 'mouse') return;
          const dx = clamp((e.clientX - rect.left) / rect.width - 0.5, -0.5, 0.5);
          const dy = clamp((e.clientY - rect.top) / rect.height - 0.5, -0.5, 0.5);
          card.setAttribute('data-tilting', '');
          card.style.setProperty('--ry', `${(dx * 5).toFixed(2)}deg`);
          card.style.setProperty('--rx', `${(-dy * 4).toFixed(2)}deg`);
        },
        { passive: true },
      );
      card.addEventListener('pointerleave', () => {
        rect = null;
        card.removeAttribute('data-tilting');
        card.style.removeProperty('--rx');
        card.style.removeProperty('--ry');
      });
    });

    // a soft light that trails the pointer behind the glass, with a little inertia
    const light = $('.cursor-light');
    if (light) {
      let tx = innerWidth / 2;
      let ty = innerHeight * 0.3;
      let cx = tx;
      let cy = ty;
      let running = false;
      const step = () => {
        cx += (tx - cx) * 0.1;
        cy += (ty - cy) * 0.1;
        light.style.setProperty('--cx', `${cx.toFixed(1)}px`);
        light.style.setProperty('--cy', `${cy.toFixed(1)}px`);
        if (Math.abs(tx - cx) + Math.abs(ty - cy) > 0.5) requestAnimationFrame(step);
        else running = false;
      };
      addEventListener(
        'pointermove',
        (e) => {
          if (e.pointerType !== 'mouse') return;
          tx = e.clientX;
          ty = e.clientY;
          light.classList.add('is-on');
          if (!running) {
            running = true;
            requestAnimationFrame(step);
          }
        },
        { passive: true },
      );
      document.addEventListener('pointerleave', () => light.classList.remove('is-on'));
    }
  }

  /* ---------------------------------------------------------- hero: parallax, and the banner recedes as you scroll */
  const hero = $('[data-parallax]');
  if (hero && !reduceMotion.matches) {
    let tx = 0;
    let ty = 0;
    let raf = 0;
    const section = hero.closest('.hero');
    const apply = () => {
      raf = 0;
      const span = Math.max(1, (section ? section.offsetHeight : innerHeight) * 0.75);
      const p = clamp(scrollY / span, 0, 1);
      hero.style.setProperty('--sy', (scrollY * 0.18).toFixed(1));
      hero.style.setProperty('--bs', (1 - p * 0.07).toFixed(3));
      hero.style.setProperty('--bo', (1 - p * 0.78).toFixed(3));
      hero.style.setProperty('--bb', (p * 6).toFixed(2));
      hero.style.setProperty('--px', tx.toFixed(1));
      hero.style.setProperty('--py', ty.toFixed(1));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    addEventListener(
      'scroll',
      () => {
        if (scrollY < innerHeight * 1.4) schedule();
      },
      { passive: true },
    );
    if (finePointer.matches) {
      addEventListener(
        'pointermove',
        (e) => {
          tx = (e.clientX / innerWidth - 0.5) * -14;
          ty = (e.clientY / innerHeight - 0.5) * -8;
          schedule();
        },
        { passive: true },
      );
    }
    schedule();
  }

  /* ---------------------------------------------------------- real refraction (Chromium)
     backdrop-filter accepts an SVG filter in Chromium only. For each [data-lens] element we draw a
     displacement map of a convex glass bezel and let the backdrop bend at the rim, like Apple's Liquid Glass.
     Everywhere else the CSS blur stays, and nothing breaks. */
  const isChromium = /Chrome\//.test(navigator.userAgent) && !/Mobile|Android/.test(navigator.userAgent);
  if (isChromium && !reduceTransparency.matches && window.CSS?.supports?.('backdrop-filter', 'url(#a) blur(1px)')) {
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('width', '0');
    svg.setAttribute('height', '0');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.cssText = 'position:absolute;pointer-events:none';
    document.body.appendChild(svg);

    const MAX_SHIFT = 16; // px the backdrop is bent at the very edge

    const makeMap = (w, h, radius, bezel) => {
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d');
      const img = ctx.createImageData(w, h);
      const d = img.data;
      const hw = w / 2;
      const hh = h / 2;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const cx = x + 0.5 - hw;
          const cy = y + 0.5 - hh;
          const qx = Math.abs(cx) - (hw - radius);
          const qy = Math.abs(cy) - (hh - radius);
          const ox = Math.max(qx, 0);
          const oy = Math.max(qy, 0);
          const depth = -(Math.hypot(ox, oy) + Math.min(Math.max(qx, qy), 0) - radius); // distance inside the rim
          let dx = 0;
          let dy = 0;
          if (depth >= 0 && depth < bezel) {
            const t = 1 - depth / bezel;
            const mag = t * t * (3 - 2 * t); // smoothstep: strongest at the rim, gone at the inner edge of the bezel
            let nx;
            let ny;
            if (qx > 0 || qy > 0) {
              nx = Math.sign(cx) * ox;
              ny = Math.sign(cy) * oy;
              const l = Math.hypot(nx, ny) || 1;
              nx /= l;
              ny /= l;
            } else if (qx > qy) {
              nx = Math.sign(cx);
              ny = 0;
            } else {
              nx = 0;
              ny = Math.sign(cy);
            }
            dx = -nx * mag; // sample from further inside: the rim magnifies what is behind it
            dy = -ny * mag;
          }
          const i = (y * w + x) * 4;
          d[i] = 128 + dx * 127;
          d[i + 1] = 128 + dy * 127;
          d[i + 2] = 128;
          d[i + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
      return c.toDataURL('image/png');
    };

    let n = 0;
    const lens = (el) => {
      const id = `lens-${n++}`;
      const filter = document.createElementNS(NS, 'filter');
      filter.setAttribute('id', id);
      filter.setAttribute('x', '0');
      filter.setAttribute('y', '0');
      filter.setAttribute('width', '100%');
      filter.setAttribute('height', '100%');
      filter.setAttribute('color-interpolation-filters', 'sRGB');
      const feImage = document.createElementNS(NS, 'feImage');
      feImage.setAttribute('preserveAspectRatio', 'none');
      feImage.setAttribute('x', '0');
      feImage.setAttribute('y', '0');
      feImage.setAttribute('result', 'map');
      const disp = document.createElementNS(NS, 'feDisplacementMap');
      disp.setAttribute('in', 'SourceGraphic');
      disp.setAttribute('in2', 'map');
      disp.setAttribute('scale', String(MAX_SHIFT * 2));
      disp.setAttribute('xChannelSelector', 'R');
      disp.setAttribute('yChannelSelector', 'G');
      filter.append(feImage, disp);
      svg.appendChild(filter);

      const strong = el.matches('[data-nav]');
      const blur = strong ? 12 : 8;
      let last = '';
      const update = () => {
        const w = Math.round(el.offsetWidth);
        const h = Math.round(el.offsetHeight);
        if (!w || !h || `${w}x${h}` === last) return;
        last = `${w}x${h}`;
        const cssR = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
        const radius = Math.min(cssR, h / 2);
        const bezel = Math.min(22, h / 2.1);
        feImage.setAttribute('width', String(w));
        feImage.setAttribute('height', String(h));
        feImage.setAttribute('href', makeMap(w, h, radius, bezel));
        const value = `url(#${id}) blur(${blur}px) saturate(1.8) brightness(1.08)`;
        el.style.backdropFilter = value;
        el.style.webkitBackdropFilter = value;
      };
      update();
      let t = 0;
      new ResizeObserver(() => {
        clearTimeout(t);
        t = setTimeout(update, 120);
      }).observe(el);
    };
    $$('[data-lens]').forEach(lens);
  }
})();
