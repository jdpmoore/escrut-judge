<template>
  <q-card
    bordered
    flat
    class="full-width"
    :class="
      highlight ? 'bg-accent text-accent-inv' : 'bg-primary text-primary-inv'
    "
  >
    <q-card-section class="q-pa-sm q-pl-md row"
      ><div class="text-h6">{{ label }}</div>
      <q-space /><q-btn
        v-if="!readonly"
        flat
        :icon="showToolbar ? 'expand_less' : 'expand_more'"
        round
        dense
        @click="showToolbar = !showToolbar"
    /></q-card-section>
    <q-card-section class="q-pa-none">
      <q-editor
        :model-value="modelValue"
        min-height="5rem"
        :max-height="maxHeight"
        :height="height"
        class="text-primary full-width noLRBorder"
        toolbar-bg="cream"
        toolbar-color="primary"
        toolbar-toggle-color="secondary"
        toolbar-text-color="primary"
        :dense="$q.screen.lt.md"
        :toolbar="computedToolbar"
        :fonts="fonts"
        :readonly="readonly"
        style="width: 100vw; border: 1px 0"
        @update:model-value="onInput"
      >
      </q-editor>
    </q-card-section>
  </q-card>
</template>

<script>
// import stateComputed from 'components/js/state-computed'
import { debounce } from 'quasar'
export default {
  props: {
    maxHeight: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: '',
      // required: false,
    },
    modelValue: {
      // type: String,
      default: '',
      validator: (p) => {
        return typeof p === 'string' || p === null
      },
    },
    label: {
      type: String,
      required: true,
    },
    highlight: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  data() {
    return {
      showToolbar: false,
      // model: '<div style="text-align: left;"><br></div>',
      toolbar: [
        // ['title'],
        ['undo', 'redo'],
        ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
        ['unordered', 'ordered', 'outdent', 'indent'],
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
        ['print', 'fullscreen'],
        [
          // {
          //   label: this.$q.lang.editor.formatting,
          //   icon: this.$q.iconSet.editor.formatting,
          //   list: 'no-icons',
          //   options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code']
          // },
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
        // ['token', 'hr', 'link', 'custom_btn'],

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
    computedToolbar() {
      return this.showToolbar ? this.toolbar : null
    },
  },
  created() {
    // if (!this.value) {
    //   this.value = ''
    // }
    this.onInput = debounce(this.onInput, 1000)
  },
  methods: {
    onInput(arg) {
      this.$emit('update:modelValue', arg)
    },
  },
}
</script>
