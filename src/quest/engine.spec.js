import { describe, it, expect, beforeEach } from 'vitest'
import { createStep, createQuestDraft } from './model'
import { compileQuest, generateQuestId, playerPath } from './publish'
import { normalizeAnswer, hashAnswer, digestsMatch, isInsideTarget, verifyAnswer } from './answers'
import {
  SUBMIT,
  createSession,
  currentStep,
  currentIndex,
  submitAnswer,
  isComplete,
  progress,
  attemptsLeft,
  isLockedOut,
  restartSession,
  completionProof,
  solveSeconds
} from './engine'
import { setDriver, resetDriver, publishPayload, loadPlayPayload, redeemReward } from './storage'

/** A three-step quest: type an answer, pick an option, tap a spot. */
function draftQuest() {
  return createQuestDraft({
    name: 'The Vault',
    flow: [
      createStep('lock', {
        prompt: 'Which city did we see first?',
        successMessage: 'You always remembered.',
        hintText: 'It rhymes with dome.',
        config: { answer: 'Rome' }
      }),
      createStep('trivia', {
        prompt: 'Our song?',
        maxAttempts: 2,
        config: { options: ['Blue', 'Gold', 'Rust'], correctIndex: 1 }
      }),
      createStep('hotspot', {
        prompt: 'Tap where the gift is hidden.',
        config: { imageUrl: 'room.jpg', target: { x: 40, y: 30, w: 20, h: 20 } }
      })
    ],
    reward: { type: 'letter', body: 'Happy anniversary.' }
  })
}

async function compiled() {
  const { payload, reward, proof } = await compileQuest(draftQuest())
  return { quest: payload, reward, proof }
}

/** Walk the whole quest with correct answers. */
async function playThrough(quest) {
  let session = createSession(quest)
  let last
  for (const response of ['Rome', 1, { x: 50, y: 40 }]) {
    last = await submitAnswer(quest, session, response)
    session = last.session
  }
  return { session, last }
}

describe('answers', () => {
  it('forgives phone-keyboard noise around an answer', () => {
    expect(normalizeAnswer('  Rome  ')).toBe('rome')
    expect(normalizeAnswer('New   York')).toBe('new york')
    expect(normalizeAnswer('Rome', { caseSensitive: true })).toBe('Rome')
    expect(normalizeAnswer(null)).toBe('')
  })

  it('produces a stable digest and matches a retyped answer', async () => {
    const opts = { salt: 'abc', caseSensitive: false }
    const digest = await hashAnswer('Rome', opts)

    expect(digest).toHaveLength(64)
    expect(await hashAnswer('  rome ', opts)).toBe(digest)
    expect(await verifyAnswer('ROME', digest, opts)).toBe(true)
    expect(await verifyAnswer('Paris', digest, opts)).toBe(false)
  })

  it('honours case sensitivity when the creator asks for it', async () => {
    const opts = { salt: 'abc', caseSensitive: true }
    const digest = await hashAnswer('Rome', opts)
    expect(await verifyAnswer('Rome', digest, opts)).toBe(true)
    expect(await verifyAnswer('rome', digest, opts)).toBe(false)
  })

  it('salts digests so the same answer differs across quests', async () => {
    const a = await hashAnswer('Rome', { salt: 'one' })
    const b = await hashAnswer('Rome', { salt: 'two' })
    expect(a).not.toBe(b)
  })

  it('compares digests without tripping on type or length', () => {
    expect(digestsMatch('abc', 'abc')).toBe(true)
    expect(digestsMatch('abc', 'abd')).toBe(false)
    expect(digestsMatch('abc', 'abcd')).toBe(false)
    expect(digestsMatch(null, 'abc')).toBe(false)
  })

  it('hit-tests a hotspot box inclusively at its edges', () => {
    const target = { x: 40, y: 30, w: 20, h: 20 }
    expect(isInsideTarget({ x: 50, y: 40 }, target)).toBe(true)
    expect(isInsideTarget({ x: 40, y: 30 }, target)).toBe(true)
    expect(isInsideTarget({ x: 60, y: 50 }, target)).toBe(true)
    expect(isInsideTarget({ x: 61, y: 40 }, target)).toBe(false)
    expect(isInsideTarget({ x: 10, y: 10 }, target)).toBe(false)
    expect(isInsideTarget(null, target)).toBe(false)
  })
})

describe('publish', () => {
  it('mints an unguessable player id', () => {
    const a = generateQuestId()
    const b = generateQuestId()
    expect(a).not.toBe(b)
    expect(a.length).toBeGreaterThanOrEqual(24)
    expect(playerPath(a)).toBe(`/q/${a}`)
  })

  it('never ships a plaintext answer to the recipient', async () => {
    const { quest } = await compiled()
    const serialized = JSON.stringify(quest)

    expect(serialized).not.toContain('Rome')
    // The trivia options ARE the question, so they must survive.
    expect(quest.steps[1].options).toEqual(['Blue', 'Gold', 'Rust'])
    // ...but which one is correct must not be readable.
    expect(serialized).not.toContain('correctIndex')
    expect(quest.steps[0].solution.digest).toHaveLength(64)
  })

  it('carries the creator-facing copy the player needs', async () => {
    const { quest } = await compiled()
    expect(quest.steps[0]).toMatchObject({
      prompt: 'Which city did we see first?',
      hintText: 'It rhymes with dome.',
      successMessage: 'You always remembered.'
    })
    expect(quest.steps[1].maxAttempts).toBe(2)
    expect(quest.theme.preset).toBe('birthday')
  })

  it('keeps the reward out of the play payload entirely', async () => {
    resetDriver()
    const { quest, reward, proof } = await compiled()
    publishPayload(quest, reward)

    const served = loadPlayPayload(quest.id)
    expect(JSON.stringify(served)).not.toContain('Happy anniversary')
    expect(served.proof).toBeUndefined()

    expect(redeemReward(quest.id, 'not-the-proof')).toBeNull()
    expect(redeemReward(quest.id, proof)).toEqual(reward)
  })
})

describe('engine — strictly linear progression', () => {
  let quest

  beforeEach(async () => {
    resetDriver()
    quest = (await compiled()).quest
  })

  it('starts the recipient on step 1', () => {
    const session = createSession(quest)
    expect(currentIndex(session)).toBe(0)
    expect(currentStep(quest, session).prompt).toBe('Which city did we see first?')
    expect(progress(session)).toBe(0)
    expect(isComplete(session)).toBe(false)
  })

  it('advances only on a correct answer', async () => {
    const session = createSession(quest)

    const wrong = await submitAnswer(quest, session, 'Paris')
    expect(wrong.status).toBe(SUBMIT.INCORRECT)
    expect(currentIndex(wrong.session)).toBe(0)

    const right = await submitAnswer(quest, wrong.session, 'Rome')
    expect(right.status).toBe(SUBMIT.CORRECT)
    expect(right.message).toBe('You always remembered.')
    expect(currentIndex(right.session)).toBe(1)
    expect(progress(right.session)).toBe(33)
  })

  it('accepts a sloppily typed answer', async () => {
    const session = createSession(quest)
    const result = await submitAnswer(quest, session, '  rOmE ')
    expect(result.status).toBe(SUBMIT.CORRECT)
  })

  it('ignores an empty submission instead of burning an attempt', async () => {
    const session = createSession(quest)
    const result = await submitAnswer(quest, session, '   ')
    expect(result.status).toBe(SUBMIT.EMPTY)
    expect(result.session.attempts).toEqual({})
  })

  it('grades each block kind on its own terms', async () => {
    let session = createSession(quest)
    session = (await submitAnswer(quest, session, 'Rome')).session

    const wrongOption = await submitAnswer(quest, session, 0)
    expect(wrongOption.status).toBe(SUBMIT.INCORRECT)

    session = (await submitAnswer(quest, session, 1)).session
    expect(currentIndex(session)).toBe(2)

    const miss = await submitAnswer(quest, session, { x: 5, y: 5 })
    expect(miss.status).toBe(SUBMIT.INCORRECT)

    const hit = await submitAnswer(quest, session, { x: 45, y: 35 })
    expect(hit.status).toBe(SUBMIT.CORRECT)
    expect(hit.complete).toBe(true)
  })

  it('reports the finale only once every step is solved', async () => {
    const { session, last } = await playThrough(quest)
    expect(last.complete).toBe(true)
    expect(isComplete(session)).toBe(true)
    expect(progress(session)).toBe(100)
    expect(currentStep(quest, session)).toBeNull()

    const extra = await submitAnswer(quest, session, 'anything')
    expect(extra.status).toBe(SUBMIT.FINISHED)
  })
})

describe('engine — max attempts', () => {
  let quest

  beforeEach(async () => {
    resetDriver()
    quest = (await compiled()).quest
  })

  it('counts down and locks the step when the cap is spent', async () => {
    let session = createSession(quest)
    session = (await submitAnswer(quest, session, 'Rome')).session // step 2 caps at 2

    const step = currentStep(quest, session)
    expect(attemptsLeft(step, session)).toBe(2)

    const first = await submitAnswer(quest, session, 0)
    expect(first.status).toBe(SUBMIT.INCORRECT)
    expect(first.attemptsLeft).toBe(1)

    const second = await submitAnswer(quest, first.session, 2)
    expect(second.status).toBe(SUBMIT.LOCKED)
    expect(second.attemptsLeft).toBe(0)
    expect(isLockedOut(step, second.session)).toBe(true)
  })

  it('refuses further guesses once locked, even correct ones', async () => {
    let session = createSession(quest)
    session = (await submitAnswer(quest, session, 'Rome')).session
    session = (await submitAnswer(quest, session, 0)).session
    session = (await submitAnswer(quest, session, 2)).session

    const correctButTooLate = await submitAnswer(quest, session, 1)
    expect(correctButTooLate.status).toBe(SUBMIT.LOCKED)
    expect(currentIndex(correctButTooLate.session)).toBe(1)
  })

  it('lets an uncapped step be guessed freely', async () => {
    let session = createSession(quest)
    const step = currentStep(quest, session)
    expect(attemptsLeft(step, session)).toBeNull()

    for (let i = 0; i < 6; i += 1) {
      session = (await submitAnswer(quest, session, 'nope')).session
    }
    expect(isLockedOut(step, session)).toBe(false)
    expect((await submitAnswer(quest, session, 'Rome')).status).toBe(SUBMIT.CORRECT)
  })

  it('restarts a stuck run from the beginning', async () => {
    const started = createSession(quest)
    const midway = (await submitAnswer(quest, started, 'Rome')).session
    expect(currentIndex(midway)).toBe(1)

    const fresh = restartSession(quest)
    expect(fresh.solved).toEqual([])
    expect(fresh.attempts).toEqual({})
    expect(currentIndex(fresh)).toBe(0)
  })
})

describe('engine — resuming an interrupted run', () => {
  let quest

  beforeEach(async () => {
    resetDriver()
    quest = (await compiled()).quest
  })

  it('returns the recipient to their furthest unlocked step', async () => {
    let session = createSession(quest)
    session = (await submitAnswer(quest, session, 'Rome')).session
    session = (await submitAnswer(quest, session, 1)).session

    const resumed = createSession(quest, JSON.parse(JSON.stringify(session)))
    expect(currentIndex(resumed)).toBe(2)
    expect(resumed.solved).toHaveLength(2)
  })

  it('remembers attempts already spent', async () => {
    let session = createSession(quest)
    session = (await submitAnswer(quest, session, 'wrong')).session

    const resumed = createSession(quest, session)
    expect(resumed.attempts).toEqual(session.attempts)
  })

  it('ignores progress saved against a different quest', () => {
    const foreign = { questId: 'someone-elses', solved: ['x', 'y'], attempts: {} }
    expect(createSession(quest, foreign).solved).toEqual([])
  })

  it('drops solved ids for steps the creator has since deleted', () => {
    const stale = { questId: quest.id, solved: [quest.steps[0].id, 'deleted-step'], attempts: {} }
    const resumed = createSession(quest, stale)
    expect(resumed.solved).toEqual([quest.steps[0].id])
    expect(currentIndex(resumed)).toBe(1)
  })

  it('treats a quest with no steps as never complete', () => {
    const empty = createSession({ id: 'x', steps: [] })
    expect(isComplete(empty)).toBe(false)
    expect(currentIndex(empty)).toBe(-1)
    expect(progress(empty)).toBe(0)
  })
})

describe('engine — reward gate', () => {
  beforeEach(() => resetDriver())

  it('only issues a proof for a genuinely finished run', async () => {
    const { quest } = await compiled()
    const partial = createSession(quest)
    expect(await completionProof(quest, partial)).toBeNull()

    const { session } = await playThrough(quest)
    expect(await completionProof(quest, session)).toHaveLength(64)
  })

  it('matches the proof minted at publish time, unlocking the reward', async () => {
    const { quest, reward } = await compiled()
    publishPayload(quest, reward)

    const { session } = await playThrough(quest)
    const proof = await completionProof(quest, session)

    expect(redeemReward(quest.id, proof)).toEqual(reward)
  })

  it('records how long the run took', async () => {
    const { quest } = await compiled()
    const { session } = await playThrough(quest)
    expect(solveSeconds(session)).toBeGreaterThanOrEqual(0)
    expect(solveSeconds(createSession(quest))).toBe(0)
  })
})

describe('storage driver', () => {
  it('keeps working when localStorage throws', () => {
    const store = new Map()
    setDriver({
      available: false,
      get: (k) => store.get(k) ?? null,
      set: (k, v) => store.set(k, v),
      remove: (k) => store.delete(k)
    })

    publishPayload({ id: 'q1', steps: [], proof: 'p' }, { type: 'letter' })
    expect(loadPlayPayload('q1')).toMatchObject({ id: 'q1' })
    expect(redeemReward('q1', 'p')).toEqual({ type: 'letter' })

    resetDriver()
  })
})
