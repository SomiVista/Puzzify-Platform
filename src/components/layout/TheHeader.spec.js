import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import i18n from '../../i18n'
import router from '../../router'
import { useAppStore } from '../../stores/useAppStore'
import TheHeader from './TheHeader.vue'

describe('TheHeader language menu', () => {
  let wrapper
  let onError

  beforeEach(async () => {
    setActivePinia(createPinia())
    i18n.global.locale.value = 'en'
    vi.useFakeTimers()

    // The bug this guards is a template expression that throws at RUNTIME —
    // Vue swallows handler errors, so assert on the error hook instead.
    onError = vi.fn()

    router.push('/')
    await router.isReady()

    wrapper = mount(TheHeader, {
      global: {
        plugins: [createPinia(), i18n, router],
        config: { errorHandler: onError }
      }
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    wrapper?.unmount()
  })

  const trigger = () => wrapper.findAll('button').find((b) => b.text().includes('English'))
  const menu = () => wrapper.find('.lang-menu div')

  it('opens on click', async () => {
    expect(menu().exists()).toBe(false)
    await trigger().trigger('click')
    expect(menu().exists()).toBe(true)
  })

  it('closes on focusout without raising an error', async () => {
    await trigger().trigger('click')
    expect(menu().exists()).toBe(true)

    await wrapper.find('.lang-menu').trigger('focusout')
    expect(onError).not.toHaveBeenCalled()

    // The close is deferred so a click on an option still lands first.
    expect(menu().exists()).toBe(true)
    vi.runAllTimers()
    await wrapper.vm.$nextTick()
    expect(menu().exists()).toBe(false)
  })

  it('keeps the menu open when focus moves back inside it', async () => {
    await trigger().trigger('click')
    await wrapper.find('.lang-menu').trigger('focusout')
    await wrapper.find('.lang-menu').trigger('focusin')

    vi.runAllTimers()
    await wrapper.vm.$nextTick()
    expect(menu().exists()).toBe(true)
  })

  it('closes on Escape', async () => {
    await trigger().trigger('click')
    await wrapper.find('.lang-menu').trigger('keydown.esc')
    expect(menu().exists()).toBe(false)
  })

  it('selects a language and closes', async () => {
    const store = useAppStore()
    await trigger().trigger('click')

    const arabic = wrapper.findAll('button').find((b) => b.text().includes('العربية'))
    expect(arabic.exists()).toBe(true)
    await arabic.trigger('click')

    expect(store.lang).toBe('ar')
    expect(menu().exists()).toBe(false)
    expect(onError).not.toHaveBeenCalled()
  })

  it('reports its expanded state to assistive tech', async () => {
    expect(trigger().attributes('aria-expanded')).toBe('false')
    await trigger().trigger('click')
    expect(trigger().attributes('aria-expanded')).toBe('true')
  })
})
