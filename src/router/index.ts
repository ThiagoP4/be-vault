// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      // Carrega o arquivo da tela de Login
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/',
      name: 'home',
      // Carrega o arquivo do Cofre (Dashboard)
      component: () => import('../views/VaultView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFoundView.vue')
    }
  ]
})

export default router
