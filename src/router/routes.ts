import { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/loginPin.vue') },
      { path: '/login', component: () => import('pages/loginPin.vue') },
      { path: '/pad', component: () => import('components/JudgePad.vue') },
      {
        path: '/judge',
        component: () => import('pages/JudgePage.vue'),
        meta: {
          requiresAuth: true,
          // title: 'Ju',
        },
      },
      {
        path: '/demo',
        component: () => import('pages/DemoPage.vue'),
        meta: {
          requiresAuth: true,
          // title: 'Ju',
        },
      },
      {
        path: '/backgrounds',
        component: () => import('pages/Backgrounds.vue'),
      },
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
