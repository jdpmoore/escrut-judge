<template>
  <q-editor
    dark
    square
    :model-value="modelValue"
    min-height="30vh"
    :max-height="maxHeight"
    flat
    :height="height"
    class="text-white"
    content-class="bg-white text-black"
    toolbar-text-color="white"
    toolbar-toggle-color="yellow"
    toolbar-color="yellow"
    toolbar-bg="dark"
    :dense="$q.screen.lt.md"
    :toolbar="toolbar"
    :fonts="fonts"
    @update:model-value="onInput"
  />
</template>

<script>
// import stateComputed from 'components/js/state-computed'
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    maxHeight: {
      type: String,
      default: '',
    },
    height: {
      type: String,
      default: '',
    },
    modelValue: {
      type: String,
      required: true,
    },
  },
  emits: ['input', 'update:modelValue'],
  data() {
    return {
      // model: '<div style="text-align: left;"><br></div>',
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
  methods: {
    onInput(arg) {
      this.$emit('update:modelValue', arg)
    },
  },
})
</script>
