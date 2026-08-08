import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import i18n from '../../i18n'
import { THEMES } from '../../themes'
import { useAppStore } from '../../stores/useAppStore'
import { useBuilderStore } from '../../stores/useBuilderStore'
import ThemeConfigurator from './ThemeConfigurator.vue'
import LivePreview from './LivePreview.vue'

const mountWith = (component) => mount(component, { global: { plugins: [i18n] } })

describe('ThemeConfigurator', () => {
  let builder

  beforeEach(() => {
    setActivePinia(createPinia())
    i18n.global.locale.value = 'en'
    builder = useBuilderStore()
    builder.startNew('birthday')
  })

  it('offers every shipped theme preset', () => {
    const wrapper = mountWith(ThemeConfigurator)
    expect(wrapper.findAll('.presets button')).toHaveLength(Object.keys(THEMES).length)
  })

  it('marks the seeded preset as selected', () => {
    const wrapper = mountWith(ThemeConfigurator)
    expect(wrapper.find('[data-testid="theme-birthday"]').attributes('aria-pressed')).toBe('true')
    expect(wrapper.find('[data-testid="theme-mystery"]').attributes('aria-pressed')).toBe('false')
  })

  it('changes the quest theme without touching the app-wide theme', async () => {
    const app = useAppStore()
    const wrapper = mountWith(ThemeConfigurator)

    await wrapper.find('[data-testid="theme-spooky"]').trigger('click')

    expect(builder.draft.theme.preset).toBe('spooky')
    expect(wrapper.find('[data-testid="theme-spooky"]').attributes('aria-pressed')).toBe('true')
    // The studio chrome stays on whatever theme the creator picked globally.
    expect(app.theme).toBe('birthday')
  })

  it('names the ambient audio and particle effect of the active preset', async () => {
    const wrapper = mountWith(ThemeConfigurator)
    expect(wrapper.text()).toContain(THEMES.birthday.audio)
    expect(wrapper.text()).toContain(THEMES.birthday.particles.label)

    await wrapper.find('[data-testid="theme-mystery"]').trigger('click')
    expect(wrapper.text()).toContain(THEMES.mystery.audio)
    expect(wrapper.text()).toContain(THEMES.mystery.particles.label)
  })

  it('toggles ambient audio and opening particles', async () => {
    const wrapper = mountWith(ThemeConfigurator)
    expect(builder.draft.theme.ambientAudio).toBe(true)
    expect(builder.draft.theme.particles).toBe(true)

    await wrapper.find('[data-testid="toggle-audio"]').trigger('click')
    await wrapper.find('[data-testid="toggle-particles"]').trigger('click')

    expect(builder.draft.theme.ambientAudio).toBe(false)
    expect(builder.draft.theme.particles).toBe(false)
    expect(wrapper.find('[data-testid="toggle-audio"]').attributes('aria-checked')).toBe('false')
  })
})

describe('LivePreview', () => {
  let builder

  beforeEach(() => {
    setActivePinia(createPinia())
    i18n.global.locale.value = 'en'
    builder = useBuilderStore()
    builder.startNew('birthday')
  })

  it('invites the creator to add a step first', () => {
    expect(mountWith(LivePreview).text()).toContain('Add a step to preview it.')
  })

  it('re-skins with the quest theme tokens, never a hardcoded colour', async () => {
    builder.addStep('lock')
    builder.setThemePreset('mystery')
    const preview = mountWith(LivePreview).find('[data-testid="live-preview"]')

    expect(preview.attributes('data-theme')).toBe('mystery')
    // Values come straight from the preset in themes.js.
    expect(preview.attributes('style')).toContain(THEMES.mystery.vars['--color-primary'])
  })

  it('shows the advanced settings the creator configured', async () => {
    builder.addStep('lock')
    builder.updateStep({
      prompt: 'First city?',
      hintText: 'It rhymes with dome',
      successMessage: 'You always remembered!',
      maxAttempts: 3
    })
    const wrapper = mountWith(LivePreview)

    expect(wrapper.text()).toContain('First city?')
    expect(wrapper.text()).toContain('Hint')
    expect(wrapper.text()).toContain('3 attempts')
    expect(wrapper.text()).toContain('You always remembered!')
  })

  it('hides the hint chip and attempts counter when they are not configured', () => {
    builder.addStep('lock')
    builder.updateStep({ prompt: 'First city?' })
    const wrapper = mountWith(LivePreview)

    expect(wrapper.find('.hint-chip').exists()).toBe(false)
    expect(wrapper.find('.attempts').exists()).toBe(false)
    expect(wrapper.find('.mock-toast').exists()).toBe(false)
  })

  it('drops the particle field when opening particles are switched off', async () => {
    builder.addStep('lock')
    expect(mountWith(LivePreview).find('.particles').exists()).toBe(true)

    builder.setParticles(false)
    expect(mountWith(LivePreview).find('.particles').exists()).toBe(false)
  })
})
