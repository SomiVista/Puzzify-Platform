# 🎁 Puzzify

**The delivery is the gift.**

Puzzify turns any digital gift, message, or announcement into a personalized, online mini-escape room. Creators build the mystery in a few minutes — recipients play the game on a unique link (no app, no login) to unlock their reward.

[![CI/CD](https://github.com/SomiVista/Puzzify-Platform/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/SomiVista/Puzzify-Platform/actions/workflows/ci-cd.yml)
[![Release](https://img.shields.io/github/v/release/SomiVista/Puzzify-Platform)](https://github.com/SomiVista/Puzzify-Platform/releases)
[![Vue 3](https://img.shields.io/badge/Vue-3.5-42b883?logo=vuedotjs&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase Hosting](https://img.shields.io/badge/Hosting-Firebase-ffca28?logo=firebase&logoColor=black)](https://puzzify-platform.web.app)

**🌐 Live:** [puzzify-platform.web.app](https://puzzify-platform.web.app)

---

## Why Puzzify?

Sending a gift card or a greeting link feels transactional — the recipient clicks once and it's over. Puzzify replaces "delivery" with an **exploration experience**:

1. **🛠️ Create** — Pick an occasion, add puzzle steps (a password riddle, a trivia question, a hidden spot in a photo), attach the reward.
2. **🔗 Send** — Share one unique link in any chat app.
3. **🎉 Play** — The recipient solves each step and unlocks the **Grand Finale**: a video, an animated letter, or a copyable voucher code.

A few minutes of the sender's thought and creativity become the most valuable part of the gift.

## ✨ Feature Highlights

- **🎨 Occasion-agnostic theming** — No holiday logic is hardcoded anywhere. A theme is just a preset of design tokens (colors, particle effects, ambient audio, box asset). Four presets ship today, and adding a new occasion means adding one preset object — zero component changes:

  | Preset | Mood | Box | Particles |
  | :--- | :--- | :--- | :--- |
  | 🎂 Birthday *(default)* | Pastel bright | Gift | Falling confetti |
  | 🕵️ Mystery | Dark detective | Safe | Rising dust motes |
  | 🎃 Spooky | Ember & phantom | Cauldron | Rising embers |
  | 💼 Corporate | Calm & credible | Envelope | Soft dots |

- **🌍 True internationalization** — 9 languages (English, Swedish, Spanish, French, German, Portuguese, Italian, Persian, Arabic) with **full RTL mirroring** built on CSS logical properties and runtime font injection (Vazirmatn for Persian/Arabic).
- **🧩 Modular puzzle blocks** — Text/Password Lock, Trivia (with media clues), and Image Hotspot; each is an isolated component that emits a simple pass/fail signal to a JSON-driven engine.
- **🔒 Answers stay secret** — Solutions are stored as SHA-256 hashes, never plaintext, and the reward payload is only fetched from the server *after* every step is solved — opening DevTools spoils nothing.
- **📱 Mobile-first player** — Built for the in-app browsers (Telegram, WhatsApp, Instagram) where ~90% of recipients open their links: sub-2-second load budget, ≥44 px touch targets, progress saved locally so an interruption never loses your place.
- **♿ Accessible by design** — WCAG 2.1 AA contrast in every theme, visible focus rings, and all decorative motion respects `prefers-reduced-motion`.

## 🚧 Project Status

Puzzify is an MVP in active development.

| | Module |
| :--- | :--- |
| ✅ Shipped | Marketing landing page (9 locales, RTL, live theme switching) · design-token system with 4 theme presets · CI/CD with automated releases and Firebase deploys |
| 🔨 In progress | Creator dashboard — quest overview, KPIs, occasion presets ([Direction A design](docs/README.md)) |
| 🗺️ Planned | Quest builder (canvas editor + live preview) · interactive player at `/q/{questId}` · playable puzzle blocks · Grand Finale rewards · Firebase Auth + Firestore · monetization |

The full spec lives in the [PRD](docs/prd.md); the [design system](docs/design.md) governs all visuals.

## 🧰 Tech Stack

**Vue 3.5** (Composition API) · **Vite 6** · **vue-router 4** · **Pinia 3** · **vue-i18n 11** · **Lucide** icons · plain CSS on semantic design tokens (no CSS framework) · **Firebase** (Hosting today; Auth, Firestore, Cloud Functions planned) · **Vitest** + **Vue Test Utils** · **Playwright** · **ESLint 9** · **GitHub Actions**

## 🚀 Getting Started

Requires **Node 20+**.

```bash
git clone https://github.com/SomiVista/Puzzify-Platform.git
cd Puzzify-Platform
npm install
npm run dev
```

The app starts on the Vite dev server — `/` is the landing page, `/dashboard` is the creator dashboard.

### Scripts

| Command | What it does |
| :--- | :--- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run test` | Unit tests (Vitest + Vue Test Utils) |
| `npm run test:e2e` | End-to-end tests (Playwright: Chromium desktop + Pixel 7 mobile) |
| `npm run test:coverage` | Unit tests with coverage |
| `npm run lint` / `lint:fix` | Lint (ESLint flat config) |

## 📁 Project Structure

```
src/
  views/               Landing page + creator dashboard views
  components/
    sections/          Landing sections (hero, pricing, use cases, …)
    layout/            Header, footer
    dashboard/         Sidebar, quest cards, KPI row, empty state
    ui/                Shared kit: PzButton, PzBadge, IconButton, BoxStage
  stores/              Pinia store (language, theme, plan tier, quests)
  locales/             9 locale JSON files
  assets/tokens/       Design-token CSS (colors, type, spacing, motion, …)
  themes.js            Theme presets + applyTheme()
e2e/                   Playwright specs
docs/                  PRD, design system, dashboard design handoff
old-version/           Legacy prototype — reference only
```

## 🔄 CI/CD

Every push and PR runs the full pipeline: **install → lint → unit tests → build → E2E**. Pull requests deploy to a Firebase Hosting `dev` preview channel; merges to `main` deploy to [production](https://puzzify-platform.web.app), auto-bump the patch version, and publish a tagged GitHub Release. A red pipeline blocks merge — no manual deploys, no manual version bumps.

## 🤝 Contributing

- **Branch per task**, named with the ClickUp task id: `CU-86xxxx_short-description`.
- **[Conventional Commits](https://www.conventionalcommits.org/)**: `feat:`, `fix:`, `test:`, `chore:`, `ci:`, …
- **Tests are required** — every feature and bug fix ships with unit coverage and, for user-facing flows, Playwright E2E coverage (including RTL and mobile viewports).
- Fill in every section of the [PR template](.github/PULL_REQUEST_TEMPLATE.md); an automated workflow drafts the description, but the author reviews and corrects it.
- Never commit secrets — Firebase credentials and API keys live in GitHub Secrets.

## 📚 Documentation

| Document | Contents |
| :--- | :--- |
| [Product Requirements (PRD)](docs/prd.md) | Vision, functional requirements, monetization, implementation status |
| [Design System](docs/design.md) | Tokens, typography, components, theming, RTL, design principles |
| [Dashboard Design Handoff](docs/README.md) | Creator dashboard "Direction A" specification |

---

<p align="center"><em>Build the mystery. Let them play to unlock it.</em> 🗝️</p>
