import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { createRouter, createWebHistory } from 'vue-router'
import i18n from '../../i18n'
import { useBuilderStore } from '../../stores/useBuilderStore'
import BuilderTopBar from './BuilderTopBar.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/:pathMatch(.*)*', component: { template: '<div />' } }]
})

const mountTopBar = () => mount(BuilderTopBar, { global: { plugins: [i18n, router] } })

describe('BuilderTopBar', () => {
  let builder

  beforeEach(async () => {
    setActivePinia(createPinia())
    i18n.global.locale.value = 'en'
    builder = useBuilderStore()
    builder.startNew('birthday')
    router.push('/')
    await router.isReady()
  })

  it('edits the quest name', async () => {
    const wrapper = mountTopBar()
    await wrapper.find('[data-testid="quest-name"]').setValue('The Vault')
    expect(builder.draft.name).toBe('The Vault')
    expect(builder.dirty).toBe(true)
  })

  it('shows the live step count', async () => {
    const wrapper = mountTopBar()
    expect(wrapper.find('[data-testid="step-count"]').text()).toContain('0')

    builder.addStep('lock')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-testid="step-count"]').text()).toContain('1')
  })

  it('surfaces the first thing standing between the draft and publishing', async () => {
    const wrapper = mountTopBar()
    expect(wrapper.find('[data-testid="quest-issue"]').text()).toBe('Name your quest.')

    builder.setName('The Vault')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-testid="quest-issue"]').text()).toBe('Add at least one step.')

    builder.addStep('lock')
    await wrapper.vm.$nextTick()
    expect(wrapper.find('[data-testid="quest-issue"]').text()).toBe('Finish every step.')
  })

  it('reports a saved state only when the quest is complete and clean', async () => {
    const wrapper = mountTopBar()
    builder.setName('The Vault')
    builder.addStep('lock')
    builder.updateStep({ prompt: 'Where?' })
    builder.updateConfig({ answer: 'Oslo' })
    await wrapper.vm.$nextTick()

    // Complete but unsaved: no issue, and no "Saved" badge either.
    expect(wrapper.find('[data-testid="quest-issue"]').exists()).toBe(false)
    expect(wrapper.text()).not.toContain('Saved')

    builder.save()
    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Saved')
  })

  it('emits save so the view can claim the new quest URL', async () => {
    const wrapper = mountTopBar()
    await wrapper.find('[data-testid="save-quest"]').trigger('click')
    expect(wrapper.emitted('save')).toHaveLength(1)
  })

  it('links back to the dashboard', () => {
    expect(mountTopBar().find('a.back').attributes('href')).toBe('/dashboard/quests')
  })
})
