import { boot } from 'quasar/wrappers'

// boot/router.js
let storeInstance = void 0

export default boot(({ store }) => {
  storeInstance = store
});

export { storeInstance }