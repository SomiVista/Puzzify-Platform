import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import i18n from '../../i18n'
import { useBuilderStore } from '../../stores/useBuilderStore'
import FlowCanvas from './FlowCanvas.vue'
import BlockPalette from './BlockPalette.vue'

/** Mounts against the pinia activated in `beforeEach`, not a fresh one. */
function mountWith(component) {
  return mount(component, { global: { plugins: [i18n] } })
}

describe('BlockPalette', () => {
  let builder

  beforeEach(() => {
    setActivePinia(createPinia())
    i18n.global.locale.value = 'en'
    builder = useBuilderStore()
    builder.startNew('birthday')
  })

  it('offers one draggable source per puzzle kind', () => {
    const wrapper = mountWith(BlockPalette)
    const blocks = wrapper.findAll('[data-testid^="palette-"]')
    expect(blocks).toHaveLength(3)
    blocks.forEach((block) => expect(block.attributes('draggable')).toBe('true'))
  })

  it('adds a step when a block is pressed — the keyboard path', async () => {
    const wrapper = mountWith(BlockPalette)
    await wrapper.find('[data-testid="palette-trivia"]').trigger('click')
    expect(builder.flow.map((s) => s.kind)).toEqual(['trivia'])
  })

  it('arms a palette drag on dragstart and disarms it on dragend', async () => {
    const wrapper = mountWith(BlockPalette)
    const block = wrapper.find('[data-testid="palette-hotspot"]')

    await block.trigger('dragstart')
    expect(builder.dragKind).toBe('hotspot')
    expect(builder.isDragging).toBe(true)

    await block.trigger('dragend')
    expect(builder.isDragging).toBe(false)
  })
})

describe('FlowCanvas', () => {
  let builder

  beforeEach(() => {
    setActivePinia(createPinia())
    i18n.global.locale.value = 'en'
    builder = useBuilderStore()
    builder.startNew('birthday')
  })

  it('shows the empty state with the start and finale bookends', () => {
    const wrapper = mountWith(FlowCanvas)
    expect(wrapper.find('[data-testid="canvas-empty"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Start')
    expect(wrapper.text()).toContain('Grand Finale')
  })

  it('renders one card per step, numbered in play order', () => {
    builder.addStep('lock')
    builder.addStep('trivia')
    const wrapper = mountWith(FlowCanvas)

    const cards = wrapper.findAll('[data-testid^="step-card-"]')
    expect(cards).toHaveLength(2)
    expect(cards[0].text()).toContain('Plays first')
    // Step 2 is gated on step 1 — the strictly linear rule, rendered.
    expect(cards[1].text()).toContain('Locked until Step 1 is solved')
  })

  it('exposes a drop gap before, between and after every card', () => {
    builder.addStep('lock')
    builder.addStep('trivia')
    const wrapper = mountWith(FlowCanvas)
    expect(wrapper.findAll('[data-testid^="drop-slot-"]')).toHaveLength(3)
  })

  it('inserts a dragged block at the gap it was dropped on', async () => {
    builder.addStep('lock')
    builder.addStep('hotspot')
    const wrapper = mountWith(FlowCanvas)

    builder.beginPaletteDrag('trivia')
    await wrapper.find('[data-testid="drop-slot-1"]').trigger('dragover')
    expect(builder.dropSlot).toBe(1)

    await wrapper.find('[data-testid="drop-slot-1"]').trigger('drop')

    expect(builder.flow.map((s) => s.kind)).toEqual(['lock', 'trivia', 'hotspot'])
    expect(builder.isDragging).toBe(false)
  })

  it('reorders a card dropped onto another gap', async () => {
    builder.addStep('lock')
    builder.addStep('trivia')
    builder.addStep('hotspot')
    const wrapper = mountWith(FlowCanvas)

    builder.beginCardDrag(2)
    await wrapper.find('[data-testid="drop-slot-0"]').trigger('drop')

    expect(builder.flow.map((s) => s.kind)).toEqual(['hotspot', 'lock', 'trivia'])
  })

  it('appends when a block is dropped on the canvas away from any gap', async () => {
    builder.addStep('lock')
    const wrapper = mountWith(FlowCanvas)

    builder.beginPaletteDrag('trivia')
    await wrapper.find('[data-testid="flow-canvas"]').trigger('drop')

    expect(builder.flow.map((s) => s.kind)).toEqual(['lock', 'trivia'])
  })

  it('reorders and deletes from the card buttons — the keyboard path', async () => {
    builder.addStep('lock')
    builder.addStep('trivia')
    const wrapper = mountWith(FlowCanvas)

    await wrapper.find('[data-testid="move-up-1"]').trigger('click')
    expect(builder.flow.map((s) => s.kind)).toEqual(['trivia', 'lock'])

    await wrapper.find('[data-testid="delete-step-0"]').trigger('click')
    expect(builder.flow.map((s) => s.kind)).toEqual(['lock'])
  })

  it('disables the move buttons at the ends of the chain', () => {
    builder.addStep('lock')
    builder.addStep('trivia')
    const wrapper = mountWith(FlowCanvas)

    expect(wrapper.find('[data-testid="move-up-0"]').attributes('disabled')).toBeDefined()
    expect(wrapper.find('[data-testid="move-down-1"]').attributes('disabled')).toBeDefined()
    expect(wrapper.find('[data-testid="move-down-0"]').attributes('disabled')).toBeUndefined()
  })

  it('marks a step ready once it validates', async () => {
    builder.addStep('lock')
    let wrapper = mountWith(FlowCanvas)
    expect(wrapper.find('[data-testid="step-card-0"]').text()).toContain('Needs setup')

    builder.updateStep({ prompt: 'First city?' })
    builder.updateConfig({ answer: 'Rome' })
    wrapper = mountWith(FlowCanvas)
    expect(wrapper.find('[data-testid="step-card-0"]').text()).toContain('Ready')
  })

  it('selects a step when its card is clicked', async () => {
    builder.addStep('lock')
    const second = builder.addStep('trivia')
    builder.selectStep(null)
    const wrapper = mountWith(FlowCanvas)

    await wrapper.findAll('[data-testid^="step-card-"]')[1].find('button').trigger('click')
    expect(builder.selectedStepId).toBe(second.id)
  })
})
