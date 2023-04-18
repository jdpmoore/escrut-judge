import { boot } from 'quasar/wrappers'
import VueSanitize from 'vue-sanitize-directive'
import sanitizeHTML from 'sanitize-html'

export default boot(({ app }) => {
  app.config.globalProperties.$sanitize = sanitizeHTML
  app.use(VueSanitize)
})
