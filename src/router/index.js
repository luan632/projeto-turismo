
/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import Turismo from "../pages/index.vue"
import Hoteis from "../pages/index.vue"
import Rotiros from "../pages/index.vue"
import Restauntes from "../pages/index.vue"
import FeedBack from "../pages/index.vue"

const routes = [
  { path: '/', component: Turismo },
  { path: '/turismo', component: Turismo },
  { path: '/hoteis', component: Hoteis},
  { path: '/roteiro', component: Rotiros },
  { path: '/restaurante', component: Restauntes },
  { path: '/feedback', component: FeedBack },
]
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
