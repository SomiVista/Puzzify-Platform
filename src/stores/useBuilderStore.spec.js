import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useBuilderStore } from './useBuilderStore'
import { useAppStore } from './useAppStore'

describe('useBuilderStore', () => {
  let builder
  let app

  beforeEach(() => {
    setActivePinia(createPinia())
    builder = useBuilderStore()
    app = useAppStore()
  })

  describe('startNew', () => {
    it('seeds theme and reward from the occasion preset', () => {
      builder.startNew('mysteryNight')
      expect(builder.draft.occasion).toBe('mysteryNight')
      expect(builder.draft.theme.preset).toBe('mystery')
      expect(builder.draft.reward.type).toBe('video')
      expect(builder.flow).toEqual([])
      expect(builder.isNew).toBe(true)
      expect(builder.dirty).toBe(false)
    })

    it('falls back to the default theme for an unknown occasion', () => {
      builder.startNew('not-a-preset')
      expect(builder.draft.occasion).toBe('')
      expect(builder.draft.theme.preset).toBe('birthday')
    })

    it('reserves an id that does not collide with existing quests', () => {
      builder.startNew('birthday')
      expect(app.getQuestById(builder.draft.id)).toBeNull()
      expect(Number(builder.draft.id)).toBeGreaterThan(app.quests.length - 1)
    })
  })

  describe('loadExisting', () => {
    it('rehydrates a flow from a legacy quest and selects its first step', () => {
      const legacy = app.quests[0] // 3 steps: lock, trivia, hotspot
      expect(builder.loadExisting(legacy.id)).toBe(true)
      expect(builder.flow.map((s) => s.kind)).toEqual(legacy.stepKinds)
      expect(builder.selectedStepId).toBe(builder.flow[0].id)
      expect(builder.isNew).toBe(false)
      expect(builder.dirty).toBe(false)
    })

    it('reports an unknown id instead of silently editing a blank quest', () => {
      expect(builder.loadExisting('nope')).toBe(false)
    })

    it('fills in theme defaults a legacy quest never had', () => {
      builder.loadExisting(app.quests[0].id)
      expect(builder.draft.theme).toEqual({
        preset: 'birthday',
        ambientAudio: true,
        particles: true
      })
    })
  })

  describe('flow editing', () => {
    beforeEach(() => builder.startNew('birthday'))

    it('adds a step, selects it, and marks the draft dirty', () => {
      const step = builder.addStep('lock')
      expect(builder.flow).toHaveLength(1)
      expect(builder.selectedStepId).toBe(step.id)
      expect(builder.selectedStep.kind).toBe('lock')
      expect(builder.dirty).toBe(true)
    })

    it('adds at an explicit slot', () => {
      builder.addStep('lock')
      builder.addStep('hotspot')
      builder.addStep('trivia', 1)
      expect(builder.flow.map((s) => s.kind)).toEqual(['lock', 'trivia', 'hotspot'])
    })

    it('reorders by drop slot', () => {
      builder.addStep('lock')
      builder.addStep('trivia')
      builder.addStep('hotspot')
      builder.reorderStep(0, 3)
      expect(builder.flow.map((s) => s.kind)).toEqual(['trivia', 'hotspot', 'lock'])
    })

    it('nudges a step one place and refuses to run off either end', () => {
      builder.addStep('lock')
      builder.addStep('trivia')

      builder.nudgeStep(1, -1)
      expect(builder.flow.map((s) => s.kind)).toEqual(['trivia', 'lock'])

      builder.nudgeStep(0, -1) // already first
      builder.nudgeStep(1, 1) // already last
      expect(builder.flow.map((s) => s.kind)).toEqual(['trivia', 'lock'])
    })

    it('keeps selection on a neighbour after deleting', () => {
      const first = builder.addStep('lock')
      const second = builder.addStep('trivia')
      const third = builder.addStep('hotspot')

      builder.selectStep(second.id)
      builder.deleteStep(1)
      // The card that slid into slot 1 takes over.
      expect(builder.selectedStepId).toBe(third.id)

      builder.deleteStep(1)
      expect(builder.selectedStepId).toBe(first.id)

      builder.deleteStep(0)
      expect(builder.flow).toEqual([])
      expect(builder.selectedStepId).toBeNull()
    })

    it('ignores a delete outside the flow', () => {
      builder.addStep('lock')
      builder.deleteStep(7)
      expect(builder.flow).toHaveLength(1)
    })
  })

  describe('wizard navigation', () => {
    beforeEach(() => {
      builder.startNew('birthday')
      builder.addStep('lock')
      builder.addStep('trivia')
      builder.addStep('hotspot')
    })

    it('walks the chain in order and clamps at both ends', () => {
      builder.selectByIndex(0)
      expect(builder.selectedIndex).toBe(0)

      builder.selectPrev()
      expect(builder.selectedIndex).toBe(0) // clamped

      builder.selectNext()
      builder.selectNext()
      expect(builder.selectedIndex).toBe(2)

      builder.selectNext()
      expect(builder.selectedIndex).toBe(2) // clamped
    })
  })

  describe('step configuration', () => {
    beforeEach(() => {
      builder.startNew('birthday')
      builder.addStep('lock')
    })

    it('writes the per-step advanced settings', () => {
      builder.updateStep({
        prompt: 'First city?',
        hintText: 'It rhymes with dome',
        successMessage: 'You always remembered!'
      })
      expect(builder.selectedStep).toMatchObject({
        prompt: 'First city?',
        hintText: 'It rhymes with dome',
        successMessage: 'You always remembered!'
      })
    })

    it('normalizes Max Attempts on the way in', () => {
      builder.updateStep({ maxAttempts: 99 })
      expect(builder.selectedStep.maxAttempts).toBe(10)

      builder.updateStep({ maxAttempts: 0 })
      expect(builder.selectedStep.maxAttempts).toBe(1)

      builder.updateStep({ maxAttempts: '' })
      expect(builder.selectedStep.maxAttempts).toBeNull()
    })

    it('merges block config without dropping sibling keys', () => {
      builder.updateConfig({ answer: 'Rome' })
      expect(builder.selectedStep.config).toEqual({ answer: 'Rome', caseSensitive: false })

      builder.updateConfig({ caseSensitive: true })
      expect(builder.selectedStep.config).toEqual({ answer: 'Rome', caseSensitive: true })
    })

    it('does nothing when no step is selected', () => {
      builder.deleteStep(0)
      expect(() => builder.updateStep({ prompt: 'x' })).not.toThrow()
      expect(() => builder.updateConfig({ answer: 'x' })).not.toThrow()
    })

    it('tracks per-step validity for the canvas dots', () => {
      const id = builder.selectedStepId
      expect(builder.stepValidity[id]).toBe(false)

      builder.updateStep({ prompt: 'First city?' })
      builder.updateConfig({ answer: 'Rome' })
      expect(builder.stepValidity[id]).toBe(true)
    })
  })

  describe('theme configurator', () => {
    beforeEach(() => builder.startNew('birthday'))

    it('changes preset, ambient audio and particles on the draft only', () => {
      builder.setThemePreset('spooky')
      builder.setAmbientAudio(false)
      builder.setParticles(false)

      expect(builder.draft.theme).toEqual({
        preset: 'spooky',
        ambientAudio: false,
        particles: false
      })
      // The studio chrome keeps the app-wide theme — the quest theme is data.
      expect(app.theme).toBe('birthday')
    })
  })

  describe('drag and drop', () => {
    beforeEach(() => builder.startNew('birthday'))

    it('resolves a palette drag into an insert at the hovered slot', () => {
      builder.addStep('lock')
      builder.addStep('hotspot')

      builder.beginPaletteDrag('trivia')
      builder.setDropSlot(1)
      expect(builder.isDragging).toBe(true)
      builder.dropAt()

      expect(builder.flow.map((s) => s.kind)).toEqual(['lock', 'trivia', 'hotspot'])
      expect(builder.isDragging).toBe(false)
      expect(builder.dropSlot).toBeNull()
    })

    it('resolves a card drag into a reorder', () => {
      builder.addStep('lock')
      builder.addStep('trivia')
      builder.addStep('hotspot')

      builder.beginCardDrag(2)
      builder.dropAt(0)

      expect(builder.flow.map((s) => s.kind)).toEqual(['hotspot', 'lock', 'trivia'])
    })

    it('drops at the end when no slot was hovered', () => {
      builder.addStep('lock')
      builder.beginPaletteDrag('trivia')
      builder.dropAt()
      expect(builder.flow.map((s) => s.kind)).toEqual(['lock', 'trivia'])
    })

    it('does nothing when a drop arrives with no active drag', () => {
      builder.dropAt(0)
      expect(builder.flow).toEqual([])
    })

    it('clears drag state when a drag is abandoned', () => {
      builder.beginCardDrag(0)
      builder.setDropSlot(1)
      builder.endDrag()
      expect(builder.isDragging).toBe(false)
      expect(builder.dropSlot).toBeNull()
    })
  })

  describe('save', () => {
    it('adds a new quest to the dashboard with derived card fields', () => {
      const before = app.quests.length
      builder.startNew('corporate')
      builder.setName('Onboarding — Q4')
      builder.addStep('lock')
      builder.addStep('trivia')

      const record = builder.save()

      expect(app.quests).toHaveLength(before + 1)
      expect(record.name).toBe('Onboarding — Q4')
      // steps/stepKinds are derived from flow, never set by hand.
      expect(record.steps).toBe(2)
      expect(record.stepKinds).toEqual(['lock', 'trivia'])
      expect(record.status).toBe('Draft')
      expect(builder.dirty).toBe(false)
      expect(builder.isNew).toBe(false)
    })

    it('updates an existing quest in place and preserves its play metrics', () => {
      const existing = app.quests[1] // published, 38 plays
      const before = app.quests.length

      builder.loadExisting(existing.id)
      builder.addStep('lock')
      builder.save()

      expect(app.quests).toHaveLength(before)
      const saved = app.getQuestById(existing.id)
      expect(saved.steps).toBe(existing.stepKinds.length + 1)
      expect(saved.plays).toBe(38)
      expect(saved.status).toBe('Published')
    })

    it('round-trips a saved quest back into the builder', () => {
      builder.startNew('birthday')
      builder.setName('Mum')
      builder.addStep('lock')
      builder.updateStep({ prompt: 'Where?', hintText: 'North', maxAttempts: 3 })
      builder.updateConfig({ answer: 'Oslo' })
      const record = builder.save()

      const fresh = useBuilderStore()
      fresh.loadExisting(record.id)
      expect(fresh.flow[0]).toMatchObject({
        kind: 'lock',
        prompt: 'Where?',
        hintText: 'North',
        maxAttempts: 3
      })
      expect(fresh.flow[0].config.answer).toBe('Oslo')
      expect(fresh.draft.name).toBe('Mum')
    })
  })
})
