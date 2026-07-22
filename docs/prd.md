# Product Requirement Document (PRD)

## Project Name: Puzzify

* **Version:** 1.1
* **Status:** Living document — MVP in development
* **Date:** July 2026

> **Versioning note:** this document's version is independent of the application release version. The app version in `package.json` (currently 1.1.x) is bumped automatically on every merge to `main` by `.github/workflows/release.yml` and does not track PRD revisions.

### Revision History

| Version | Date | Summary |
| :--- | :--- | :--- |
| 1.0 | June 2026 | Initial MVP requirements, finalized for initial development. |
| 1.1 | July 2026 | Aligned with the implemented codebase: technology stack, named theme presets, Sender Dashboard spec (Direction A), i18n locale set, testing & CI/CD requirements, URL scheme, and an implementation-status matrix. |

### How to read this document

All requirements are written in normative, forward-looking language ("must", "shall") and remain binding regardless of build state. Each functional module carries an inline status tag reflecting the codebase as of this document's date:

* **`[Shipped]`** — implemented and deployed.
* **`[In progress]`** — partially implemented (details in Section 9).
* **`[Not started]`** — specified here, not yet built.

Section 9 holds the consolidated implementation-status matrix; everything else describes the product as it must be.

---

## 1. Product Overview & Vision

### 1.1. Problem Statement

The digital gifting and online interaction industries currently face three fundamental challenges:

* **Low Emotional ROI:** Sending a digital greeting card, an instant discount code, or a gift card feels purely transactional and dry. The recipient experiences minimal lasting joy because the process requires little visible time or creativity from the sender. In gifting culture, the delivery mechanism is just as valuable as the gift itself.
* **Creative Block for Average Users:** Everyday individuals who want to surprise others for various occasions (birthdays, anniversaries, inside jokes, holidays) lack interactive tools if they don't possess programming or graphic design skills. Existing platforms are either overly simplistic (audio ecards) or overly complex (enterprise gamification suites).
* **Template Lock-in:** Current market tools force users into rigid structures (e.g., exclusively Christmas or Valentine's Day layouts). These tools lack the flexibility to seamlessly merge personal memories, localized riddles, and diverse languages into a single cohesive experience.

### 1.2. The Solution

**Puzzify** gamifies the digital gifting process, shifting the experience from a simple "delivery" to an **Exploration Experience**. Senders spend just a few minutes configuring a highly personalized digital "Quest." This investment of time and thought exponentially increases the emotional value of the gift for the recipient, even if the final reward is a simple text message.

### 1.3. Core Value Proposition

**"Puzzify turns any digital gift, message, or announcement into a personalized, online mini-escape room. Creators build the mystery; recipients play the game to unlock their reward."**

### 1.4. Target Users & Personas

| Persona | Tier | Profile & Needs |
| :--- | :--- | :--- |
| **The Thoughtful Sender** | Freemium | Wants to make a birthday or anniversary feel personal in under 10 minutes, with no design or coding skills. Builds a short quest from an occasion preset and shares the link in a chat app. The product's reference persona is *Maya Kapoor* (used across dashboard designs and mock data). |
| **The Event Perfectionist** | Premium Box | Has one high-stakes moment — a proposal, a milestone birthday, a reveal — and pays a one-time fee for unlimited steps, premium themes, and a watermark-free experience. |
| **The HR / Marketing Team** | Corporate | Uses quests for onboarding, team-building, campaigns, and launches. Needs a team dashboard with seats, white-labeling, and engagement analytics. |
| **The Recipient** | — (never a customer at first touch) | Opens the link one-handed inside a chat-app in-app browser. No install, no login, no friction. After the Grand Finale they are the viral loop's conversion target ("Create your own"). |

---

## 2. Core Pillars: Universal & Modular

To ensure Puzzify operates as a truly generic, scalable, and globally accessible platform, it is built upon four foundational pillars.

### 2.1. Occasion-Agnostic Architecture

The product does not hardcode theme logic for any specific event in the frontend or database. Instead, the platform exposes an **abstract set of visual parameters**. Seasonal events like Valentine's Day, birthdays, or corporate onboarding are merely pre-configured presets of these parameters:

| Visual Parameter | System Functionality | Practical Example |
| :--- | :--- | :--- |
| **Color Palette** | Dynamically updates the primary, secondary, and background UI variables. | A dark/detective theme for a crime mystery puzzle vs. a pastel/bright theme for a birthday. |
| **Environmental Effects (Particles)** | Renders fluid background animations with a per-theme motion direction (`fall` or `rise`). | Falling confetti for a birthday; rising dust motes for a mystery; rising embers for a spooky theme. |
| **Ambient Sound** | Background audio loops that enhance immersive interaction. | A soft lo-fi melody or a mysterious, suspenseful background track. |
| **Box Asset** | The visual model/icon of the final container that unlocks. | A classic ribboned gift box, a heavy steel safe, a cauldron, or a confidential envelope. |

**Implementation contract `[Shipped]`:** components read **only semantic design tokens** (`--pz-primary`, `--pz-surface`, `--pz-text`, …) — never raw hex values and never occasion names. A theme is a preset object in `src/themes.js` that assigns values to those token names; the `applyTheme()` helper applies it at runtime by setting the CSS variables, stamping a `data-pz-theme` attribute, flipping particle motion, and swapping the visible box asset. Adding a new occasion means adding **one preset object** — zero component edits.

#### 2.1.1. Named Theme Presets

Four presets are implemented in `src/themes.js` (the single source of truth for token values). Every palette must maintain WCAG 2.1 AA contrast on its own surfaces.

| Preset id | Label | Mood | Box Asset | Particles (motion) | Ambient Audio | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `birthday` | Birthday | Pastel bright — **default** | gift | Confetti (fall) | Lo-fi pop | Shipped |
| `mystery` | Mystery | Dark detective | safe | Dust motes (rise) | Suspense hum | Shipped |
| `spooky` | Spooky | Ember & phantom | cauldron | Embers (rise) | Eerie drone | Shipped |
| `corporate` | Corporate | Calm & credible | envelope | Soft dots (fall) | Calm focus | Shipped |

> **Note:** ambient audio currently exists as a labeled preset value only; actual playback ships with the Interactive Player (Section 4.4). Earlier design documents refer to the default preset as *"Celebration"* — that is a legacy alias for `birthday`.

### 2.2. True i18n & RTL/LTR Flexibility

* **Layout Mirroring:** The frontend component layout dynamically mirrors based on the chosen language locale. When a Right-to-Left (RTL) language such as Persian or Arabic is selected, UI alignment, button placement, and box animations flip seamlessly without breaking the layout. Left-to-Right (LTR) languages operate natively.
* **Dynamic Font Injection:** The application injects language-optimized web typography at runtime to maintain high visual standards across alphabets (see Section 2.4 for the typography stack).

**Implementation contract `[Shipped — landing page]`:**

* All layout CSS uses **logical properties** (`inset-inline-start/end`, `margin-inline-*`, `text-align: start`) — "mirror, don't flip." No hardcoded left/right.
* The document `dir` attribute is bound from the global Pinia store; selecting Persian sets `dir="rtl"` and applies the `.pz-lang-fa` class, which swaps display and UI fonts to **Vazirmatn**.
* Translations are managed with **vue-i18n**; adding a locale means adding one JSON file to `src/locales/`.

**Shipped locales (9):**

| Locale | Language | Direction | Notes |
| :--- | :--- | :--- | :--- |
| `en` | English | LTR | Default & fallback locale |
| `sv` | Swedish | LTR | |
| `es` | Spanish | LTR | |
| `fr` | French | LTR | |
| `de` | German | LTR | |
| `pt` | Portuguese | LTR | |
| `it` | Italian | LTR | |
| `fa` | Persian | **RTL** | Vazirmatn font swap via `.pz-lang-fa` |
| `ar` | Arabic | **RTL** | Vazirmatn |

**Requirement:** every authenticated surface (Sender Dashboard, Quest Builder) must consume vue-i18n message keys — no hardcoded UI strings. *(Current gap: dashboard strings are hardcoded English — see Section 9.)*

### 2.3. JSON-Driven Engine `[Not started]`

The platform enforces a strict decoupling of raw puzzle data from the rendering UI. The client-side application evaluates a structured JSON object to render the step-by-step interface dynamically. This keeps the bundle size exceptionally lightweight, allows creators to make real-time edits without rebuilding, and simplifies database storage: each quest is a single document addressed by an unguessable identifier and served on the canonical player path **`/q/{questId}`** (see Section 8 for the full URL scheme).

### 2.4. Design System as Source of Truth

The normative design reference is **`docs/design.md`** ("Puzzify Design System"). The PRD deliberately does not duplicate visual specifications; where this document and `design.md` describe the same surface, `design.md` governs appearance and this document governs behavior.

* **Tokens `[Shipped]`:** semantic `--pz-*` variables defined in `src/assets/tokens/` (`colors`, `typography`, `spacing`, `radius`, `elevation`, `motion`, `base`); theme values in `src/themes.js`.
* **Typography:** Bricolage Grotesque (display), IBM Plex Sans (UI/body), IBM Plex Mono (code/voucher codes), Vazirmatn (Persian/Arabic) — all self-hosted `.woff2`.
* **Motion:** CSS-only animation (`--pz-dur: .32s`, custom cubic-bezier easing); all decorative motion honors `prefers-reduced-motion`.
* **Seven design principles** (from `design.md`): the theme is the product · tension, then relief · thumb-first · "two seconds or it's gone" · one step, one job · mirror, don't flip · delight everyone.

---

## 3. System Architecture & Technology Stack

Puzzify is a single Vue SPA today, structured so the two experiences (Creator Studio and Interactive Player) stay decoupled and the Player can later be split/optimized independently to protect its load budget.

| Layer | Technology | Status |
| :--- | :--- | :--- |
| Framework | **Vue 3.5** (Composition API, `<script setup>`), single-page application | Shipped |
| Build tool | **Vite 6** | Shipped |
| Routing | **vue-router 4**, HTML5 history — `/` (landing), `/dashboard/*` (studio); `/q/:questId` (player) planned | Shipped / planned |
| State | **Pinia 3** — global store (`src/stores/useAppStore.js`): language, theme, particles, plan tier, quests | Shipped |
| i18n | **vue-i18n 11** — 9 locale JSON files in `src/locales/` | Shipped |
| Icons | **Lucide** (`lucide-vue-next`) | Shipped |
| Styling | Plain CSS with design tokens (`src/assets/tokens/`); no CSS framework | Shipped |
| Theming | Preset objects + `applyTheme()` in `src/themes.js` | Shipped |
| Hosting | **Firebase Hosting**, project `puzzify-platform` (SPA rewrite to `/index.html`) | Shipped |
| Backend (planned) | **Firebase Auth** (creator accounts), **Firestore** (quest documents, analytics), **Cloud Functions** (secure reward endpoint), **Storage** (media uploads) | Not started |
| Unit testing | **Vitest 2** + **Vue Test Utils** (jsdom) | Shipped |
| E2E testing | **Playwright** — Chromium desktop + Pixel 7 mobile emulation projects | Shipped |
| Linting | **ESLint 9** (flat config) + `eslint-plugin-vue` | Shipped |
| CI/CD | **GitHub Actions** (see Section 7) | Shipped |

**Repository layout (informative):**

```
src/
  views/               LandingView, CreatorDashboard + dashboard/* child views
  components/
    sections/          Landing-page sections (hero, pricing, use cases, …)
    layout/            Header, footer
    dashboard/         Sidebar, header, quest cards, KPI row, empty state
    ui/                Shared kit: PzButton, PzBadge, IconButton, BoxStage
  stores/              Pinia store(s)
  locales/             9 locale JSON files
  assets/tokens/       Design-token CSS files
  themes.js            Theme presets + applyTheme()
e2e/                   Playwright specs
docs/                  prd.md, design.md, dashboard design handoff
.github/workflows/     ci-cd.yml, release.yml, auto-pr-description.yml
old-version/           Legacy prototype — reference only, out of scope
```

---

## 4. Functional Requirements & Module Architecture

The application splits into two decoupled core experiences — the **Creator Studio** for the sender and the **Interactive Player** for the recipient — fronted by a public landing page. Modules are ordered below by user journey.

### 4.1. Public Landing Page `[Shipped]`

A dedicated marketing and product introduction page at `/` that showcases the platform, highlights use cases, and drives new creator sign-ups.

Shipped sections, in order: **Hero** (headline, primary CTA, animated phone mock of the Player with a live particle field and theme switching), **Trust strip**, **How it works** (create → send → play), **Puzzle types showcase** (the three MVP blocks), **Use cases**, **Why Puzzify**, **Partners** (Puzzify × WelloWork collaboration block), **Pricing** (the three tiers of Section 5.1), **Final CTA**, and a footer.

Requirements:

* The header provides a **theme switcher** (the four presets of §2.1.1) and a **language switcher** (the nine locales of §2.2); the whole page re-skins and mirrors instantly.
* All copy comes from vue-i18n; the page must render correctly in RTL.
* Primary CTAs lead into quest creation. *Until creator authentication ships, CTAs route to the dashboard directly (see Section 9).*

### 4.2. Creator Studio (Sender Experience)

#### 4.2.1. Sender Dashboard `[In progress]`

The creator's home after sign-in: view, manage, and track every quest. The layout follows the approved **"Direction A"** design (persistent left sidebar + airy card grid — see `docs/README.md` and the standalone HTML handoff in `docs/`). Routes: `/dashboard` redirects to `/dashboard/quests`, with sibling views `analytics`, `presets`, and `settings`.

* **Sidebar:** logo lockup; "Workspace" navigation — **Quests**, **Analytics**, **Presets**, **Settings**; an **Upgrade card** pinned to the bottom, shown **only when `planTier === 'free'`** (hidden for premium/corporate); user row with avatar initials, name, and plan label.
* **Header:** time-of-day greeting with the creator's name; a search field that live-filters the quest list by name; notification bell; avatar. All interactive targets ≥ 44 px.
* **Create hero:** "Start a new gift" panel with a primary **New quest** button and **six occasion presets** that pre-seed the quest's theme, ambient audio, and reward box: Birthday, Anniversary, Holiday (→ `birthday` theme), Mystery night (→ `mystery`), Corporate (→ `corporate`), and Start blank (creator's choice). Selecting either path opens the Quest Builder (§4.2.2).
* **KPI row:** four derived (never stored) metrics — **Total gifts** (with published count), **Total plays**, **Average completion** (published quests only), **Average solve time** (played quests only).
* **Quest list:** segmented filter **All / Published / Drafts** (client-side), sort control (default: recent activity), and a responsive card grid. Each **quest card** shows: occasion kicker, quest name, status badge (Published = success tone, Draft = neutral), step count with per-step type glyphs (`lock` / `trivia` / `hotspot`), metrics (plays, average solve time, reward type `video` / `letter` / `voucher`), a completion-rate bar, and a footer with relative last-activity time, a **copy-link** button (clipboard + confirmation toast), and **Open** (→ quest editor).
* **Empty state (first run):** centered BoxStage gift illustration, "Create your first gift" heading, New quest CTA, the same six occasion presets, and the signature line *"The delivery is the gift."*
* **State model:** `planTier: 'free' | 'premium' | 'corporate'`; `quests[]` (name, occasion, steps, step kinds, status, plays, completion, average solve, reward type, last activity); search / filter / sort state. KPIs are computed from `quests[]`.
* **Data requirement:** the dashboard must load the signed-in creator's quests and play analytics from Firestore. *Currently it renders hardcoded mock data (six sample quests, persona "Maya Kapoor") — see Section 9.*
* Analytics, Presets, and Settings views are routed placeholders pending specification. `[Not started]`

#### 4.2.2. Quest Builder — Canvas-Style Design Engine `[Not started]`

* **Canvas-Style Design Engine:** a rich design experience featuring drag-and-drop interfaces and canvas-style tools for building the puzzle flow and placing elements intuitively.
* **Live Output Preview:** a real-time preview panel allowing the sender to interact with and test the quest exactly as the recipient will see it.
* **Flow Manager:** a step-by-step configuration wizard to add, delete, or reorder steps. For the MVP, gameplay progression is strictly **Linear** (Step N must evaluate to true before Step N+1 unlocks).

#### 4.2.3. Theme Configurator `[Not started]`

An interface to assign one of the visual theme presets (§2.1.1), select ambient audio, and toggle opening particle effects. Occasion presets chosen on the dashboard (§4.2.1) pre-populate this configuration.

#### 4.2.4. Per-Step Advanced Settings `[Not started]`

Senders can optionally configure three fields for each individual step:

* **Hint Text:** a contextual clue revealed only when the recipient clicks the hint/lightbulb icon.
* **Success Message:** a short toast or text block appearing immediately after a correct answer (e.g., "Correct! You always remembered that date.").
* **Max Attempts:** an optional integer to cap how many times a recipient can guess before being locked out or penalized.

#### 4.2.5. Publishing & Unique URL Generation `[Not started]`

Upon publishing, the studio generates a unique, secure URL on the `/q/{questId}` scheme (Section 8) for the creator to copy and send directly to the recipient. Identifiers must be unguessable.

### 4.3. MVP Puzzle Block Library `[Not started]`

Each puzzle block operates as an isolated, reusable frontend component accepting standardized props and emitting a boolean (true/false) validity state to the main engine. The canonical block ids below are already used across the dashboard data model and design system:

1. **`lock` — Text/Password Lock:** displays a prompt requiring an exact string match in a text field. Features a toggleable configuration for case-sensitivity. *Example: "What is the name of the first city we traveled to together?"*
2. **`trivia` — Trivia / Multiple Choice:** renders a question alongside 2 to 4 options with a single correct index. Supports media attachments (image/video) as a visual clue for the question.
3. **`hotspot` — Image Inspect / Hotspot Lock:** the creator uploads an image and defines a bounding-box target using relative X/Y coordinates. The recipient must click or tap the correct area on the image to pass. *Example: "Tap on the hidden location of your real physical gift in this room photo."*

*(A non-interactive visual mock of the `lock` block exists in the landing-page hero; no playable block is implemented yet.)*

### 4.4. Interactive Player (Recipient Experience) `[Not started]`

* **Zero-Friction Access:** recipients **must not** be forced to download an application, register, or authenticate. Access is handled strictly via the unique URL token at `/q/{questId}`.
* **In-App Browser Compatibility:** the player must work flawlessly inside Telegram, WhatsApp, and Instagram in-app browsers (see Section 6.3).
* **State Persistence:** gameplay progress caches instantly to LocalStorage or SessionStorage. If the recipient closes the tab or is interrupted, re-opening the link returns them exactly to their furthest unlocked step.
* **Dedicated Output Page:** a focused, single-purpose interface for the recipient to play, one step per screen, with no distraction.
* **Ambient Audio:** the theme's audio loop plays only after an explicit user gesture (mobile browsers block autoplay); a visible control toggles it.
* **The Grand Finale (Reward Screen):** a dedicated, high-impact component that mounts only when the final puzzle condition is met. It supports three modular reward layouts, matching the reward ids used in the quest data model:
  * `video` — an embedded streaming video;
  * `letter` — an animated rich-text letter with a typewriter effect;
  * `voucher` — a digital voucher/gift-card display with an instant copy-to-clipboard action.
* The Grand Finale hosts the viral-loop CTA (Section 5.2).

### 4.5. Client-Side Data Security `[Not started]`

To prevent tech-savvy recipients from opening browser developer tools to read raw JSON answers or find the final payload URL, the system applies these safeguards:

* Correct answers never exist as plain text in the payload; they are stored as cryptographic hashes (Web Crypto **SHA-256**). The recipient's input is normalized (trimmed; case-folded when the step is case-insensitive), hashed on the fly, and compared against the stored hash.
* The final reward payload (the Grand Finale content) is completely omitted from the initial network payload and is fetched only from a secure server endpoint (Firebase Cloud Function / callable) after all step solutions are verified.

> **Scope note:** these measures are deterrence against casual inspection, not cryptographic secrecy — anyone able to solve the quest can, by definition, obtain the reward.

---

## 5. Monetization & Viral Loop

### 5.1. Monetization Strategy

The platform utilizes a combination of freemium limits, micro-transactions, and subscription tiers. The tier contents below are the public pricing shipped on the landing page (source of truth for copy: the `pricing` block in `src/locales/en.json`); prices are subject to review before payment processing launches.

| Tier | Price | Target Audience | Features & Packaging |
| :--- | :--- | :--- | :--- |
| **Freemium** | $0 — free forever | Casual, everyday senders | • Up to 3 linear steps per quest. • Base puzzle modules (`lock`, `trivia`). • Birthday & Mystery themes. • Puzzify watermark on the player. |
| **Premium Box** | $4 — one-time, per quest | One-off event creators | • Unlimited gameplay steps. • Premium themes, particles & ambient audio (all presets, incl. `spooky`). • Image Hotspot module. • No watermark. |
| **Corporate** | Custom — billed annually | HR teams & marketing agencies | • Team dashboard & seats. • White-labeling & custom domains. • Analytics & play tracking (completion rates, solve times, engagement). • Priority support. |

*Monetization enforcement (tier gating, payments) is not yet implemented — the pricing page is display-only today (Section 9).*

### 5.2. The Viral Loop `[Not started — player-side]`

Because Puzzify is an inherently shared utility, the product leverages built-in organic growth mechanics:

```
[Sender Creates Quest] ──> [Recipient Opens Link] ──> [Recipient Plays & Unlocks Reward]
                                                                    │
                                                                    ▼
[New Account Registration] <── [Clicks "Create Your Own"] <── [Grand Finale + High-Impact CTA]
```

* **Post-Game Call to Action (CTA):** immediately after viewing their reward, recipients encounter an elegant, animated panel reading: *"Want to surprise someone else with a custom puzzle? Create your first quest for free!"* This converts immediate emotional delight directly into product adoption.
* **Polished Watermarking:** in the free tier, a minimalist, aesthetic brand badge sits subtly within the player UI, inviting curious players to click through and explore the creation engine themselves.

---

## 6. Non-Functional Requirements

### 6.1. Backend & Database Infrastructure

The server, database, and authentication layers use **Firebase** for rapid development, real-time capabilities, and seamless frontend integration.

* **In use today:** Firebase **Hosting** (project `puzzify-platform`), serving the built SPA with a rewrite to `/index.html`; deploys are fully automated (Section 7).
* **Planned:** Firebase **Auth** (creator accounts), **Firestore** (quest documents, play analytics), **Cloud Functions** (secure reward endpoint, §4.5), and **Storage** (creator media uploads).

### 6.2. Performance & Core Web Vitals

The Player client must be optimized for lightweight network delivery, achieving an initial load time **under 2 seconds** even on throttled mobile networks. The JSON-driven engine (§2.3) and CSS-only motion (§2.4) exist specifically to protect this budget.

### 6.3. Mobile-First Responsive Design

Over 90% of recipients open their links inside social in-app browsers (Telegram, WhatsApp, Instagram). Every puzzle component, interaction model, and form input must be optimized for mobile viewports, with touch targets **≥ 44 px** and safe-area awareness. The Creator Studio is desktop-leaning; the Player is strictly mobile-first.

### 6.4. Accessibility

* Every theme preset maintains **WCAG 2.1 AA** contrast on its own surfaces.
* Visible keyboard focus: 4 px ring (`--pz-ring`) plus focus border color (`--pz-focus`) on all interactive elements.
* All decorative motion (particles, box float, typewriter) is disabled under `prefers-reduced-motion`; no infinite decorative loops for users who opt out.

### 6.5. Infrastructure Elasticity

Backend API routing and storage must use elastic scaling capable of absorbing massive traffic spikes on global hallmark dates (Valentine's Day, New Year's Eve, major holidays).

---

## 7. Quality Engineering: Testing & CI/CD

No functionality ships without tests; automation is the source of truth for build, test, and deploy.

### 7.1. Testing Requirements

* **Unit tests** (Vitest + Vue Test Utils, jsdom) for all logic: puzzle-block validators, answer hashing/comparison, JSON engine evaluation, theme/token resolution, i18n/RTL helpers, state persistence, and store getters. Existing coverage: `App` shell and the global store.
* **E2E tests** (Playwright) run on two projects — **Chromium desktop** and **Pixel 7 mobile emulation** — and must cover every user-facing flow as it ships: landing (exists), dashboard journey, and eventually create → publish → open link → solve each puzzle type → Grand Finale → viral CTA. RTL (Persian) smoke coverage is required.
* Scripts: `npm run test` (unit), `npm run test:e2e` (Playwright), `npm run test:coverage`, `npm run lint`.
* A change is complete only when new/changed code has tests, the full suite passes, and coverage does not regress.

### 7.2. CI/CD Pipeline (GitHub Actions)

| Workflow | Trigger | Behavior |
| :--- | :--- | :--- |
| `ci-cd.yml` | Every push/PR to `main` | Validate: install → lint → unit tests → build → Playwright E2E (report uploaded as artifact). PRs (non-fork) additionally deploy the build to a Firebase Hosting **`dev` preview channel**; pushes to `main` deploy to the **live** channel at `https://puzzify-platform.web.app`. A red pipeline blocks merge. |
| `release.yml` | Push to `main` | Auto-bumps the patch version in `package.json`, commits with `[skip ci]`, and publishes a tagged GitHub Release with generated notes. **Never bump the patch version manually.** |
| `auto-pr-description.yml` | PR opened/updated | Drafts the PR description from commits + diff against the repo PR template (Gemini-assisted); the author must review and correct it before requesting review. |

**Version-control discipline:** branch per task named with the ClickUp task id (`CU-86xxxx_short-description`); Conventional Commits; no secrets in the repo (Firebase service account, `GEMINI_API_KEY` live in GitHub Secrets).

---

## 8. URL & Environment Scheme

| Surface | Path / URL | Status |
| :--- | :--- | :--- |
| Landing page | `/` | Shipped |
| Sender Dashboard | `/dashboard` → `/dashboard/quests` · `/dashboard/analytics` · `/dashboard/presets` · `/dashboard/settings` | In progress |
| Quest Builder | `/dashboard/quests/:id/edit` *(proposed)* | Not started |
| Player | `/q/{questId}` — unguessable id, no authentication | Not started |
| Production hosting | `https://puzzify-platform.web.app` (Firebase `live` channel) | Shipped |
| PR previews | Firebase Hosting `dev` preview channel | Shipped |
| Custom domain | `puzzify.me` (target production domain; the `/q/` path scheme is normative regardless of host) | Not started |

---

## 9. Implementation Status (as of July 2026)

> *This section describes the state of the codebase at the date above. Everything else in this document is normative and forward-looking.*

| Module | PRD ref | Status | Notes |
| :--- | :--- | :--- | :--- |
| Public landing page (all sections, 9 locales, RTL) | 4.1 | **Shipped** | |
| Design system: tokens + 4 theme presets | 2.1, 2.4 | **Shipped** | `src/assets/tokens/`, `src/themes.js` |
| i18n framework + 9 locales | 2.2 | **Shipped (landing only)** | Dashboard not localized |
| Sender Dashboard — shell + Quests view | 4.2.1 | **In progress** | Mock data; create/open/copy-link actions inert |
| Dashboard — Analytics / Presets / Settings | 4.2.1 | **Not started** | Route stubs only |
| Quest Builder (canvas, live preview, flow manager) | 4.2.2–4.2.5 | **Not started** | |
| Quest data model + CRUD (Firestore) | 4.2, 6.1 | **Not started** | |
| Creator authentication (Firebase Auth) | 4.2, 6.1 | **Not started** | Landing CTAs route straight to the dashboard |
| Puzzle blocks (`lock` / `trivia` / `hotspot`), playable | 4.3 | **Not started** | Visual `lock` mock in landing hero only |
| Interactive Player + `/q/:id` + state persistence | 4.4 | **Not started** | |
| Grand Finale (`video` / `letter` / `voucher`) | 4.4 | **Not started** | |
| Viral CTA + watermark on player | 5.2 | **Not started** | |
| Answer hashing + secure reward endpoint | 4.5 | **Not started** | |
| Ambient audio playback | 2.1 | **Not started** | Theme audio is a label only |
| Monetization enforcement / payments | 5.1 | **Not started** | Pricing page is display-only |
| Analytics pipeline | 5.1 (Corporate) | **Not started** | Dashboard KPIs derive from mock data |
| Hosting, CI/CD, release automation | 7, 8 | **Shipped** | |

### Known gaps / documentation debt

* Dashboard UI strings are hardcoded English — must migrate to vue-i18n (§2.2 requirement).
* Dashboard runs on mock data (six sample quests, persona "Maya Kapoor") pending Auth + Firestore.
* `docs/design.md` §5 still lists Spooky and Corporate presets as "roadmap"; all four presets ship in `src/themes.js`.
* `CLAUDE.md` / `GEMINI.md` reference `docs/DESIGN.md` (wrong case — file is `docs/design.md`) and mention a legacy `gh-pages` deploy; actual CD target is Firebase Hosting.
* `docs/README.md` (dashboard handoff) uses the legacy theme alias "Celebration" for `birthday`.
* `npm run test:coverage` requires a `@vitest/coverage-*` provider that is not yet in `devDependencies`.

---

## Appendix A — References

* `docs/design.md` — Puzzify Design System (tokens, components, theming, RTL, design principles). **Normative for all visuals.**
* `docs/README.md` + `docs/Creator Dashboard - Direction A (standalone).html` — Sender Dashboard design handoff (Direction A).
* `src/themes.js` — canonical theme preset ids and token values.
* `src/locales/en.json` — canonical marketing/pricing copy.
* `CLAUDE.md` / `GEMINI.md` — agent working agreements (testing, CI/CD, PR discipline).

## Appendix B — Glossary

| Term | Meaning |
| :--- | :--- |
| **Quest** | One complete Puzzify experience: an ordered set of steps plus a theme and a reward, shared via a unique link. |
| **Step** | A single screen in a quest containing exactly one puzzle block. MVP progression is strictly linear. |
| **Puzzle Block** | A reusable, isolated puzzle component (`lock`, `trivia`, `hotspot`) that receives standardized props and emits a boolean validity state. |
| **Grand Finale** | The reward screen that mounts only after every step is solved. |
| **Reward** | The Grand Finale payload; one of `video`, `letter` (typewriter), or `voucher` (copyable code). |
| **Theme Preset** | A named set of design-token values plus box asset, particle motion, and audio (`birthday`, `mystery`, `spooky`, `corporate`). |
| **Occasion Preset** | A dashboard shortcut (e.g., Anniversary, Mystery night) that pre-seeds a new quest's theme, audio, and reward box. |
| **Creator / Sender** | The authenticated user who builds and publishes quests in the Creator Studio. |
| **Recipient** | The person who plays a quest via its link — no account, no install. |
| **Watermark** | The Puzzify brand badge on free-tier players; part of the viral loop and removed in paid tiers. |
