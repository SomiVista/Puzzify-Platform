# Puzzify Design System

> A token-driven system for building gift-quest experiences. One component set;
> the **theme** (a set of token values) is the product. Swap tokens → re-skin
> everything. Flip one attribute → mirror everything for RTL.

---

## 1. Foundations

### 1.1 Core idea — semantic over primitive

Components **only ever read semantic token names** (`--pz-primary`, `--pz-surface`,
`--pz-text`…). They never reference a raw hex value or a holiday. A *theme* is a JSON
preset that assigns values to those names. The runtime flips one `data-theme`
attribute and every component re-skins with zero component edits.

```
Primitive values  ─►  Semantic tokens  ─►  Components
   #D62E6C              --pz-primary         button, lock, dot…
   (per theme)          (stable name)        (never see the hex)
```

**Themeable axes:** `color` · `particles` · `ambient audio` · `box asset`

### 1.2 Typography

| Role | Family | Stack |
|------|--------|-------|
| Display | **Bricolage Grotesque** | `'Bricolage Grotesque', system-ui, sans-serif` |
| UI / body | **IBM Plex Sans** | `'IBM Plex Sans', system-ui, sans-serif` |
| Mono / code | **IBM Plex Mono** | `'IBM Plex Mono', ui-monospace, monospace` |
| RTL (Persian) | **Vazirmatn** | `'Vazirmatn', system-ui, sans-serif` (overrides both display + UI under `.pz-lang-fa`) |

Tokens: `--pz-font-display`, `--pz-font-ui`.

**Type scale**

| Step | Family | Size | Weight | Use |
|------|--------|------|--------|-----|
| display | display | 30–38px | 800 | Hero / finale title |
| title | display | 20–22px | 700 | Card titles |
| body | ui | 14px | 400 | Prompts, paragraphs |
| caption | ui | 12px | 400 | Meta, watermark |

### 1.3 Color tokens

Stored as semantic names. Two shipped presets below share **every name** — only the values differ.

| Token | Role | Birthday (default) | Mystery |
|-------|------|-------------------|---------|
| `--pz-bg` | Canvas | `#FFF6F1` | `#0E1118` |
| `--pz-surface` | Cards | `#FFFFFF` | `#161B26` |
| `--pz-surface-2` | Raised / chips | `#FFEEF3` | `#1E2531` |
| `--pz-surface-3` | Tertiary fill | `#FFF9EC` | `#11202A` |
| `--pz-text` | Text | `#2B2230` | `#ECEFF4` |
| `--pz-muted` | Secondary text | `#7C6F79` | `#94A0B0` |
| `--pz-border` | Borders | `#F2DBE4` | `#2A3340` |
| `--pz-hairline` | Dividers | `#F6E7EC` | `#222B38` |
| `--pz-primary` | Primary action | `#D62E6C` | `#E0A92E` |
| `--pz-on-primary` | Text on primary | `#FFFFFF` | `#15110A` |
| `--pz-secondary` | Accent action | `#1C9A92` | `#4FB0A5` |
| `--pz-accent` | Highlight / hint | `#F4B740` | `#C7604F` |
| `--pz-success` | Correct | `#1E9E6A` | `#56B47E` |
| `--pz-error` | Incorrect | `#D64545` | `#E06A6A` |
| `--pz-focus` | Focus border | `#D62E6C` | `#E0A92E` |
| `--pz-ring` | Focus ring | `rgba(214,46,108,.26)` | `rgba(224,169,46,.30)` |
| `--pz-glow` | Hint glow | `rgba(244,183,64,.55)` | `rgba(79,176,165,.5)` |

> **Contrast:** every theme targets **WCAG AA**.

### 1.4 Spacing scale

`4 · 8 · 12 · 16 · 24 · 32 · 48`

| Token | Value |
|-------|-------|
| `--pz-sp-1` | 4px |
| `--pz-sp-2` | 8px |
| `--pz-sp-3` | 12px |
| `--pz-sp-4` | 16px |
| `--pz-sp-5` | 24px |
| `--pz-sp-6` | 32px |
| `--pz-sp-7` | 48px |

### 1.5 Radius

| Token | Value |
|-------|-------|
| `--pz-r-sm` | 8px |
| `--pz-r-md` | 14px |
| `--pz-r-lg` | 20px |
| `--pz-r-xl` | 30px |
| `--pz-r-full` | 999px |

### 1.6 Elevation

| Token | Shadow | Use |
|-------|--------|-----|
| `--pz-e-1` | `0 1px 2px rgba(12,14,20,.06), 0 2px 6px rgba(12,14,20,.05)` | Buttons, chips, small cards |
| `--pz-e-2` | `0 8px 22px rgba(12,14,20,.12)` | Raised cards, voucher |
| `--pz-e-3` | `0 26px 70px rgba(8,9,14,.45)` | Phone frame, studio window |

> Mystery theme deepens `--pz-e-1` / `--pz-e-2` for dark-surface legibility.

### 1.7 Motion

- Duration token: `--pz-dur: .32s` (320ms)
- Easing token: `--pz-ease: cubic-bezier(.2, .8, .2, 1)`
- CSS-only animations; **honors `prefers-reduced-motion`** (`.pz-anim` is disabled).

| Keyframe | Purpose |
|----------|---------|
| `pzFall` | Birthday particles fall + spin |
| `pzRise` | Mystery particles rise + scale |
| `pzBars` | Ambient-audio equalizer bars |
| `pzFloatBox` | Box asset idle float |
| `pzPulse` | Focus / hotspot ring pulse |
| `pzCaret` | Input caret blink |

---

## 2. Components

All components are token-only and direction-agnostic (logical `start`/`end`).

### 2.1 Puzzle block
The core unit — one puzzle per screen. Variants by type:

- **Password Lock** — kicker chip (puzzle type) → title → prompt → focused input
  with blinking caret → hint button + attempts counter → primary submit.
- **Trivia (MCQ)** — optional media placeholder → radio options; selected option
  uses `--pz-success` border + filled radio.
- **Image inspect / hotspot** — scene image with a pulsing `--pz-primary` ring
  marking the tappable clue.

**States:** Correct (`--pz-success`) · Incorrect (`--pz-error`) · Locked
(muted, "solve previous") · Hint (`--pz-accent` + `--pz-glow`).

### 2.2 Buttons

| Variant | Fill | Text | Border |
|---------|------|------|--------|
| Primary | `--pz-primary` | `--pz-on-primary` | none |
| Secondary | `--pz-surface-2` | `--pz-primary` | `--pz-border` |
| Disabled | transparent | `--pz-muted` | `--pz-border`, `opacity:.6` |

Padding `10–14px`, radius `--pz-r-md`, weight 700, `--pz-e-1`. Min hit target **44px**.

### 2.3 Inputs
Background `--pz-bg`, `1.5px` border. **Focus:** `--pz-focus` border + `0 0 0 4px var(--pz-ring)`. **Error:** `--pz-error` border + text. Text aligns `start` (RTL-safe).

### 2.4 Step indicator
Row of dots; active dot widens to `30px` and fills `--pz-primary`, completed dots fill, upcoming dots are `--pz-border`. Animated width transition.

### 2.5 Toggle / switch
46×27 (or 44×26) pill track. On = `--pz-primary` + knob to end; Off = `--pz-border` + knob to start. White knob with `--pz-e-1`.

### 2.6 Toast
`--pz-text` background, `--pz-bg` text, `--pz-success` status dot. Radius `--pz-r-md`.

### 2.7 Box stage (swappable asset)
One framed 128px tile; the artwork is **token-selected** (`box.asset`). Shipped assets: **gift** (Birthday default), **safe** (Mystery default), **envelope**. Idle `pzFloatBox` + `pzPulse` ring.

### 2.8 Voucher / reward
Surface card: label + small gift icon → title → description → dashed-border code row (mono) with copy button (turns `--pz-success` "Copied!").

### 2.9 Particle field
Decorative overlay of 14–16 token-colored shapes. Birthday falls (`pzFall`), Mystery rises (`pzRise`). Toggleable; off by default respects reduced-motion.

---

## 3. Surfaces / patterns

- **Player (mobile)** — 312×646 phone frame, single puzzle per step, thumb-first,
  ambient-audio control, watermark. Two key screens: *puzzle step* and *grand finale*.
- **Creator Studio (desktop)** — windowed builder: left quest rail → center
  linear flow builder (draggable step cards on a dotted canvas) → right live
  preview + theme configurator (preset picker, particle / audio toggles).

---

## 4. Internationalization (RTL)

RTL is **automatic**. Every component uses logical properties
(`inset-inline-start/end`, `margin-inline-*`, `text-align:start`), so a Persian
locale mirrors layout, alignment, and box animations with **zero new CSS**.

- Switch sets `dir="rtl"` and adds `.pz-lang-fa`, which swaps both font tokens to **Vazirmatn**.
- Chrome / control bar stays `dir="ltr"` (neutral shell).

---

## 5. Theming — add an occasion

A theme is a JSON preset of token values. No component edits. The runtime flips
one `data-theme` attribute and every component re-skins.

```jsonc
// themes/spooky.json
{
  "id": "spooky",
  "color.primary": "#7C5CFF",
  "color.bg": "#120E1F",
  "box.asset": "cauldron",
  "particles": "embers",
  "audio": "low-hum"
}
```

Shipped: **Birthday** (pastel-bright, default) · **Mystery** (dark detective).
Roadmap presets: **Spooky**, **Corporate**.

---

## 6. Design principles

1. **The theme is the product.** Every pixel reads a token — never a hardcoded holiday.
2. **Tension, then relief.** Motion earns the unlock; celebration is the payoff, not the noise.
3. **Thumb-first.** The recipient is one-handed inside a chat app — reachable, ≥44px, safe-area aware.
4. **Two seconds or it's gone.** CSS-driven motion, zero heavy decoration on the Player.
5. **One step, one job.** A single puzzle on screen; clarity beats density.
6. **Mirror, don't flip.** Logical start/end so Persian RTL feels native.
7. **Delight everyone.** AA contrast in every theme; motion you can switch off.

---

*Source of truth: `Puzzify System.dc.html` — the live, themeable showcase. Toggle
its controls to see every token, component, and screen re-skin and mirror.*
