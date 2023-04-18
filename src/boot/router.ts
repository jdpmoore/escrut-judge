import { boot } from 'quasar/wrappers'
import { Router } from 'vue-router'

// boot/router.js
let routerInstance: Router

export default boot(({ router }) => {
  routerInstance = router
});

export { routerInstance }