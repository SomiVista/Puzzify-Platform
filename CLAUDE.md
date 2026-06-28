# CLAUDE.md — Agent Guide for Puzzify

This file tells Claude (and any Claude-based agent) how to work in the **Puzzify** repository. Read it before making changes. Keep it in sync with `docs/.md` and `docs/DESIGN.md`.

## 1. What Puzzify is
Puzzify turns any digital gift, message, or announcement into a personalized, online mini-escape room. Creators build a multi-step **Quest** in a **Creator Studio**; recipients play it on a unique link (no login, no download) and unlock a reward.

Authoritative specs:
- Product scope & requirements → `docs/prd.md`
- Design system, tokens, components → `docs/DESIGN.md`

Never contradict these. If a request conflicts with them, flag it instead of silently diverging.

## 2. Architecture you must respect
- **Frontend:** Vue 3 + Vite. Two decoupled experiences: **Creator Studio** (desktop-leaning) and **Interactive Player** (mobile-first).
- **Backend/DB/Auth:** Firebase.
- **Occasion-agnostic theming:** no holiday/event logic is hardcoded. Visual identity flows from **design tokens** (color palette, particle effects, ambient audio, box asset). A "theme" is just a token preset.
- **JSON-driven engine:** the player renders steps from a structured JSON object. Keep raw puzzle data decoupled from rendering UI.
- **i18n + RTL/LTR:** use logical properties (start/end), never hardcoded left/right. Layout must mirror cleanly for RTL (e.g. Persian) and LTR (English). Support runtime font injection.
- **Client-side security:** correct answers are stored as hashes (compare hashed input, never plaintext). The final reward payload is fetched from a secure endpoint only after all steps are solved — never ship it in the initial payload.
- **Mobile-first & performance:** ~90% of recipients open links in in-app browsers (Telegram/WhatsApp/Instagram). Player initial load must stay under 2s; touch targets ≥44px.

## 3. Testing — REQUIRED for every feature
**No functionality ships without tests. Every feature and every bug fix must include both unit and end-to-end coverage where applicable.**

- **Unit tests** for all logic: puzzle-block validators, answer hashing/comparison, JSON engine evaluation, theme/token resolution, i18n/RTL helpers, state persistence (LocalStorage/SessionStorage). Use **Vitest** + **Vue Test Utils**.
- **E2E tests** for all user-facing flows with **Playwright**: create a quest → publish → open link → solve each puzzle type (Text/Password Lock, Trivia, Image Hotspot) → reach the Grand Finale → trigger the viral CTA. Include RTL and mobile-viewport runs.
- A change is **not complete** until: new/changed code has tests, the full suite passes locally, and coverage does not regress.
- Add the matching test in the same PR as the code. If something is genuinely untestable, say why explicitly in the PR.

Expected scripts (add if missing): `npm run test` (unit), `npm run test:e2e` (Playwright), `npm run test:coverage`.

## 4. CI/CD & version control — REQUIRED
GitHub Actions is the source of truth for build, test, and deploy. Automation must stay green.

- **Every push and PR runs the full pipeline:** install → lint → unit tests → build → E2E tests. A red pipeline blocks merge.
- **Automatic deployment (CD):** merges to the default branch deploy automatically (current setup uses Vite build → `gh-pages`; the Firebase-hosted target follows the same automated pattern). Never deploy manually around CI.
- **Version control discipline:**
  - Branch per task; name branches with the ClickUp task ID (e.g. `CU-86xxxx_short-description`) so automation can link them.
  - Use Conventional Commits (`feat:`, `fix:`, `test:`, `chore:`, `ci:`...).
  - Versioning is automated: every merge to `main` auto-bumps the patch version in `package.json` and publishes a tagged GitHub Release (see `.github/workflows/release.yml`). Do **not** bump the version manually in a PR. For a minor/major release, bump `package.json` in that PR yourself and the automation will tag whatever version is on `main`.
  - Never commit secrets. Firebase keys, `GEMINI_API_KEY`, etc. live in GitHub Secrets / env, not in the repo.
- If you add or change a workflow, validate the YAML and keep `permissions` minimal.

## 5. Pull Requests — description checks are REQUIRED
A PR is incomplete until its description is correct and complete.

- **Follow the template** at `.github/PULL_REQUEST_TEMPLATE.md`. Fill in every section: **What changed**, **Why it changed**, **Technical Summary**, and the **ClickUp Task** link.
- The **ClickUp Task** link must be real and correctly formatted: `[ClickUp Task](https://app.clickup.com/t/<task_id>)`. If there genuinely is none, write `No ClickUp task ID found.` — do not leave the placeholder.
- An automated workflow (`.github/workflows/auto-pr-description.yml`) drafts the description, but the author is responsible for **reviewing and correcting it** before requesting review.
- Before requesting review, confirm the PR description: accurately reflects the diff, lists tests added/updated, notes any RTL/i18n or theming impact, and calls out migrations or breaking changes.
- Do not merge a PR whose description is empty, still contains template placeholders, or omits the ClickUp link.

## 6. Definition of Done (check before opening/merging a PR)
1. Code matches `prd.md` and `DESIGN.md`; theming stays token-driven; no hardcoded occasion logic.
2. RTL/LTR verified; mobile-first verified; player load budget respected.
3. Unit **and** E2E tests added/updated and the full suite passes.
4. CI pipeline is green; no secrets committed; version/commits follow convention.
5. PR description complete, template-compliant, with a valid ClickUp link.

## 7. Working style for the agent
- Make the smallest change that fully solves the task; prefer editing existing files over creating new ones.
- When unsure about scope, ask before large refactors.
- Keep the legacy `old-version/` untouched unless explicitly asked — it is reference only.
