<template>
  <q-dialog
    ref="dialog"
    :maximized="maximized"
    :persistent="persistent"
    @hide="onDialogHide"
  >
    <q-card
      style="min-width: 90vw"
      class="q-dialog-plugin bg-primary text-white q-page-container"
    >
      <q-card-section
        class="bg-primary text-white shadow-2 text-center q-pa-sm"
      >
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
            <div class="text-h6 text-capitalize">{{ title }}</div>
          </div>
          <div class="col-auto">
            <q-btn v-close-popup icon="close" dense flat />
          </div>
        </div>
      </q-card-section>
      <q-card-section
        class="bg-cream items-left text-left justify-center q-pa-none"
      >
        <TextEditor
          v-model="model"
          :max-height="maximized ? '100vh' : '80vh'"
          :height="maximized ? 'calc(100vh - 150px)' : ''"
        />
      </q-card-section>
      <q-card-section
        class="bg-primary text-white shadow-2 text-center q-pb-none"
      >
        <div class="row items-center no-wrap q-pa-sm">
          <div class="col">
            <q-btn
              icon="clear"
              :label="cancel"
              color="red"
              flat
              class="q-pl-sm q-pr-sm"
              @click="onCancelClick"
            />
            <q-btn
              v-close-popup
              icon="cloud_upload"
              :label="ok"
              color="green"
              flat
              class="q-pl-sm q-pr-sm"
              @click="onOKClick()"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from 'vue'
import TextEditor from 'components/TextEditor'
export default defineComponent({
  components: {
    TextEditor
  },
  props: {
    // ...your custom props
    title: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    ok: {
      type: String,
      default: 'Ok'
    },
    cancel: {
      type: String,
      default: 'cancel'
    },
    text: {
      type: String,
      default: ''
    },
    persistent: {
      type: Boolean,
      default: false
    }
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
            options: ['left', 'center', 'right', 'justify']
          }
        ],
        // ['print', 'fullscreen'],
        [
          {
            label: this.$q.lang.editor.formatting,
            icon: this.$q.iconSet.editor.formatting,
            list: 'no-icons',
            options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code']
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
              'size-7'
            ]
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
              'verdana'
            ]
          },
          'removeFormat'
        ],
        ['token', 'hr', 'link', 'custom_btn'],
        ['unordered', 'ordered', 'outdent', 'indent'], //'quote',

        ['undo', 'redo'],
        ['viewsource']
      ],
      fonts: {
        arial: 'Arial',
        arial_black: 'Arial Black',
        comic_sans: 'Comic Sans MS',
        courier_new: 'Courier New',
        impact: 'Impact',
        lucida_grande: 'Lucida Grande',
        times_new_roman: 'Times New Roman',
        verdana: 'Verdana'
      }
    }
  },

  computed: {
    maximized() {
      if (this.$q.screen.lt.sm) {
        return true
      } else {
        return this.toMaximize
      }
    }
  },
  created() {
    if (this.text) {
      this.model = this.$sanitize(this.text, this.sanitizeRules)
      // this.model = this.text
    }
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
      console.log(this.model)
      this.$emit('ok', this.$sanitize(this.model, this.$common.sanitizeRules))
      // or with payload: this.$emit('ok', { ... })

      // then hiding dialog
      this.hide()
    },

    onCancelClick() {
      // we just need to hide dialog
      this.hide()
    }
  }
})
</script>
