<template>
  <q-tabs
    :inline-label="$q.screen.gt.sm"
    no-caps
    :dense="$q.screen.lt.md || dense"
    :model-value="modelValue"
    class="col"
    :class="computedClass"
    :active-color="activeColor"
    :indicator-color="indicatorColor"
    align="justify"
    @update:model-value="onInput"
  >
    <q-tab
      v-for="(tabI, index) in tabs"
      :key="index"
      style="font-weight: 300"
      :name="tabI.name"
      :icon="tabI.icon"
      :label="$q.screen.gt.xs ? tabI.title : ''"
      :class="computedTabClass(tabI, index)"
      @click="setPage(tabI)"
    >
      <q-tooltip v-if="tabI.tooltip">{{ tabI.tooltip }}</q-tooltip>
      <q-menu
        v-if="tabI.subTabs"
        fit
        content-class="rounded-bottom"
        @before-hide="menuHide"
      >
        <q-list
          style="min-width: 100px; font-weight: 500"
          class="bg-secondary text-secondary-inv"
        >
          <q-item
            v-for="(page, indexTwo) in tabI.subTabs"
            :key="indexTwo"
            v-close-popup
            clickable
            @click="setPage(page)"
          >
            <q-item-section v-if="page.icon" avatar>
              <q-icon
                :name="page.icon"
                :class="
                  page.name === tempTab.name
                    ? 'text-accent'
                    : 'text-secondary-inv'
                "
              />
            </q-item-section>
            <q-item-section
              :class="
                page.name === tempTab.name
                  ? 'text-accent'
                  : 'text-secondary-inv'
              "
              >{{ page.title }}</q-item-section
            >
          </q-item>
        </q-list>
      </q-menu>
    </q-tab>
  </q-tabs>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  props: {
    tabs: {
      type: Array,
      default: function () {
        return []
      },
    },
    elevated: { type: Boolean, default: false },
    modelValue: {
      type: String || Number,
      required: true,
    },
    dense: { type: Boolean, default: false },
    invert: { type: Boolean, default: false },
  },
  emits: ['update:modelValue', 'setPage'],
  computed: {
    computedClass() {
      const toReturn = this.invert
        ? 'bg-dark text-dark-inv'
        : 'bg-primary text-primary-inv'
      if (this.elevated) {
        toReturn = `${toReturn} shadow-2`
      }
      return toReturn
    },

    activeColor() {
      return this.invert ? 'white' : 'accent'
    },
    indicatorColor() {
      return this.invert ? 'warning' : 'accent'
    },
  },
  methods: {
    computedTabClass(tabI, index) {
      // index
      let toReturn = ''
      if (this.invert) {
        toReturn = tabI.name === this.modelValue ? 'bg-accent' : 'bg-dark'
      } else {
        toReturn = tabI.name === this.modelValue ? 'bg-secondary' : 'bg-primary'
      }
      toReturn = `${toReturn} tab-${index}`
      return toReturn
    },
    onInput(arg) {
      this.$emit('update:modelValue', arg)
    },
    menuHide(arg) {
      console.log(arg)
    },
    setPage(arg) {
      this.$emit('setPage', arg)
    },
  },
})
</script>
