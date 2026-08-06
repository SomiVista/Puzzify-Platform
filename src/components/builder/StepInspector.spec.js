import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import i18n from '../../i18n'
import { useBuilderStore } from '../../stores/useBuilderStore'
import StepInspector from './StepInspector.vue'

const mountInspector = () => mount(StepInspector, { global: { plugins: [i18n] } })

describe('StepInspector', () => {
  let builder

  beforeEach(() => {
    setActivePinia(createPinia())
    i18n.global.locale.value = 'en'
    builder = useBuilderStore()
    builder.startNew('birthday')
  })

  it('prompts the creator to pick a step when nothing is selected', () => {
    const wrapper = mountInspector()
    expect(wrapper.text()).toContain('No step selected')
    expect(wrapper.find('[data-testid="wizard-nav"]').exists()).toBe(false)
  })

  describe('Flow Manager wizard', () => {
    beforeEach(() => {
      builder.addStep('lock')
      builder.addStep('trivia')
      builder.addStep('hotspot')
      builder.selectByIndex(0)
    })

    it('reports the position in the linear chain', () => {
      expect(mountInspector().find('[data-testid="wizard-label"]').text()).toBe('Step 1 of 3')
    })

    it('walks forward and back through the chain', async () => {
      const wrapper = mountInspector()

      await wrapper.find('[data-testid="wizard-next"]').trigger('click')
      expect(builder.selectedIndex).toBe(1)
      expect(wrapper.find('[data-testid="wizard-label"]').text()).toBe('Step 2 of 3')

      await wrapper.find('[data-testid="wizard-prev"]').trigger('click')
      expect(builder.selectedIndex).toBe(0)
    })

    it('disables navigation past either end', async () => {
      const wrapper = mountInspector()
      expect(wrapper.find('[data-testid="wizard-prev"]').attributes('disabled')).toBeDefined()

      builder.selectByIndex(2)
      await wrapper.vm.$nextTick()
      expect(wrapper.find('[data-testid="wizard-next"]').attributes('disabled')).toBeDefined()
    })
  })

  describe('per-step advanced settings', () => {
    beforeEach(() => {
      builder.addStep('lock')
    })

    it('keeps the advanced panel collapsed until asked for', async () => {
      const wrapper = mountInspector()
      const toggle = wrapper.find('[data-testid="advanced-toggle"]')
      expect(toggle.attributes('aria-expanded')).toBe('false')

      await toggle.trigger('click')
      expect(toggle.attributes('aria-expanded')).toBe('true')
    })

    it('writes hint text and success message to the step', async () => {
      const wrapper = mountInspector()
      await wrapper.find('[data-testid="advanced-toggle"]').trigger('click')

      await wrapper.find('[data-testid="field-hint"]').setValue('It rhymes with dome')
      await wrapper.find('[data-testid="field-success"]').setValue('You always remembered!')

      expect(builder.selectedStep.hintText).toBe('It rhymes with dome')
      expect(builder.selectedStep.successMessage).toBe('You always remembered!')
    })

    it('clamps Max Attempts into the supported range', async () => {
      const wrapper = mountInspector()
      await wrapper.find('[data-testid="advanced-toggle"]').trigger('click')
      const field = wrapper.find('[data-testid="field-attempts"]')

      await field.setValue('3')
      expect(builder.selectedStep.maxAttempts).toBe(3)

      await field.setValue('99')
      expect(builder.selectedStep.maxAttempts).toBe(10)

      await field.setValue('')
      expect(builder.selectedStep.maxAttempts).toBeNull()
    })
  })

  describe('block-specific configuration', () => {
    it('edits a lock answer and its case sensitivity', async () => {
      builder.addStep('lock')
      const wrapper = mountInspector()

      await wrapper.find('[data-testid="field-prompt"]').setValue('First city?')
      await wrapper.find('[data-testid="field-answer"]').setValue('Rome')
      expect(builder.selectedStep.prompt).toBe('First city?')
      expect(builder.selectedStep.config.answer).toBe('Rome')

      await wrapper.find('[data-testid="toggle-case"]').trigger('click')
      expect(builder.selectedStep.config.caseSensitive).toBe(true)
    })

    it('adds trivia options up to the four-option ceiling', async () => {
      builder.addStep('trivia')
      const wrapper = mountInspector()
      const addOption = wrapper.find('[data-testid="add-option"]')

      await addOption.trigger('click')
      await addOption.trigger('click')
      expect(builder.selectedStep.config.options).toHaveLength(4)
      expect(addOption.attributes('disabled')).toBeDefined()
    })

    it('marks the selected option as the correct one', async () => {
      builder.addStep('trivia')
      const wrapper = mountInspector()

      await wrapper.find('[data-testid="option-text-0"]').setValue('Rome')
      await wrapper.find('[data-testid="option-text-1"]').setValue('Oslo')
      await wrapper.find('[data-testid="option-correct-1"]').trigger('change')

      expect(builder.selectedStep.config.options).toEqual(['Rome', 'Oslo'])
      expect(builder.selectedStep.config.correctIndex).toBe(1)
    })

    it('surfaces what a step still needs before it can ship', async () => {
      builder.addStep('lock')
      const wrapper = mountInspector()
      expect(wrapper.find('[data-testid="step-issues"]').text()).toContain('Add a prompt.')

      await wrapper.find('[data-testid="field-prompt"]').setValue('First city?')
      await wrapper.find('[data-testid="field-answer"]').setValue('Rome')
      expect(wrapper.find('[data-testid="step-issues"]').exists()).toBe(false)
    })

    it('edits a hotspot image and target area', async () => {
      builder.addStep('hotspot')
      const wrapper = mountInspector()

      await wrapper.find('[data-testid="field-image"]').setValue('https://example.test/room.jpg')
      expect(builder.selectedStep.config.imageUrl).toBe('https://example.test/room.jpg')

      const [x] = wrapper.findAll('.target-cell input')
      await x.setValue('60')
      expect(builder.selectedStep.config.target).toMatchObject({ x: 60, y: 35 })
    })
  })

  it('renders in Persian without falling back to English', async () => {
    builder.addStep('lock')
    i18n.global.locale.value = 'fa'
    const wrapper = mountInspector()

    expect(wrapper.text()).toContain('تنظیمات گام')
    expect(wrapper.text()).not.toContain('Step settings')
  })
})
