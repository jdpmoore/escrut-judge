import { boot } from 'quasar/wrappers'
import {Store} from 'vuex'
import {StateInterface} from 'src/store/index'
// boot/router.js
let storeInstance: Store<StateInterface>
//  = void 0

export default boot(({ store }) => {
  storeInstance = store
});

export { storeInstance }