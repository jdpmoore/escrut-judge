<template>
  <q-dialog
    ref="dialog"
    :maximized="maximized || $q.screen.lt.sm"
    :persistent="persistent"
    style="width: 100vw"
    class="q-page-container"
    @hide="onDialogHide"
  >
    <CustomForm
      :fields="fields"
      close
      :clear="clear"
      :submit="submit"
      :square="maximized || $q.screen.lt.sm"
      :maximized="maximized"
      :cancel="cancel"
      :no-clear="noClear"
      :no-submit="noSubmit"
      :title="title"
      @submit-form="onOKClick"
      @cancel="onCancelClick"
      @new-annot="newAnnot"
    />
  </q-dialog>
</template>

<script>
import CustomForm from 'components/Form.vue'
import { defineComponent } from 'vue'
export default defineComponent({
  components: { CustomForm },
  props: {
    // ...your custom props
    noClear: { type: Boolean, default: false },
    noSubmit: { type: Boolean, default: false },
    maximized: {
      type: Boolean,
      default: false,
    },
    fields: {
      type: Array,
      required: true,
    },
    samples: {
      type: Array,
      default() {
        return []
      },
    },
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
      type: Boolean,
      default: false,
    },
    persistent: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['hide', 'ok', 'custom'],
  data() {
    return {
      refreshTrick: false,
      text: '',
    }
  },
  watch: {
    fields() {
      // console.log(newValue, oldValue)
    },
  },
  methods: {
    newAnnot(arg) {
      this.$emit('custom', { newAnnot: arg })
    },
    // following method is REQUIRED
    // (don't change its name --> "show")
    show() {
      // this.$nextTick((() => )
      this.$refs.dialog.show()
    },

    // following method is REQUIRED
    // (don't change its name --> "hide")
    hide() {
      this.$refs.dialog.hide()
    },

    onDialogHide() {
      // required to be emitted
      // when QDialog emits "hide" event
      this.$emit('hide')
    },

    onOKClick(arg) {
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      this.$emit('ok', arg)
      // or with payload: this.$emit('ok', { ... })

      // then hiding dialog
      this.hide()
    },

    onCancelClick() {
      if (!this.cancel) {
        return
      }
      // console.log('closed...')
      // we just need to hide dialog
      this.hide()
    },
  },
})
</script>
