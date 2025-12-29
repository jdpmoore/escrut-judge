import { boot } from 'quasar/wrappers'
import { ActionContext, Store } from 'vuex'
import { createStore } from 'vuex'

import command from 'src/store/command'
import echo from 'src/store/echo'
import scrutineer from 'src/store/scrutineer'
import { ScrutineerStateInterface } from 'src/store/scrutineer/state'
import { EchoStateInterface } from 'src/store/echo/state'
import { CommandStateInterface } from 'src/store/command/state'
// boot/router.js
export interface StateInterface {
  // Define your own store structure, using submodules if needed
  // example: ExampleStateInterface;
  // Declared as unknown to avoid linting issue. Best to strongly type as per the line above.
  command: CommandStateInterface
  echo: EchoStateInterface
  scrutineer: ScrutineerStateInterface
}

// provide typings for `this.$store`
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $store: ActionContext<StateInterface, StateInterface>
  }
}

let storeInstance: Store<StateInterface>
//  = void 0
export default boot(({ app }) => {
  const store = createStore({
    modules: {
      command,
      echo,
      scrutineer,
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
  })
  // console.log('the store', store)
  app.use(store)
  storeInstance = store
  // app.config.globalProperties.$moment = storeInstance
})

// export default boot(({ store }) => {
//   storeInstance = store
// });

export { storeInstance }
