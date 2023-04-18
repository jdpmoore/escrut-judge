import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/login.vue') },
      { path: '/login', component: () => import('pages/login.vue') },
      { path: '/pad', component: () => import('components/JudgePad.vue') },
      { path: '/whiteboard', component: () => import('pages/whiteboard.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
