import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import i18n from '../../i18n'
import LockBlock from './LockBlock.vue'
import TriviaBlock from './TriviaBlock.vue'
import HotspotBlock from './HotspotBlock.vue'
import StepIndicator from './StepIndicator.vue'
import GrandFinale from './GrandFinale.vue'

// GrandFinale renders BoxStage (a store consumer) and a RouterLink.
const mountWith = (component, props) =>
  mount(component, {
    props,
    global: {
      plugins: [i18n],
      stubs: { RouterLink: { template: '<a><slot /></a>' } }
    }
  })

beforeEach(() => {
  setActivePinia(createPinia())
  i18n.global.locale.value = 'en'
})

describe('LockBlock', () => {
  it('submits what the recipient typed', async () => {
    const wrapper = mountWith(LockBlock, { stepId: 's1' })
    await wrapper.find('[data-testid="answer-input"]').setValue('Rome')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')[0]).toEqual(['Rome'])
  })

  it('keeps a wrong answer in the field so it can be edited, not retyped', async () => {
    const wrapper = mountWith(LockBlock, { stepId: 's1' })
    await wrapper.find('[data-testid="answer-input"]').setValue('Paris')
    await wrapper.setProps({ wrongNonce: 1 })

    expect(wrapper.find('[data-testid="answer-input"]').element.value).toBe('Paris')
  })

  it('clears the field when the recipient moves to the next step', async () => {
    const wrapper = mountWith(LockBlock, { stepId: 's1' })
    await wrapper.find('[data-testid="answer-input"]').setValue('Rome')

    await wrapper.setProps({ stepId: 's2' })
    await nextTick()

    expect(wrapper.find('[data-testid="answer-input"]').element.value).toBe('')
  })

  it('flags the field invalid for assistive tech after a wrong answer', async () => {
    const wrapper = mountWith(LockBlock, { stepId: 's1' })
    const input = wrapper.find('[data-testid="answer-input"]')
    expect(input.attributes('aria-invalid')).toBe('false')

    await wrapper.setProps({ wrongNonce: 1 })
    expect(wrapper.find('[data-testid="answer-input"]').attributes('aria-invalid')).toBe('true')
  })

  it('replays the shake on a second consecutive wrong answer', async () => {
    vi.useFakeTimers()
    const wrapper = mountWith(LockBlock, { stepId: 's1' })
    const classes = () => wrapper.find('[data-testid="answer-input"]').classes()
    // The watcher defers the class by a tick so the animation restarts.
    const settle = async () => { await nextTick(); await nextTick() }

    await wrapper.setProps({ wrongNonce: 1 })
    await settle()
    expect(classes()).toContain('wrong')

    vi.advanceTimersByTime(500)
    await settle()
    expect(classes()).not.toContain('wrong')

    // A boolean prop could not do this — the nonce is what re-arms it.
    await wrapper.setProps({ wrongNonce: 2 })
    await settle()
    expect(classes()).toContain('wrong')

    vi.useRealTimers()
  })
})

describe('TriviaBlock', () => {
  const options = ['Blue', 'Gold', 'Rust']

  it('will not submit before an option is chosen', async () => {
    const wrapper = mountWith(TriviaBlock, { stepId: 's1', options })
    expect(wrapper.find('[data-testid="submit-answer"]').attributes('disabled')).toBeDefined()
  })

  it('emits the chosen index', async () => {
    const wrapper = mountWith(TriviaBlock, { stepId: 's1', options })
    await wrapper.find('[data-testid="option-1"]').trigger('click')
    await wrapper.find('[data-testid="submit-answer"]').trigger('click')

    expect(wrapper.emitted('submit')[0]).toEqual([1])
  })

  it('marks the chosen option for assistive tech', async () => {
    const wrapper = mountWith(TriviaBlock, { stepId: 's1', options })
    await wrapper.find('[data-testid="option-2"]').trigger('click')

    expect(wrapper.find('[data-testid="option-2"]').attributes('aria-checked')).toBe('true')
    expect(wrapper.find('[data-testid="option-0"]').attributes('aria-checked')).toBe('false')
  })

  it('drops the selection when the step changes', async () => {
    const wrapper = mountWith(TriviaBlock, { stepId: 's1', options })
    await wrapper.find('[data-testid="option-1"]').trigger('click')

    await wrapper.setProps({ stepId: 's2' })
    await nextTick()

    expect(wrapper.find('[data-testid="submit-answer"]').attributes('disabled')).toBeDefined()
  })
})

describe('HotspotBlock', () => {
  /** jsdom reports a zero-size box, so give the scene real dimensions. */
  function stubBox(wrapper) {
    const scene = wrapper.find('[data-testid="hotspot-scene"]').element
    scene.getBoundingClientRect = () => ({ left: 100, top: 50, width: 200, height: 100 })
  }

  it('reports the tap as a percentage of the image', async () => {
    const wrapper = mountWith(HotspotBlock, { stepId: 's1', imageUrl: 'room.jpg' })
    stubBox(wrapper)

    // 150,100 on a 200x100 box at (100,50) => 25% across, 50% down.
    await wrapper.find('[data-testid="hotspot-scene"]').trigger('click', { clientX: 150, clientY: 100 })

    expect(wrapper.emitted('submit')[0][0]).toEqual({ x: 25, y: 50 })
  })

  it('treats keyboard activation as a tap on the centre', async () => {
    const wrapper = mountWith(HotspotBlock, { stepId: 's1', imageUrl: 'room.jpg' })
    stubBox(wrapper)

    // Keyboard-triggered clicks report 0,0.
    await wrapper.find('[data-testid="hotspot-scene"]').trigger('click', { clientX: 0, clientY: 0 })

    expect(wrapper.emitted('submit')[0][0]).toEqual({ x: 50, y: 50 })
  })

  it('leaves a marker where each miss landed', async () => {
    const wrapper = mountWith(HotspotBlock, { stepId: 's1', imageUrl: 'room.jpg' })
    stubBox(wrapper)

    await wrapper.find('[data-testid="hotspot-scene"]').trigger('click', { clientX: 150, clientY: 100 })
    await wrapper.find('[data-testid="hotspot-scene"]').trigger('click', { clientX: 200, clientY: 75 })

    expect(wrapper.findAll('.miss')).toHaveLength(2)
  })

  it('clears the markers on the next step', async () => {
    const wrapper = mountWith(HotspotBlock, { stepId: 's1', imageUrl: 'room.jpg' })
    stubBox(wrapper)
    await wrapper.find('[data-testid="hotspot-scene"]').trigger('click', { clientX: 150, clientY: 100 })

    await wrapper.setProps({ stepId: 's2' })
    await nextTick()

    expect(wrapper.findAll('.miss')).toHaveLength(0)
  })
})

describe('StepIndicator', () => {
  it('fills solved dots and widens the one in play', () => {
    const wrapper = mountWith(StepIndicator, { total: 4, solved: 2 })
    const dots = wrapper.findAll('.dot')

    expect(dots).toHaveLength(4)
    expect(dots[0].classes()).toContain('done')
    expect(dots[1].classes()).toContain('done')
    expect(dots[2].classes()).toContain('active')
    expect(dots[3].classes()).not.toContain('done')
  })
})

describe('GrandFinale', () => {
  it('waits for the gated reward before typing the letter out', async () => {
    vi.useFakeTimers()
    // Mounts the instant the last step is solved — the reward lands a tick later.
    const wrapper = mountWith(GrandFinale, { reward: null, questName: 'The Vault' })
    expect(wrapper.find('[data-testid="reward-letter"]').text()).toBe('')

    await wrapper.setProps({ reward: { type: 'letter', body: 'See you Friday.' } })

    // Typed one character at a time, so nothing shows until the timer runs.
    vi.advanceTimersByTime(60)
    await nextTick()
    const partial = wrapper.find('[data-testid="reward-letter"]').text()
    expect(partial.length).toBeGreaterThan(0)
    expect(partial.length).toBeLessThan('See you Friday.'.length)

    vi.advanceTimersByTime(1000)
    await nextTick()
    expect(wrapper.find('[data-testid="reward-letter"]').text()).toContain('See you Friday.')

    vi.useRealTimers()
  })

  it('renders a voucher with its copyable code', () => {
    const wrapper = mountWith(GrandFinale, {
      reward: { type: 'voucher', code: 'GIFT-2026', body: 'Coffee is on me.' }
    })
    expect(wrapper.find('[data-testid="voucher-code"]').text()).toBe('GIFT-2026')
    expect(wrapper.find('[data-testid="copy-code"]').exists()).toBe(true)
  })

  it('embeds a video reward', () => {
    const wrapper = mountWith(GrandFinale, {
      reward: { type: 'video', url: 'https://example.test/embed/1' }
    })
    expect(wrapper.find('[data-testid="reward-video"] iframe').attributes('src')).toBe(
      'https://example.test/embed/1'
    )
  })

  it('always offers the viral CTA', () => {
    const wrapper = mountWith(GrandFinale, { reward: { type: 'letter', body: 'x' } })
    expect(wrapper.find('[data-testid="viral-cta"]').text()).toContain('Want to surprise someone else?')
  })

  it('drops the watermark for paid tiers', () => {
    const wrapper = mountWith(GrandFinale, {
      reward: { type: 'letter', body: 'x' },
      watermark: false
    })
    expect(wrapper.text()).not.toContain('Made with Puzzify')
  })
})
