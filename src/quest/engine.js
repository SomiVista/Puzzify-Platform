/**
 * The JSON-driven quest engine (PRD §2.3, §4.4).
 *
 * Given a compiled quest payload and the recipient's saved progress, this
 * decides what screen they are on, whether an answer is right, how many guesses
 * they have left, and when the Grand Finale may mount. It owns every rule; the
 * player components only render what it reports.
 *
 * Sessions are plain JSON so they can be written straight to storage and read
 * back to resume at the furthest unlocked step.
 */
import { verifyResponse, hashAnswer } from './answers'

export const SUBMIT = {
  CORRECT: 'correct',
  INCORRECT: 'incorrect',
  LOCKED: 'locked',
  FINISHED: 'finished',
  EMPTY: 'empty'
}

/** A fresh run, or a rehydrated one when `saved` progress is supplied. */
export function createSession(quest, saved = null) {
  const steps = quest?.steps || []
  const base = {
    questId: quest?.id ?? null,
    stepCount: steps.length,
    solved: [],
    attempts: {},
    startedAt: Date.now(),
    completedAt: null
  }
  if (!saved || saved.questId !== base.questId) return base

  // Only trust saved ids that still exist, so editing a quest cannot strand a
  // recipient on a step that was deleted underneath them.
  const known = new Set(steps.map((step) => step.id))
  const solved = (saved.solved || []).filter((id) => known.has(id))
  return {
    ...base,
    solved,
    attempts: saved.attempts || {},
    startedAt: saved.startedAt || base.startedAt,
    completedAt: solved.length === steps.length && steps.length > 0
      ? saved.completedAt || Date.now()
      : null
  }
}

/**
 * Strictly linear: the current step is always the first unsolved one, so there
 * is no way to answer step 3 before step 2 (PRD §4.2.2).
 */
export function currentIndex(session) {
  if (!session || session.stepCount === 0) return -1
  if (session.solved.length >= session.stepCount) return -1
  return session.solved.length
}

export function currentStep(quest, session) {
  const index = currentIndex(session)
  return index === -1 ? null : quest.steps[index]
}

export function isComplete(session) {
  return Boolean(session) && session.stepCount > 0 && session.solved.length === session.stepCount
}

export function progress(session) {
  if (!session || session.stepCount === 0) return 0
  return Math.round((session.solved.length / session.stepCount) * 100)
}

/** Guesses used on a step so far. */
export function attemptsUsed(session, stepId) {
  return session?.attempts?.[stepId] || 0
}

/**
 * Guesses left, or `null` when the creator did not cap the step. A capped step
 * with 0 left is locked.
 */
export function attemptsLeft(step, session) {
  if (!step || !step.maxAttempts) return null
  return Math.max(0, step.maxAttempts - attemptsUsed(session, step.id))
}

export function isLockedOut(step, session) {
  const left = attemptsLeft(step, session)
  return left !== null && left === 0
}

/**
 * Evaluate one submission. Returns the outcome plus the NEXT session — the
 * caller persists it. The input session is never mutated.
 */
export async function submitAnswer(quest, session, response) {
  const step = currentStep(quest, session)
  if (!step) {
    return { status: SUBMIT.FINISHED, session }
  }
  if (isLockedOut(step, session)) {
    return { status: SUBMIT.LOCKED, session, step }
  }
  // An empty text answer is a slip, not a guess — don't burn an attempt.
  if (step.kind === 'lock' && String(response ?? '').trim() === '') {
    return { status: SUBMIT.EMPTY, session, step }
  }

  const correct = await verifyResponse(step, response)

  if (correct) {
    const solved = [...session.solved, step.id]
    const complete = solved.length === session.stepCount
    return {
      status: SUBMIT.CORRECT,
      step,
      message: step.successMessage || '',
      complete,
      session: {
        ...session,
        solved,
        completedAt: complete ? Date.now() : null
      }
    }
  }

  const used = attemptsUsed(session, step.id) + 1
  const next = { ...session, attempts: { ...session.attempts, [step.id]: used } }
  const left = attemptsLeft(step, next)
  return {
    status: left === 0 ? SUBMIT.LOCKED : SUBMIT.INCORRECT,
    step,
    attemptsUsed: used,
    attemptsLeft: left,
    session: next
  }
}

/** Wipe a run so a locked-out recipient is never permanently stuck. */
export function restartSession(quest) {
  return createSession(quest, null)
}

/** Seconds spent on the quest, for the creator's solve-time analytics. */
export function solveSeconds(session) {
  if (!session?.completedAt || !session?.startedAt) return 0
  return Math.max(0, Math.round((session.completedAt - session.startedAt) / 1000))
}

/**
 * Proof that every step was genuinely solved, exchanged for the reward payload
 * (see rewardGate in storage.js). Server-side this becomes the argument to the
 * Cloud Function of PRD §4.5 — the shape is deliberately the same so swapping
 * the client stand-in for the callable is a one-file change.
 */
export async function completionProof(quest, session) {
  if (!isComplete(session)) return null
  const digests = quest.steps.map((step) => step.solution?.digest ?? step.id).join('|')
  return hashAnswer(digests, { salt: quest.proofSalt || '', caseSensitive: true })
}
