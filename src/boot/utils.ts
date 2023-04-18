import { boot } from 'quasar/wrappers'
import { date, extend, colors, uid } from 'quasar'
// import crono from 'vue-crono'
import _, { LoDashStatic } from 'lodash'
import * as common from 'components/script/common'
import { Common } from '../@types/common'
import { bugPost } from 'components/script/common'
import { ComponentConstructor } from 'quasar'
// import Sortable from 'sortablejs'

import DialogCustomForm from 'src/components/dialog/FormDialog.vue'
// import DialogFileUpload from 'components/dialog/FileUpload.vue'
import DialogTextEditor from 'components/dialog/TextEditor.vue'
// import DialogResults from 'components/dialog/Results.vue'
// import DialogResultsOld from 'components/dialog/ResultsOld.vue'
// import DialogJudges from 'components/dialog/Judges.vue'
import DialogCompetitors from 'components/dialog/Competitors.vue'
import DialogTable from 'src/components/dialog/TableDialog.vue'
// import DialogRoundBuilder from 'components/dialog/RoundBuilder.vue'
// import DialogTimetableBuilder from 'components/dialog/TimetableBuilder.vue'
// import DialogTeamBuilder from 'components/dialog/TeamBuilder.vue'
// import DialogReportIssue from 'components/dialog/ReportIssue.vue'
// import DialogUserResults from 'components/dialog/UserResults.vue'
// import DialogInvoice from 'components/dialog/Invoice.vue'

import CustomForm from 'components/Form.vue'
import FieldCard from 'components/FieldCard.vue'
import ListTable from 'components/ListTable.vue'
import Tabs from 'src/components/JTabs.vue'
import TextEditorEmbed from 'components/TextEditorEmbed.vue'
// import TapGrid from 'components/TapGrid.vue'
import ProfileExpander from 'components/ProfileExpander.vue'
// import FileList from 'components/FileList.vue'

// import InvoicePDF from 'components/pdf_templates/invoice.vue'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $common: Common.Common
    $customDialog: {
      Form: ComponentConstructor
      TextEditor: ComponentConstructor
      Table: ComponentConstructor
      Competitors: ComponentConstructor
      // ReportIssue: ComponentConstructor
    }
    $_: LoDashStatic
  }
}

export default boot(({ app }) => {
  app.component('FieldCard', FieldCard)
  app.component('CustomForm', CustomForm)
  app.component('ListTable', ListTable)
  app.component('JTabs', Tabs)
  // app.component('InvoicePDF', InvoicePDF)
  app.component('TextEditorEmbed', TextEditorEmbed)
  // app.component('TapGrid', TapGrid)
  app.component('ProfileExpander', ProfileExpander)
  // app.component('FileList', FileList)
  app.config.globalProperties.$date = date
  app.config.globalProperties.$colors = colors
  app.config.globalProperties.$extend = extend
  app.config.globalProperties.$common = common
  app.config.globalProperties.$uid = uid
  app.config.globalProperties.$_ = _
  app.config.globalProperties.$customDialog = {
    Form: DialogCustomForm,
    TextEditor: DialogTextEditor,
    Table: DialogTable,
    Competitors: DialogCompetitors,
    // ReportIssue: DialogReportIssue,
  }
  app.config.errorHandler = bugPost
  // app.directive('sortable', {
  //   updated(el, binding) {
  //     const options = binding.value.options ?? {}
  //     const sorting = binding.value.list
  //     if (sorting) {
  //       options.onUpdate = (e: { oldIndex: number; newIndex: number }) => {
  //         const deleted = sorting.splice(e.oldIndex, 1)
  //         sorting.splice(e.newIndex, 0, deleted[0])
  //       }
  //     }
  //     Sortable.create(el, options)
  //   },
  // })
  // app.use(crono)
})

// export { common }
