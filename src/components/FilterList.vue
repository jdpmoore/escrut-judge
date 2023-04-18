<template>
  <q-btn-dropdown
    dense
    flat
    :color="color"
    :label="$q.screen.gt.sm ? label : ''"
    :dropdown-icon="dropdownIcon"
    :icon="icon"
    :class="buttonClass"
    content-class="rounded-bottom bg-light-blue-2"
  >
    <div :class="dropdownClass" class="bg-light-blue-2">
      <q-list v-for="(filterFamily, index) in filters" :key="index">
        <q-item-label
          header
          :class="headerClass"
          class="text-capitalize"
          style="font-weight: 600;"
          >{{ filterFamily.label ? filterFamily.label : filterFamily.key }}</q-item-label
        >
        <q-item
          v-for="(filter, indexTwo) in filterFamily.values"
          :key="indexTwo"
          :class="bodyClass"
          class="bg-light-blue-2"
        >
          <q-item-section v-if="filter.icon" avatar>
            <q-icon outlined :name="filter.icon" :color="filter.color" />
          </q-item-section>
          <q-item-section>
            <q-item-label
              :class="'text-' + filter.color"
              class="text-capitalize"
              >{{ filter.title ? filter.title : filter.name }}</q-item-label
            >
          </q-item-section>
          <q-item-section avatar>
            <q-toggle
              v-model="filter.toggle"
              keep-color
              checked-icon="check"
              :color="filter.color"
              unchecked-icon="clear"
              @update:model-value="filterTable()"
            >
              <q-tooltip>{{ filter.toggle ? 'Hide' : 'Show' }}</q-tooltip>
            </q-toggle>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
     <!-- v-if="tooltip" -->
    <!-- <q-tooltip>Hey {{ tooltip }}</q-tooltip> -->
  </q-btn-dropdown>
</template>
<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'FilterList',
  // data() {
  //   return {}
  // },
  props: {
    label: {
      type: String,
      default: 'Filter'
    },
    tooltip: {
      type: String,
      default: ''
    },
    color: {
      type: String,
      default: 'blue'
    },
    icon: {
      type: String,
      default: 'filter_list'
    },
    dropdownIcon: {
      type: String,
      default: ''
    },
    buttonClass: {
      type: String,
      default: ''
    },
    headerClass: {
      type: String,
      default: 'text-white bg-primary'
    },
    bodyClass: {
      type: String,
      default: 'bg-white text-bold'
    },
    filters: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
emits: ['filterFn'],
  computed: {
    dropdownClass() {
      if (this.$q.screen.lt.sm) {
        return this.bodyClass + ' col no-wrap'
      } else {
        return this.bodyClass + ' row no-wrap'
      }
    }
  },
  methods: {
    filterTable() {
      var toCall = []
      this.filters.map(o => {
        const toCallValues = o.values
          .map(v => {
            if (v.toggle) {
              return v.name
            }
          })
          .filter(w => {
            return w
          })
        toCall.push({ key: o.key, values: toCallValues })
      })
      this.$emit('filterFn', toCall)
    }
  }
})
</script>
