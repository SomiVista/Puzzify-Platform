import { createRouter, createWebHistory } from 'vue-router'
import LandingView from '../views/LandingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: LandingView
    },
    {
      path: '/dashboard',
      component: () => import('../views/CreatorDashboard.vue'),
      children: [
        {
          path: '',
          redirect: '/dashboard/quests'
        },
        {
          path: 'quests',
          name: 'dashboard-quests',
          component: () => import('../views/dashboard/QuestsView.vue'),
          meta: { titleKey: 'dashboard.titles.quests' }
        },
        {
          path: 'analytics',
          name: 'dashboard-analytics',
          component: () => import('../views/dashboard/AnalyticsView.vue'),
          meta: { titleKey: 'dashboard.titles.analytics' }
        },
        {
          path: 'presets',
          name: 'dashboard-presets',
          component: () => import('../views/dashboard/PresetsView.vue'),
          meta: { titleKey: 'dashboard.titles.presets' }
        },
        {
          path: 'settings',
          name: 'dashboard-settings',
          component: () => import('../views/dashboard/SettingsView.vue'),
          meta: { titleKey: 'dashboard.titles.settings' }
        }
      ]
    },
    /* The Quest Builder is a full-width studio, so it sits OUTSIDE the dashboard
       shell rather than inside its sidebar layout (design.md §3). */
    {
      path: '/dashboard/quests/new',
      name: 'quest-builder-new',
      component: () => import('../views/QuestBuilderView.vue')
    },
    {
      path: '/dashboard/quests/:id/edit',
      name: 'quest-builder',
      component: () => import('../views/QuestBuilderView.vue')
    },
    /* The recipient's entry point (PRD §8). No auth, no shell, its own chunk so
       it stays inside the 2s load budget (PRD §6.2). */
    {
      path: '/q/:questId',
      name: 'player',
      component: () => import('../views/PlayerView.vue')
    }
  ]
})

export default router
