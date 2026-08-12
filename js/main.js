/* ==========================================================================
   LOGPAH — main.js
   GSAP + ScrollTrigger driven motion for the whole site.
   Loaded on every page after the GSAP CDN scripts.
   ========================================================================== */

(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
  });

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
          once: true,
        },
      });
    });
  }

  /* ---------------- Generic scroll reveals ---------------- */
  function initReveals() {
    document.body.classList.add("reveal-ready");
    const items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    if (!window.gsap || !window.ScrollTrigger) {
      items.forEach((el) => {
        el.style.opacity = 1;
        el.style.transform = "none";
      });
      return;
    }

    ScrollTrigger.batch(items, {
      start: "top 88%",
      onEnter: (batch) =>
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          overwrite: true,
        }),
      once: true,
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
          once: true,
          onEnter: run,
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
})();
