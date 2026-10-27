# LOGPAH Website: Project Log

**Client:** Ladies Of Greater Plans And Hope Foundation (LOGPAH)
**Founder & CEO:** Mrs. Beatrice Modupe Aladegbola (confirmed, see §3)
**Founded:** August 2016, Lagos, Nigeria
**Site theme:** "A Decade of Elegance and Excellence" · 10th anniversary framing, targeting 2026
**Stack:** Static HTML/CSS/JS, no build step, no framework. GSAP 3.12.5 + ScrollTrigger via CDN.
**Live site:** https://www.logpah.com (hosted on Vercel, auto-deploys from `master`;
domain registered at Nameslink, see §9)
**Repo:** https://github.com/Akolis2021/logpah, client's `details.md` in the repo root is the
running source-of-truth content brief; read it alongside this log.

> Read this file first in any new session before making changes. It tracks what's
> real content vs. placeholder, what's been decided and why, and what's still queued.

---

## 1. File structure

```
logpah/
├── index.html                 Home
├── our-story.html              About Us + Milestones + Founder & CEO + EXCO strip
├── members.html                 Founder spotlight + Executive Council grid (6 real roles)
├── business-directory.html   NEW: Members' Business Directory (5 real listings)
├── gallery.html                 Masonry gallery (75 tiles) + Gbagada Hospital feature
├── get-involved.html         Ways to help + Become a Sponsor + contact form
├── vercel.json                 Clean URLs, no .html in addresses (see §9)
├── robots.txt                  Crawl rules + sitemap pointer (see §10)
├── sitemap.xml                 The six public pages on the www host (see §10)
├── css/style.css               ~1400 lines, all styling, design tokens at top
├── js/main.js                     ~1000 lines, all interactivity (see §4)
├── details.md                    Client's content brief, growing over time
├── PROJECT_LOG.md            This file
└── images/
    ├── 1st/1.jpeg-5.jpeg              1st Anniversary (real, 5 photos)
    ├── 5th/1.jpeg-14.jpeg             5th Anniversary (real, 14 photos)
    ├── empowerment/1.jpeg-12.jpeg  Empowerment programme (real, 12 of ~22 photos)
    ├── healthyloaf/1.jpeg-2.jpeg    Healthy Loaf business photos (real)
    ├── 8th/1.jpeg-27.jpeg               8th Anniversary, Bariga (not yet uploaded, wired with fallback)
    ├── elderly/1.jpeg-7.jpeg           Elderly Care visits (not yet uploaded, wired with fallback)
    ├── gbagada/1.jpeg-3.jpeg          Gbagada Hospital outreach (not yet uploaded, wired with fallback)
    ├── invitation_meeting/1.jpeg-3.jpeg  Commissioner's office visit (not yet uploaded, wired with fallback)
    ├── placeholder-photo.svg        4:3 branded "coming soon" graphic
    ├── placeholder-avatar.svg      1:1 branded "coming soon" graphic
    ├── home1.jpeg, home2.jpeg          Team photos (Home page)
    ├── ceo1.jpeg, ceo2.jpeg            Founder and CEO photos
    ├── collage.jpeg                     Red Cross Motherless Home visit
    ├── engyblossomempire.jpeg      Business Directory flier
    ├── a-series.jpeg                    Business Directory flier
    ├── flaros.jpeg                      Business Directory flier (Flaros College)
    └── (original 10 stock photos from the Facebook scrape, still in use)
```

No build tools. Drop into any static host that supports clean URLs (Vercel does via
`vercel.json`, see §9). Because internal links now start with `/`, opening the HTML
files straight from disk will not navigate correctly: test locally with `npx serve`
or `npx vercel dev`.

---

## 2. Design system (css/style.css, top of file)

- **Colors:** navy (`--navy-950/900/800/700`), royal blue (`--blue-600`), gold
  (`--gold-700→200`), cream (`--cream-50/100/200`), ink (`--ink-900/700/500`).
- **Fonts:** Fraunces (display/serif, headings) + Manrope (body/UI). Loaded via
  Google Fonts `@import` at the top of style.css.
- **Signature motif:** the "laurel-ring", an SVG wreath frame (two mirrored
  bezier paths + leaf ellipses) that draws itself on scroll around portrait
  photos. Used in: hero (index.html), Founder and CEO feature (our-story.html),
  founder spotlight (members.html).
- **Eyebrow marker:** small labels ("MOMENTS & MEMORIES" style) are prefixed
  with a gold sparkle (✦) via `.eyebrow::before`, not a dash or line. This is
  one shared CSS rule, so it applies everywhere automatically.
- **Motion:** GSAP timelines everywhere, curtain preloader on every page,
  ScrollTrigger.batch for generic `[data-reveal]` fade-ups, plus bespoke
  entrances for pillars, tiles, member cards, business cards, gallery masonry.

---

## 3. Content status by page, READ THIS BEFORE EDITING COPY

### index.html (Home), real content
- Hero lede = trimmed real welcome message.
- "Mission & Vision" section = real Mission Statement, Vision Statement, "Our
  Statement" (all verbatim from client doc). Uses `images/home1.jpeg`.
- New "Our Team" band (dark section, right after Mission & Vision) = the real
  full-width group photo `images/home2.jpeg` + a "Become a Member" CTA. This
  matches the client's exact requested sequence: "After our Mission, the
  group picture, then Become a Member button."
- "What We Stand For" = the real 7 core values (Compassion, Service, Unity,
  Empowerment, Integrity, Love, Community Impact).
- Founding year corrected sitewide: "Est. 2016" (confirmed August 2016).

### our-story.html, real content, founder identified
- "Who We Are" + "Our Beginning" = verbatim from client doc.
- "Our Work & Achievements" = real 6-card grid, all real locations/institutions named.
- "Our Milestones" = real 9-entry timeline (2016 founding through Journey Continues).
- "Our Vision for the Future" callout = verbatim closing lines.
- Founder and CEO section (was placeholder, now real): Mrs. Beatrice Modupe
  Aladegbola, full bio (originally from Ikere-Ekiti, Nigeria; now UK-based;
  education history; leadership philosophy quote), photo = `images/ceo1.jpeg`.
- "A Message From Our Founder", her full personal letter, verbatim, with
  `images/ceo2.jpeg`, in a dark decade-panel-style block.
- Still pending: EXCO strip (3 photos) still uses generic stock photos, not
  tied to specific real captions yet.

### members.html, real roles, confirmed officers and member profiles
- Founder spotlight: Mrs. Beatrice Modupe Aladegbola with full biographical narrative and interactive expandable bio ("Read full bio" / "Show less").
- Executive Council (unfilled placeholder cards and duplicated founder portrait removed):
  - Mrs. Adenuga Idowu Oluwabunmi: General Secretary (real photo `images/Adenuga_Oluwabunmi.jpeg`, full leadership bio, educational credentials, and entrepreneurship profile).
  - Adadey Ngozi: Welfare Officer (real photo `images/Adadey_Ngozi.jpeg`, full welfare leadership and educator/businesswoman bio).
  - Mercy Osazemen Ojo Komolafe: Executive Committee / Admin (real photo `images/Mercy_Osazemen_Ojo_Komolafe.jpeg`, administrative & outreach coordination bio).
- Featured Members & Global Sisterhood:
  - Ibironke Oluwakemi Iyanda: Member (real photo `images/IBIRONKE_OLUWAKEMI_IYANDA.jpeg`, Nurse, United Kingdom).
  - Modinat Abimbola Adaranijo-Adesoji: Foundational Member (real photo `images/Modinat_Abimbola_Adaranijo_Adesoji.jpeg`, Healthcare Professional, Iya Suna Adini General, UK & Lagos Nigeria).

### business-directory.html, 5 real listings completed
- Full page built: intro copy (verbatim), 5 real business listings in an enhanced card grid.
- All 5 listings now feature real categories, rich descriptions, and verified contact details:
  - Engy Blossom Empire: Fashion & Lifestyle (Ankara, Adire, men's & women's wear, accessories; phone, IG, nationwide delivery).
  - Healthy Loaf: Food & Bakery (family loaves, Ikorodu bakery address, phone).
  - A-Series Creative World Ventures: Cakes, Pastries & Catering (by Mrs. Adenuga Idowu Oluwabunmi; phone, IG, FB).
  - Flaros College: Education & Academics (Government-approved WAEC/NECO/BECE school; motto "Knowledge Guided with Zeal", official banner `images/flaros_college.jpeg`, full verified Ogun State address, and 3 phone lines from `images/flaros_college_address.jpeg`).
  - Ambassador 360 Limited Hotel & Suite: Hospitality, Hotel & Suites (motto "A Place Like Home", hotel premises photo `images/ambassador2.jpeg` with inset logo badge `images/ambassador1.jpeg`).
- Added to nav (as "Businesses") and footer on every page.

### gallery.html, major rebuild, real albums wired in
- Filter chips changed from generic Outreach/Events/Team to the real albums:
  All, 1st Anniversary, 5th Anniversary, 8th Anniversary, Empowerment,
  Elderly Care, Team & Events.
- Redesigned grid: unified 3-column card grid matching the scale, proximity,
  and clean aesthetics of the Members and Our Story pages (.exco-strip), with
  a 4:3 aspect ratio, border-radius, clean card footers, and smooth hover zoom:
  - 1st Anniversary: 5 real photos (`images/1st/1-5.jpeg`)
  - 5th Anniversary: 14 real photos (`images/5th/1-14.jpeg`)
  - 8th Anniversary, Bariga: 27 tiles wired to `images/8th/1-27.jpeg`, files
    not uploaded yet, each shows the placeholder graphic via
    `initImageFallbacks()` (see §4) until the client drops matching files in.
    Zero code editing needed when she does.
  - Empowerment: 12 real photos (`images/empowerment/1-12.jpeg`); client
    mentioned ~22 total, so 13.jpeg onward can be added the same way.
  - Elderly Care: 7 tiles wired to `images/elderly/1-7.jpeg`, same
    not-yet-uploaded/fallback situation as 8th.
  - Team & Events: the original 9 stock photos + `images/collage.jpeg`
    (Red Cross Motherless Home visit), recategorized as a catch-all.
- "A Notable Encounter" (Gbagada General Hospital) feature section, real
  narrative text, 6 photo tiles wired to `images/gbagada/1-3.jpeg` and
  `images/invitation_meeting/1-3.jpeg`, same fallback pattern.
- New "Promoting Good Hygiene Among Children" section, real narrative,
  names the General Secretary Mrs Oluwabunmi Adenuga as the session leader.
  No photos given for this one yet, text-only for now.
- Still pending, and not built at all: video. The client has mentioned real
  videos for several albums (8th, 5th, empowerment, hygiene session, Ketu
  feeding) but no files or links have been provided, and this site has no
  `<video>` or embed infrastructure yet. Flagged with a comment in
  gallery.html. When videos are available: small files can use a native
  `<video>` tag; anything large should be a YouTube/Vimeo iframe embed
  instead, since a static host won't want to serve large video files
  directly. Needs a decision, not started.
- Old "Albums Coming Soon" teaser-card section removed, those albums are
  now real sections in the grid above instead of just a promise.

### get-involved.html, Become a Sponsor added, rest still generic
- New "Become a Sponsor" section (dark, full-width): real copy ("Together,
  We Can Make a Greater Difference"), 7 real sponsorship benefits, "Partner
  With Us" copy, and the real bank account details (GTB, account name
  "LADIES OF GREATER PLANS AD HOPE FOUNDATION" exactly as given by the
  client, account number 3000586861). The account name is preserved
  character-for-character rather than "corrected" to "AND HOPE," since bank
  transfers need to match the registered name exactly, if that's actually a
  typo in the client's doc, confirm with her before changing it.
- Ways-to-help cards + contact form are still the original generic copy.
  Nothing from the client's doc covers this specifically (her "12. Join the
  Group" brainstorm section hasn't been delivered as real copy yet).

---

## 4. main.js, function inventory (so you don't duplicate work)

| Function | Purpose |
|---|---|
| `initImageFallbacks` | New. Any `<img data-fallback="images/placeholder-photo.svg">` that 404s swaps to the fallback automatically. This is what makes the numbered-but-not-yet-uploaded folders (8th, elderly, gbagada, invitation_meeting) work with zero future code edits. |
| `initImageSkeletons` | Shimmer/blur-up placeholder on every `<img>` until loaded |
| `initMasonryGrid` | Manages gallery grid lifecycle and ScrollTrigger synchronization |
| `initCurtain` | Preloader, waits on fonts + hero image ready (900ms-3.2s window), not a fixed timer |
| `initHeaderScroll` / `initNavToggle` | Header shrink + mobile dropdown (GSAP slide+bounce, hamburger to X) |
| `initHeroEntrance` | Hero timeline, branches for mobile (visual reveals first, matches CSS `order:-1`) |
| `initLaurelDraw` | SVG wreath stroke-draw; hero instance syncs to `curtainExit` event, others just scroll-trigger |
| `initReveals` | Generic `[data-reveal]` fade-up via `ScrollTrigger.batch` |
| `initCounters` | Animated number counters (`[data-counter]`) |
| `initGallery` | Filter chip logic on gallery.html (now keyed to real album slugs) |
| `initLightbox` | Click-to-enlarge on `[data-lightbox]` tiles |
| `initMemberCardsReveal` | 3D fan-in entrance for `.member-card` (members.html) |
| `curtainExit` (promise, module scope) | Shared signal other entrances key off instead of guessed delays |

---

## 5. Key decisions & why

- Real numbered image folders (`1.jpeg`, `2.jpeg`...) instead of the
  client's original WhatsApp-export filenames. Renamed on disk to match
  exactly what the client described wanting in `details.md` ("images/8th/
  1.jpeg to 27.jpeg", etc.). This makes every future upload trivial: drop a
  correctly-numbered file into the right folder, done.
- `initImageFallbacks` + `data-fallback` lets us wire up real future paths
  before the files exist. Folders with zero files today (8th, elderly,
  gbagada, invitation_meeting) are already fully coded into the page and will
  "just work" the moment matching files land, no HTML/JS changes needed.
  This is a step beyond the earlier "edit the src path" placeholder pattern
  (still used for members.html and business-directory.html, where exact
  future filenames aren't predictable).
- Bank account name preserved exactly as given, even though "AD HOPE" reads
  like it might be missing "AND", financial account names must match bank
  records exactly, so it was not "corrected." Flag this for the client to
  confirm.
- Curtain preloader is a real loading gate, not decorative. Waits for
  `document.fonts.ready` + hero image `load`, bounded 900ms-3.2s.
- Masonry gallery uses CSS Grid + JS-computed row-spans, not CSS `columns`.
  Images use `height:auto` so they show their true aspect ratio.
- `grid-auto-flow: dense` is ON to avoid empty-gap bugs in the masonry.
- Gallery caption style = persistent bottom plate, not hover-only reveal.
- No em dashes, anywhere in visible content, including HTML comments now.
  Use a comma, colon, period, or the middle-dot `·` instead. Eyebrow labels
  use a gold sparkle (✦) rather than a dash/line, also via one shared rule.
- "5 pillars" to "7 values" swap (from an earlier guessed list to the
  client's real 7 core values). Fully retired, don't reintroduce.
- Clean URLs everywhere: internal links never end in `.html` (`/our-story`, not
  `our-story.html`). One canonical host, `https://www.logpah.com`; the bare domain
  and `logpah.vercel.app` both redirect to it so Google sees a single site.
- Every new page gets its own title, description, canonical and social tags, and a
  line in `sitemap.xml` (checklist in §10).

---

## 6. Full page map the client has proposed (from details.md)

They're delivering content gradually. Only items marked done have real
content built in.

1. Done, Home page
2. Done, About Us (built into our-story.html, not a separate page, revisit
   if the client wants it split out)
3. Done, Photo & Video Gallery: images normalized and wired (8th, elderly, gbagada, invitation, empowerment), video infrastructure built (video cards, play badges, filter chip, and video lightbox modal).
4. Done, Events Calendar: built into index.html with interactive filter chips (All, Anniversaries, Outreaches, Empowerment).
5. Not started, Our Community Impact (dedicated page), overlaps with
   Our Story's achievements section
6. Not started, Members' Achievements (personal milestones: new job,
   graduation, etc.), distinct from the Executive Council page
7. Done, Members' Business Directory, built as business-directory.html
8. Not started, Birthday & Celebration Corner
9. Not started, News & Updates / blog
10. Done, Testimonials: "Voices of Sisterhood" section built into index.html with quotes from Founder, General Secretary, and community partners.
11. Done, Our Story / Timeline: built with embedded milestone photos (Red Cross Motherless Home and Ayangburen Primary School), merged with About Us.
12. Partial, Join the Group, get-involved.html exists, Become a Sponsor now
    real, but the specific "who can join / requirements / how to apply"
    copy from section 12 of the brainstorm hasn't been delivered yet
13. Not started, Social Media Wall
14. Partial, Contact Us, basic version exists, not expanded
15. Done, Get Involved / Become a Sponsor, real content now in place

Open question for the client: the nav is now six items (Home, Our Story,
Members, Businesses, Gallery, Get Involved). Recommend resolving Events
Calendar, Testimonials, and News as sections within existing pages rather
than growing the nav further, before building the remaining not-started items.

---

## 7. Changelog

- v1 through v9, see git history / earlier log versions. Summary: initial
  4-page build with GSAP/ScrollTrigger, laurel-ring motif, curtain preloader;
  magnetic cursor + parallax + clip-path reveals; mobile nav fixes (dropdown
  gap, hamburger to X, slide+bounce entrance); members.html added; image
  skeleton/shimmer system + lazy loading sitewide; gallery redesigned to CSS
  Grid masonry with true aspect ratios; caption style changed to persistent
  bottom plate; first real content pass (mission, vision, values, milestones,
  founding year correction); em dash removal + placeholder-image system
  (editable `src` paths).
- v10, major pass from the client's expanded `details.md`
  (business directory, sponsor page, founder identity, exact image folder
  structure):
  - Renamed real photo folders to clean numbered sequences (1st, 5th,
    empowerment, healthyloaf).
  - Added `initImageFallbacks` + `data-fallback` so not-yet-uploaded numbered
    folders (8th, elderly, gbagada, invitation_meeting) work with zero future
    code edits.
  - Rebuilt gallery.html around real albums, 75 tiles, new filter set.
  - Fixed a real bug: `placeholder-photo.svg` / `placeholder-avatar.svg` were
    sitting in the repo root instead of `images/`, silently breaking every
    "photo pending" tile on the site.
  - Identified the founder: Mrs. Beatrice Modupe Aladegbola, full bio and
    personal message built into our-story.html, synced to members.html.
  - Assigned the 6 real Executive Council role titles in members.html.
  - Built business-directory.html from scratch (new page, new nav item,
    new `.business-card` CSS component), 4 real listings.
  - Added the real "Become a Sponsor" section to get-involved.html,
    including bank account details.
  - Added the real Home page team photos (home1.jpeg, home2.jpeg) in a
    sequence matching the client's exact requested layout.
  - This log rewritten to match.
- v11 (current), domain, clean URLs and SEO pass:
  - Connected `logpah.com` (Nameslink DNS pointing to Vercel). `logpah.com` and
    `logpah.vercel.app` both redirect to `www.logpah.com` (see §9).
  - Added `vercel.json` (clean URLs), `robots.txt` and `sitemap.xml`.
  - Rewrote every internal page link across the six pages from `page.html` to
    `/page` (home is `/`). A one-time script was used for this and is not in the repo.
  - Replaced each page's title and description with page-specific SEO tags,
    canonical links, Open Graph tags and Twitter card tags. Added NGO structured
    data (JSON-LD) to the home page.
  - Added §9 (domain, hosting, clean URLs) and §10 (SEO) to this log.
  - Corrected the Business Directory count in the file tree to 5 listings.

---

## 8. How to continue this project (for future sessions)

1. Read §3 above first, know what's real vs. placeholder before touching copy.
2. When new content arrives, check `details.md` in the repo root first
   (it's the client's running brief), then update §3, §6, and §7 here.
3. Video is the single biggest unbuilt piece with real content waiting on
   it. Needs a hosting decision (native `<video>` vs. YouTube/Vimeo embed)
   before building.
4. EXCO member names/photos (beyond role titles) are the next biggest gap in
   members.html. Business Directory listing details (categories,
   descriptions, contact info) for 3 of 4 businesses are the gap in
   business-directory.html.
5. Confirm the bank account name spelling with the client before it goes live.
6. Before adding new top-level nav pages, resolve the nav-grouping question
   in §6. Six items is likely near the practical limit before it needs a
   "More" dropdown or reorganization.
7. Before changing links, routes, redirects or the domain, read §9. Before adding
   a page, follow the new-page checklist in §10.

---

## 9. Domain, hosting and clean URLs

- **Live site:** https://www.logpah.com is the canonical address. `logpah.com`
  redirects to it (308, set in Vercel), and so does `logpah.vercel.app` (308 Permanent
  Redirect, set in Vercel > Project > Settings > Domains). Do not link to the
  vercel.app address anywhere.
- **Hosting:** Vercel, project `logpah`, Hobby plan. Every push to `master`
  redeploys automatically.
- **Domain:** `logpah.com` registered at Nameslink in October 2026 on a one-year
  promo (limit one per customer). Confirm the exact expiry date, the real renewal
  price and the auto-renew setting in the Nameslink account, and keep a valid
  payment card on it. A lapsed domain takes the whole site down.
- **DNS (managed at Nameslink, nameservers ns1.nameslink.com and ns2.nameslink.com):**
  - A record: host `@`, value `216.198.79.1` (Vercel)
  - CNAME record: host `www`, value `b9fda3078663a2f6.vercel-dns-017.com`
    (no trailing dot, Nameslink rejects it)
  - Leave any MX or TXT records alone, they belong to email and site verification.
  - If Vercel ever shows different values in the project's Domains tab, Vercel wins.
- **Planned move to Spaceship before year two** (cheaper renewal than Nameslink's
  regular price). Transfers are not allowed in the first 60 days after
  registration. Start 30 to 45 days before expiry: unlock the domain, get the EPP
  code, approve the confirmation email, pay at Spaceship. Make sure both DNS
  records above exist at the new registrar before the transfer completes, or the
  site goes down.

### Clean URLs (no `.html` in the address bar)

- `vercel.json` sets `cleanUrls: true` and `trailingSlash: false`. Vercel serves
  `our-story.html` at `/our-story` and redirects any visit to `/our-story.html`
  to `/our-story`, so old links keep working.
- Link rule: internal links never end in `.html`. Use `/` for home and
  `/our-story`, `/members`, `/business-directory`, `/gallery`, `/get-involved`.
  Anchors are fine, for example `/gallery#albums`.
- Asset paths (`css/`, `js/`, `images/`) stay relative. That works because no page
  lives in a sub-folder. If a page is ever added in a sub-folder, switch that
  page's asset paths to root-absolute (`/css/style.css`).
- Opening the HTML files straight from disk no longer navigates correctly,
  because links now start with `/`. Test locally with `npx serve` (serves clean
  URLs by default) or `npx vercel dev`.
- If any script in `js/` compares the current page to a filename ending in
  `.html` (for example to mark the current nav link), it must also accept the
  clean path, for example `/our-story`.

---

## 10. SEO setup

- Every page has its own `<title>`, meta description, canonical link, `robots` tag,
  Open Graph tags and Twitter card tags in `<head>`. Canonical URLs use the clean
  path on the www host, for example `https://www.logpah.com/our-story`.
- `index.html` also carries NGO structured data (JSON-LD): name LOGPAH, alternate
  name Ladies Of Greater Plans And Hope Foundation, founded 2016-08, Lagos,
  contact email, and the Facebook, Instagram and YouTube profiles as `sameAs`.
  Keep it in sync with the footer if contact details or social links change.
- Share images (`og:image`): Home, Our Story and Businesses use
  `images/anniversary-10yr.jpg`; Members uses `images/home2.jpeg`; Gallery uses
  `images/outreach-girls.jpg`; Get Involved uses `images/community-selfie.jpg`.
  Do not rename or delete these files without updating the tags.
- `robots.txt` allows all crawlers and points to
  `https://www.logpah.com/sitemap.xml`.
- `sitemap.xml` lists the six public pages. Update it whenever a page is added or
  removed, and bump `lastmod` after major content changes.

**New-page checklist**
1. Add title, description, canonical, Open Graph and Twitter tags to the page head.
2. Add the page to `sitemap.xml`.
3. Link to it with a clean path (no `.html`).
4. Add it to the nav and footer on every page.

**Off-site steps (pending, done by the site owner, not in code)**
- Google Search Console: add `logpah.com` as a Domain property, verify with a TXT
  record at Nameslink, submit the sitemap, then use URL Inspection to request
  indexing of the home page.
- Bing Webmaster Tools: same steps.
- Put `https://www.logpah.com` in the Instagram, Facebook and YouTube profiles.
- Confirm both redirects work: `logpah.com` and `logpah.vercel.app` should land on
  `www.logpah.com`.
