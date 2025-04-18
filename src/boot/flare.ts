import { boot } from 'quasar/wrappers'
import { flare } from '@flareapp/flare-client'
import { flareVue } from '@flareapp/flare-vue'
import { routerInstance } from 'boot/router'
import { storeInstance } from 'boot/store'
import _ from 'lodash'
// Only enable Flare in production, we don't want to waste your quota while you're developing:
flare.addContext('version', process.env.version)
flare.beforeSubmit = (report) => {
  const editedReport = { ...report }
  const theUser = _.omit(storeInstance.state.command.userDetails, ['avatar'])
  editedReport.context.user = theUser
  editedReport.context.route = routerInstance.currentRoute.value.fullPath
  const status = storeInstance.getters['command/status']
  console.log('do we have a status', status)
  editedReport.context.status = status
  return editedReport
}
if (!process.env.LOCAL) {
  flare.light(process.env.FLARE)
}

export default boot(({ app }) => {
  app.use(flareVue)
})
