<template>
  <q-dialog
    ref="dialog"
    maximized
    :persistent="persistent"
    style="width: 100vw"
    @hide="onDialogHide"
  >
    <q-layout view="lHh lpr lFf" container class="shadow-2 rounded-borders">
      <q-header elevated>
        <q-card-section
          class="bg-dark text-white text-center q-pa-sm q-mb-none"
        >
          <div class="row items-center no-wrap">
            <div class="col">
              <div class="text-h6">{{ title }}</div>
            </div>
            <div class="col-auto">
              <q-btn icon="close" round dense flat @click="onCancelClick" />
            </div>
          </div>
        </q-card-section>
      </q-header>
      <q-page-container>
        <q-page
          square
          flat
          class="col-auto justify-center items-center full-width bg-dark"
        >
          <q-card-section class="bg-dark text-black q-pa-none">
            <ListTable
              :add-button="showAdd"
              :table-title="tableTitle"
              :table-headers="headers"
              :table-data="localData"
              :row-key="rowKey"
              :word-wrap="230"
              :selection="selection"
              no-action
              :offset="152"
              :tabs="tabs"
              :tab="localTab"
              :visible-columns="visibleColumns"
              :pre-selected="preSelected"
              :print-headers="printHeaders"
              :default-filter="defaultFilter"
              :delete-buttons="deleteButtons"
              @update-selected="updateSelected"
              @new-tab="updateTabLocal"
              @btn-click="handleBtnClick"
              @add="addFn"
              @filter-fn="deleteFn"
            />
          </q-card-section>
        </q-page>
      </q-page-container>
      <q-footer v-if="!hideFooter" elevated>
        <q-card-section class="bg-dark text-white shadow-2 text-center q-pa-sm">
          <div class="row items-center no-wrap">
            <div class="col">
              <q-btn
                v-if="cancel.label"
                :icon="cancel.icon ? cancel.icon : 'clear'"
                :label="cancel.label ? cancel.label : 'clear'"
                :color="cancel.color ? cancel.color : 'amber'"
                class="q-mx-sm"
                @click="onOKClick('cancel')"
              />
              <!-- :disable="selected.length === 0" -->
              <q-btn
                v-if="ok.label"
                :icon="ok.icon ? ok.icon : 'cloud_upload'"
                :label="ok.label ? ok.label : 'submit'"
                :color="ok.color ? ok.color : 'positive'"
                class="q-mx-sm"
                @click="onOKClick('ok')"
              />
            </div>
          </div>
        </q-card-section>
      </q-footer>
    </q-layout>
    <!-- addButton
                  
                                  @add="addInvoiceFooterItem"
            @filterFn="updateInvoiceFooterItemsTable"
            @btnClick="editInvoiceFooterItem"
            @dblClick="editInvoiceFooterItem" -->
  </q-dialog>
</template>

<script>
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { defineComponent } from 'vue'
// interface TableData {
//   refreshTrick: boolean
//   text: string
//   // key: `table-${this.$uid()}`,
//   selected: unknown[]
//   localTab: string
//   localData: unknown[]
// }
export default defineComponent({
  props: {
    // ...your custom props
    printHeaders: {
      type: Array,
      default(props) {
        return props.tableHeaders
      },
    },
    add: {
      type: Function,
      default() {
        return (a) => {
          return a
        }
      },
    },
    remove: {
      type: Function,
      default() {
        return (a) => {
          return a
        }
      },
    },
    showAdd: { type: Boolean, default: false },
    hideFooter: { type: Boolean, default: false },
    deleteButtons: { type: Boolean, default: false },
    tabs: {
      type: Array,
      default() {
        return []
      },
    },
    preSelected: {
      type: Array,
      default: function () {
        return []
      },
    },
    tab: {
      type: String,
      default: '',
    },
    updateTab: {
      type: Function,
      default() {
        return () => {
          return null
        }
      },
    },
    selection: {
      type: String,
      default: 'multiple',
    },
    maximized: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      required: true,
    },
    tabbedData: {
      type: Object,
      default() {
        return {}
      },
    },
    headers: {
      type: Array,
      required: true,
    },
    name: { type: String, default: '' },
    rowKey: { type: String, default: 'id' },
    title: {
      type: String,
      default: '',
    },
    tableTitle: {
      type: String,
      default: '',
    },
    submit: {
      type: String,
      default: 'Ok',
    },
    clear: {
      type: String,
      default: 'reset',
    },
    cancel: {
      type: Object,
      default() {
        return {}
      },
    },
    ok: {
      type: Object,
      default() {
        return {}
      },
    },
    row: {
      type: Object,
      default() {
        return {}
      },
    },
    persistent: {
      type: Boolean,
      default: false,
    },
    visibleColumns: {
      type: Array,
      default(props) {
        return props.headers.map((o) => {
          return o.name
        })
      },
    },
    defaultFilter: { type: String, default: '' },
  },
  emits: ['hide', 'ok'],
  data() {
    return {
      refreshTrick: false,
      text: '',
      // key: `table-${this.$uid()}`,
      selected: [],
      localTab: '',
      localData: [],
    }
  },
  created() {
    this.localTab = this.tab
    this.localData = this.data
    if (this.preSelected.length > 0) {
      this.localData.forEach((dat) => {
        if (this.preSelected.includes(dat[this.rowKey])) {
          this.selected.push(dat)
        }
      })
    }
    // this.selected = this.preSelected
    // console.log(this.fields)
    // this.refreshTrick = !this.refreshTrick
  },
  methods: {
    addFn() {
      this.add().then((data) => {
        console.log(data)
        this.localData.push(data)
        this.selected.push(data)
      })
    },
    deleteFn(props) {
      this.remove(props).then(() => {
        this.localData = this.localData.filter((dat) => {
          return dat[this.rowKey] != props.deleted
        })
        this.selected = this.selected.filter((dat) => {
          return dat[this.rowKey] != props.deleted
        })
      })
    },
    handleBtnClick(payload, btn) {
      if (btn.type === 'results') {
        this.$q.dialog({
          component: this.$customDialog.Results,
          componentProps: {
            roundId: payload.key,
            round: payload.row,
            event: this.row,
          },
        })
      }
    },
    // following method is REQUIRED
    // (don't change its name --> "show")
    updateSelected(payload) {
      this.selected = payload
    },
    updateTabLocal(val) {
      this.localTab = val
      if (this.tabbedData[val]) {
        this.localData = this.tabbedData[val]
      }
      // else {
      //   this.updateTab(val)
      // }
    },
    show() {
      // this.$store.commit('GOstore/showDialog', {
      //   key: this.key,
      //   hide: () => this.$refs.dialog.hide()
      // })
      // this.$nextTick((() => )
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.$refs.dialog.show()
    },

    // following method is REQUIRED
    // (don't change its name --> "hide")
    hide() {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.$refs.dialog.hide()
      // this.$store.commit('GOstore/hideDialog', this.key)
    },

    onDialogHide() {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit('hide')
    },

    onOKClick(val) {
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      if (val === 'ok') {
        this.$emit('ok', this.selected)
      } else {
        this.$emit('ok', val)
      }
      this.hide()

      // or with payload: this.$emit('ok', { ... })

      // then hiding dialog
    },

    onCancelClick() {
      // console.log('closed...')
      // we just need to hide dialog
      this.hide()
    },
  },
})
</script>
