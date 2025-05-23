import { boot } from 'quasar/wrappers'
import VueTippy from 'vue-tippy'
import 'tippy.js/dist/tippy.css' // optional for styling
import 'tippy.js/dist/border.css'

export default boot(({ app }) => {
  app.use(
    VueTippy,
    // optional
    {
      directive: 'tippy', // => v-tippy
      component: 'tippy', // => <tippy/>
      componentSingleton: 'tippy-singleton', // => <tippy-singleton/>,
      defaultProps: {
        placement: 'auto-end',
        allowHTML: true,
        theme: 'ivda',
      }, // => Global default options * see all props
    }
  )
})
