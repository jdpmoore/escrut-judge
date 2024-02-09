<template>
  <q-dialog
    ref="dialog"
    maximized
    persistent
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
          class="col-auto justify-center items-center full-width bg-white"
        >
          <q-card-section class="bg-white text-black q-pa-lg text-h6">
            <q-input
              v-model="newNumber"
              outlined
              readonly
              class="text-h2"
              color="primary"
            />
          </q-card-section>
          <q-card-section class="bg-white text-black q-pa-none">
            <div
              class="number-column items-center"
              :style="`height: ${computedFlexBoxHeight}px; width: 100vw;`"
            >
              <div
                v-for="(num, index) in numbers"
                :key="index"
                :class="
                  num === 'Clear'
                    ? 'number-pad-negative'
                    : num === 'Delete'
                    ? 'number-pad-warning'
                    : 'number-pad'
                "
                @click="clickNum(num)"
              >
                <div class="text-center" style="font-size: 225%">
                  {{ num }}
                </div>
              </div>
            </div>
          </q-card-section>
        </q-page>
      </q-page-container>
      <q-footer elevated>
        <q-card-section class="bg-dark text-black shadow-2 text-center q-pa-sm">
          <div class="row items-center no-wrap">
            <div class="col-6 q-px-md">
              <q-btn
                icon="clear"
                label="cancel"
                color="amber"
                class="text-black full-width"
                size="lg"
                @click="onCancelClick"
              />
            </div>
            <!-- :disable="selected.length === 0" -->
            <div class="col-6 q-px-md">
              <q-btn
                icon="done"
                label="Add"
                color="positive"
                class="text-black full-width"
                size="lg"
                @click="onOKClick"
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
    title: {
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
  },
  emits: ['hide', 'ok'],
  data() {
    return {
      numbers: [1, 4, 7, 'Clear', 2, 5, 8, 0, 3, 6, 9, 'Delete'],
      newNumber: '',
      options: {
        keyRandomize: false,
        randomizeClick: false,
        fixDeleteKey: false,
      },
      refreshTrick: false,
      text: '',
      // key: `table-${this.$uid()}`,
      selected: [],
      localTab: '',
      localData: [],
    }
  },
  computed: {
    computedFlexBoxHeight() {
      return this.computedNumberColumns < 5 ? 540 : 642
    },
    computedNumberColumns() {
      return 3
    },
    computedFlexBoxWidth() {
      const colPx = 0.2 * window.innerWidth + 18
      const nCols = Math.min(this.computedNumberColumns, 4)
      // console.log(nCols)
      return Math.round(nCols * colPx)
    },
  },
  created() {
    // this.selected = this.preSelected
    // console.log(this.fields)
    // this.refreshTrick = !this.refreshTrick
  },
  methods: {
    clickNum(num) {
      if (num === 'Clear') {
        this.newNumber = ''
      } else if (num === 'Delete') {
        if (this.newNumber.length > 0) {
          this.newNumber = this.newNumber.slice(0, -1)
        }
      } else {
        this.newNumber = `${this.newNumber}${num}`
      }
    },
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

    onOKClick() {
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      if (this.newNumber.length === 0) {
        this.onCancelClick
      } else {
        this.$emit('ok', this.newNumber)
        this.hide()
      }

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
