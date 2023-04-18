<template>
  <q-card v-if="!loading" :style="size" class="bg-dark full-width" flat>
    <!-- <div
      v-sanitize="[
        {
          allowedAttributes: {
            iframe: ['src']
          },
          allowedIframeHostnames: ['www.youtube.com', 'www.vuejs.org']
        },
        testTemplate
      ]"
    ></div> -->
    <q-card-section v-if="editToggle" class="row justify-center">
      <q-toggle
        v-model="localEditable"
        label="Edit"
        checked-icon="check"
        color="red"
        class="text-accent text-bold q-mr-md"
        unchecked-icon="clear"
        @update:model-value="$emit('editable', localEditable)"
      />
    </q-card-section>
    <q-card-section class="row flex-center bg-dark" :class="cardClass">
      <q-resize-observer @resize="onResize" />
      <q-markup-table
        v-if="refreshTrick"
        :separator="separator"
        flat
        wrap-cells
        class="profileTable"
        :class="{ editingProfileTable: editable || localEditable }"
      >
        <tbody
          style="
            empty-cells: show;
            border-collapse: seperate;
            border-spacing: 15px;
          "
        >
          <tr
            v-for="(rows, rowIndex) in dataGrid"
            :key="rowIndex"
            class="bg-dark"
            style="empty-cells: show; margin: 10px"
          >
            <template v-for="(cols, index) in rows" :key="index">
              <td :style="spacerCell(cols)">
                <!-- :key="index + '-title'"  -->
                {{ cols.title }}
              </td>
              <td
                :style="spacerCell(cols)"
                :class="cols.readonly ? 'noHover' : ''"
                @click="$emit('click', cols)"
              >
                <!-- :key="index + '-data'" -->
                <q-popup-edit
                  v-if="(editable || localEditable) && !cols.readonly"
                  v-model="cols.value"
                  separate-close-popup
                  class="q-pa-none q-ma-none bg-primary"
                  content-class="q-pa-none q-ma-none bg-primary"
                  content-style="border-radius: 8px;"
                  @before-hide="testResponse"
                  @cancel="testResponse"
                >
                  <!-- v-model="cols.value"="{
                      emitValue,
                      set,
                      cancel
                    }"
                    scope.set()
                          updateProfileField(cols, response.popupField)
                          scope.cancel()
                    response => {
                          console.log('logging', response)
                        }
                      "
                     -->
                  <!-- scope.emitValue(response.popupField) @input="scope.emitValue" -->
                  <template #default="scope">
                    <CustomForm
                      popup-edit
                      no-clear
                      no-error-popup
                      close
                      submit="update"
                      :fields="[
                        {
                          type: 'header',
                          title: cols.title,
                        },
                        {
                          name: 'popupField',
                          type: formType(cols.format),
                          value: popupFormatData(cols),
                          add: cols.add,
                          api: cols.api,
                          optionValue: cols.optionValue,
                          optionLabel: cols.optionLabel,
                          returnOptions: cols.returnOptions,
                          options:
                            cols.format === 'country'
                              ? $common.getCountryList()
                              : cols.options,
                        },
                      ]"
                      @cancel="scope.cancel"
                      @submit-form="
                        (arg) => {
                          updateProfileField(cols, arg.popupField)
                          scope.set()
                        }
                      "
                      @keyup.enter.stop
                    />
                  </template>
                </q-popup-edit>
                <q-badge
                  v-if="cols.format === 'badge' && cols.value"
                  :color="badgeColorsComp(cols.colors, cols.value)"
                  :class="badgeTextComp(cols.colors, cols.value)"
                  class="text-capitalize"
                >
                  {{ badgeLabelComp(cols, cols.value) }}
                </q-badge>
                <div v-else-if="cols.format === 'multi-badge-link'">
                  <q-badge
                    v-for="(badge, indexTwo) in cols.value"
                    :key="indexTwo"
                    :color="badge.color"
                    class="text-capitalize q-ma-xs"
                    :class="
                      $common.lightOrDark(badge.color)
                        ? 'text-white'
                        : 'text-black'
                    "
                    :style="badge.location ? 'cursor: pointer;' : ''"
                    @click="goto(badge)"
                  >
                    {{ badge.label }}
                    <q-tooltip v-if="badge.tooltip">{{
                      badge.tooltip
                    }}</q-tooltip>
                  </q-badge>
                </div>
                <div v-else-if="cols.format === 'multi-badge-link-hardcode'">
                  <a
                    v-for="(badge, indexTwo) in cols.value"
                    :key="indexTwo"
                    type="button"
                    :href="`#${badge.location}${badge.value}`"
                    role="link"
                    style="text-decoration: none"
                  >
                    <q-badge
                      :color="badge.color"
                      class="text-capitalize q-ma-xs"
                      :class="
                        $common.lightOrDark(badge.color)
                          ? 'text-white'
                          : 'text-black'
                      "
                      style="cursor: pointer"
                    >
                      {{ badge.label }}
                    </q-badge>
                  </a>
                </div>
                <div v-else-if="cols.format === 'button'">
                  <q-btn
                    unelevated
                    dense
                    :color="cols.color"
                    :class="
                      $common.lightOrDark(cols.color)
                        ? 'text-white'
                        : 'text-black'
                    "
                    @click="$emit('btnClick', cols)"
                    >{{ cols.label }}</q-btn
                  >
                </div>
                <a
                  v-else-if="!editable && cols.format === 'email'"
                  style="
                    border: none;
                    background: none;
                    text-transform: lowercase;
                  "
                  :href="'mailto:' + cols.value"
                  >{{ cols.value }}</a
                >
                <a
                  v-else-if="!editable && cols.format === 'url'"
                  style="border: none; background: none"
                  target="_blank"
                  :href="cols.value"
                  >{{ cols.value }}</a
                >
                <span
                  v-else-if="cols.format === 'html'"
                  v-sanitize="[sanitizeRules, cols.value ? cols.value : '']"
                  style="border: none; background: none"
                ></span>
                <!-- <span
                  v-else-if="!cols.value && cols.default"
                  style="border: none; background: none;"
                  v-sanitize="[sanitizeRules, cols.default]"
                ></span> -->
                <span
                  v-else-if="!cols.value && cols.default"
                  style="border: none; background: none"
                  ><span v-sanitize="[sanitizeRules, cols.default]"></span
                ></span>
                <span
                  v-else
                  style="border: none; background: none"
                  :class="cols.format === 'capitalise' ? 'text-capitalize' : ''"
                  >{{ formatData(cols) }}</span
                >
              </td>
              <td
                v-if="index < numCols - 1"
                :key="index + '-spacer1'"
                class="bg-dark"
                style="
                  background: white;
                  border: none;
                  padding: 5px;
                  margin: 0;
                  border-radius: 0;
                "
              ></td>
              <td
                v-if="index < numCols - 1"
                :key="index + '-spacer2'"
                class="bg-dark"
                style="
                  background: white;
                  border: none;
                  padding: 5px;
                  margin: 0;
                  border-radius: 0;
                "
              ></td>
            </template>
          </tr>
        </tbody>
      </q-markup-table>
    </q-card-section>
  </q-card>
</template>
<script>
// import TextArea from 'components/common/dialog/TextArea'
// import CustomForm from 'components/common/Form'
// import stateComputed from 'components/js/state-computed'
// import FormDialog from 'components/common/dialog/Form'
// import FileUpload from 'components/common/dialog/FileUpload'
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ProfileCard',
  components: {},
  props: {
    cardClass: { type: String, default: '' },
    fields: {
      type: Array,
      default: function () {
        return []
      },
    },
    loading: { type: Boolean, default: false },
    editable: { type: Boolean, default: false },
    size: { type: String, default: '' },
    editToggle: { type: Boolean, default: false },
    maxCols: { type: Number, default: 0 },
  },
  emits: ['updateField', 'click', 'btnClick', 'editable'],
  data() {
    return {
      refreshTrick: true,
      localEditable: false,
      separator: 'cell',
      numCols: this.maxCols > 0 ? this.maxCols : 2,
      // testTemplate: `<iframe src="https://www.vuejs.org"></iframe><p>This is a <strong>test</strong>.</p>`
      // dataGrid: []
    }
  },
  computed: {
    sanitizeRules() {
      return this.$common.sanitizeRules
    },
    dataGrid() {
      var data = []
      this.$extend(true, data, this.fields)
      data = this.$_.chunk(data.flat(), this.numCols)
      for (let i = 0; i < data.length; i++) {
        const diff = data[0].length - data[i].length
        for (let j = 0; j < diff; j++) {
          data[i].push({ format: 'spacer' })
        }
      }
      return data
    },
  },
  watch: {
    fields: function () {
      // this.turnToGrid(newValue)
    },
  },
  methods: {
    submitted(arg) {
      console.log('submitted', arg)
    },
    defaultTest(cols) {
      if (!cols.value && cols.default) {
        return true
      } else {
        return false
      }
    },
    testResponse() {
      // console.log('before hide')
    },
    badgeTextComp(badgeColors, arg) {
      if (this.$common.lightOrDark(this.badgeColorsComp(badgeColors, arg))) {
        return 'text-white'
      } else {
        return 'text-black'
      }
    },
    badgeColorsComp(badgeColors, arg) {
      if (badgeColors && Object.keys(badgeColors).includes(arg.toLowerCase())) {
        return badgeColors[arg.toLowerCase()]
      } else if (badgeColors && Object.keys(badgeColors).includes(arg)) {
        return badgeColors[arg]
      } else if (badgeColors && Object.keys(badgeColors).includes('*')) {
        return badgeColors['*']
      } else {
        return 'black'
      }
    },
    badgeLabelComp(cols, arg) {
      if (
        cols &&
        cols.labels &&
        Object.keys(cols.labels).includes(arg.toLowerCase())
      ) {
        return cols.labels[arg.toLowerCase()]
      } else if (
        cols &&
        cols.labels &&
        Object.keys(cols.labels).includes(arg)
      ) {
        return cols.labels[arg]
      } else if (cols && cols.options) {
        let toReturn = arg
        let other = cols.options.filter((o) => {
          return o.value === arg.toLowerCase() || o.value === arg
        })[0]
        if (other) {
          toReturn = other.label
        }
        return toReturn
      } else {
        return arg
      }
    },
    updateProfileField(cols, newValue) {
      // console.log('emitting new field', cols, newValue)
      this.$emit('updateField', { field: cols.field, newValue: newValue })
    },
    formType(arg) {
      switch (arg) {
        case 'dob':
          return 'date'
        case 'date':
          return 'date'
        case 'time':
          return 'time'
        case 'email':
          return 'email'
        case 'badge':
          return 'select'
        case 'multi-badge-link':
          return 'multi-select'
        case 'select':
          return 'select'
        case 'country':
          return 'select'
        case 'dateTime':
          return 'dateTime'
        case 'bool':
          return 'bool'
        default:
          return 'input'
      }
    },
    DOBtoAge() {
      const toReturn = this.fields.filter((o) => {
        return o.format === 'dob'
      })[0].value
      if (toReturn) {
        return this.$common.timeElapsed(toReturn, 'years')
      } else {
        return ''
      }
    },
    popupFormatData(cols) {
      if (cols.value === 'Edit') {
        return ''
      } else {
        return this.formatData(cols, true)
      }
    },
    formatData(cols, popup) {
      if (cols.format) {
        switch (cols.format) {
          case 'date':
            if (cols.value) {
              return this.$moment(cols.value).format('Do MMMM YYYY')
            } else {
              return ''
            }
          case 'dateTime':
            if (cols.value) {
              return this.$moment(cols.value).format('Do MMMM YYYY HH:mm')
            } else {
              return ''
            }
          case 'dob':
            if (cols.value) {
              return this.$moment(cols.value).format('Do MMMM YYYY')
            } else {
              return ''
            }
          case 'time':
            if (cols.value) {
              return this.$moment(cols.value).format('HH:mm')
            } else {
              return ''
            }
          case 'currency': {
            const toReturn = new Intl.NumberFormat('en-GB', {
              style: 'currency',
              currency: cols.currency ? cols.currency : 'GBP',
            }).format(cols.value / 100)
            return cols.value ? toReturn : ''
          }
          case 'age':
            return this.DOBtoAge()
          case 'GBP':
            return popup ? cols.value : `£${cols.value}`
          case 'bool':
            if (cols.value) {
              return 'Yes'
            } else {
              return 'No'
            }
          // case 'select':
          //   return cols
          case 'country':
            return this.$common.getCountryName(cols.value)
          default:
            return cols.value
        }
      } else {
        return cols.value
      }
    },
    spacerCell(cols) {
      // cols.format === 'spacer' ? 'border: none;' : ''"
      if (cols.format === 'spacer') {
        return 'background: var(--q-color-brand-cream); border: none;'
      } else if (cols.format === 'highlight' || cols.highlight) {
        let returnBackground = 'rgb(244, 67, 54)'
        let returnText = 'var(--q-color-brand-cream)'
        if (cols.highlight && cols.highlight.background) {
          returnBackground = cols.highlight.background
        }
        if (cols.highlight && cols.highlight.color) {
          returnText = cols.highlight.color
        }
        return `background: ${returnBackground}; color: ${returnText};`
      } else if (cols.title) {
        return ''
      } else {
        return 'background: var(--q-color-brand-cream); border: none;'
      }
    },
    goto(badge) {
      console.log(badge)
      // const idMaps = {
      //   userToStudent: this.$store.state.GOstore.idMap.userToStudent,
      //   userToTutor: this.$store.state.GOstore.idMap.userToTutor,
      //   userToStaff: this.$store.state.GOstore.idMap.userToStaff
      // }
      // if (badge.location) {
      //   let destination = badge.location
      //   if (badge.idMap) {
      //     destination = `${destination}${idMaps[badge.idMap][badge.value]}`
      //   } else {
      //     destination = `${destination}${badge.value}`
      //   }
      //   if (this.$route.path !== destination) {
      //     this.$router.push(destination)
      //   }
      // }
    },
    onResize(arg) {
      var cols = this.$_.round((arg.width - 100) / 400)
      if (cols < 1) {
        cols = 1
      }
      if (cols !== this.numCols) {
        if (this.maxCols > 0 && cols > this.maxCols) {
          this.numCols = this.maxCols
        } else {
          this.numCols = cols
        }
        // this.turnToGrid(this.fields)
      }
    },
  },
})
</script>
