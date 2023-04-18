import { boot } from 'quasar/wrappers'
import { useVuelidate } from '@vuelidate/core'

export default boot(({ app }) => {
  app.config.globalProperties.$vuelidate = useVuelidate()
  app.config.globalProperties.$v = useVuelidate()
  // app.use(useVuelidate)
})