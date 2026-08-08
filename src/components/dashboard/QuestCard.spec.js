import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import i18n from '../../i18n'
import router from '../../router'
import QuestCard from './QuestCard.vue'

const published = {
  id: 7,
  name: "Mum's 60th",
  occasion: 'mysteryNight',
  steps: 2,
  stepKinds: ['lock', 'trivia'],
  status: 'Published',
  playerId: 'abc123',
  plays: 38,
  completion: 82,
  avgSolve: 252,
  rewardType: 'voucher',
  lastActivity: 'Played 3h ago',
  timestamp: Date.now()
}

const draft = { ...published, id: 8, status: 'Draft', playerId: undefined, occasion: '' }

function mountCard(quest = published) {
  return mount(QuestCard, {
    props: { quest },
    global: { plugins: [createPinia(), i18n, router] }
  })
}

describe('QuestCard', () => {
  beforeEach(async () => {
    setActivePinia(createPinia())
    i18n.global.locale.value = 'en'
    router.push('/dashboard/quests')
    await router.isReady()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  describe('PRD §4.2.1 card contents', () => {
    it('shows the occasion kicker in the reader language', () => {
      const wrapper = mountCard()
      expect(wrapper.get('[data-testid="quest-occasion"]').text()).toBe('Mystery night')

      i18n.global.locale.value = 'fr'
      expect(mountCard().get('[data-testid="quest-occasion"]').text()).toBe('Soirée mystère')
    })

    it('falls back to free text for an occasion that is not a preset', () => {
      const wrapper = mountCard({ ...published, occasion: 'Graduation party' })
      expect(wrapper.get('[data-testid="quest-occasion"]').text()).toBe('Graduation party')
    })

    it('omits the kicker when the quest has no occasion', () => {
      expect(mountCard(draft).find('[data-testid="quest-occasion"]').exists()).toBe(false)
    })

    it('shows the reward type', () => {
      expect(mountCard().get('[data-testid="quest-reward"]').text()).toBe('Voucher')
    })

    it('localizes the reward type', () => {
      i18n.global.locale.value = 'de'
      expect(mountCard().get('[data-testid="quest-reward"]').text()).toBe('Gutschein')
    })

    it('shows an unrecognized reward label verbatim rather than a raw key', () => {
      const wrapper = mountCard({ ...published, rewardType: 'Mixtape' })
      expect(wrapper.get('[data-testid="quest-reward"]').text()).toBe('Mixtape')
    })

    it('renders status, plays and completion', () => {
      const wrapper = mountCard()
      expect(wrapper.text()).toContain('Published')
      expect(wrapper.text()).toContain('38')
      expect(wrapper.text()).toContain('82%')
      expect(wrapper.text()).toContain('Played 3h ago')
    })
  })

  describe('footer actions', () => {
    it('opens the quest editor', async () => {
      const wrapper = mountCard()
      const push = vi.spyOn(router, 'push')

      await wrapper.get('[data-testid="edit-quest-7"]').trigger('click')

      expect(push).toHaveBeenCalledWith({ name: 'quest-builder', params: { id: 7 } })
      push.mockRestore()
    })

    it('copies the player link and confirms', async () => {
      vi.useFakeTimers()
      const writeText = vi.fn().mockResolvedValue(undefined)
      vi.stubGlobal('navigator', { clipboard: { writeText } })

      const wrapper = mountCard()
      await wrapper.get('[data-testid="copy-link-7"]').trigger('click')
      await vi.waitFor(() => expect(writeText).toHaveBeenCalled())

      expect(writeText).toHaveBeenCalledWith(expect.stringContaining('/q/abc123'))
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).toContain('Link copied')

      // The confirmation is transient.
      vi.advanceTimersByTime(2000)
      await wrapper.vm.$nextTick()
      expect(wrapper.text()).not.toContain('Link copied')

      vi.unstubAllGlobals()
    })

    it('still confirms when the clipboard is blocked', async () => {
      const writeText = vi.fn().mockRejectedValue(new Error('denied'))
      vi.stubGlobal('navigator', { clipboard: { writeText } })

      const wrapper = mountCard()
      await wrapper.get('[data-testid="copy-link-7"]').trigger('click')
      await vi.waitFor(() => expect(wrapper.text()).toContain('Link copied'))

      vi.unstubAllGlobals()
    })

    it('hides copy-link on a draft, which has no player URL yet', () => {
      const wrapper = mountCard(draft)
      expect(wrapper.find('[data-testid="copy-link-8"]').exists()).toBe(false)
      expect(wrapper.find('[data-testid="edit-quest-8"]').exists()).toBe(true)
      expect(wrapper.text()).toContain('Draft')
    })
  })
})
