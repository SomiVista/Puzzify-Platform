import { describe, it, expect } from 'vitest'
import {
  STEP_KINDS,
  MAX_ATTEMPTS_MAX,
  MAX_ATTEMPTS_MIN,
  createStep,
  createQuestDraft,
  defaultConfig,
  insertStep,
  removeStep,
  moveStep,
  moveStepToSlot,
  isStepUnlocked,
  currentStepIndex,
  isQuestComplete,
  normalizeMaxAttempts,
  validateStep,
  isStepValid,
  validateQuest,
  isQuestPublishable,
  summarizeFlow,
  flowFromQuest
} from './model'

/** Build a flow of n steps with predictable ids for ordering assertions. */
const flowOf = (...kinds) => kinds.map((kind, i) => createStep(kind, { prompt: `p${i}` }))
const ids = (steps) => steps.map((s) => s.id)

describe('createStep', () => {
  it('creates each canonical puzzle kind with its default config', () => {
    expect(STEP_KINDS).toEqual(['lock', 'trivia', 'hotspot'])

    expect(createStep('lock').config).toEqual({ answer: '', caseSensitive: false })
    expect(createStep('trivia').config).toEqual({ options: ['', ''], correctIndex: 0 })
    expect(createStep('hotspot').config.target).toEqual({ x: 35, y: 35, w: 30, h: 30 })
  })

  it('gives every step a unique id and empty advanced settings', () => {
    const a = createStep('lock')
    const b = createStep('lock')
    expect(a.id).not.toBe(b.id)
    expect(a).toMatchObject({ hintText: '', successMessage: '', maxAttempts: null })
  })

  it('merges partial config overrides over the kind defaults', () => {
    const step = createStep('lock', { prompt: 'City?', config: { answer: 'Rome' } })
    expect(step.prompt).toBe('City?')
    // caseSensitive survives even though the override only set answer
    expect(step.config).toEqual({ answer: 'Rome', caseSensitive: false })
  })

  it('rejects unknown kinds rather than producing an unrenderable step', () => {
    expect(() => createStep('riddle')).toThrow(/riddle/)
  })

  it('returns an empty config for an unknown kind lookup', () => {
    expect(defaultConfig('nope')).toEqual({})
  })
})

describe('createQuestDraft', () => {
  it('defaults to the birthday theme with audio and particles on', () => {
    const draft = createQuestDraft()
    expect(draft.status).toBe('Draft')
    expect(draft.flow).toEqual([])
    expect(draft.theme).toEqual({ preset: 'birthday', ambientAudio: true, particles: true })
  })

  it('accepts overrides', () => {
    const draft = createQuestDraft({ name: 'Mum', theme: { preset: 'mystery' } })
    expect(draft.name).toBe('Mum')
    expect(draft.theme.preset).toBe('mystery')
  })
})

describe('flow operations', () => {
  it('inserts at an index and appends when the index is omitted', () => {
    const flow = flowOf('lock', 'trivia')
    const extra = createStep('hotspot')

    expect(ids(insertStep(flow, extra, 1))[1]).toBe(extra.id)
    expect(ids(insertStep(flow, extra))[2]).toBe(extra.id)
  })

  it('clamps out-of-range insert indexes instead of creating holes', () => {
    const flow = flowOf('lock')
    const extra = createStep('trivia')
    expect(insertStep(flow, extra, -5)).toHaveLength(2)
    expect(ids(insertStep(flow, extra, -5))[0]).toBe(extra.id)
    expect(ids(insertStep(flow, extra, 99))[1]).toBe(extra.id)
  })

  it('never mutates the input array', () => {
    const flow = flowOf('lock', 'trivia')
    const snapshot = ids(flow)

    insertStep(flow, createStep('lock'), 0)
    removeStep(flow, 0)
    moveStep(flow, 0, 1)

    expect(ids(flow)).toEqual(snapshot)
  })

  it('removes by index and ignores out-of-range indexes', () => {
    const flow = flowOf('lock', 'trivia', 'hotspot')
    expect(ids(removeStep(flow, 1))).toEqual([flow[0].id, flow[2].id])
    expect(ids(removeStep(flow, 9))).toEqual(ids(flow))
    expect(ids(removeStep(flow, -1))).toEqual(ids(flow))
  })

  it('moves a step to a new index', () => {
    const flow = flowOf('lock', 'trivia', 'hotspot')
    expect(ids(moveStep(flow, 0, 2))).toEqual([flow[1].id, flow[2].id, flow[0].id])
    expect(ids(moveStep(flow, 2, 0))).toEqual([flow[2].id, flow[0].id, flow[1].id])
  })

  it('treats an out-of-range move source as a no-op', () => {
    const flow = flowOf('lock', 'trivia')
    expect(ids(moveStep(flow, 5, 0))).toEqual(ids(flow))
  })

  describe('moveStepToSlot — drop gaps, not indexes', () => {
    it('accounts for the dragged card leaving its own position', () => {
      const flow = flowOf('lock', 'trivia', 'hotspot')
      // Dropping card 0 into the gap AFTER card 2 (slot 3) puts it last.
      expect(ids(moveStepToSlot(flow, 0, 3))).toEqual([flow[1].id, flow[2].id, flow[0].id])
      // Dropping card 2 into the gap before card 0 (slot 0) puts it first.
      expect(ids(moveStepToSlot(flow, 2, 0))).toEqual([flow[2].id, flow[0].id, flow[1].id])
    })

    it('keeps the order when a card is dropped into a gap adjacent to itself', () => {
      const flow = flowOf('lock', 'trivia', 'hotspot')
      expect(ids(moveStepToSlot(flow, 1, 1))).toEqual(ids(flow))
      expect(ids(moveStepToSlot(flow, 1, 2))).toEqual(ids(flow))
    })
  })
})

describe('strictly linear progression', () => {
  const flow = flowOf('lock', 'trivia', 'hotspot')

  it('unlocks only the first step when nothing is solved', () => {
    expect(isStepUnlocked(flow, 0, [])).toBe(true)
    expect(isStepUnlocked(flow, 1, [])).toBe(false)
    expect(isStepUnlocked(flow, 2, [])).toBe(false)
  })

  it('unlocks the next step once every earlier step is solved', () => {
    const solved = [flow[0].id]
    expect(isStepUnlocked(flow, 1, solved)).toBe(true)
    expect(isStepUnlocked(flow, 2, solved)).toBe(false)
  })

  it('refuses to unlock past a gap — no skipping ahead', () => {
    // Step 2 solved but step 1 not: step 3 must stay locked.
    const solved = [flow[0].id, flow[2].id]
    expect(isStepUnlocked(flow, 1, solved)).toBe(true)
    expect(isStepUnlocked(flow, 2, solved)).toBe(false)
  })

  it('accepts a Set as well as an array', () => {
    expect(isStepUnlocked(flow, 1, new Set([flow[0].id]))).toBe(true)
  })

  it('returns false for out-of-range indexes', () => {
    expect(isStepUnlocked(flow, -1, [])).toBe(false)
    expect(isStepUnlocked(flow, 3, [])).toBe(false)
  })

  it('reports the current step and completion', () => {
    expect(currentStepIndex(flow, [])).toBe(0)
    expect(currentStepIndex(flow, [flow[0].id])).toBe(1)
    expect(currentStepIndex(flow, ids(flow))).toBe(-1)

    expect(isQuestComplete(flow, [flow[0].id])).toBe(false)
    expect(isQuestComplete(flow, ids(flow))).toBe(true)
    // An empty quest is never "complete" — there is nothing to reward.
    expect(isQuestComplete([], [])).toBe(false)
  })
})

describe('normalizeMaxAttempts', () => {
  it('treats blank input as unlimited', () => {
    expect(normalizeMaxAttempts('')).toBeNull()
    expect(normalizeMaxAttempts(null)).toBeNull()
    expect(normalizeMaxAttempts(undefined)).toBeNull()
    expect(normalizeMaxAttempts('abc')).toBeNull()
  })

  it('clamps to the supported range and rounds', () => {
    expect(normalizeMaxAttempts(0)).toBe(MAX_ATTEMPTS_MIN)
    expect(normalizeMaxAttempts(-4)).toBe(MAX_ATTEMPTS_MIN)
    expect(normalizeMaxAttempts(99)).toBe(MAX_ATTEMPTS_MAX)
    expect(normalizeMaxAttempts('3')).toBe(3)
    expect(normalizeMaxAttempts(2.6)).toBe(3)
  })
})

describe('validateStep', () => {
  it('requires a prompt on every kind', () => {
    expect(validateStep(createStep('lock'))).toContain('promptRequired')
    expect(validateStep(createStep('trivia'))).toContain('promptRequired')
    expect(validateStep(createStep('hotspot'))).toContain('promptRequired')
  })

  it('accepts a fully configured lock', () => {
    const step = createStep('lock', { prompt: 'City?', config: { answer: 'Rome' } })
    expect(validateStep(step)).toEqual([])
    expect(isStepValid(step)).toBe(true)
  })

  it('flags a lock with no answer', () => {
    expect(validateStep(createStep('lock', { prompt: 'City?' }))).toContain('answerRequired')
    // Whitespace is not an answer.
    const blank = createStep('lock', { prompt: 'City?', config: { answer: '   ' } })
    expect(validateStep(blank)).toContain('answerRequired')
  })

  it('requires two filled trivia options and a correct one among them', () => {
    const thin = createStep('trivia', { prompt: 'Q?', config: { options: ['A', ''] } })
    expect(validateStep(thin)).toContain('optionsRequired')

    const missingCorrect = createStep('trivia', {
      prompt: 'Q?',
      config: { options: ['A', 'B', ''], correctIndex: 2 }
    })
    expect(validateStep(missingCorrect)).toContain('correctOptionRequired')

    const good = createStep('trivia', {
      prompt: 'Q?',
      config: { options: ['A', 'B'], correctIndex: 1 }
    })
    expect(validateStep(good)).toEqual([])
  })

  it('requires an image and a non-zero target on a hotspot', () => {
    const noImage = createStep('hotspot', { prompt: 'Tap it' })
    expect(validateStep(noImage)).toContain('imageRequired')

    const flatTarget = createStep('hotspot', {
      prompt: 'Tap it',
      config: { imageUrl: 'room.jpg', target: { x: 10, y: 10, w: 0, h: 20 } }
    })
    expect(validateStep(flatTarget)).toContain('targetRequired')

    const good = createStep('hotspot', {
      prompt: 'Tap it',
      config: { imageUrl: 'room.jpg' }
    })
    expect(validateStep(good)).toEqual([])
  })

  it('flags a max-attempts value outside the supported range', () => {
    const step = createStep('lock', { prompt: 'Q', config: { answer: 'A' }, maxAttempts: 40 })
    expect(validateStep(step)).toContain('maxAttemptsRange')

    const ok = createStep('lock', { prompt: 'Q', config: { answer: 'A' }, maxAttempts: 3 })
    expect(validateStep(ok)).toEqual([])
  })

  it('reports an unknown kind as a single issue', () => {
    expect(validateStep({ kind: 'riddle' })).toEqual(['unknownKind'])
    expect(validateStep(null)).toEqual(['unknownKind'])
  })
})

describe('validateQuest', () => {
  const validStep = () => createStep('lock', { prompt: 'Q', config: { answer: 'A' } })

  it('requires a name and at least one step', () => {
    expect(validateQuest(createQuestDraft())).toEqual(['nameRequired', 'stepsRequired'])
  })

  it('flags a quest whose steps are not finished', () => {
    const quest = createQuestDraft({ name: 'Mum', flow: [createStep('lock')] })
    expect(validateQuest(quest)).toEqual(['stepsIncomplete'])
    expect(isQuestPublishable(quest)).toBe(false)
  })

  it('passes a complete quest', () => {
    const quest = createQuestDraft({ name: 'Mum', flow: [validStep()] })
    expect(validateQuest(quest)).toEqual([])
    expect(isQuestPublishable(quest)).toBe(true)
  })
})

describe('dashboard bridge', () => {
  it('derives the card summary from the flow', () => {
    expect(summarizeFlow(flowOf('lock', 'trivia'))).toEqual({
      steps: 2,
      stepKinds: ['lock', 'trivia']
    })
    expect(summarizeFlow()).toEqual({ steps: 0, stepKinds: [] })
  })

  it('rehydrates a flow from a legacy quest that only has stepKinds', () => {
    const rehydrated = flowFromQuest({ stepKinds: ['lock', 'trivia', 'hotspot'] })
    expect(rehydrated.map((s) => s.kind)).toEqual(['lock', 'trivia', 'hotspot'])
    expect(new Set(ids(rehydrated)).size).toBe(3)
  })

  it('prefers an existing flow over stepKinds', () => {
    const flow = flowOf('hotspot')
    expect(flowFromQuest({ flow, stepKinds: ['lock', 'lock'] })).toBe(flow)
  })

  it('drops unknown kinds and copes with a quest that has neither field', () => {
    expect(flowFromQuest({ stepKinds: ['lock', 'riddle'] }).map((s) => s.kind)).toEqual(['lock'])
    expect(flowFromQuest({})).toEqual([])
    expect(flowFromQuest(null)).toEqual([])
  })
})
