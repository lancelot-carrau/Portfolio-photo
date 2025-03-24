import { createRouter, createWebHistory } from 'vue-router'
import Portfolio from '@/components/Portfolio.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Portfolio,
    },
  ],
})

export default router
