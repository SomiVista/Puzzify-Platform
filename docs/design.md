---
name: Puzzify Default Design System
description: The complete occasion-agnostic design system for the Puzzify platform.
---

# Puzzify Design System

### 1. Brand Identity & Personality

- **Brand Personality Keywords:** Mysterious, Delightful, Playful, Premium, Warm.
- **Tone of Voice:** Encouraging, theatrical, and clear. Successes are celebrated ("You unlocked it!"), errors are playful but guide the user ("Not quite! Try another angle."), and system messaging is crisp and frictionless.
- **Logo Concept:** A wordmark combining an elegant, modern sans-serif with a subtle puzzle piece motif integrated into the negative space of the 'P'. The accompanying icon is an abstract, geometric lock mechanism that visually resembles a wrapped gift box.

---

### 2. Color System

The semantic design tokens are mapped to Light and Dark mode values. The Dark mode is the primary UX experience (moody, deep-space aesthetic), while the Light mode provides a clean, editorial alternative.

| Semantic Token | Dark Mode Default | Light Mode |
|---|---|---|
| `--color-surface-base` | `#0B1020` | `#F7F8FC` |
| `--color-surface-elevated` | `#121A31` | `#FFFFFF` |
| `--color-surface-overlay` | `rgba(8,12,24,0.82)` | `rgba(255,255,255,0.88)` |
| `--color-text-primary` | `#F5F7FF` | `#182033` |
| `--color-text-secondary` | `#B8C1E6` | `#5E6886` |
| `--color-text-disabled` | `#6B749A` | `#A0A8BE` |
| `--color-text-on-accent` | `#08101F` | `#FFFFFF` |
| `--color-accent-primary` | `#7C5CFF` | `#6D5EF7` |
| `--color-accent-secondary` | `#21D4C3` | `#18B8A7` |
| `--color-accent-glow` | `#A78BFA` | `#B9B3FF` |
| `--color-border-default` | `#273253` | `#D9DFF0` |
| `--color-border-focus` | `#8B7CFF` | `#6D5EF7` |
| `--color-border-error` | `#FF6B8B` | `#E85D75` |
| `--color-feedback-success` | `#4ADE80` | `#1EAE62` |
| `--color-feedback-warning` | `#FBBF24` | `#D99A1A` |
| `--color-feedback-error` | `#FF6B6B` | `#E85D75` |
| `--color-feedback-info` | `#38BDF8` | `#2C8DEB` |

#### Seasonal Theme Override Patches

1. **Valentine's Day** (warm reds, rose pinks, candlelight golds)
   - `--color-surface-base`: `#2B0A12`
   - `--color-accent-primary`: `#FF4D6D`
   - `--color-accent-secondary`: `#FFB3C6`
   - `--color-accent-glow`: `#FF758F`

2. **Mystery / Detective** (deep charcoal, cold blue, amber spotlight)
   - `--color-surface-base`: `#1A1A1A`
   - `--color-accent-primary`: `#F59E0B`
   - `--color-accent-secondary`: `#3B82F6`
   - `--color-accent-glow`: `#FBBF24`

3. **Birthday / Celebration** (vivid confetti brights, electric violet)
   - `--color-surface-base`: `#171032`
   - `--color-accent-primary`: `#D946EF`
   - `--color-accent-secondary`: `#06B6D4`
   - `--color-accent-glow`: `#E879F9`

**Accessibility:** All text/background token pairs (e.g., `--color-text-primary` on `--color-surface-base`) meet or exceed WCAG AA contrast ratios (minimum 4.5:1 for body text).

---

### 3. Typography System

- **Font Stack:** 
  - **Latin:** `Inter` (Clean, highly legible on mobile, handles varied weights beautifully).
  - **RTL (Persian/Arabic):** `Vazirmatn` (Excellent pairing with Inter, ensuring RTL parity).
- **Type Scale** (Ratio 1.25, Base 16px):
  - `--text-xs`: 0.75rem (12px), Line Height 1.5, Tracking 0.02em
  - `--text-sm`: 0.875rem (14px), Line Height 1.5, Tracking 0.01em
  - `--text-base`: 1rem (16px), Line Height 1.5, Tracking 0
  - `--text-lg`: 1.25rem (20px), Line Height 1.4, Tracking -0.01em
  - `--text-xl`: 1.56rem (25px), Line Height 1.3, Tracking -0.015em
  - `--text-2xl`: 1.95rem (31px), Line Height 1.2, Tracking -0.02em
  - `--text-3xl`: 2.44rem (39px), Line Height 1.2, Tracking -0.02em
  - `--text-display`: 3.05rem (49px), Line Height 1.1, Tracking -0.025em

- **Semantic Roles:**
  - **Display Heading:** `h1`, `--text-display`, bold (Hero, finale screen).
  - **Section Heading:** `h2`, `--text-2xl`, semibold (Step titles).
  - **Body:** `p`, `--text-base`, regular (Reading text).
  - **Caption / Label:** `--text-sm`, medium (Hints, timestamps).
  - **Interactive Label:** `--text-base`, semibold (Button text).
  - **Monospaced:** `JetBrains Mono` or similar system monospace, `--text-sm` (Voucher codes, IDs).

---

### 4. Spacing & Layout System

- **Base Unit:** 4px
- **Scale:**
  - `--space-1`: 0.25rem (4px)
  - `--space-2`: 0.5rem (8px)
  - `--space-3`: 0.75rem (12px)
  - `--space-4`: 1rem (16px)
  - `--space-6`: 1.5rem (24px)
  - `--space-8`: 2rem (32px)
  - `--space-12`: 3rem (48px)
  - `--space-16`: 4rem (64px)
  - `--space-20`: 5rem (80px)

- **Component Density Variants:** 
  - *Compact:* Studio sidepanels.
  - *Comfortable:* Standard components, inputs.
  - *Spacious:* Player puzzle cards to emphasize focus.

- **Grid System:**
  - **Mobile:** Single column, full-bleed with `--space-4` horizontal padding.
  - **Tablet:** 2-column layout for studio.
  - **Desktop:** 3-zone layout for Studio (Left Sidebar 300px / Center Canvas 1fr / Right Panel 300px); single-column centered for Player.
- **Container Widths:** 
  - Landing page sections: max `1200px`
  - Player puzzle card: max `600px`

---

### 5. Elevation & Depth System

- `--elevation-0`: `none` (flat surface background)
- `--elevation-1`: `0 2px 4px rgba(0,0,0,0.1)` (Cards, list items)
- `--elevation-2`: `0 4px 8px rgba(0,0,0,0.12), 0 2px 4px rgba(0,0,0,0.08)` (Active cards, dropdowns)
- `--elevation-3`: `0 12px 24px rgba(0,0,0,0.15), 0 4px 8px rgba(0,0,0,0.1)` (Modals, floating panels)
- `--elevation-4`: `0 24px 48px rgba(0,0,0,0.2), 0 12px 24px rgba(0,0,0,0.1)` + `backdrop-filter: blur(8px)` (Grand Finale container)
- `--glow-accent`: `0 0 16px var(--color-accent-glow)` (Success states, CTA buttons)

---

### 6. Border & Shape System

- **Border Radius Scale:**
  - `--radius-sm`: 0.25rem (4px)
  - `--radius-md`: 0.5rem (8px)
  - `--radius-lg`: 1rem (16px)
  - `--radius-xl`: 1.5rem (24px)
  - `--radius-pill`: 9999px
  - `--radius-circle`: 50%
- **Border Widths:**
  - `--border-thin`: 1px
  - `--border-default`: 2px
  - `--border-thick`: 4px
- **Shape Language:** Elements are soft and prominently rounded (using `--radius-lg` and `--radius-md`). This friendly, pill-like geometric approach prevents the UI from feeling like strict corporate software, elevating the gamified and gift-giving nature.

---

### 7. Motion & Animation System

- **Timing Tokens:**
  - `--duration-instant`: 0ms
  - `--duration-fast`: 150ms (Micro-interactions)
  - `--duration-normal`: 300ms (Standard transitions)
  - `--duration-slow`: 600ms (Emphasis transitions)
  - `--duration-cinematic`: 1200ms (Finale reveals)
- **Easing Tokens:**
  - `--ease-linear`: `linear`
  - `--ease-out`: `cubic-bezier(0, 0, 0.2, 1)`
  - `--ease-in-out`: `cubic-bezier(0.4, 0, 0.2, 1)`
  - `--ease-spring`: `cubic-bezier(0.175, 0.885, 0.32, 1.275)`
  - `--ease-bounce`: `cubic-bezier(0.68, -0.55, 0.265, 1.55)`

- **Named Animation Patterns:**
  1. **Step Unlock:** Element scales up to `1.05`, border flashes success, spring easing.
  2. **Wrong Answer Shake:** 3 rapid horizontal translations (`-8px` to `8px`), fast duration.
  3. **Step Transition:** Fade out and vertical slide (`20px`), normal duration.
  4. **Grand Finale Entrance:** Slow slide up with scale up, cinematic duration.
  5. **Particle Burst:** Confetti translation and rotation using keyframes.
  6. **Typewriter Reveal:** Staggered opacity transitions per character.
  7. **Hint Reveal:** Vertical height and opacity interpolation.
  8. **Glitch / Suspense Pulse:** Subtle opacity and sub-pixel translations.

- **Reduced Motion:** If `prefers-reduced-motion` is true, `--duration-fast` and spring/bounce easings collapse to `opacity` fades, and durations are halved or disabled.

---

### 8. Iconography System

- **Style:** Filled (for the Player, solid and tactile feel) and Outline (for the Studio, precision and clarity).
- **Sizes:** Small (16px), Medium (24px), Large (32px), XL (48px). All wrapped in touch targets of min `44x44px`.
- **Core Key Icons:** Hint (Lightbulb), Correct (Check), Incorrect (X), Lock, Unlock, Steps, Share, Copy, Theme, Sound, Progress, User, Reward, Settings.
- **Animation:** The Lock icon scales into an Unlock icon on correct answers; sync/loading icons utilize infinite rotation.

---

### 9. Component Library Specification

**Foundations:**
- **Button:** 
  - *Variants:* Primary (`bg: accent-primary`), Secondary (`bg: surface-elevated`), Ghost, Icon-only.
  - *States:* Hover scales to `1.02`, active to `0.98`.
- **Input:** 
  - *Default:* `surface-elevated` background, `border-default`. 
  - *Focus:* `border-focus`, adds `--glow-accent`.
- **Badge:** Uses `surface-elevated` or `accent-secondary` for statuses.
- **Tooltip:** Hover-triggered helper text, `elevation-2`, `radius-sm`.
- **Toast:** Auto-dismiss notifications, `elevation-3`, specific feedback background colors.

**Creator Studio:**
- **StepCard:** Draggable card (`elevation-1`), collapsible content.
- **ThemeConfigurator:** Visual selector with `--border-focus` indicating the active swatch.
- **PublishButton:** Transitions text to a spinner, then to a checkmark when complete.
- **LivePreviewPanel:** `iframe` container styled with a phone-like border and `radius-xl`.

**Player:**
- **PuzzleCard:** The main interaction surface. `surface-elevated`, `radius-lg`, heavily padded (`--space-8`).
- **AnswerInput:** Specialized text input, highly centered, large text.
- **HintButton:** Distinct `text-accent-primary` coloring, triggers drop-down animation.
- **MultipleChoiceOption:** Standard list options that highlight `--border-focus` on click.
- **GrandFinaleScreen:** Utilizes `--elevation-4` and cinematic motion.

---

### 10. Pattern Library

1. **Linear Step Progression:** Current step is at 100% opacity, upcoming steps are blurred or `opacity: 0.5` with a lock icon.
2. **Correct Answer Celebration:** Form validation -> feedback success color -> correct sound -> Step Unlock animation -> auto-scroll.
3. **Wrong Answer Feedback:** Shake animation triggers -> text input clears -> optional "Try again" toast.
4. **Theme Switching:** Selecting a theme injects CSS custom properties to `:root`, instantly cascading across all variables.
5. **Grand Finale Sequence:** Final lock breaks -> cinematic pause -> particle burst -> main container elevates.
6. **Loading States:** Uses skeleton screens with a subtle gradient sweep animation over `surface-elevated` blocks.

---

### 11. Accessibility Framework

- **Color Contrast:** The token architecture restricts foreground/background combinations to those meeting WCAG AA.
- **Focus Management:** All interactive elements receive a `2px solid var(--color-border-focus)` outline with a `2px` offset.
- **ARIA Live Regions:** All toasts, hint reveals, and incorrect answer feedbacks are wrapped in `aria-live="polite"` or `aria-live="assertive"`.
- **Touch Targets:** The base spacing system forces buttons and inputs to be at least `44px` tall on mobile.

---

### 12. Design Tokens — Export Format

#### CSS Custom Properties

```css
:root {
  /* Colors - Dark Mode Default */
  --color-surface-base: #0B1020;
  --color-surface-elevated: #121A31;
  --color-surface-overlay: rgba(8, 12, 24, 0.82);
  --color-text-primary: #F5F7FF;
  --color-text-secondary: #B8C1E6;
  --color-text-disabled: #6B749A;
  --color-text-on-accent: #08101F;
  --color-accent-primary: #7C5CFF;
  --color-accent-secondary: #21D4C3;
  --color-accent-glow: #A78BFA;
  --color-border-default: #273253;
  --color-border-focus: #8B7CFF;
  --color-border-error: #FF6B8B;
  --color-feedback-success: #4ADE80;
  --color-feedback-warning: #FBBF24;
  --color-feedback-error: #FF6B6B;
  --color-feedback-info: #38BDF8;

  /* Typography */
  --font-family-latin: 'Inter', sans-serif;
  --font-family-rtl: 'Vazirmatn', sans-serif;
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.25rem;
  --text-xl: 1.56rem;
  --text-2xl: 1.95rem;
  --text-3xl: 2.44rem;
  --text-display: 3.05rem;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;

  /* Borders */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  --radius-pill: 9999px;
  --radius-circle: 50%;
  --border-thin: 1px;
  --border-default: 2px;
  --border-thick: 4px;

  /* Shadows / Elevation */
  --elevation-0: none;
  --elevation-1: 0 2px 4px rgba(0, 0, 0, 0.1);
  --elevation-2: 0 4px 8px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08);
  --elevation-3: 0 12px 24px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1);
  --elevation-4: 0 24px 48px rgba(0, 0, 0, 0.2), 0 12px 24px rgba(0, 0, 0, 0.1);
  --glow-accent: 0 0 16px var(--color-accent-glow);

  /* Animation */
  --duration-instant: 0ms;
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 600ms;
  --duration-cinematic: 1200ms;
  --ease-linear: linear;
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

[data-theme="light"] {
  --color-surface-base: #F7F8FC;
  --color-surface-elevated: #FFFFFF;
  --color-surface-overlay: rgba(255, 255, 255, 0.88);
  --color-text-primary: #182033;
  --color-text-secondary: #5E6886;
  --color-text-disabled: #A0A8BE;
  --color-text-on-accent: #FFFFFF;
  --color-accent-primary: #6D5EF7;
  --color-accent-secondary: #18B8A7;
  --color-accent-glow: #B9B3FF;
  --color-border-default: #D9DFF0;
  --color-border-focus: #6D5EF7;
  --color-border-error: #E85D75;
  --color-feedback-success: #1EAE62;
  --color-feedback-warning: #D99A1A;
  --color-feedback-error: #E85D75;
  --color-feedback-info: #2C8DEB;
}
```

#### JSON Tokens (W3C DTCG Format)

```json
{
  "color": {
    "surface": {
      "base": { "$value": "#0B1020", "$type": "color" },
      "elevated": { "$value": "#121A31", "$type": "color" }
    },
    "text": {
      "primary": { "$value": "#F5F7FF", "$type": "color" },
      "secondary": { "$value": "#B8C1E6", "$type": "color" }
    },
    "accent": {
      "primary": { "$value": "#7C5CFF", "$type": "color" },
      "secondary": { "$value": "#21D4C3", "$type": "color" }
    }
  }
}
```
