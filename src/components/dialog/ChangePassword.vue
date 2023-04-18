<template>
  <q-dialog
    ref="dialog"
    maximized
    persistent
    style="width: 100vw"
    @hide="onDialogHide"
  >
    <ChangePassword embedded @changed="onOKClick"/>
  </q-dialog>
</template>

<script>
import ChangePassword from 'pages/changepassword.vue'
export default {
  components: {
    ChangePassword,
  },
emits: ['hide', 'ok'],
  data() {
    return {
      refreshTrick: false,
      text: '',
      // key: `error-${this.$uid()}`
    }
  },
  mounted() {
    // console.log(this.fields)
    // this.refreshTrick = !this.refreshTrick
  },
  methods: {
    // following method is REQUIRED
    // (don't change its name --> "show")
    show() {
      // this.$nextTick((() => )
      // this.$store.commit('GOstore/showDialog', {
      //   key: this.key,
      //   hide: () => this.$refs.dialog.hide()
      // })
      this.$refs.dialog.show()
    },

    // following method is REQUIRED
    // (don't change its name --> "hide")
    hide() {
      // this.$store.commit('GOstore/hideDialog', this.key)
      this.$refs.dialog.hide()
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
      this.$emit('ok')
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
}
</script>
