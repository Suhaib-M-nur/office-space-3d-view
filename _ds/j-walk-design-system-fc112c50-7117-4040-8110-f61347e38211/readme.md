# J WALK — Design System (جي ووك)

A brand & UI system for **J WALK (جي ووك)**, a modern open-air shopping and
leisure destination in **Al-Jammawat Park, Madinah (المدينة المنورة)**, Saudi
Arabia. J WALK blends retail, dining, green space and a signature dancing
fountain into one family destination, aligned with Vision 2030.

The brand is **bilingual and Arabic-primary (RTL)**. English is a secondary
locale. Every surface should read naturally right-to-left first.

---

## Sources this system was built from

- **`uploads/J WALK Proposal.pdf`** — 22-slide Arabic marketing/season proposal
  ("صيف جي ووك · اليوم الوطني الـ96"). Source of tone, campaign structure, stat
  styling and the deck patterns recreated in `slides/`.
- **`uploads/دليل صيف جي ووك معتمد.pdf`** (`uploads/summer-guide.pdf`) — the
  **official 42-page brand guide** ("دليل صيف جي ووك"). Source of the exact
  Pantone/HEX palette, the type pairing, and the brand's decorative language
  (3D icons, patterns, stickers, flags, merchandise, kiosks, wayfinding).
- **https://jwalksa.com/** — the live WordPress site. Source of product facts,
  navigation, services, imagery and copy tone. Brand imagery in the UI kit is
  referenced from the site's public CDN (`jwalksa.com/wp-content/uploads/…`).
- **Logos** — `uploads/Logo.png`, `Jwalk-Logof-1.png`, `Jwalk-Logof-3.png`
  (copied into `assets/`).

---

## The product at a glance

- Two-floor mall with **9 rental zones (مناطق تأجيرية)**, each with different
  features and views over the park and the dancing fountain.
- **Signature dancing fountain (النافورة الراقصة)** — hydraulic water shows,
  synced audio, dynamic LED lighting; daily varied schedule.
- **25,000 m²** green space · **1,200 m** walking track · **737 m** bike track ·
  **3,500 m²** marketing spaces · 24/7 security · dedicated parking.
- Global retail brands, restaurants & cafés, outdoor + upper-level seating,
  kids' play area, admin offices, event spaces.
- **Location:** Al-Difa'a district, Prince Nayef Rd × Imam Muslim Rd, Madinah.
  7 km Prophet's Mosque · 20 km Haramain train · 30 km Prince Mohammad airport ·
  100 m city buses.
- **Contact:** info@jwalksa.com · 920013195 · WhatsApp 966148181585 ·
  IG/FB/X @jwalksa.

Primary site navigation: الرئيسية · من نحن · خدماتنا · المتاجر ·
المساحات التأجيرية · مركز التواصل (خدمات المستأجرين / التوظيف / تواصل معنا) ·
الاخبار والفعاليات · English.

---

## CONTENT FUNDAMENTALS — how J WALK writes

- **Language & direction.** Arabic first, RTL. English is a mirror, never the
  lead. Keep Arabic and English copy separate — do not machine-mix them in one
  sentence.
- **Voice.** Warm, welcoming, aspirational hospitality. It invites rather than
  sells. Addresses the reader directly and generously — "امنح عائلتك تجربة لا
  تُنسى" (give your family an unforgettable experience), "استمتع بجمال الطبيعة"
  (enjoy the beauty of nature).
- **Person.** Second person to visitors ("زيارتك", "عائلتك"); first-person
  plural for the brand ("نستقطب", "نحن في موقع…"). To tenants/partners the tone
  turns confident and commercial ("انضم إلى جي ووك", clear ROI framing in the
  proposal).
- **Sentence style.** Marketing copy is lush and descriptive (fountain,
  nature, ambience). Operational/proposal copy is crisp and numeric: short
  labels, big numbers, tables, staged roadmaps ("المرحلة الأولى", "الهدف:
  إشغال 100٪").
- **Numbers are heroes.** Stats are stated boldly and paired with a short label
  ("25 ألف م² مسطحات خضراء", "1,200 م ممشى", "57٪ نسبة الإشغال"). Use Arabic-
  Indic context naturally; Western digits are fine on the site.
- **Casing (English).** Display/wordmark is **UPPERCASE and wide** (see WALK).
  Body English is sentence case.
- **Emoji.** Essentially none. The occasional single "!" for warmth. Do not add
  emoji to J WALK copy.
- **Tagline in use:** "مفهوم مبتكر للتسوق" (an innovative concept for shopping);
  campaign line "نملأ جي ووك بالحياة" (we fill J WALK with life).

---

## VISUAL FOUNDATIONS

- **Palette (exact, from the brand guide).** A warm, sun-and-garden set.
  Primary brand trio = **Eucalyptus Teal `#47a190`**, **Burnt Orange
  `#c86038`**, **Amber `#efba51`** (the three shapes of the logomark).
  Secondary/support: Deep Ocean Blue `#3277a4`, Pale Lemon Cream `#f2ed9e`,
  Soft Olive Gold `#d4d383`, Soft Aqua Blue `#b7dde3`, Soft Peach Blush
  `#eab7a6`. Neutral is a **warm charcoal `#2b2a28`** (the logotype colour) on a
  warm off-white `#faf8f3` — never pure black on pure white. Use max ~2 brand
  colours as fields per composition; the softer secondaries are for
  backgrounds, patterns and illustration fills, not primary CTAs.
- **Type.** Latin **Condor** (Light + Black) and Arabic **A Jannat LT** (Regular
  + Bold). Substituted here with **Archivo** (Latin) and **Almarai** (Arabic) —
  see Font substitution below. Display is set **wide, heavy, uppercase** with
  positive tracking to echo the WALK wordmark; body is regular weight, Arabic
  slightly looser line-height.
- **Logo.** A stacked geometric mark: a **teal leaf/petal**, a **burnt-orange
  quarter-disc**, and an **amber circle** — an abstract sprout/"walk" glyph.
  Lockups place the mark above/left of "WALK جي ووك". Keep clear space ≈ the
  height of the amber disc. Never recolour the mark outside the brand trio.
- **Backgrounds.** Warm off-white by default. Feature sections use full-bleed
  photography (the fountain at dusk, greenery, families) or a **flat brand-colour
  field** (teal or amber) carrying the decorative pattern. The guide defines a
  family of **flat vector patterns** (center / small / large / corner / triple
  motifs) and **3D icons** — playful, rounded, brand-coloured. No gradients as a
  primary device; imagery is warm, bright, natural, lightly saturated (golden-
  hour warmth, no grain, no b&w).
- **Shape language.** Soft-organic, from the mark: generous rounded corners
  (cards ~20px), full pills for buttons/tags, and an optional **leaf corner**
  (`--radius-leaf`) that rounds one pair of opposite corners for an organic
  accent. Circles (the amber disc) recur as bullets, badges and photo masks.
- **Cards.** Warm-white surface, 20px radius, hairline `#e7e3da` border OR a
  soft warm shadow (`--shadow-md`) — not both heavily. No coloured left-border
  accent stripes. Feature cards may sit on a teal/amber field with a tinted glow
  shadow.
- **Shadows.** Warm-tinted (rgba of the charcoal), soft and diffuse — the brand
  is airy and outdoor. A teal/amber glow shadow is reserved for hover on
  elevated feature cards.
- **Borders.** 1px warm hairline `#e7e3da`; 2px for strong/active. Radii do the
  heavy lifting more than borders.
- **Motion.** Gentle and unhurried. Fades + short rises on scroll; a soft spring
  (`--ease-spring`) for interactive lifts. Nothing flashy or bouncy-cartoonish
  in product UI (the playful energy lives in the illustrations, not the chrome).
- **Hover / press.** Hover: darken brand fills one step (`-hover` tokens) or
  lift with shadow + ~2px rise. Press: settle back down (translateY 0) and/or
  slightly darker; no aggressive scale. Ghost/soft buttons tint their soft
  background on hover.
- **Transparency & blur.** Sparingly — a charcoal scrim over hero photos for
  text legibility, and an occasional frosted (`--overlay-blur`) sticky header
  over imagery. Not a glassmorphism-heavy system.
- **Layout.** Roomy, centred containers (max ~1320px), generous vertical rhythm,
  4px spacing grid. RTL-first: mirror padding/alignment; logo and primary nav
  sit on the right in Arabic.

---

## ICONOGRAPHY

- **Two icon registers.**
  1. **Illustrated / 3D brand icons** — the hero register. The website uses
     **flat full-colour illustrated PNG icons** for services and wayfinding
     (restaurants, outdoor seating, dancing fountain, offices, playground, green
     spaces, global stores; dome, train, plane, bus for distances). The brand
     guide additionally defines **3D icons (أيقونات ثلاثية الأبعاد)** in the
     brand colours. These are proprietary raster/vector assets — use the brand's
     own files; do not redraw them.
  2. **Functional UI icons** — for chrome (nav arrows, close, search, chevrons,
     menu). No custom UI icon font exists in the sources, so this system
     **substitutes [Lucide](https://lucide.dev)** (1.75px stroke, rounded) via
     CDN for functional UI. **Flagged substitution** — swap for a brand set if
     one is produced.
- **Emoji / unicode as icons:** not used. Do not introduce them.
- **Available now:** the illustrated service/location icons live on the J WALK
  CDN (`https://jwalksa.com/wp-content/uploads/…` — e.g. `fountain.png`,
  `plant.png`, `shopping-store.png`, `playground.png`, `chair.png`,
  `romantic-dinner-1.png`, `dome.png`, `train.png`, `airplane1.png`, `bus.png`).
  The UI kit references these directly. **TODO for the brand:** export the guide's
  3D icons and pattern library and drop them into `assets/icons/` and
  `assets/patterns/` so the system is fully self-contained.

---

## Font substitution (action needed)

The licensed brand fonts are **not** included:

| Role   | Brand font   | Substitute (Google Fonts) |
|--------|--------------|---------------------------|
| Latin  | Condor (Light/Black) | **Archivo** (300–900) |
| Arabic | A Jannat LT (Regular/Bold) | **Almarai** (300/400/700/800) |

Both substitutes are the nearest free matches (wide geometric grotesque / modern
geometric Arabic). **Please provide the licensed Condor and A Jannat LT web
fonts** and swap the `@font-face`/`@import` in `tokens/fonts.css`.

---

## Index / manifest

- `styles.css` — the single entry point consumers link. `@import`s only.
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `spacing.css`,
  `effects.css`, `base.css`.
- `assets/` — `logo-mark.png`, `logo-lockup.png`, `logo-horizontal-white.png`.
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Brand).
- `components/` — reusable React primitives (see below) + one card HTML each.
- `ui_kits/website/` — recreation of the jwalksa.com destination site.
- `slides/` — sample presentation slides matching the proposal deck.
- `thumbnail.html` — homepage tile. `SKILL.md` — portable skill wrapper.

**Components:** Button, IconButton, Badge, Tag, StatCard, FeatureCard, Card,
SectionHeading, Input. (Standard set — no component library existed in the
sources; sized to J WALK's needs. Namespace: `JWALKDesignSystem_fc112c`.)

**UI kits:** `website` — home hero, services grid, about, stats, location.

---

## CAVEATS

- **Fonts are substituted** (Archivo/Almarai for Condor/A Jannat LT) — see above.
- **UI icons are substituted** (Lucide) — brand has no functional icon set yet.
- The brand guide's **patterns, 3D icons, stickers and merchandise artwork**
  could not be extracted (14 MB image-heavy PDF); they are described here and
  should be exported by the brand into `assets/`.
- Brand photography/illustrated icons in the UI kit are **hot-linked from the
  live CDN**; download them for a fully offline/portable system.
