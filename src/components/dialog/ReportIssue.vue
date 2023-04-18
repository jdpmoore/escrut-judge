<template>
  <q-dialog
    ref="dialog"
    :maximized="maximized"
    :persistent="persistent"
    @hide="onDialogHide"
  >
    <q-card
      style="min-width: 90vw"
      class="q-dialog-plugin bg-dark text-white border-primary"
    >
      <q-card-section class="bg-dark text-white shadow-2 text-center q-pa-sm">
        <div class="row items-center no-wrap q-pa-none q-ma-none">
          <div class="col-auto">
            <q-btn
              :icon="maximized ? 'fullscreen_exit' : 'fullscreen'"
              dense
              flat
              @click="toMaximize = !toMaximize"
            />
          </div>
          <div class="col">
            <div class="text-h6">Report issue</div>
          </div>
          <div class="col-auto">
            <q-btn v-close-popup icon="close" dense flat round />
          </div>
        </div>
      </q-card-section>
      <q-card-section
        class="bg-white items-center text-center justify-center q-pa-none underlined-before underlined-after"
      >
        <TextEditor
          v-model="model"
          max-height="maximized ? '100vh' : '80vh'"
          :height="maximized ? 'calc(100vh - 150px)' : ''"
        />
      </q-card-section>
      <!-- <pre>{{ toSubmit }}</pre> -->
      <q-card-section
        class="bg-dark text-white shadow-2 text-center q-pb-none ivdalines"
      >
        <div class="row items-center no-wrap q-pa-sm">
          <div class="col">
            <q-btn
              icon="clear"
              :label="cancel"
              color="negative"
              unelevated
              class="q-mx-sm"
              @click="onCancelClick"
            />
            <q-btn
              v-close-popup
              icon="cloud_upload"
              :label="ok"
              color="positive"
              class="q-mx-sm"
              unelevated
              @click="onOKClick()"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import TextEditor from 'components/TextEditor.vue'
// import stateComputed from 'components/js/state-computed'
import md5 from 'md5'
export default {
  components: {
    TextEditor,
  },
  props: {
    // ...your custom props
    label: {
      type: String,
      default: '',
    },
    ok: {
      type: String,
      default: 'Ok',
    },
    cancel: {
      type: String,
      default: 'cancel',
    },
    text: {
      type: String,
      default: '',
    },
    persistent: {
      type: Boolean,
      default: false,
    },
    source: {
      type: String,
      required: true,
    },
    row: {
      type: Object,
      default() {
        return {}
      },
    },
    id: {
      type: [String, Number],
      default: '',
    },
  },
  emits: ['hide', 'ok'],
  data() {
    return {
      model: '<div style="text-align: left;"><br></div>',
      toMaximize: false,
      toolbar: [
        ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
        [
          // {
          //   label: this.$q.lang.editor.align,
          //   icon: this.$q.iconSet.editor.align,
          //   fixedLabel: true,
          //   list: 'only-icons',
          //   options: ['left', 'center', 'right', 'justify']
          // },
          {
            label: this.$q.lang.editor.align,
            icon: this.$q.iconSet.editor.align,
            fixedLabel: true,
            options: ['left', 'center', 'right', 'justify'],
          },
        ],
        // ['print', 'fullscreen'],
        [
          {
            label: this.$q.lang.editor.formatting,
            icon: this.$q.iconSet.editor.formatting,
            list: 'no-icons',
            options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code'],
          },
          {
            label: this.$q.lang.editor.fontSize,
            icon: this.$q.iconSet.editor.fontSize,
            fixedLabel: true,
            fixedIcon: true,
            list: 'no-icons',
            options: [
              'size-1',
              'size-2',
              'size-3',
              'size-4',
              'size-5',
              'size-6',
              'size-7',
            ],
          },
          {
            label: this.$q.lang.editor.defaultFont,
            icon: this.$q.iconSet.editor.font,
            fixedIcon: true,
            list: 'no-icons',
            options: [
              'default_font',
              'arial',
              'arial_black',
              'comic_sans',
              'courier_new',
              'impact',
              'lucida_grande',
              'times_new_roman',
              'verdana',
            ],
          },
          'removeFormat',
        ],
        ['token', 'hr', 'link', 'custom_btn'],
        ['unordered', 'ordered', 'outdent', 'indent'], //'quote',

        ['undo', 'redo'],
        ['viewsource'],
      ],
      fonts: {
        arial: 'Arial',
        arial_black: 'Arial Black',
        comic_sans: 'Comic Sans MS',
        courier_new: 'Courier New',
        impact: 'Impact',
        lucida_grande: 'Lucida Grande',
        times_new_roman: 'Times New Roman',
        verdana: 'Verdana',
      },
    }
  },
  computed: {
    // ...stateComputed,
    toSubmit() {
      return {
        type: 'manual',
        host: window.location.host,
        url: window.location.href,
        route: this.$route.fullPath,
        userAgent: JSON.stringify(this.$q.platform.userAgent),
        platform: JSON.stringify(this.$q.platform.is),
        state: JSON.stringify(this.row),
        entityId: this.id,
        entityTypeId: this.id,
        entityType: this.source,
        description: this.$sanitize(this.model, this.$common.sanitizeRules),
        userId: this.$store.state.command.userDetails.id,
        version: this.$store.state.command.version,
        app: 'Competitor',
        // orgId:
        //   this.$store.state.tmr.user && this.$store.state.tmr.user.org
        //     ? this.$store.state.tmr.user.org.id
        //     : 0,
        // departmentId:
        //   this.$store.state.tmr.user && this.$store.state.tmr.user.department
        //     ? this.$store.state.tmr.user.department.id
        //     : 0,
        // centre: this.$store.state.tmr.user.centre,
        status: 'submitted',
      }
    },
    maximized() {
      if (this.$q.screen.lt.sm) {
        return true
      } else {
        return this.toMaximize
      }
    },
  },
  created() {
    if (this.text) {
      this.model = this.$sanitize(this.text, this.$common.sanitizeRules)
      // this.model = this.text
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.$q.dialog({
        dark: true,
        class: 'bg-primary',
        persistent: true,
        title: 'Bug reporting',
        html: true,
        message: 'Please describe what you were trying to do, and the bug you found in as much detail as possible when submitting a bug report to the eScrut team.',
      })
    })
  },

  methods: {
    // following method is REQUIRED
    // (don't change its name --> "show")
    show() {
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

    onOKClick() {
      // on OK, it is REQUIRED to
      // emit "ok" event (with optional payload)
      // before hiding the QDialog
      const toSubmit = this.toSubmit
      const hash = md5(JSON.stringify(toSubmit))
      this.$axios
        .post('/bug', { hash, ...toSubmit })
        .then(() => {
          this.$common.popup({
            persistent: true,
            title: 'Feedback received',
            html: true,
            message: 'Thank you for your feedback, the eScrut team will look at this issue for you.',
          })
        })
        .catch(this.$common.axiosError)
      this.$emit('ok', this.toSubmit)
      // or with payload: this.$emit('ok', { ... })

      // then hiding dialog
      this.hide()
    },

    onCancelClick() {
      // we just need to hide dialog
      this.hide()
    },
  },
}
</script>
