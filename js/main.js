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

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  document.addEventListener("DOMContentLoaded", () => {
    footerYear();
    duplicateMarquee();
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
  });

  /* =====================================================================
     EXISTING CORE FUNCTIONS (preserved & enhanced)
     ===================================================================== */

  /* ---------------- Footer year ---------------- */
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

  /* ---------------- Curtain preloader ---------------- */
  function initCurtain() {
    const curtain = document.querySelector(".curtain");
    if (!curtain) return;

    if (reduceMotion || !window.gsap) {
      curtain.remove();
      return;
    }

    const panels = curtain.querySelectorAll(".curtain__panel");
    const tl = gsap.timeline({
      defaults: { ease: "power4.inOut" },
      onComplete: () => curtain.remove(),
    });
    tl.to(curtain.querySelector(".curtain__mark"), {
      opacity: 0,
      duration: 0.35,
      delay: 0.25,
    })
      .to(
        panels[0],
        { xPercent: -100, duration: 0.9 },
        "-=0.05"
      )
      .to(
        panels[1],
        { xPercent: 100, duration: 0.9 },
        "<"
      );
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

    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
      if (isOpen) {
        links.style.display = "flex";
        links.style.flexDirection = "column";
        links.style.position = "fixed";
        links.style.top = "72px";
        links.style.left = "0";
        links.style.right = "0";
        links.style.padding = "1.5rem 2rem 2rem";
        links.style.background = "rgba(8,15,36,.97)";
        links.style.backdropFilter = "blur(14px)";
      } else {
        links.removeAttribute("style");
      }
    });

    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        links.classList.remove("is-open");
        links.removeAttribute("style");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
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

    const tl = gsap.timeline({
      delay: reduceMotion ? 0 : 1.05,
      defaults: { ease: "power3.out", duration: 1 },
    });

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
      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 1.8,
        ease: "power2.inOut",
        delay: 1.3,
        scrollTrigger: {
          trigger: path.closest(".laurel-frame, .hero__visual") || path,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
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
})();
