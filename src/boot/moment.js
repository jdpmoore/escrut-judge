import { boot } from 'quasar/wrappers'
// import Vue from 'vue'
import * as momentTimezone from 'moment-timezone'
// import { Moment } from 'moment'
// import moment from 'moment'
import { extendMoment } from 'moment-range'

// declare module '@vue/runtime-core' {
//   interface ComponentCustomProperties {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     $moment: Moment
//   }
// }

const momentInstance = extendMoment(momentTimezone)

export default boot(({ app }) => {
    app.config.globalProperties.$moment = momentInstance
})

export { momentInstance }
