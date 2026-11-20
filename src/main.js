/* TissByte: progressive enhancement only. The page is fully readable without this file. */
(() => {
  'use strict';

  const root = document.documentElement;
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');

  /* ---------------------------------------------------------- reveal on scroll
     Content is hidden ONLY once this script has proven it can reveal it (class js-reveal).
     Anything already in the first screen is revealed on the next frames. */
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
    const toggle = $('.nav__toggle', nav);
    const setOpen = (open) => {
      nav.toggleAttribute('data-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? toggle.dataset.labelClose : toggle.dataset.labelOpen);
    };
    toggle.addEventListener('click', () => setOpen(!nav.hasAttribute('data-open')));
    $$('.nav__links a', nav).forEach((a) => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.hasAttribute('data-open')) {
        setOpen(false);
        toggle.focus();
      }
    });
    document.addEventListener('click', (e) => {
      if (nav.hasAttribute('data-open') && !nav.contains(e.target)) setOpen(false);
    });

    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 24);
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });

    // which section is on screen
    const links = new Map($$('.nav__links a[href^="#"]', nav).map((a) => [a.getAttribute('href').slice(1), a]));
    if ('IntersectionObserver' in window) {
      const spy = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            const link = links.get(e.target.id);
            if (!link) continue;
            if (e.isIntersecting) {
              links.forEach((l) => l.removeAttribute('aria-current'));
              link.setAttribute('aria-current', 'true');
            } else if (link.getAttribute('aria-current')) {
              link.removeAttribute('aria-current');
            }
          }
        },
        { rootMargin: '-45% 0px -50% 0px' },
      );
      links.forEach((_, id) => {
        const s = document.getElementById(id);
        if (s) spy.observe(s);
      });
    }
  }

  /* ---------------------------------------------------------- project dialogs */
  const supportsDialog = typeof HTMLDialogElement === 'function';
  if (supportsDialog) {
    $$('[data-open]').forEach((btn) => {
      const dlg = document.getElementById(btn.dataset.open);
      if (!dlg) return;
      btn.addEventListener('click', () => {
        if (!dlg.open) dlg.showModal();
      });
      // the whole card is clickable for pointer users (the button stays the keyboard / screen-reader path)
      const card = btn.closest('.card');
      card?.addEventListener('click', (e) => {
        if (e.target instanceof Element && e.target.closest('a, button')) return;
        if (getSelection()?.toString()) return; // don't hijack a text selection
        btn.focus({ preventScroll: true });
        btn.click();
      });
    });
    $$('dialog.sheet').forEach((dlg) => {
      $('[data-close]', dlg)?.addEventListener('click', () => dlg.close());
      // click on the dimmed backdrop (outside the panel) closes it
      dlg.addEventListener('click', (e) => {
        if (e.target === dlg) dlg.close();
      });
      // keep the panel's scroll at the top each time it opens
      dlg.addEventListener('toggle', () => {
        if (dlg.open) $('.sheet__scroll', dlg).scrollTop = 0;
      });
    });
  } else {
    // very old browsers: show the details inline, as the no-JS version does
    root.classList.remove('js');
  }

  /* ---------------------------------------------------------- liquid light: edge + spotlight follow the pointer */
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
  }

  /* ---------------------------------------------------------- hero: gentle parallax (pointer + scroll) */
  const hero = $('[data-parallax]');
  if (hero && !reduceMotion.matches) {
    let sy = 0;
    let tx = 0;
    let ty = 0;
    let raf = 0;
    const apply = () => {
      raf = 0;
      hero.style.setProperty('--sy', (sy * 0.16).toFixed(1));
      hero.style.setProperty('--px', tx.toFixed(1));
      hero.style.setProperty('--py', ty.toFixed(1));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    addEventListener(
      'scroll',
      () => {
        if (window.scrollY < window.innerHeight * 1.2) {
          sy = window.scrollY;
          schedule();
        }
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
  }
})();
