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

    // the lit key slides under the section being read
    const list = $('.nav__links', nav);
    const glide = () => {
      if (!list) return;
      list.style.setProperty('--on', current ? '1' : '0');
      if (!current) return;
      list.style.setProperty('--x', `${current.offsetLeft}px`);
      list.style.setProperty('--w', `${current.offsetWidth}px`);
      if (list.classList.contains('has-glider')) return;
      list.classList.add('has-glider');
      setTimeout(() => list.classList.add('is-live'), 60); // the first position is set without travelling to it
    };
    if (list && 'ResizeObserver' in window) new ResizeObserver(glide).observe(list);

    // the language switch keeps you where you were: its links carry the section being read (#projects, ...)
    const langLinks = $$('[data-lang] a', nav).map((a) => [a, a.getAttribute('href')]);
    const setCurrent = (link) => {
      if (link === current) return;
      links.forEach((l) => l.toggleAttribute('aria-current', false));
      if (link) link.setAttribute('aria-current', 'true');
      current = link;
      glide();
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
      // opened near the bottom of the window, the menu scrolls into view instead of hiding below it
      if (open) panel.scrollIntoView({ block: 'nearest', behavior: reduceMotion.matches ? 'auto' : 'smooth' });
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

  /* ---------------------------------------------------------- liquid metal: as the light passes, the monogram becomes
     molten chrome. One WebGL2 quad: a relief map gives the letters their volume, flowing ripples bend it, and the metal
     reflects a small studio (softboxes, horizon, warm floor) with a key light that travels with the pass. In step with
     the CSS sheen it replaces (same clock). Without WebGL2, or with reduced motion, the CSS version stands. */
  const art = win && $('img', win);
  const sheen = win && $('.hero__sheen', win);
  if (art && sheen && !reduceMotion.matches) {
    const maps = [art.dataset.mask, art.dataset.relief].map((src) => Object.assign(new Image(), { src }));
    Promise.all([art, ...maps].map((i) => i.decode())).then(() => liquidMetal(art, ...maps)).catch(() => { /* the CSS sheen stays */ });
  }

  function liquidMetal(...images) {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2', { premultipliedAlpha: true, powerPreference: 'low-power' });
    const clock = sheen.getAnimations?.()[0];
    if (!gl || !clock) return;

    const FRAGMENT = `#version 300 es
      precision highp float;
      uniform sampler2D art;    // the banner: the metal as drawn
      uniform sampler2D cut;    // alpha: the exact shape of the metal
      uniform sampler2D relief; // red, green: which way the surface faces; blue: its height
      uniform vec2 fit;         // the part of the artwork a "cover" fit shows in this box
      uniform float front;      // where the light is, in the artwork's width (0 to 1)
      uniform float strength;   // eases the whole effect in and out
      uniform float time;
      in vec2 box;
      out vec4 colour;

      float lum(vec2 p, float soft) { return dot(textureLod(art, p, soft).rgb, vec3(0.299, 0.587, 0.114)); }

      // smooth value noise and its slope: the waves on the molten surface
      float hash(vec2 c) { return fract(sin(dot(c, vec2(127.1, 311.7))) * 43758.5453); }
      vec3 noise(vec2 x) {
        vec2 i = floor(x), f = fract(x);
        vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0), du = 30.0 * f * f * (f * (f - 2.0) + 1.0);
        float a = hash(i), b = hash(i + vec2(1.0, 0.0)), c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0));
        float k = a - b - c + d;
        return vec3(a + (b - a) * u.x + (c - a) * u.y + k * u.x * u.y, du * (vec2(b - a, c - a) + k * u.yx));
      }

      float band(float v, float at, float width, float soft) { return 1.0 - smoothstep(width, width + soft, abs(v - at)); }

      // what the chrome reflects: a dark studio, a bright ceiling, a warm floor, and tall softboxes that slide past
      vec3 studio(vec3 r, float slide) {
        float up = -r.y;
        vec3 c = mix(vec3(0.055, 0.045, 0.035), vec3(0.42, 0.43, 0.46), smoothstep(-0.05, 0.75, up));
        c += vec3(0.62, 0.45, 0.24) * band(up, -0.42, 0.14, 0.26);                       // champagne bounce from below
        c += vec3(1.30, 1.28, 1.24) * band(up, 0.72, 0.10, 0.16);                        // the box overhead
        float x = r.x + slide;
        c += vec3(1.55, 1.50, 1.40) * band(x, -0.34, 0.075, 0.06);                       // a tall, crisp softbox
        c += vec3(1.00, 0.80, 0.50) * band(x, 0.46, 0.17, 0.20);                         // a wide, warm one
        c += vec3(0.92, 0.94, 1.00) * band(x, 0.93, 0.025, 0.05);                        // a thin cool edge
        c *= 1.0 - 0.8 * band(up, 0.03 + 0.09 * sin(x * 4.0), 0.035, 0.09);              // the dark horizon of chrome
        return c;
      }

      void main() {
        vec2 p = (box - 0.5) * fit + 0.5;
        float metal = texture(cut, p).a;
        if (metal <= 0.002) discard;
        vec3 map = texture(relief, p).rgb;
        vec2 tilt = (map.rg * 255.0 - 128.0) / 127.0;
        // the finer grooves of the drawing itself, read from its shading
        vec2 e = vec2(1.0 / 450.0, 1.0 / 150.0);
        vec2 groove = vec2(lum(p + vec2(e.x, 0.0), 1.5) - lum(p - vec2(e.x, 0.0), 1.5),
                           lum(p + vec2(0.0, e.y), 1.5) - lum(p - vec2(0.0, e.y), 1.5));

        float d = p.x - front + (p.y - 0.5) * 0.09;
        float melt = exp(-d * d / 0.0128);                  // how molten the metal is here
        vec2 w = p * vec2(3.0, 1.0);                        // square units
        vec3 n1 = noise(w * 6.5 + vec2(-time * 0.9, time * 0.35));
        vec3 n2 = noise(w * 11.0 + n1.yz * 0.35 + vec2(time * 0.55, -time * 0.8));
        vec2 wave = n1.yz * 0.26 + n2.yz * 0.13;
        vec2 slope = tilt * 0.92 - groove * 0.85 + wave * melt * (0.35 + 0.65 * map.b);
        slope *= min(1.0, 0.97 / max(length(slope), 1e-4));
        vec3 n = vec3(slope, sqrt(1.0 - dot(slope, slope)));
        vec3 r = reflect(vec3(0.0, 0.0, -1.0), n);

        // the reflections, split very slightly into their colours, as on polished metal under a hard light
        float slide = d * 2.6 + (n1.x - 0.5) * 0.3 * melt;
        vec3 chrome = vec3(studio(r, slide - 0.008).r, studio(r, slide).g, studio(r, slide + 0.008).b);
        // the key light travels with the pass
        vec3 key = normalize(vec3(clamp(-d * 5.0, -0.9, 0.9), -0.45, 0.62));
        float facing = max(dot(n, normalize(key + vec3(0.0, 0.0, 1.0))), 0.0);
        chrome += vec3(1.0, 0.97, 0.92) * (pow(facing, 160.0) * 2.4 + pow(facing, 22.0) * 0.34) * (0.35 + 0.65 * melt);
        chrome += vec3(1.0, 0.86, 0.62) * pow(1.0 - n.z, 3.0) * 0.55;                    // the champagne rim

        // keep the drawing's own light and shade underneath, then compress the highlights like film
        float drawn = lum(p + wave * melt * 0.004, 0.6);
        chrome *= 0.62 + 0.95 * drawn;
        chrome += vec3(1.0, 0.95, 0.86) * exp(-d * d / 0.0011) * (0.12 + 0.5 * drawn);   // the white heart of the pass
        chrome = 1.0 - exp(-chrome * 1.75);

        float a = metal * strength * smoothstep(0.015, 0.75, melt);
        colour = vec4(chrome * a, a);
      }`;
    const VERTEX = `#version 300 es
      out vec2 box;
      void main() {
        vec2 c = vec2(gl_VertexID & 1, gl_VertexID >> 1);
        box = vec2(c.x, 1.0 - c.y);
        gl_Position = vec4(c * 2.0 - 1.0, 0.0, 1.0);
      }`;

    const program = gl.createProgram();
    for (const [type, source] of [[gl.VERTEX_SHADER, VERTEX], [gl.FRAGMENT_SHADER, FRAGMENT]]) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      gl.attachShader(program, shader);
    }
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);
    try {
      images.forEach((image, unit) => {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      });
    } catch {
      return; // opened from a file: the browser keeps the pixels to itself
    }
    ['art', 'cut', 'relief'].forEach((name, unit) => gl.uniform1i(gl.getUniformLocation(program, name), unit));
    const [uFit, uFront, uStrength, uTime] = ['fit', 'front', 'strength', 'time'].map((n) => gl.getUniformLocation(program, n));

    canvas.className = 'hero__liquid';
    canvas.setAttribute('aria-hidden', 'true');
    sheen.before(canvas);
    win.classList.add('has-liquid');

    // the light's way across, as in --pass (styles.css): it crosses during the first CROSSING of each cycle and brakes
    // halfway. Between NEAR and FAR of that way it is on the letters, and sweeps the matching stretch of artwork.
    const BRAKE = [0, 0.19, 0.32, 0.395, 0.45, 0.5, 0.55, 0.605, 0.68, 0.81, 1];
    const CROSSING = 0.4;
    const NEAR = 0.2;
    const FAR = 0.8;
    const way = (u) => {
      const x = Math.min(u, 1) * (BRAKE.length - 1);
      const i = Math.min(Math.floor(x), BRAKE.length - 2);
      return BRAKE[i] + (BRAKE[i + 1] - BRAKE[i]) * (x - i);
    };
    let visible = true;
    let lit = false;
    let frame = 0;
    const draw = () => {
      frame = visible ? requestAnimationFrame(draw) : 0;
      const { delay, duration } = clock.effect.getTiming();
      const t = (clock.currentTime ?? 0) - delay;
      const at = t < 0 ? 0 : (t % duration) / duration;
      const along = way(at / CROSSING);
      if (along < NEAR || along > FAR) {
        if (lit) gl.clear(gl.COLOR_BUFFER_BIT);
        lit = false;
        return;
      }
      const ratio = Math.min(devicePixelRatio || 1, 2) * 1.13; // 1.13: the scale the artwork is shown at
      const w = Math.round(win.clientWidth * ratio);
      const h = Math.round(win.clientHeight * ratio);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uFit, Math.min(w / h / 3, 1), Math.min((3 * h) / w, 1));
      const done = (along - NEAR) / (FAR - NEAR);
      gl.uniform1f(uFront, 0.16 + done * 0.68);
      gl.uniform1f(uStrength, Math.min(1, done / 0.16, (1 - done) / 0.16));
      gl.uniform1f(uTime, t / 1000);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      lit = true;
    };
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !frame) frame = requestAnimationFrame(draw);
    }).observe(win);
    canvas.addEventListener('webglcontextlost', () => {
      cancelAnimationFrame(frame);
      canvas.remove();
      win.classList.remove('has-liquid'); // back to the CSS sheen
    });
  }
})();
