/* ==========================================================================
   LOGPAH — main.js
   GSAP + ScrollTrigger driven motion for the whole site.
   Rich animations: parallax, custom cursor, text splits, clip reveals,
   scrub-based section animations, floating particles, magnetic buttons.
   Loaded on every page after the GSAP CDN scripts.
   ========================================================================== */

(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(hover: none)").matches || "ontouchstart" in window;

  // Resolves the moment the curtain actually starts sliding away (dispatched
  // from initCurtain), or immediately if there's no curtain / motion is
  // reduced. The hero entrance and hero laurel-ring key off this instead of
  // a guessed fixed delay, so they stay in sync even when the curtain's own
  // wait stretches out on a slow connection.
  const curtainExit = new Promise((resolve) => {
    const curtain = document.querySelector(".curtain");
    if (!curtain || reduceMotion || !window.gsap) {
      resolve();
      return;
    }
    document.addEventListener("logpah:curtain-exit", () => resolve(), { once: true });
    setTimeout(resolve, 4200); // safety net if the event never fires
  });

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  document.addEventListener("DOMContentLoaded", () => {
    footerYear();
    duplicateMarquee();
    initImageSkeletons();
    initMasonryGrid();
    initCurtain();
    initHeaderScroll();
    initNavToggle();
    initHeroEntrance();
    initLaurelDraw();
    initReveals();
    initCounters();
    initGallery();
    initLightbox();

    // New creative animations
    initCustomCursor();
    initHeroParallax();
    initParticles();
    initSplitTextReveals();
    initImageClipReveals();
    initPillarFanOut();
    initMarqueeVelocity();
    initMagneticButtons();
    initFooterEntrance();
    initDecadePanelParallax();
    initTileGridAnimations();
    initMemberCardsReveal();
  });

  /* =====================================================================
     EXISTING CORE FUNCTIONS (preserved & enhanced)
     ===================================================================== */

  /* ---------------- Image loading skeletons ----------------
     Every content image gets a branded shimmer placeholder (matching
     the section it's in) until it actually finishes decoding, then a
     short blur-to-sharp resolve. On a fast connection this is
     invisible — images are already .complete by the time this runs.
     On a slow one, visitors always see an intentional loading state
     instead of a blank box or a broken-image icon. */
  function initImageSkeletons() {
    const imgs = document.querySelectorAll("img:not(.brand__mark)");
    if (!imgs.length) return;

    imgs.forEach((img) => {
      img.classList.add("img-fade");

      if (img.complete && img.naturalWidth > 0) {
        img.classList.add("img-loaded");
        return;
      }

      img.classList.add("img-skel");

      const settle = (loaded) => {
        img.classList.remove("img-skel");
        if (loaded) img.classList.add("img-loaded");
      };

      img.addEventListener("load", () => settle(true), { once: true });
      img.addEventListener("error", () => settle(false), { once: true });
    });
  }


  function footerYear() {
    document.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ---------------- Marquee: duplicate content for seamless loop ---------------- */
  function duplicateMarquee() {
    document.querySelectorAll(".marquee__track").forEach((track) => {
      track.innerHTML += track.innerHTML;
    });
  }

  /* ---------------- Curtain preloader ----------------
     This used to be a fixed-length animation that played on a timer
     regardless of whether anything had actually loaded — fine on a
     fast connection, but on a slow one the curtain would open onto
     half-loaded images. It now waits on real signals:
       - document fonts ready (avoids a flash of fallback serif)
       - the hero's critical image, if one exists on this page
     ...bounded by a minimum (so it never feels like a flicker) and a
     maximum (so a stalled request can never trap someone behind it). */
  function initCurtain() {
    const curtain = document.querySelector(".curtain");
    if (!curtain) return;

    if (reduceMotion || !window.gsap) {
      curtain.remove();
      return;
    }

    const MIN_DISPLAY = 900; // ms — keeps the brand moment from flashing
    const MAX_WAIT = 3200; // ms — hard ceiling so slow connections aren't stuck
    const WAITING_LABEL_AT = 1800; // ms — show a "still working" pulse past this point

    const mark = curtain.querySelector(".curtain__mark");
    const start = performance.now();

    const heroImg = document.querySelector(
      ".hero .laurel-frame__photo img, .hero__visual img"
    );

    const fontsReady = document.fonts && document.fonts.ready
      ? document.fonts.ready.catch(() => {})
      : Promise.resolve();

    const heroReady = new Promise((resolve) => {
      if (!heroImg || (heroImg.complete && heroImg.naturalWidth > 0)) {
        resolve();
        return;
      }
      heroImg.addEventListener("load", resolve, { once: true });
      heroImg.addEventListener("error", resolve, { once: true });
    });

    const waitingTimer = setTimeout(() => {
      mark && mark.classList.add("is-waiting");
    }, WAITING_LABEL_AT);

    const readySignal = Promise.race([
      Promise.all([fontsReady, heroReady]),
      new Promise((resolve) => setTimeout(resolve, MAX_WAIT)),
    ]);

    readySignal.then(() => {
      clearTimeout(waitingTimer);
      const elapsed = performance.now() - start;
      const remaining = Math.max(0, MIN_DISPLAY - elapsed);
      setTimeout(playCurtainExit, remaining);
    });

    function playCurtainExit() {
      document.dispatchEvent(new CustomEvent("logpah:curtain-exit"));
      const panels = curtain.querySelectorAll(".curtain__panel");
      const tl = gsap.timeline({
        defaults: { ease: "power4.inOut" },
        onComplete: () => curtain.remove(),
      });
      tl.to(mark, { opacity: 0, duration: 0.35 })
        .to(panels[0], { xPercent: -100, duration: 0.9 }, "-=0.05")
        .to(panels[1], { xPercent: 100, duration: 0.9 }, "<");
    }
  }

  /* ---------------- Header shrink on scroll ---------------- */
  function initHeaderScroll() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------------- Mobile nav toggle ---------------- */
  function initNavToggle() {
    const toggle = document.querySelector(".nav-toggle");
    const links = document.querySelector(".main-nav__links");
    if (!toggle || !links) return;

    const items = links.querySelectorAll("li");
    const mq = window.matchMedia("(max-width: 980px)");
    let isOpen = false;
    let animating = false;

    // Only the mobile panel gets primed with GSAP inline styles — on desktop
    // the nav stays a plain visible flex row, untouched.
    const primeForMobile = () => {
      if (!window.gsap) return;
      gsap.set(links, {
        autoAlpha: 0,
        y: -18,
        scaleY: 0.9,
        transformOrigin: "top center",
      });
      gsap.set(items, { autoAlpha: 0, y: -10 });
    };

    const resetForDesktop = () => {
      isOpen = false;
      links.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
      if (window.gsap) {
        gsap.set(links, { clearProps: "all" });
        gsap.set(items, { clearProps: "all" });
      }
    };

    if (mq.matches) primeForMobile();
    if (mq.addEventListener) {
      mq.addEventListener("change", (e) => {
        e.matches ? primeForMobile() : resetForDesktop();
      });
    }

    const openMenu = () => {
      toggle.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";

      if (!window.gsap) {
        links.classList.add("is-open");
        return;
      }
      animating = true;
      links.classList.add("is-open");
      const tl = gsap.timeline({ onComplete: () => (animating = false) });
      tl.to(links, {
        autoAlpha: 1,
        y: 0,
        scaleY: 1,
        duration: 0.6,
        ease: "back.out(1.7)",
      }).to(
        items,
        { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.06, ease: "power2.out" },
        "-=0.32"
      );
    };

    const closeMenu = () => {
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";

      if (!window.gsap) {
        links.classList.remove("is-open");
        return;
      }
      animating = true;
      gsap.to(items, { autoAlpha: 0, y: -8, duration: 0.18, ease: "power1.in" });
      gsap.to(links, {
        autoAlpha: 0,
        y: -18,
        scaleY: 0.9,
        duration: 0.35,
        ease: "power2.in",
        delay: 0.05,
        onComplete: () => {
          links.classList.remove("is-open");
          animating = false;
        },
      });
    };

    toggle.addEventListener("click", () => {
      if (!mq.matches || animating) return;
      isOpen = !isOpen;
      isOpen ? openMenu() : closeMenu();
    });

    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        if (mq.matches && isOpen) {
          isOpen = false;
          closeMenu();
        }
      })
    );

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && isOpen) {
        isOpen = false;
        closeMenu();
      }
    });
  }

  /* ---------------- Hero entrance timeline ---------------- */
  function initHeroEntrance() {
    const hero = document.querySelector(".hero, .page-hero");
    if (!hero || !window.gsap) return;

    const targets = {
      eyebrow: hero.querySelector(".hero__eyebrow, .eyebrow"),
      title: hero.querySelector(".hero__title, h1"),
      lede: hero.querySelector(".hero__lede, .page-hero p"),
      actions: hero.querySelector(".hero__actions"),
      stats: hero.querySelectorAll(".hero__stat"),
      visual: hero.querySelector(".hero__visual"),
    };

    // Below 980px the CSS reorders .hero__visual above the copy block
    // (see .hero__visual{ order:-1 } in the responsive styles), so the
    // reveal sequence needs to match — visual first, then copy — or the
    // portrait appears to "pop in" last even though it's the first thing
    // on screen.
    const isStackedLayout = window.matchMedia("(max-width: 980px)").matches;

    const tl = gsap.timeline({
      paused: true,
      defaults: { ease: "power3.out", duration: 1 },
    });

    if (isStackedLayout && targets.visual) {
      tl.from(targets.visual, {
        scale: 0.9,
        opacity: 0,
        duration: 1.1,
        ease: "power4.out",
      });
      if (targets.eyebrow) tl.from(targets.eyebrow, { y: 18, opacity: 0 }, "-=0.5");
      if (targets.title)
        tl.from(targets.title, { y: 34, opacity: 0, duration: 1.1 }, "-=0.65");
      if (targets.lede) tl.from(targets.lede, { y: 24, opacity: 0 }, "-=0.7");
      if (targets.actions)
        tl.from(targets.actions, { y: 20, opacity: 0 }, "-=0.7");
      if (targets.stats && targets.stats.length)
        tl.from(targets.stats, { y: 16, opacity: 0, stagger: 0.12 }, "-=0.6");
    } else {
      if (targets.eyebrow) tl.from(targets.eyebrow, { y: 18, opacity: 0 });
      if (targets.title)
        tl.from(targets.title, { y: 34, opacity: 0, duration: 1.1 }, "-=0.65");
      if (targets.lede) tl.from(targets.lede, { y: 24, opacity: 0 }, "-=0.7");
      if (targets.actions)
        tl.from(targets.actions, { y: 20, opacity: 0 }, "-=0.7");
      if (targets.stats && targets.stats.length)
        tl.from(targets.stats, { y: 16, opacity: 0, stagger: 0.12 }, "-=0.6");
      if (targets.visual)
        tl.from(
          targets.visual,
          { scale: 0.9, opacity: 0, duration: 1.2, ease: "power4.out" },
          "-=1"
        );
    }

    // Play as soon as the curtain clears (or immediately if reduced motion
    // resolved that promise instantly) — never on a fixed guessed delay.
    curtainExit.then(() => tl.play());
  }

  /* ---------------- Laurel ring draw ---------------- */
  function initLaurelDraw() {
    const paths = document.querySelectorAll(".laurel-path");
    if (!paths.length) return;

    if (!window.gsap || reduceMotion) {
      paths.forEach((p) => (p.style.strokeDashoffset = "0"));
      return;
    }

    paths.forEach((path) => {
      const length = path.getTotalLength ? path.getTotalLength() : 900;
      gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

      const runDraw = () => {
        gsap.to(path, {
          strokeDashoffset: 0,
          duration: 1.8,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: path.closest(".laurel-frame, .hero__visual") || path,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      };

      // The hero's laurel ring is above the fold and hidden behind the
      // curtain, so it should wait for the same exit signal as the rest of
      // the hero. Laurel rings elsewhere on the page (e.g. a leadership
      // portrait further down) are below the fold anyway, so they just use
      // their normal scroll trigger with no artificial delay.
      if (path.closest(".hero")) {
        curtainExit.then(runDraw);
      } else {
        runDraw();
      }
    });
  }

  /* ---------------- Generic scroll reveals (enhanced with directions) ---------------- */
  function initReveals() {
    const items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    if (!window.gsap || !window.ScrollTrigger) {
      document.body.classList.add("reveal-ready");
      items.forEach((el) => {
        el.style.opacity = 1;
        el.style.transform = "none";
      });
      return;
    }

    if (reduceMotion) {
      items.forEach((el) => {
        el.style.opacity = 1;
        el.style.transform = "none";
      });
      return;
    }

    ScrollTrigger.batch(items, {
      start: "top 94%",
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          overwrite: true,
        }),
      onLeaveBack: (batch) =>
        gsap.set(batch, {
          opacity: 0,
          y: 30,
          overwrite: true,
        }),
    });
  }

  /* ---------------- Animated counters ---------------- */
  function initCounters() {
    const counters = document.querySelectorAll("[data-counter]");
    if (!counters.length) return;

    counters.forEach((el) => {
      const target = parseFloat(el.dataset.counter);
      const suffix = el.dataset.suffix || "";

      const run = () => {
        if (!window.gsap) {
          el.textContent = target + suffix;
          return;
        }
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = Math.round(obj.val) + suffix;
          },
        });
      };

      if (window.ScrollTrigger) {
        ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          onEnter: run,
          onLeaveBack: () => { el.textContent = "0" + suffix; }
        });
      } else {
        run();
      }
    });
  }

  /* ---------------- Masonry grid (gallery.html) ----------------
     .masonry is a CSS Grid with a tiny grid-auto-rows (8px). Each tile's
     grid-row-end: span is set here to exactly match its image's natural
     rendered height, so wide landscape shots stay short and portraits
     stay tall — nothing gets cropped to a uniform box. Recomputes on
     image load (since most tiles use loading="lazy") and on resize. */
  function initMasonryGrid() {
    const grid = document.querySelector(".masonry");
    if (!grid) return;

    const ROW = 8; // must match grid-auto-rows in CSS
    let gap = 19.2; // fallback ~1.2rem, corrected below once measurable

    const readGap = () => {
      const g = parseFloat(getComputedStyle(grid).rowGap);
      if (!isNaN(g)) gap = g;
    };

    const setSpan = (item) => {
      const img = item.querySelector("img");
      if (!img) return;
      const h = img.getBoundingClientRect().height;
      if (!h) return;
      const span = Math.ceil((h + gap) / (ROW + gap));
      item.style.setProperty("--span", span);
    };

    const layoutAll = () => {
      readGap();
      grid.querySelectorAll(".masonry__item").forEach(setSpan);
    };

    grid.querySelectorAll("img").forEach((img) => {
      if (img.complete && img.naturalWidth > 0) return;
      img.addEventListener(
        "load",
        () => setSpan(img.closest(".masonry__item")),
        { once: true }
      );
    });

    layoutAll();
    window.addEventListener("load", layoutAll);

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(layoutAll, 150);
    });
  }

  /* ---------------- Gallery filter (gallery.html) ---------------- */
  function initGallery() {
    const chips = document.querySelectorAll(".filter-chip");
    const items = document.querySelectorAll(".masonry__item");
    if (!chips.length || !items.length) return;

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        chips.forEach((c) => c.classList.remove("is-active"));
        chip.classList.add("is-active");
        const filter = chip.dataset.filter;

        items.forEach((item) => {
          const match = filter === "all" || item.dataset.category === filter;
          if (window.gsap) {
            gsap.to(item, {
              opacity: match ? 1 : 0,
              scale: match ? 1 : 0.92,
              duration: 0.4,
              onStart: () => {
                if (match) item.style.display = "";
              },
              onComplete: () => {
                if (!match) item.style.display = "none";
              },
            });
          } else {
            item.style.display = match ? "" : "none";
          }
        });
      });
    });
  }

  /* ---------------- Lightbox ---------------- */
  function initLightbox() {
    const triggers = document.querySelectorAll("[data-lightbox]");
    const lightbox = document.querySelector(".lightbox");
    if (!triggers.length || !lightbox) return;

    const img = lightbox.querySelector("img");
    const cap = lightbox.querySelector(".lightbox__cap");
    const closeBtn = lightbox.querySelector(".lightbox__close");

    const open = (src, caption) => {
      img.src = src;
      cap.textContent = caption || "";
      lightbox.classList.add("is-open");
      document.body.style.overflow = "hidden";
    };
    const close = () => {
      lightbox.classList.remove("is-open");
      document.body.style.overflow = "";
    };

    triggers.forEach((t) => {
      t.addEventListener("click", () => {
        const fullImg = t.querySelector("img");
        open(fullImg.currentSrc || fullImg.src, t.dataset.caption);
      });
    });

    closeBtn.addEventListener("click", close);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  /* =====================================================================
     NEW CREATIVE ANIMATION SYSTEMS
     ===================================================================== */

  /* ================ 1. Custom Magnetic Cursor ================ */
  function initCustomCursor() {
    if (isTouch || reduceMotion || !window.gsap) return;

    const dot = document.createElement("div");
    dot.classList.add("cursor-dot");
    document.body.appendChild(dot);

    const xTo = gsap.quickTo(dot, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.35, ease: "power3.out" });

    // Show cursor after first move (avoid flash at 0,0)
    let shown = false;
    window.addEventListener("mousemove", (e) => {
      if (!shown) {
        dot.classList.add("is-visible");
        shown = true;
      }
      xTo(e.clientX);
      yTo(e.clientY);
    }, { passive: true });

    // Scale up on interactive elements
    const hoverTargets = "a, button, [data-magnetic], .tile, .masonry__item, .pillar-card, input, textarea, select";
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(hoverTargets)) {
        dot.classList.add("is-active");
      }
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(hoverTargets)) {
        dot.classList.remove("is-active");
      }
    });

    // Hide when cursor leaves window
    document.addEventListener("mouseleave", () => {
      dot.classList.remove("is-visible");
      shown = false;
    });
    document.addEventListener("mouseenter", () => {
      dot.classList.add("is-visible");
      shown = true;
    });
  }

  /* ================ 2. Hero Parallax Depth ================ */
  function initHeroParallax() {
    const hero = document.querySelector(".hero");
    if (!hero || !window.gsap || !window.ScrollTrigger || reduceMotion) return;

    const copy = hero.querySelector(".hero__copy");
    const visual = hero.querySelector(".hero__visual");
    const badge = hero.querySelector(".badge-10");
    const grid = hero.querySelector("::before") ? hero : null;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: 0.8,
      },
    });

    if (copy) {
      tl.to(copy, { y: -60, opacity: 0.3, ease: "none" }, 0);
    }
    if (visual) {
      tl.to(visual, { y: 40, scale: 0.92, ease: "none" }, 0);
    }
    if (badge) {
      tl.to(badge, { rotation: 90, ease: "none" }, 0);
    }

    // Also parallax the ::before grid by moving the whole hero bg slightly
    tl.to(hero, { backgroundPositionY: "30%", ease: "none" }, 0);
  }

  /* ================ 3. Floating Particles ================ */
  function initParticles() {
    if (reduceMotion || !window.gsap) return;

    const containers = document.querySelectorAll(".hero, .section--dark");
    if (!containers.length) return;

    containers.forEach((container) => {
      // Ensure container is position:relative for absolute children
      const cs = getComputedStyle(container);
      if (cs.position === "static") {
        container.style.position = "relative";
      }

      const count = container.classList.contains("hero") ? 18 : 10;

      for (let i = 0; i < count; i++) {
        const p = document.createElement("div");
        const sizeClass = i % 3 === 0 ? "particle--lg" : i % 3 === 1 ? "particle--sm" : "";
        p.className = `particle ${sizeClass}`;
        p.style.left = `${Math.random() * 100}%`;
        p.style.top = `${Math.random() * 100}%`;
        container.appendChild(p);

        // Animate each particle with a random floating motion
        const dur = 4 + Math.random() * 6;
        const delay = Math.random() * 3;
        gsap.to(p, {
          opacity: 0.15 + Math.random() * 0.25,
          duration: 1.5,
          delay: delay,
          ease: "power2.inOut",
        });
        gsap.to(p, {
          y: -30 - Math.random() * 60,
          x: -20 + Math.random() * 40,
          duration: dur,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: delay,
        });
        // Subtle pulsing
        gsap.to(p, {
          opacity: 0.05,
          duration: 2 + Math.random() * 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: delay + 1,
        });
      }
    });
  }

  /* ================ 4. Split Text Reveals ================ */
  function initSplitTextReveals() {
    if (!window.gsap || !window.ScrollTrigger || reduceMotion) return;

    function wrapWords(node) {
      if (node.nodeType === 3) {
        const text = node.nodeValue;
        if (!text.trim()) return null;
        const words = text.split(/(\s+)/);
        const frag = document.createDocumentFragment();
        words.forEach((word) => {
          if (/^\s+$/.test(word)) {
            frag.appendChild(document.createTextNode(word));
          } else if (word.length > 0) {
            const wrapper = document.createElement("span");
            wrapper.className = "word-wrap";
            const inner = document.createElement("span");
            inner.className = "word";
            inner.textContent = word;
            wrapper.appendChild(inner);
            frag.appendChild(wrapper);
          }
        });
        return frag;
      } else if (node.nodeType === 1) {
        Array.from(node.childNodes).forEach((child) => {
          const replacement = wrapWords(child);
          if (replacement) {
            node.replaceChild(replacement, child);
          }
        });
        return null;
      }
    }

    const targets = document.querySelectorAll(
      ".section-head h2, .split h2, .decade-panel h2, .leader__quote, .page-hero h1"
    );
    if (!targets.length) return;

    targets.forEach((el) => {
      if (el.dataset.splitDone) return;
      el.dataset.splitDone = "true";

      wrapWords(el);

      const wordEls = el.querySelectorAll(".word");
      if (!wordEls.length) return;

      gsap.set(wordEls, { y: "100%", opacity: 0 });

      gsap.to(wordEls, {
        y: "0%",
        opacity: 1,
        duration: 0.7,
        stagger: 0.04,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });
    });
  }

  /* ================ 5. Image Clip Reveals ================ */
  function initImageClipReveals() {
    if (!window.gsap || !window.ScrollTrigger || reduceMotion) return;

    // Split media images — wipe from left
    const splitImages = document.querySelectorAll(".split__media img");
    splitImages.forEach((img, i) => {
      const fromRight = i % 2 === 1;
      gsap.set(img, {
        clipPath: fromRight ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)",
      });

      gsap.to(img, {
        clipPath: "inset(0 0% 0 0%)",
        duration: 1.2,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: img,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    });

    // Decade panel frame — wipe from bottom
    const decadeFrame = document.querySelector(".decade-panel__frame");
    if (decadeFrame) {
      gsap.set(decadeFrame, { clipPath: "inset(100% 0 0 0)" });
      gsap.to(decadeFrame, {
        clipPath: "inset(0% 0 0 0)",
        duration: 1.0,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: decadeFrame,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    }

    // Leader media — wipe from left
    const leaderMedia = document.querySelector(".leader__media img");
    if (leaderMedia) {
      gsap.set(leaderMedia, { clipPath: "inset(0 100% 0 0)" });
      gsap.to(leaderMedia, {
        clipPath: "inset(0 0% 0 0%)",
        duration: 1.2,
        ease: "power3.inOut",
        scrollTrigger: {
          trigger: leaderMedia,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    }
  }

  /* ================ 6. Pillar Cards Fan-Out ================ */
  function initPillarFanOut() {
    if (!window.gsap || !window.ScrollTrigger || reduceMotion) return;

    const cards = document.querySelectorAll(".pillar-card");
    if (!cards.length) return;

    cards.forEach((card, i) => {
      gsap.set(card, {
        opacity: 0,
        y: 50,
        rotationX: 12,
        scale: 0.92,
        transformOrigin: "center bottom",
      });

      gsap.to(card, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        delay: i * 0.1,
        scrollTrigger: {
          trigger: card.closest(".pillars") || card,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      });
    });

    // Continuous subtle float on hover
    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        gsap.to(card, {
          y: -8,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          y: 0,
          duration: 0.5,
          ease: "power2.inOut",
          overwrite: "auto",
        });
      });
    });
  }

  /* ================ 7. Marquee Velocity Link ================ */
  function initMarqueeVelocity() {
    if (!window.gsap || !window.ScrollTrigger || reduceMotion) return;

    const track = document.querySelector(".marquee__track");
    if (!track) return;

    // Speed up marquee animation when scrolling fast
    let currentSpeed = 1;
    const targetSpeed = { val: 1 };

    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const vel = Math.abs(self.getVelocity()) / 1000;
        const newSpeed = Math.max(1, Math.min(vel, 5));
        gsap.to(targetSpeed, {
          val: newSpeed,
          duration: 0.5,
          overwrite: true,
          onUpdate: () => {
            track.style.animationDuration = `${34 / targetSpeed.val}s`;
          },
        });
      },
    });

    // Also add a subtle skew when scrolling
    ScrollTrigger.create({
      trigger: ".marquee",
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const vel = self.getVelocity() / 3000;
        const skew = Math.max(-3, Math.min(vel, 3));
        gsap.to(track, {
          skewX: skew,
          duration: 0.3,
          overwrite: true,
        });
      },
    });
  }

  /* ================ 8. Magnetic Buttons ================ */
  function initMagneticButtons() {
    if (isTouch || reduceMotion || !window.gsap) return;

    const magnets = document.querySelectorAll("[data-magnetic]");
    if (!magnets.length) return;

    magnets.forEach((btn) => {
      const strength = parseFloat(btn.dataset.magnetic) || 0.3;

      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btn, {
          x: x * strength,
          y: y * strength,
          duration: 0.4,
          ease: "power2.out",
          overwrite: true,
        });
      });

      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.4)",
          overwrite: true,
        });
      });
    });
  }

  /* ================ 9. Footer Stagger Entrance ================ */
  function initFooterEntrance() {
    if (!window.gsap || !window.ScrollTrigger || reduceMotion) return;

    const footer = document.querySelector(".site-footer");
    if (!footer) return;

    const cols = footer.querySelectorAll(".footer-brand, .footer-col");
    const socialLinks = footer.querySelectorAll(".footer-social a");
    const bottomText = footer.querySelector(".footer-bottom > span");

    if (cols.length) {
      gsap.set(cols, { opacity: 0, y: 30 });
      ScrollTrigger.create({
        trigger: footer,
        start: "top 92%",
        onEnter: () => {
          gsap.to(cols, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            overwrite: true,
          });
        },
        onLeaveBack: () => {
          gsap.set(cols, { opacity: 0, y: 30, overwrite: true });
        }
      });
    }

    if (socialLinks.length) {
      gsap.set(socialLinks, { opacity: 0, scale: 0, rotation: -45 });
      ScrollTrigger.create({
        trigger: footer.querySelector(".footer-bottom") || footer,
        start: "top 96%",
        onEnter: () => {
          gsap.to(socialLinks, {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.5,
            stagger: 0.08,
            ease: "back.out(2)",
            overwrite: true,
          });
        },
        onLeaveBack: () => {
          gsap.set(socialLinks, { opacity: 0, scale: 0, rotation: -45, overwrite: true });
        }
      });
    }

    if (bottomText) {
      gsap.set(bottomText, { opacity: 0, y: 12 });
      ScrollTrigger.create({
        trigger: bottomText,
        start: "top 98%",
        onEnter: () => {
          gsap.to(bottomText, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            overwrite: true,
          });
        },
        onLeaveBack: () => {
          gsap.set(bottomText, { opacity: 0, y: 12, overwrite: true });
        }
      });
    }
  }

  /* ================ 10. Decade Panel Parallax ================ */
  function initDecadePanelParallax() {
    if (!window.gsap || !window.ScrollTrigger || reduceMotion) return;

    const panel = document.querySelector(".decade-panel");
    if (!panel) return;

    const textSide = panel.querySelector(":scope > div:first-child");
    const imageSide = panel.querySelector(".decade-panel__frame");

    if (textSide && imageSide) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 0.6,
        },
      });

      tl.fromTo(textSide, { y: 30 }, { y: -20, ease: "none" }, 0);
      tl.fromTo(imageSide, { y: -20 }, { y: 30, ease: "none" }, 0);
    }
  }

  /* ================ 11. Tile Grid Staggered Animation ================ */
  function initTileGridAnimations() {
    if (!window.gsap || !window.ScrollTrigger || reduceMotion) return;

    const tiles = document.querySelectorAll(".tile-grid .tile");
    if (!tiles.length) return;

    gsap.set(tiles, { opacity: 0, scale: 0.85, y: 30 });

    ScrollTrigger.create({
      trigger: ".tile-grid",
      start: "top 88%",
      onEnter: () => {
        gsap.to(tiles, {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.7,
          stagger: {
            amount: 0.4,
            from: "start",
          },
          ease: "power3.out",
          overwrite: true,
        });
      },
      onLeaveBack: () => {
        gsap.set(tiles, { opacity: 0, scale: 0.85, y: 30, overwrite: true });
      }
    });

    // Continuous tilt effect on hover
    tiles.forEach((tile) => {
      tile.addEventListener("mousemove", (e) => {
        if (isTouch) return;
        const rect = tile.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(tile, {
          rotationY: x * 8,
          rotationX: -y * 8,
          transformPerspective: 600,
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
      });
      tile.addEventListener("mouseleave", () => {
        gsap.to(tile, {
          rotationY: 0,
          rotationX: 0,
          duration: 0.6,
          ease: "power2.inOut",
          overwrite: "auto",
        });
      });
    });
  }
  /* ================ 12. Member Cards Fan-In (members.html) ================ */
  function initMemberCardsReveal() {
    if (!window.gsap || !window.ScrollTrigger || reduceMotion) return;

    const cards = document.querySelectorAll(".member-card");
    if (!cards.length) return;

    cards.forEach((card, i) => {
      gsap.set(card, {
        opacity: 0,
        y: 40,
        rotationX: 10,
        scale: 0.94,
        transformOrigin: "center bottom",
      });

      gsap.to(card, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        scale: 1,
        duration: 0.75,
        ease: "power3.out",
        delay: (i % 6) * 0.08,
        scrollTrigger: {
          trigger: card.closest(".member-grid") || card,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      });
    });

    cards.forEach((card) => {
      card.addEventListener("mouseenter", () => {
        gsap.to(card, { y: -6, duration: 0.4, ease: "power2.out", overwrite: "auto" });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, { y: 0, duration: 0.5, ease: "power2.inOut", overwrite: "auto" });
      });
    });
  }
})();
