/**
 * Quest data model — the JSON contract the Player engine will evaluate (PRD §2.3).
 *
 * Everything here is pure and framework-free on purpose: the Creator Studio edits
 * these objects, the Player will render them, and both sides share one definition
 * of "what a step is" and "what unlocks next".
 *
 * Progression is strictly LINEAR for the MVP (PRD §4.2.2): step N must evaluate
 * true before step N+1 unlocks. `isStepUnlocked` is the single source of truth.
 */

/** Canonical puzzle block ids (PRD §4.3). */
export const STEP_KINDS = ['lock', 'trivia', 'hotspot']

/** Max attempts is optional; when set it is an integer in this range (PRD §4.2.4). */
export const MAX_ATTEMPTS_MIN = 1
export const MAX_ATTEMPTS_MAX = 10

/** Trivia supports 2–4 options with a single correct index (PRD §4.3). */
export const TRIVIA_MIN_OPTIONS = 2
export const TRIVIA_MAX_OPTIONS = 4

/** Reward layouts offered by the Grand Finale (PRD §4.4). */
export const REWARD_TYPES = ['letter', 'video', 'voucher']

let idCounter = 0

/** Client-side id for draft objects. Published ids come from Firestore later. */
export function createId(prefix = 'step') {
  idCounter += 1
  return `${prefix}_${idCounter.toString(36)}${Math.random().toString(36).slice(2, 8)}`
}

/** Default block-specific configuration for a puzzle kind. */
export function defaultConfig(kind) {
  switch (kind) {
    case 'lock':
      return { answer: '', caseSensitive: false }
    case 'trivia':
      return { options: ['', ''], correctIndex: 0 }
    case 'hotspot':
      // Target is a bounding box in PERCENT of the image, so it survives any
      // render size and mirrors correctly under RTL without recalculation.
      return { imageUrl: '', target: { x: 35, y: 35, w: 30, h: 30 } }
    default:
      return {}
  }
}

/**
 * Build a step. `overrides` may set any field, including partial `config`
 * (merged over the kind's defaults).
 */
export function createStep(kind, overrides = {}) {
  if (!STEP_KINDS.includes(kind)) {
    throw new Error(`Unknown puzzle kind: ${kind}`)
  }
  const { config, ...rest } = overrides
  return {
    id: createId(),
    kind,
    title: '',
    prompt: '',
    // Per-step advanced settings (PRD §4.2.4) — all optional.
    hintText: '',
    successMessage: '',
    maxAttempts: null,
    ...rest,
    config: { ...defaultConfig(kind), ...(config || {}) }
  }
}

/** Blank quest draft. `occasion` is a label only — no behavior keys off it. */
export function createQuestDraft(overrides = {}) {
  return {
    id: createId('quest'),
    name: '',
    occasion: '',
    status: 'Draft',
    flow: [],
    theme: { preset: 'birthday', ambientAudio: true, particles: true },
    reward: { type: 'letter' },
    ...overrides
  }
}

/* ── Flow operations — all pure, all return a new array ─────────────── */

function clampIndex(length, index) {
  if (!Number.isFinite(index)) return length
  return Math.max(0, Math.min(length, Math.trunc(index)))
}

/** Insert `step` at `index` (clamped); omitting `index` appends. */
export function insertStep(steps, step, index = steps.length) {
  const next = steps.slice()
  next.splice(clampIndex(steps.length, index), 0, step)
  return next
}

/** Remove the step at `index`. Out-of-range indexes are a no-op. */
export function removeStep(steps, index) {
  if (index < 0 || index >= steps.length) return steps.slice()
  const next = steps.slice()
  next.splice(index, 1)
  return next
}

/**
 * Move the step at `from` so it lands at `to`. Out-of-range `from` is a no-op;
 * `to` is clamped into the array.
 */
export function moveStep(steps, from, to) {
  if (from < 0 || from >= steps.length) return steps.slice()
  const next = steps.slice()
  const [moved] = next.splice(from, 1)
  next.splice(clampIndex(next.length, to), 0, moved)
  return next
}

/**
 * Move the step at `from` to the drop slot `to`, where slots are the gaps
 * between cards (0 = before the first card, steps.length = after the last).
 * A card dragged onto a gap after its own position keeps its place, which is
 * what the canvas drop indicator implies visually.
 */
export function moveStepToSlot(steps, from, slot) {
  if (from < 0 || from >= steps.length) return steps.slice()
  const target = slot > from ? slot - 1 : slot
  return moveStep(steps, from, target)
}

/* ── Strictly linear progression (PRD §4.2.2) ───────────────────────── */

function toSolvedSet(solved) {
  if (solved instanceof Set) return solved
  return new Set(Array.isArray(solved) ? solved : [])
}

/**
 * A step is playable only when EVERY earlier step is solved. This is the whole
 * of "strictly linear": there is no branching and no skipping ahead.
 */
export function isStepUnlocked(steps, index, solved = []) {
  if (index < 0 || index >= steps.length) return false
  const solvedIds = toSolvedSet(solved)
  return steps.slice(0, index).every((step) => solvedIds.has(step.id))
}

/** Index of the step the recipient is currently on, or -1 when the quest is done. */
export function currentStepIndex(steps, solved = []) {
  const solvedIds = toSolvedSet(solved)
  const index = steps.findIndex((step) => !solvedIds.has(step.id))
  return index
}

export function isQuestComplete(steps, solved = []) {
  const solvedIds = toSolvedSet(solved)
  return steps.length > 0 && steps.every((step) => solvedIds.has(step.id))
}

/* ── Validation ─────────────────────────────────────────────────────── */

/** Coerce a Max Attempts input into `null` (unlimited) or a clamped integer. */
export function normalizeMaxAttempts(value) {
  if (value === null || value === undefined || value === '') return null
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return null
  const rounded = Math.round(parsed)
  if (rounded < MAX_ATTEMPTS_MIN) return MAX_ATTEMPTS_MIN
  if (rounded > MAX_ATTEMPTS_MAX) return MAX_ATTEMPTS_MAX
  return rounded
}

const isBlank = (value) => typeof value !== 'string' || value.trim() === ''

/**
 * Returns issue codes for a step; an empty array means the step is ready to
 * publish. Codes map 1:1 to `builder.issues.*` i18n keys.
 */
export function validateStep(step) {
  const issues = []
  if (!step || !STEP_KINDS.includes(step.kind)) return ['unknownKind']
  if (isBlank(step.prompt)) issues.push('promptRequired')

  const config = step.config || {}
  if (step.kind === 'lock' && isBlank(config.answer)) {
    issues.push('answerRequired')
  }
  if (step.kind === 'trivia') {
    const options = Array.isArray(config.options) ? config.options : []
    const filled = options.filter((option) => !isBlank(option))
    if (filled.length < TRIVIA_MIN_OPTIONS) issues.push('optionsRequired')
    const correct = options[config.correctIndex]
    if (isBlank(correct)) issues.push('correctOptionRequired')
  }
  if (step.kind === 'hotspot') {
    if (isBlank(config.imageUrl)) issues.push('imageRequired')
    const target = config.target || {}
    if (!(target.w > 0 && target.h > 0)) issues.push('targetRequired')
  }
  if (step.maxAttempts !== null && step.maxAttempts !== undefined) {
    if (normalizeMaxAttempts(step.maxAttempts) !== step.maxAttempts) {
      issues.push('maxAttemptsRange')
    }
  }
  return issues
}

export function isStepValid(step) {
  return validateStep(step).length === 0
}

/** Quest-level readiness: needs a name, at least one step, and all steps valid. */
export function validateQuest(quest) {
  const issues = []
  if (!quest || isBlank(quest.name)) issues.push('nameRequired')
  const flow = quest?.flow || []
  if (flow.length === 0) issues.push('stepsRequired')
  if (flow.some((step) => !isStepValid(step))) issues.push('stepsIncomplete')
  return issues
}

export function isQuestPublishable(quest) {
  return validateQuest(quest).length === 0
}

/* ── Dashboard bridge ───────────────────────────────────────────────── */

/**
 * The dashboard card renders `steps` (count) and `stepKinds` (glyphs). Derive
 * both from the authoritative `flow` so the two never drift.
 */
export function summarizeFlow(flow = []) {
  return { steps: flow.length, stepKinds: flow.map((step) => step.kind) }
}

/**
 * Quests created before the builder existed carry only `stepKinds`. Rehydrate a
 * real flow from them so any quest on the dashboard can be opened and edited.
 */
export function flowFromQuest(quest) {
  if (Array.isArray(quest?.flow) && quest.flow.length > 0) return quest.flow
  const kinds = Array.isArray(quest?.stepKinds) ? quest.stepKinds : []
  return kinds.filter((kind) => STEP_KINDS.includes(kind)).map((kind) => createStep(kind))
}
