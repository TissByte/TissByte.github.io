/* TissByte: progressive enhancement only. The page is fully readable and usable without this file.
   Every motion effect below is skipped when the visitor asks for reduced motion. */
(() => {
  'use strict';

  const root = document.documentElement;
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
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
    const links = new Map($$('.nav__links a[href^="#"]', nav).map((a) => [a.getAttribute('href').slice(1), a]));
    let current = null;

    // the language switch keeps you where you were: its links carry the section being read (#projects, ...)
    const langLinks = $$('[data-lang] a', nav).map((a) => [a, a.getAttribute('href')]);
    const setCurrent = (link) => {
      if (link === current) return;
      links.forEach((l) => l.toggleAttribute('aria-current', false));
      if (link) link.setAttribute('aria-current', 'true');
      current = link;
      for (const [a, href] of langLinks) a.setAttribute('href', link ? href + link.getAttribute('href') : href);
    };

    // a soft fade of the surface comes in behind the menu as the page scrolls away from the hero
    const onScroll = () => wrap?.style.setProperty('--scrim', clamp((scrollY - 120) / 260, 0, 1).toFixed(3));
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });

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
    const lightbox = $('#lightbox');

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
        if (lightbox?.open) {
          e.preventDefault(); // Esc belongs to the enlarged screenshot on top; the sheet stays
          return;
        }
        if (canMorph()) {
          e.preventDefault(); // Esc: close through the morph instead
          closeSheet(dlg);
        }
      });
      dlg.addEventListener('toggle', () => {
        if (dlg.open) $('.sheet__scroll', dlg).scrollTop = 0;
      });
    });

    // enlarge a README screenshot: one shared viewer, closed by a click anywhere, Esc or its button
    if (lightbox) {
      const big = $('.lightbox__img', lightbox);
      $$('.shot__open').forEach((btn) =>
        btn.addEventListener('click', () => {
          big.src = btn.dataset.zoom;
          big.alt = btn.dataset.zoomAlt || '';
          lightbox.showModal();
        }),
      );
      lightbox.addEventListener('click', () => lightbox.close());
      lightbox.addEventListener('close', () => big.removeAttribute('src'));
    }
  } else {
    root.classList.remove('js'); // very old browsers: details show inline, as in the no-JS version
  }

  /* ---------------------------------------------------------- contact: write, copy, or open in Gmail
     The address is never in the HTML; it is joined here from two data attributes (nothing for harvesters to find). */
  const contact = $('[data-contact]');
  if (contact) {
    const addr = `${contact.dataset.u}@${contact.dataset.d}`;
    const L = JSON.parse(contact.dataset.labels);
    const btn = $('.contact__btn', contact);
    const NS = 'http://www.w3.org/2000/svg';
    const ICON = {
      mail: '<rect x="3" y="5" width="18" height="14" rx="2.6"/><path d="m4 8 8 5.8L20 8"/>',
      copy: '<rect x="8" y="8" width="12" height="12" rx="2.4"/><path d="M16 8V6.6A2.6 2.6 0 0 0 13.4 4H6.6A2.6 2.6 0 0 0 4 6.6v6.8A2.6 2.6 0 0 0 6.6 16H8"/>',
      check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
      out: '<path d="M7 17 17 7"/><path d="M8.5 7H17v8.5"/>',
    };
    const icon = (name) => {
      const s = document.createElementNS(NS, 'svg');
      s.setAttribute('viewBox', '0 0 24 24');
      s.setAttribute('class', 'icon');
      s.setAttribute('fill', 'none');
      s.setAttribute('stroke', 'currentColor');
      s.setAttribute('stroke-width', '1.7');
      s.setAttribute('stroke-linecap', 'round');
      s.setAttribute('stroke-linejoin', 'round');
      s.setAttribute('aria-hidden', 'true');
      s.innerHTML = ICON[name];
      return s;
    };
    const action = (tag, name, label) => {
      const el = document.createElement(tag);
      el.className = 'contact__act';
      el.append(icon(name), Object.assign(document.createElement('span'), { textContent: label }));
      return el;
    };

    const panel = $('#contact-panel', contact); // an empty, hidden container from the HTML; filled here

    const shown = Object.assign(document.createElement('p'), { className: 'contact__addr', textContent: addr });
    const write = action('a', 'mail', L.write);
    write.href = `mailto:${addr}?subject=${encodeURIComponent(L.subject)}`;
    const copy = action('button', 'copy', L.copy);
    copy.type = 'button';
    const gmail = action('a', 'out', L.gmail);
    gmail.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(addr)}&su=${encodeURIComponent(L.subject)}`;
    gmail.target = '_blank';
    gmail.rel = 'noopener noreferrer';
    const status = Object.assign(document.createElement('p'), { className: 'sr-only' });
    status.setAttribute('role', 'status');
    panel.append(shown, write, copy, gmail, status);

    const setOpen = (open) => {
      panel.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
    };
    btn.addEventListener('click', () => setOpen(panel.hidden));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !panel.hidden) {
        setOpen(false);
        btn.focus();
      }
    });
    document.addEventListener('pointerdown', (e) => {
      if (!panel.hidden && !contact.contains(e.target)) setOpen(false);
    });
    contact.addEventListener('focusout', (e) => {
      if (!panel.hidden && e.relatedTarget && !contact.contains(e.relatedTarget)) setOpen(false);
    });

    const flash = () => {
      const label = copy.querySelector('span');
      copy.querySelector('svg').replaceWith(icon('check'));
      label.textContent = L.copied;
      status.textContent = L.copied;
      setTimeout(() => {
        copy.querySelector('svg').replaceWith(icon('copy'));
        label.textContent = L.copy;
        status.textContent = '';
      }, 2200);
    };
    copy.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(addr);
      } catch {
        // older browsers / insecure context: select the address so Cmd/Ctrl+C works
        const r = document.createRange();
        r.selectNodeContents(shown);
        const sel = getSelection();
        sel.removeAllRanges();
        sel.addRange(r);
        try { document.execCommand('copy'); } catch { /* the address stays selected */ }
      }
      flash();
    });
  }

  /* ---------------------------------------------------------- the logo's glint follows the pointer (fine pointers only) */
  const win = $('.hero__window');
  if (win && !reduceMotion.matches && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    win.addEventListener('pointermove', (e) => {
      const r = win.getBoundingClientRect();
      win.style.setProperty('--gx', `${(e.clientX - r.left).toFixed(0)}px`);
      win.style.setProperty('--gy', `${(e.clientY - r.top).toFixed(0)}px`);
      win.style.setProperty('--glint', '.55');
    }, { passive: true });
    win.addEventListener('pointerleave', () => win.style.setProperty('--glint', '0'));
  }

  /* ---------------------------------------------------------- the three LEDs on a section's groove light up once, left to right */
  if ('IntersectionObserver' in window && !reduceMotion.matches) {
    const lamp = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-lit');
            lamp.unobserve(e.target);
          }
        }
      },
      { rootMargin: '0px 0px -55% 0px' },
    );
    $$('.section').forEach((el) => lamp.observe(el));
  }
})();
