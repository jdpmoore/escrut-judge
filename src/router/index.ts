import { route } from 'quasar/wrappers'
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router'
import { StateInterface } from '../store'
import routes from './routes'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route<StateInterface>(function ({ store }) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(
      process.env.MODE === 'ssr' ? void 0 : process.env.VUE_ROUTER_BASE
    ),
  })
  Router.beforeEach((to, from, next) => {
    let allowedToEnter = true
    to.matched.some((record) => {
      // check if there is meta data
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const isLoggedIn = (<any>store).state.command.loggedIn
      // if (!isLoggedIn && record.name === 'home') {
      //   next({
      //     path: '/login',
      //     replace: true,
      //   })
      // }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const user = (<any>store).state.command.userDetails
      // const userRoles = user?.roles
      const loginPage =
        record.path == '' || record.path == '/' || record.path.includes('login')
      if (loginPage && isLoggedIn) {
        allowedToEnter = false
      }
      if ('meta' in record) {
        // ------------------------------------------------------------
        // check if user needs to be logged in to access this page
        if ('requiresAuth' in record.meta) {
          if (record.meta.requiresAuth) {
            // console.log('Page requires auth:', to, from)
            // this route requires auth, check if user is logged in
            // if not, redirect to login page.
            if (!isLoggedIn || !user) {
              // User is not logged in, redirect to signin page
              allowedToEnter = false
              next({
                path: '/login',
                replace: true,
                // redirect back to original path when done signing in
                query: { redirect: to.fullPath },
              })
            }
          }
        }
      }
    })

    if (allowedToEnter) {
      // go to the requested page
      next()
    } else {
      next(false)
    }
  })
  return Router
})
