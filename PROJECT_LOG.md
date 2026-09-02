# LOGPAH Website — Project Log

**Client:** Ladies Of Greater Plans And Hope Foundation (LOGPAH)
**Founded:** August 2016, Lagos, Nigeria
**Site theme:** "A Decade of Elegance and Excellence" — 10th anniversary framing, targeting 2026
**Stack:** Static HTML/CSS/JS, no build step, no framework. GSAP 3.12.5 + ScrollTrigger via CDN.

> Read this file first in any new session before making changes. It tracks what's
> real content vs. placeholder, what's been decided and why, and what's still queued.

---

## 1. File structure

```
logpah-website/
├── index.html          Home
├── our-story.html       About Us + Milestones timeline + Leadership + EXCO
├── members.html          Founder spotlight + Executive Council grid
├── gallery.html          Masonry gallery + Gbagada Hospital feature + albums-coming-soon
├── get-involved.html   Ways to help + contact form
├── css/style.css        ~1300 lines, all styling, design tokens at top
├── js/main.js             ~1000 lines, all interactivity (see §4)
└── images/                 10 real photos pulled from the client's Facebook page
```

No build tools. Drop into any static host or open `index.html` directly.

---

## 2. Design system (css/style.css, top of file)

- **Colors:** navy (`--navy-950/900/800/700`), royal blue (`--blue-600`), gold
  (`--gold-700→200`), cream (`--cream-50/100/200`), ink (`--ink-900/700/500`).
- **Fonts:** Fraunces (display/serif, headings) + Manrope (body/UI). Loaded via
  Google Fonts `@import` at the top of style.css.
- **Signature motif:** the "laurel-ring" — an SVG wreath frame (two mirrored
  bezier paths + leaf ellipses) that draws itself on scroll around portrait
  photos. Used in: hero (index.html), leader feature (our-story.html, members.html).
- **Motion:** GSAP timelines everywhere, curtain preloader on every page,
  ScrollTrigger.batch for generic `[data-reveal]` fade-ups, plus bespoke
  entrances for pillars, tiles, member cards, gallery masonry.

---

## 3. Content status by page — READ THIS BEFORE EDITING COPY

### index.html (Home) — ✅ real content
- Hero lede = trimmed real welcome message.
- "Mission & Vision" section = real Mission Statement, Vision Statement, "Our
  Statement" (all verbatim from client doc).
- "What We Stand For" = the real 7 core values (Compassion, Service, Unity,
  Empowerment, Integrity, Love, Community Impact), replacing an earlier
  **guessed** 5-pillar list (Empowerment/Self Discovery/Motherless
  Care/Less-Privileged/Marital Wellness) that was inferred from a
  partially-cropped event banner — that guess is now fully retired.
- Marquee strip updated to the real 7 values.
- Founding year corrected sitewide: was placeholder "Est. 2015", now "Est. 2016"
  (confirmed in client doc — founded August 2016).
- ⏳ Still placeholder: the "2 big landscape team photos" the client mentioned
  for below the mission section — not yet supplied, hero currently reuses
  `images/founder-portrait.jpg` and `images/outreach-girls.jpg`.

### our-story.html — ✅ real content
- "Who We Are" + "Our Beginning" = verbatim from client doc.
- "Our Work & Achievements" = real 6-card grid (Caring for Children, Supporting
  the Elderly, Feeding the Destitute, Supporting Education, Pad a Girl Child,
  Widows & Single Mothers) — all real locations/institutions named.
- "Our Milestones" timeline = real 9-entry timeline built from the client's
  full milestones narrative (2016 founding → Journey Continues). This
  **replaced** an earlier generic/invented 4-phase timeline ("The Beginning /
  Finding Our Voice / Growing the Sisterhood / A Decade of Distinction") that
  had no factual basis — fully retired now.
- "Our Vision for the Future" callout = verbatim closing lines from client doc.
- ⏳ Leadership feature block still has placeholder `[Founder Name]` /
  generic bio — client hasn't confirmed founder's name yet. Search for
  `EDIT:` comment near `.leader__quote`.
- ⏳ EXCO strip (3 photos) still uses generic existing stock photos
  (exco-collage.jpg, womens-day-group.jpg, celebration-cake.jpg) — fine as
  placeholders, not tied to specific real captions yet.

### members.html — ⏳ mostly placeholder (built before the content doc existed)
- Founder spotlight uses `[Founder Name]` placeholder, same gap as above.
- Executive Council grid: 1 real photo (member-portrait.jpg) + 5 dashed-border
  "photo pending" placeholder cards with `[Member Name]` / `[Role Title]`
  bracket text. See `<!-- EDIT -->` comment above the grid for how to
  duplicate a card.
- Not yet updated to reflect anything from the new content doc — revisit once
  the client sends actual EXCO names/photos.

### gallery.html — 🟡 partially real, structure built for what's pending
- Existing masonry grid (9 tiles) = original stock photos from the Facebook
  scrape, categorized Outreach/Events & Fellowship/Team & Leadership. Not
  tied to the specific named events in the new doc.
- NEW: "A Notable Encounter — Community Health Outreach & Engagement" section
  (Gbagada General Hospital + Honourable Commissioner for Health story) — full
  real narrative text is in, plus 6 dashed "Photo Pending" placeholder tiles
  (3 for the outreach itself, 3 for the Commissioner's-office follow-up
  visit), each pre-labeled with the exact caption text the client provided.
  Look for `<!-- EDIT -->` comments in this section for exact swap
  instructions — this is the highest-priority section to finish once photos
  arrive, since the copy is already final.
- NEW: "Albums Coming Soon" — a simple card list flagging the 8 albums the
  client mentioned but hasn't sent photos for yet: 8th/5th/1st Anniversary,
  Elderly Home Visits, Empowerment Programmes, Feeding the Destitute (Ketu),
  Ayangburen hygiene session, Red Cross Motherless Home visit. Each is
  currently just a label card — **not yet built out as real album sections**.
  When photos arrive for one, build it as either a `.masonry` grid (matching
  the existing gallery) or a smaller `.album-grid` (matching the Gbagada
  section), depending on photo count.
- Known real caption for the hygiene session (not yet built into the page):
  session led by General Secretary **Mrs Oluwabunmi Adenuga** at Ayangburen
  Primary School — has an associated video, not just photos.

### get-involved.html — unchanged, generic
- Ways-to-help cards + contact form are still generic/placeholder copy from
  the original build. Nothing from the new content doc applies here yet
  (client's doc doesn't cover this page's content — their "12. Join the
  Group" section brainstorm hasn't been delivered as actual copy yet).

---

## 4. main.js — function inventory (so you don't duplicate work)

| Function | Purpose |
|---|---|
| `initImageSkeletons` | Shimmer/blur-up placeholder on every `<img>` until loaded |
| `initMasonryGrid` | Computes true masonry row-spans for `.masonry` (gallery.html) from real image height |
| `initCurtain` | Preloader — waits on fonts + hero image ready (900ms–3.2s window), not a fixed timer |
| `initHeaderScroll` / `initNavToggle` | Header shrink + mobile dropdown (GSAP slide+bounce, hamburger→X) |
| `initHeroEntrance` | Hero timeline, branches for mobile (visual reveals first, matches CSS `order:-1`) |
| `initLaurelDraw` | SVG wreath stroke-draw; hero instance syncs to `curtainExit` event, others just scroll-trigger |
| `initReveals` | Generic `[data-reveal]` fade-up via `ScrollTrigger.batch` |
| `initCounters` | Animated number counters (`[data-counter]`) |
| `initGallery` | Filter chip logic (All/Outreach/Events/Team) on gallery.html |
| `initLightbox` | Click-to-enlarge on `[data-lightbox]` tiles |
| `initMemberCardsReveal` | 3D fan-in entrance for `.member-card` (members.html) |
| `curtainExit` (promise, module scope) | Shared signal other entrances key off instead of guessed delays |

---

## 5. Key decisions & why

- **Curtain preloader is a real loading gate, not decorative.** Waits for
  `document.fonts.ready` + hero image `load`, bounded 900ms–3.2s. Added after
  client asked about slow-connection users. Hero entrance + hero laurel-draw
  now key off a `logpah:curtain-exit` custom event instead of a fixed delay,
  so they can never play out of sync with what's actually visible.
- **Masonry gallery uses CSS Grid + JS-computed row-spans**, not CSS
  `columns`. Images use `height:auto` (not `object-fit:cover`) so they show
  their true aspect ratio — client explicitly wants horizontal/portrait shots
  to keep their natural form, not be cropped into uniform boxes.
- **`grid-auto-flow: dense` is ON.** Was briefly turned off to match a
  reference layout the client showed (strict top-to-bottom order), but that
  produced visible empty gaps in short columns — dense packing was
  reinstated to fix it. Trade-off: tiles can appear slightly out of DOM
  order to fill gaps efficiently. Fine for a photo gallery (no narrative
  order to preserve).
- **Gallery caption style = persistent bottom plate**, not hover-only reveal.
  Changed after client shared a reference image (Lorem Picsum-style gallery)
  — they wanted that caption-plate behavior while keeping our rounded
  corners/hover snap, not the reference's sharp-corner polaroid look.
- **Nav CTA moves into the mobile dropdown below 980px** instead of shrinking
  in place — fixes an overlap bug reported on real iPhone screenshots.
- **"5 pillars" → "7 values" swap.** The original 5-item pillar list was a
  guess made before real content existed (inferred from a cropped event
  banner: "Empowerment ▪ Self Discovery ▪ Motherless Care ▪
  Destitute/Less Privileged ▪ M...RRIAGE PILLS"). The client's actual doc
  gives 7 explicit core values instead. The guessed version is fully retired
  — if you see "Self Discovery" or "Marital Wellness" anywhere, that's stale
  and should be removed.

---

## 6. Full page map the client has proposed (from their planning doc)

They're delivering content **gradually, page by page**. Only items marked ✅
have real content built in. Everything else is either not started or only
loosely represented in the current 5-page structure.

1. ✅ Home page — welcome, mission/vision, group photo, join CTA
2. ✅ About Us — who we are, beginning, achievements, values, vision (built
   into our-story.html rather than a separate page — revisit if the client
   wants it split out)
3. 🟡 Photo & Video Gallery — structure built, most albums pending real media
4. ⬜ Events Calendar — not started, no content received
5. ⬜ Our Community Impact (as a dedicated page, distinct from About) — not
   started; some overlap already exists in Our Story's achievements section
6. ⬜ Members' Achievements (personal milestones: new job, graduation, etc.) —
   not started, distinct from the Members/EXCO page that already exists
7. ⬜ Members' Business Directory — not started
8. ⬜ Birthday & Celebration Corner — not started
9. ⬜ News & Updates / blog — not started
10. ⬜ Testimonials — not started
11. 🟡 Our Story / Timeline — built (see §3), though client's brainstorm
    treated this as separate from "About Us"; currently merged into one page
12. ⬜ Join the Group (dedicated membership page/form) — get-involved.html
    exists but wasn't built from this doc's spec; revisit
13. ⬜ Social Media Wall — not started
14. 🟡 Contact Us — basic version exists on get-involved.html, not expanded
15. 🟡 Get Involved — exists, generic copy only

**Open question for the client:** 15 sections can't all be top-level nav
items. Current nav is Home / Our Story / Members / Gallery / Get Involved.
Recommend grouping future sections under these five rather than expanding
the nav indefinitely — e.g., Events Calendar + Testimonials + News could live
as sections within Get Involved or a new "Community" page. Needs a decision
before building further pages.

- **No em dashes, anywhere in visible content.** Client has a firm standing
  preference against em dashes in all copy. Use a comma, colon, period, or
  the middle-dot `·` (already used for "Est. 2016 · Lagos, Nigeria" style
  separators) instead. This was violated a few times during the content
  pass in v8/v9 and had to be corrected — check any new copy against this
  before shipping it.
- **All placeholder images are real `<img>` tags pointing at
  `images/placeholder-photo.svg` (4:3, for photo tiles) or
  `images/placeholder-avatar.svg` (1:1, for member circles).** Nothing is
  built as an icon-and-text box anymore. Adding a real photo later is
  strictly "edit the `src` path, nothing else" — see §3 for exactly which
  images are still placeholders.

---

## 7. Changelog

- **v1** — Initial 4-page build (Home, Our Story, Gallery, Get Involved),
  GSAP/ScrollTrigger animations, laurel-ring motif, cross-document View
  Transitions, curtain preloader (time-based).
- **v2** — Client uploaded enhanced version with custom magnetic cursor,
  parallax, particles, split-text word reveals, clip-path image wipes —
  reviewed and confirmed working.
- **v3** — Mobile nav fixes: CTA moved into dropdown below 980px, hero
  entrance reveal-order fixed for mobile (visual-first to match CSS order).
- **v4** — Mobile dropdown gap eliminated (position:absolute anchored to
  header instead of hardcoded top offset), hamburger→X animation, GSAP
  slide+bounce entrance for the mobile menu.
- **v5** — Added members.html (Founder spotlight + EXCO grid, mostly
  placeholder), real image skeleton/shimmer loading system sitewide, curtain
  preloader rebuilt as a real loading gate (fonts + hero image + min/max
  window), lazy-loading + fetchpriority hints on all images.
- **v6** — Gallery redesigned: CSS Grid masonry with JS-computed row-spans
  (true aspect-ratio preservation), gold category tag pills, hover states.
- **v7** — Gallery caption style changed to persistent bottom plate
  (client reference image), dense-packing removed then reinstated (gap bug).
- **v8 (current)** — Major content pass from client's Word doc: founding
  year corrected to 2016, Home page mission/vision/values rewritten with
  real copy, Our Story rebuilt with real About Us + 9-entry real milestones
  timeline, Gallery got the Gbagada Hospital feature story (real captions,
  placeholder photo slots) + an albums-coming-soon list. This log file
  created.

- **v9 (current)** — Removed every em dash from visible site content
  (5 instances in members.html; other pages were already clean). Rebuilt
  the placeholder-image system: added `images/placeholder-photo.svg` (4:3)
  and `images/placeholder-avatar.svg` (1:1) as real on-brand graphics, and
  converted every "photo pending" slot (Gbagada Hospital's 6 photo-grid
  tiles, the 8 albums-coming-soon cards, and the 5 pending EXCO member
  cards) from icon-box placeholders into actual `<img src="...">` tags. Now
  adding a real photo anywhere is purely "edit the `src` path" — no markup
  restructuring needed. Removed the now-dead `.photo-pending` and
  `.member-card__placeholder` CSS in favor of `.album-tile` /
  `.member-card__photo`, which both real and placeholder images share.

---

## 8. How to continue this project (for future sessions)

1. Read §3 above first — know what's real vs. placeholder before touching copy.
2. When the client sends the next content batch, update §3 and §7 (add a
   changelog entry) as part of that work — keep this file current, don't let
   it drift.
3. Founder's name and EXCO members' names/photos are the biggest outstanding
   gaps — flagged with `<!-- EDIT -->` HTML comments in our-story.html and
   members.html.
4. Before adding new top-level pages, resolve the nav-grouping question in §6.
