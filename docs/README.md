# Handoff: Puzzify Creator Dashboard — Direction A

## Overview
This is the **Creator Dashboard** for Puzzify — the home screen a creator lands on after signing in. Puzzify turns any digital gift, message, or announcement into a personalized online mini-escape room ("Quest"); recipients play it on a unique link and unlock a reward. The dashboard lets a creator start a new gift, browse occasion presets, see headline metrics, and manage their existing quests.

**Direction A** is the chosen layout: a **persistent left sidebar + an airy card grid**. (An alternative "Direction B" — top nav + dense data table — was explored but is **not** part of this handoff.) Two states are documented: **Populated** (creator has quests) and **Empty** (first run).

## About the Design Files
The files in this bundle are **design references created in HTML** — prototypes showing the intended look and behavior. They are **not** production code to copy directly. The task is to **recreate this design in the target codebase's existing environment** (the source product is Vue 3 + Firebase — see the repo note under Assets) using its established components, patterns, and styling tokens. If no environment exists yet, choose the most appropriate framework and implement there.

Bundled files:
- `Creator Dashboard - Direction A (standalone).html` — open this in any browser to view the design offline (self-contained, no setup).
- `Creator Dashboard - Direction A.dc.html` — the source prototype. It composes the Puzzify design-system bundle (`Button`, `Badge`, `BoxStage` components) and reads its design tokens. Useful for inspecting exact markup and token usage.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, and component styling are all design-system-accurate. Recreate the UI pixel-perfectly using the codebase's existing component library and the Puzzify token set documented below. All values map to CSS custom properties (`--pz-*`); wire those to the codebase's theme rather than hard-coding hex where possible.

---

## Screens / Views

### 1. Dashboard — Populated
**Purpose:** Creator's home. Start a new gift, pick an occasion preset, scan KPIs, and manage existing quests.

**Layout:** Full-height two-column shell, rounded `22px`, max content width ~`1260px`.
- **Sidebar** — fixed `250px` wide, `var(--pz-surface)` background, `1px` `--pz-hairline` inline-end border, `22px 16px` padding, vertical flex.
- **Main** — flex-fill, soft radial wash background `radial-gradient(120% 90% at 88% -12%, var(--pz-surface-2), var(--pz-bg) 56%)`, vertical flex (header + scrolling content).

**Components:**

**Sidebar**
- *Logo lockup* (top): `32px` gradient rounded square (`linear-gradient(140deg, var(--pz-primary), var(--pz-secondary))`, radius `10px`) holding a white "candle" mark (`7×11px`, radius `99px 99px 4px 4px`), beside the "Puzzify" wordmark — Bricolage Grotesque 800, `20px`, `letter-spacing:-.02em`, `--pz-text`.
- *"WORKSPACE" kicker* — `10.5px`, weight 700, `letter-spacing:.13em`, uppercase, `--pz-muted`.
- *Nav items* — flex row, `gap:11px`, `padding:11px 12px`, radius `12px`, `14px` text. Active item: `--pz-surface-2` background, `--pz-primary` text, weight 700. Inactive: transparent background, `--pz-muted`, weight 600. Items: Quests (active), Analytics, Presets, Settings, each with an 18px stroke icon.
- *Upgrade card* (only when plan = free, pinned to bottom via `margin-top:auto`) — `1px --pz-border`, radius `16px`, `15px` padding, `radial-gradient(140% 140% at 100% 0%, var(--pz-surface-3), var(--pz-surface-2))` background. Title "You're on Free" (Bricolage 800, 14px), body copy 12px `--pz-muted`, full-width small primary Button "Upgrade a gift".
- *User row* — top hairline border. `38px` circular avatar ("MK", `--pz-surface-2` bg, `--pz-primary` text), name "Maya Kapoor" (13.5px/700) + plan label (11.5px `--pz-muted`).

**Main header** (`padding:26px 30px 16px`)
- H1 greeting "Good evening, Maya" — Bricolage 800, `30px`, `letter-spacing:-.025em`, `--pz-text`.
- Subhead "You build the mystery — they play to unlock their reward." — 14px `--pz-muted`.
- Right cluster: search field (`240px` wide, `1.5px --pz-border`, radius `14px`, magnifier icon + "Search gifts…" placeholder), `44×44` bell button (radius `13px`, `1px --pz-border`), `44×44` gradient avatar circle "MK". **All interactive targets ≥ 44px.**

**Create hero** (card: radius `20px`, `1px --pz-border`, `--pz-surface`, shadow `--pz-e-1`)
- Upper band background `radial-gradient(130% 170% at 0% 0%, var(--pz-surface-2), var(--pz-surface) 60%)`.
- Kicker "START A NEW GIFT" (11px/700, `letter-spacing:.14em`, uppercase, `--pz-primary`).
- H2 "Turn a moment into a mini-escape room" (Bricolage 800, 26px, max-width 460px).
- Body "Pick an occasion to begin with a matching theme, audio and reward box — or build from scratch." (13.5px `--pz-muted`).
- Large primary Button "New quest" with plus icon.
- *Preset grid* — `1px dashed --pz-border` top divider, 6-column grid, `gap:12px`. Each preset: column flex card, `1px --pz-border`, radius `14px`, `--pz-bg`, `13px 14px` padding — `36px` icon tile (radius `11px`, `--pz-surface-2` bg, `--pz-primary` icon), label (13.5px/700), theme caption (10.5px `--pz-muted`).
  - Presets: **Birthday** (cake, Celebration) · **Anniversary** (heart, Celebration) · **Mystery night** (search, Mystery) · **Corporate** (briefcase, Either theme) · **Holiday** (snow, Celebration) · **Start blank** (plus, Any theme).

**Stats row** — 4-column grid, `gap:14px`. Each stat card: `--pz-surface`, `1px --pz-border`, radius `16px`, `16px 18px` padding, shadow `--pz-e-1`. Label row (11px/700 uppercase `--pz-muted`, 15px `--pz-secondary` icon), value (Bricolage 800, `28px`), delta (11.5px/600 `--pz-secondary`).
  - Stats: **Total gifts** 6 / "4 published" (quests icon) · **Total plays** 217 / "+48 this week" (eye icon) · **Avg completion** 82% / "Across published" (trend icon) · **Avg solve** 4m 48s / "−12s vs last month" (clock icon).

**Quests section**
- Section header: H2 "Your quests" (Bricolage 800, 20px). Right controls: segmented filter (All [active, `--pz-primary` fill, `--pz-on-primary` text] · Published · Drafts) inside a `--pz-surface` pill (radius `12px`, 4px padding); plus a "Recent" sort button (sort icon, `1px --pz-border`, radius `12px`).
- *Quest card grid* — 3 columns, `gap:16px`. Each card: column flex, `--pz-surface`, `1px --pz-border`, radius `18px`, shadow `--pz-e-1`, `overflow:hidden`.
  - **Header:** kicker (occasion, 11px/700 uppercase `--pz-secondary`) + name (Bricolage 800, 18px); right-aligned status **Badge** — tone `success` for "Published", tone `neutral` for "Draft".
  - **Step row:** "N steps" (12px `--pz-muted`) · dot separator · row of `24px` step-kind glyph tiles (radius `7px`, `--pz-surface-2` bg, `--pz-secondary` icon). Step kinds: `lock`, `trivia`, `hotspot`.
  - **Metric row** (`gap:16px`): Plays / Avg solve / Reward. Labels 10px/700 uppercase `--pz-muted`; values IBM Plex Mono 600, 15px `--pz-text`. Reward shows a 15px `--pz-secondary` icon + label.
  - **Completion bar:** label + mono % value; `6px` track (radius `99px`, `--pz-surface-2`) with `--pz-secondary` fill at the completion percentage.
  - **Footer:** top hairline, `--pz-bg` background. Left: clock icon + relative time ("Played 3h ago" / "Edited 2d ago"). Right: `34×34` "copy link" icon button + secondary small Button "Open".

  Quest data (6 cards):
  - **A Year of Us** — Anniversary · 3 steps [lock, trivia, hotspot] · Draft · plays — · completion — (0%) · solve — · Letter reward · Edited 2d ago
  - **Mum's 60th** — Birthday · 4 steps [lock, trivia, trivia, hotspot] · Published · 38 plays · 82% · 4m 12s · Voucher · Played 3h ago
  - **Onboarding — Q3** — Corporate · 5 steps [lock, trivia, hotspot, trivia, lock] · Published · 126 plays · 71% · 6m 03s · Video · Played 12m ago
  - **Sara, will you?** — Proposal · 3 steps [trivia, hotspot, lock] · Published · 1 play · 100% · 7m 41s · Letter · Played yesterday
  - **Dad's retirement** — Celebration · 4 steps [lock, trivia, hotspot, trivia] · Published · 52 plays · 88% · 3m 55s · Video · Played 1d ago
  - **Team offsite hunt** — Corporate · 5 steps [hotspot, lock, trivia, hotspot, lock] · Draft · plays — · completion — (0%) · solve — · Voucher · Edited 5h ago

### 2. Dashboard — Empty (first run)
**Purpose:** First-run experience when the creator has no quests. Same sidebar shell; main column is a centered empty state.
- Header simplified: H1 "Your quests" (Bricolage 800, 24px) + bell + avatar.
- Centered column: **BoxStage** illustration (`asset="gift"`, `120px`), H2 "Create your first gift" (Bricolage 800, 30px), body "Build a quest in a few minutes — a few clues, then the reward. Start from an occasion and we'll set the theme, audio and box for you." (15px `--pz-muted`, max-width 430px), large primary Button "New quest".
- "OR START FROM AN OCCASION" kicker (11px/700 uppercase), then the same 6 presets in a 6-column grid (centered variant: icon tile above label, no theme caption).
- Footer signature line "The delivery is the gift." (Bricolage 800, 15px, `--pz-muted`).

---

## Interactions & Behavior
- **New quest / preset cards** → open the Creator Studio quest builder (preset preseeds theme + audio + reward box).
- **Filter segmented control** (All / Published / Drafts) → client-side filter of the quest list.
- **Sort button** ("Recent") → opens sort menu; default sort is most-recent activity.
- **Copy-link button** on each card → copies the quest's public play URL to clipboard (show a Toast confirmation — the design system ships a `Toast` component).
- **Open button** → navigates into that quest's editor.
- **Upgrade a gift** (free plan only) → upgrade flow. Hide the upgrade card entirely for premium/corporate plans.
- **Hover:** subtle only — the design relies on color/fill, not large hover FX. Quest cards and preset buttons may lift slightly or shift border toward `--pz-primary` on hover; keep it understated.
- **Focus:** use the signature brand ring — `box-shadow: 0 0 0 4px var(--pz-ring)` + `--pz-focus` border — on all focusable controls (search, buttons, nav links).
- **Empty state** renders when the quest list is empty; otherwise render the populated grid.
- **Motion:** CSS-only, gate decorative motion behind `prefers-reduced-motion`. Duration `--pz-dur .32s`, easing `cubic-bezier(.2,.8,.2,1)`. No infinite decorative loops, no parallax, no bounce.

## State Management
- `theme`: `'celebration' | 'mystery'` — applied via `data-theme` / `.pz-theme-mystery` on the dashboard root; flips every `--pz-*` token. Default `celebration`.
- `planTier`: `'free' | 'premium' | 'corporate'` — controls the sidebar upgrade card visibility and the plan label ("Free plan" / "Premium" / "Corporate workspace").
- `quests`: array of quest objects (fields: name, kicker/occasion, steps, stepKinds[], status, plays, completion %, avgSolve, rewardType, lastActivity). Drives the card grid; empty → empty state.
- `filter`: `'all' | 'published' | 'drafts'` — segmented control selection.
- `sort`: current sort key (default recent activity).
- Aggregate KPIs (total gifts, total plays, avg completion, avg solve) are **derived** from the quest list.
- Data fetching: load the signed-in creator's quests + play analytics (the source product uses Firebase).

## Design Tokens
Source of truth: the Puzzify token CSS (`tokens/colors.css`, `tokens/layout.css`). Wire these to the codebase theme. Celebration is default; Mystery values listed where they differ.

**Colors — Celebration (default)**
- `--pz-bg` `#FFF6F1` · `--pz-surface` `#FFFFFF` · `--pz-surface-2` `#FFEEF3` · `--pz-surface-3` `#FFF9EC`
- `--pz-text` `#2B2230` · `--pz-muted` `#7C6F79` · `--pz-border` `#F2DBE4` · `--pz-hairline` `#F6E7EC`
- `--pz-primary` `#D62E6C` · `--pz-on-primary` `#FFFFFF` · `--pz-secondary` `#1C9A92` · `--pz-accent` `#F4B740`
- `--pz-success` `#1E9E6A` · `--pz-error` `#D64545` · `--pz-focus` `#D62E6C` · `--pz-ring` `rgba(214,46,108,.26)` · `--pz-glow` `rgba(244,183,64,.55)`

**Colors — Mystery (dark)**
- `--pz-bg` `#0E1118` · `--pz-surface` `#161B26` · `--pz-surface-2` `#1E2531` · `--pz-surface-3` `#11202A`
- `--pz-text` `#ECEFF4` · `--pz-muted` `#94A0B0` · `--pz-border` `#2A3340` · `--pz-hairline` `#222B38`
- `--pz-primary` `#E0A92E` · `--pz-on-primary` `#15110A` · `--pz-secondary` `#4FB0A5` · `--pz-accent` `#C7604F`
- `--pz-success` `#56B47E` · `--pz-error` `#E06A6A` · `--pz-focus` `#E0A92E` · `--pz-ring` `rgba(224,169,46,.30)` · `--pz-glow` `rgba(79,176,165,.5)`

**Spacing scale** — 4 · 8 · 12 · 16 · 24 · 32 · 48px (`--pz-sp-1`…`--pz-sp-7`).

**Radius** — sm `8px` · md `14px` · lg `20px` · xl `30px` · full `999px`. Buttons/inputs use md; cards use lg; the quest cards use `18px`; hero `20px`; dashboard shell `22px`; chips/avatars use full.

**Elevation**
- `--pz-e-1` `0 1px 2px rgba(12,14,20,.06), 0 2px 6px rgba(12,14,20,.05)` — buttons, chips, small/stat/quest cards.
- `--pz-e-2` `0 8px 22px rgba(12,14,20,.12)` — raised cards.
- `--pz-e-3` `0 26px 70px rgba(8,9,14,.45)` — phone frame / studio window.
- Dashboard outer shell uses `0 30px 70px rgba(8,9,14,.18)` (presentation framing only — drop this when embedding in a real app shell).
- Mystery deepens e-1/e-2 (see Mystery colors).

**Typography**
- Display: **Bricolage Grotesque** 800, tight tracking `-0.025em` — H1/hero/section titles. Scale used: 30px (greeting), 26px (hero H2), 24px (empty H1), 20px (section H2), 18px (quest name), 14px (sidebar upgrade title).
- UI / body: **IBM Plex Sans** 400–700 — nav, labels, body copy (11–15px).
- Mono: **IBM Plex Mono** 500/600 — quest metric values, completion %, reward codes.
- RTL (Persian/Arabic) swaps display + UI to **Vazirmatn**.
- Kicker/label convention: UPPERCASE only for small labels with wide tracking (`.12–.16em`); everything else is sentence case.

**Motion** — `--pz-dur .32s`, `--pz-ease cubic-bezier(.2,.8,.2,1)`.

## Assets
- **Icons:** inline stroke SVGs (~2px stroke, round caps/joins — Lucide/Feather visual language), colored via `currentColor`. The prototype defines a `<symbol>` sprite (`#i-search`, `#i-plus`, `#i-quests`, `#i-analytics`, `#i-presets`, `#i-settings`, `#i-link`, `#i-more`, `#i-clock`, `#i-eye`, `#i-trend`, `#i-arrow`, `#i-sort`, `#i-bell`, `#i-lock`, `#i-trivia`, `#i-hotspot`, `#i-video`, `#i-letter`, `#i-voucher`, `#i-cake`, `#i-heart`, `#i-briefcase`, `#i-snow`, `#i-gift`). In the target codebase use **Lucide** (matches the stroke weight) or the app's existing icon set.
- **Logo:** gradient (primary→secondary) rounded square + white candle mark + "Puzzify" wordmark in Bricolage 800. Source files in the design system: `assets/puzzify-logo.svg`, `assets/puzzify-mark.svg`.
- **BoxStage illustrations** (empty state): filled, token-colored brand SVGs (gift / safe / envelope) — these are illustrations, not icons. Reproduce from the design system's `BoxStage` component.
- **Fonts:** Bricolage Grotesque, IBM Plex Sans, IBM Plex Mono, Vazirmatn.
- **Design-system components used:** `Button` (variants: primary default, secondary; sizes sm/lg; full-width), `Badge` (tones: success, neutral), `BoxStage` (asset: gift/envelope). Use the codebase's equivalents or port these.
- **Source product repo:** `SomiVista/Puzzify-Platform` (Vue 3 + Firebase) — reference for the quest engine, i18n, and data model.

## Files
- `Creator Dashboard - Direction A (standalone).html` — self-contained, openable offline.
- `Creator Dashboard - Direction A.dc.html` — source prototype (depends on the Puzzify design-system bundle + tokens).
- `README.md` — this document.
