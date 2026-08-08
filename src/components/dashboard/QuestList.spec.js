import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import i18n from '../../i18n'
import router from '../../router'
import { useAppStore } from '../../stores/useAppStore'
import QuestList from './QuestList.vue'

function mountList() {
  return mount(QuestList, {
    global: { plugins: [createPinia(), i18n, router] }
  })
}

const cardTitles = (wrapper) => wrapper.findAll('.quest-title').map((n) => n.text())

describe('QuestList', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
    i18n.global.locale.value = 'en'
    router.push('/dashboard/quests')
    await router.isReady()
  })

  it('renders a card per quest, most recent first', () => {
    const wrapper = mountList()
    const store = useAppStore()
    expect(cardTitles(wrapper)).toEqual(store.filteredQuests.map((q) => q.name))
    expect(cardTitles(wrapper)[0]).toBe('Onboarding — Q3') // played 12m ago
  })

  it('filters to drafts', async () => {
    const wrapper = mountList()
    const drafts = wrapper.findAll('.filter-btn').find((b) => b.text() === 'Drafts')

    await drafts.trigger('click')

    expect(cardTitles(wrapper)).toEqual(['Team offsite hunt', 'A Year of Us'])
  })

  it('toggles the sort control between recent and name', async () => {
    const wrapper = mountList()
    const sort = wrapper.get('[data-testid="quest-sort"]')
    expect(sort.text()).toContain('Recent')

    await sort.trigger('click')

    expect(sort.text()).toContain('Name')
    expect(cardTitles(wrapper)).toEqual([...cardTitles(wrapper)].sort((a, b) => a.localeCompare(b)))

    await sort.trigger('click')
    expect(sort.text()).toContain('Recent')
  })

  it('narrows to the search query and shows a message when nothing matches', async () => {
    const wrapper = mountList()
    const store = useAppStore()

    store.searchQuery = 'offsite'
    await wrapper.vm.$nextTick()
    expect(cardTitles(wrapper)).toEqual(['Team offsite hunt'])

    store.searchQuery = 'nothing here'
    await wrapper.vm.$nextTick()
    expect(wrapper.find('.no-results').exists()).toBe(true)
  })
})
