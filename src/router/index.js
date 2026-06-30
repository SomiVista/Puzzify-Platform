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
          meta: { title: 'Your quests' }
        },
        {
          path: 'analytics',
          name: 'dashboard-analytics',
          component: () => import('../views/dashboard/AnalyticsView.vue'),
          meta: { title: 'Analytics' }
        },
        {
          path: 'presets',
          name: 'dashboard-presets',
          component: () => import('../views/dashboard/PresetsView.vue'),
          meta: { title: 'Presets' }
        },
        {
          path: 'settings',
          name: 'dashboard-settings',
          component: () => import('../views/dashboard/SettingsView.vue'),
          meta: { title: 'Settings' }
        }
      ]
    }
  ]
})

export default router
