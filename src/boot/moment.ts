import { boot } from 'quasar/wrappers'
// import Vue from 'vue'
import * as momentTimezone from 'moment-timezone'
// import { Moment } from 'moment'
import * as moment from 'moment'
// import moment from 'moment'
import { extendMoment, MomentRange } from 'moment-range'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $moment: MomentRange & typeof moment
  }
}

const momentInstance = extendMoment(momentTimezone)

export default boot(({ app }) => {
  app.config.globalProperties.$moment = momentInstance
})

export { momentInstance }
