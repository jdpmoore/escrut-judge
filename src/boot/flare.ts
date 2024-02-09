import { boot } from 'quasar/wrappers'
import { flare } from '@flareapp/flare-client'
import { flareVue } from '@flareapp/flare-vue'
// Only enable Flare in production, we don't want to waste your quota while you're developing:
if (!process.env.LOCAL) {
  flare.light(process.env.FLARE)
}

export default boot(({ app }) => {
  app.use(flareVue)
})
