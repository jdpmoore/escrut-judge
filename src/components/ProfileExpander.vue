<template>
  <q-card
    bordered
    flat
    class="text-secondary-inv full-width bg-secondary q-my-lg"
  >
    <q-expansion-item
      v-for="(page, index) in modelValue"
      :key="'profile-' + index"
      v-model="expanded[page.name]"
      expand-separator
      :group="group"
      :label="page.title"
      :icon="page.icon"
      :header-class="
        page.color
          ? `bg-${page.color} ${
              $common.lightOrDark(page.color) ? 'text-white' : 'text-black'
            }`
          : 'bg-primary text-primary-inv'
      "
      expand-icon-class="text-primary-inv"
    >
      <q-item
        v-for="(field, childIndex) in filteredFields(page)"
        :key="'field-' + childIndex"
        :clickable="editable(field)"
        :v-ripple="editable(field)"
        :header-inset-level="1"
        @click="editValue(field)"
      >
        <q-item-section v-if="field.icon" avatar>
          <q-icon :name="field.icon" />
        </q-item-section>
        <q-item-section v-if="field.type === 'editor'">
          <TextEditorEmbed
            v-model="field.value"
            :label="field.title"
            :highlight="field.highlight"
            :readonly="field.readonly"
            @update:model-value="
              (val) => {
                onInput(field, val)
              }
            "
          />
        </q-item-section>
        <!-- <q-item-section v-else-if="field.type === 'tapGrid'">
          <TapGrid
            v-model="field.value"
            :readonly="field.readonly"
            @update="
              (val) => {
                onInput(field, val)
              }
            "
          />
        </q-item-section> -->
        <q-item-section v-else-if="field.type === 'table'">
          <!--  -->
          <ListTable
            :add-bottom="showAdd(field)"
            :delete-buttons="showDelete(field)"
            :table-title="field.title"
            :table-headers="field.headers"
            :table-data="field.value"
            :draggable="field.draggable"
            :row-key="field.key ? field.key : 'id'"
            :no-search="field.search ? false : true"
            :visible-columns="
              field.visibleColumns ? field.visibleColumns : undefined
            "
            @add="addFunction(field)"
            @filter-fn="
              (arg) => {
                deleteFunction(field, arg)
              }
            "
            @dbl-click="
              (arg) => {
                editFunction(field, arg)
              }
            "
            @btn-click="
              (arg) => {
                editFunction(field, arg)
              }
            "
            @drag-end="
              (arg) => {
                dragFunction(field, arg)
              }
            "
          />
        </q-item-section>
        <q-item-section v-else-if="field.type === 'files'">
          <!-- <FileList
            :files="field.value"
            :directory="field.directory ? field.directory : []"
            :post-a-p-i="field.postAPI ? field.postAPI : '/uploader'"
            :types="field.types"
            :title="field.title ? field.title : 'files'"
            :params="field.params"
            :headers="field.headers"
            :entity-type="field.entityType"
            :entity-type-id="field.entityTypeId"
            :readonly="field.readonly"
            @uploaded="
              (val) => {
                $emit('uploaded', val)
              }
            "
          /> -->
        </q-item-section>
        <q-item-section v-else>
          <q-item-label>{{ field.title }}</q-item-label>
          <q-item-label caption>
            <q-badge
              v-if="field.style === 'badge' && field.value"
              :color="field.value.color"
              :class="
                $common.lightOrDark(field.value.color)
                  ? 'text-white'
                  : 'text-black'
              "
            >
              {{ displayValue(field) }}
            </q-badge>
            <q-badge
              v-else-if="field.type === 'bool'"
              :color="field.value ? 'green' : 'red'"
              class="text-white"
            >
              {{ field.value ? 'Yes' : 'No' }}
            </q-badge>
            <div v-else-if="field.style === 'multi-badge' && field.value">
              <q-badge
                v-for="(badge, k) in field.value"
                :key="`badge-${k}`"
                :color="badge.color"
                :class="
                  $common.lightOrDark(badge.color) ? 'text-white' : 'text-black'
                "
                class="q-mr-sm"
              >
                {{ badge.label }}
              </q-badge>
            </div>
            <div v-else-if="field.style === 'button'">
              <q-btn
                unelevated
                dense
                :color="field.color"
                :class="
                  $common.lightOrDark(field.color) ? 'text-white' : 'text-black'
                "
                @click="$emit('btnClick', field)"
                >{{ field.label }}</q-btn
              >
            </div>
            <div v-else :class="displayClass(field)">
              {{ displayValue(field) }}
            </div>
          </q-item-label>
        </q-item-section>
        <q-item-section v-if="field.readonly" side top>
          <q-item-label caption>Read only</q-item-label>
        </q-item-section>
      </q-item>
    </q-expansion-item>
  </q-card>
</template>

<script>
// :class="
//
//               child.iconColor ? `text-${child.iconColor}` : 'text-dark-inv'
//             "
// import { debounce } from 'quasar'
export default {
  components: {},
  props: {
    modelValue: { type: Array, required: true },
    defaultOpened: { type: String, default: '' },
    group: { type: String, default: undefined },
  },
  emits: ['btnClick', 'edit', 'uploaded'],
  // watch: {
  //   expanded(newVal, oldVal) {
  //     console.log(newVal, oldVal)
  //   }
  // },
  data() {
    return {
      expanded: {},
      expanded2: false,
    }
  },
  computed: {
    computedDefaultOpened() {
      if (this.defaultOpened === '') {
        return this.modelValue[0]?.name
      } else {
        return this.defaultOpened
      }
    },
  },
  created() {
    // this.onInput = debounce(this.onInput, 1000)
    const toSet = {}
    this.modelValue.map((o) => {
      toSet[o.name] = o.expanded ? true : false
    })
    this.expanded = { ...toSet }
  },
  methods: {
    filteredFields(page) {
      return page.fields.filter((field) => {
        return Boolean(field.name)
      })
    },
    showAdd(field) {
      return typeof field.add === 'function'
    },
    showDelete(field) {
      return typeof field.delete === 'function'
    },
    addFunction(field) {
      field.add()
    },
    deleteFunction(field, arg) {
      field.delete(arg)
    },
    dragFunction(field, arg) {
      field.drag(arg)
    },
    editFunction(field, arg) {
      if (typeof field.edit === 'function') {
        field.edit(arg)
      }
    },
    filterFileList(field, response) {
      field.filterFileList(response)
    },
    addToFileList(field, response) {
      field.addToFileList(response)
    },
    newAnnot(field, response) {
      field.newAnnot(response)
    },
    editable(field) {
      return (
        !field.readonly &&
        !['editor', 'table', 'files', 'tapGrid'].includes(field.type)
      )
    },
    editValue(field) {
      // console.log('editing', field)
      if (
        field.readonly ||
        ['editor', 'table', 'tapGrid', 'files'].includes(field.type)
      ) {
        return
      }
      if (typeof field.click === 'function') {
        field.click()
        return
      }
      const fields = [
        {
          type: 'header',
          title: field.title,
        },
      ]
      if (field.type === 'address') {
        fields.push(
          {
            name: 'title',
            label: 'Title',
            required: true,
            type: 'input',
            value: field.value.title,
          },
          {
            name: 'line1',
            label: 'Line 1',
            required: true,
            type: 'input',
            value: field.value.line1,
          },
          {
            name: 'line2',
            label: 'Line 2',
            type: 'input',
            value: field.value.line2,
          },
          {
            name: 'line3',
            label: 'Line 3',
            type: 'input',
            value: field.value.line3,
          },
          {
            name: 'postcode',
            label: 'Postcode',
            required: true,
            type: 'input',
            value: field.value.postcode,
          },
          {
            name: 'country',
            label: 'Country',
            type: 'input',
            value: field.value.country,
          }
        )
      } else if (['dob', 'date'].includes(field.type)) {
        fields.push({
          name: field.name,
          type: 'date',
          value: field.value?.date
            ? this.$moment(`${field.value?.date}Z`).format('Do MMMM YYYY')
            : '',
        })
      } else if (field.type === 'dateTime') {
        fields.push(
          {
            name: `${field.name}.date`,
            label: 'Date',
            type: 'date',
            required: true,
            value: field.value?.date
              ? this.$moment(`${field.value.date}`).format('Do MMMM YYYY')
              : '',
          },
          {
            name: `${field.name}.time`,
            label: 'Time',
            type: 'time',
            required: true,
            value: field.value?.date
              ? this.$moment(`${field.value.date}`).format('HH:mm')
              : '',
          }
        )
      } else {
        fields.push({ ...field, required: true, returnOptions: true })
      }
      this.$q
        .dialog({
          component: this.$customDialog.Form,
          componentProps: {
            fields,
            persistent: false,
            clear: 'cancel',
            cancel: true,
          },
        })
        .onOk((data) => {
          let toEmit = {}
          if (field.type === 'dateTime') {
            data = {
              [field.name]: `${data[`${field.name}.date`]} ${
                data[`${field.name}.time`]
              }`,
            }
          }
          Object.keys(data).map((key) => {
            if (field.type === 'address') {
              toEmit = {
                fullField: `${field.name}.${key}`,
                field: `${field.name}.${key}`,
                update: data[key],
                newValue: data[key].value ? data[key].value : data[key],
                put: false,
              }
              if (!this.$_.isEqual(field.value[key], data[key])) {
                this.$axios
                  .put(`/address/${field.value.id}`, {
                    field: key,
                    newValue: data[key],
                  })
                  .catch(this.$common.axiosError)
              }
            } else {
              let update = data[key]
              if (field.type === 'bool') {
                data[key] = data[key] ? 'isTrue' : 'isFalse'
              }
              if (['dob', 'date', 'dateTime'].includes(field.type)) {
                update = { date: update }
              }

              toEmit = {
                fullField: key,
                field: field.editKey ?? key,
                update,
                newValue: data[key].value ?? data[key],
                put: true,
              }
            }
            this.$emit('edit', toEmit)
          })

          // console.log('edited', field, data)
        })
    },
    displayValue(field) {
      if (field.type === 'select') {
        return field.value?.label
          ? field.value.label
          : field.value?.title
          ? field.value.title
          : field.value
      }
      if (field.type === 'address' && field.value) {
        let addressReturn = `${field.value.title}: ${field.value.line1}`
        if (field.value.line2) {
          addressReturn = `${addressReturn}, ${field.value.line2}`
        }
        if (field.value.line3) {
          addressReturn = `${addressReturn}, ${field.value.line3}`
        }
        addressReturn = `${addressReturn}, ${field.value.postcode}`
        if (field.value.country) {
          addressReturn = `${addressReturn}, ${field.value.country}`
        }
        return addressReturn
      }
      if (field.type === 'dob') {
        const dobMoment = this.$moment(`${field.value?.date}Z`)
        const age = this.$moment().diff(dobMoment, 'years')
        return `${dobMoment.format('Do MMMM YYYY')} (${age} years old)`
      }
      if (field.type === 'date') {
        if (field.value?.date) {
          const dateMoment = this.$moment(`${field.value?.date}`)
          return `${dateMoment.format('Do MMMM YYYY')}`
        } else {
          return ''
        }
      }
      if (field.type === 'dateTime') {
        if (field.value?.date) {
          const dateMoment = this.$moment(`${field.value?.date}`)
          return `${dateMoment.format('Do MMMM YYYY HH:mm')}`
        } else {
          return ''
        }
      }
      return field.value
    },
    displayClass(field) {
      if (field.type === 'email') {
        return 'text-blue'
      }
      if (field.highlight) {
        return 'text-accent text-bold bg-accent-inv'
      }
    },
    clickExpand(page) {
      console.log('expanded', page, this.expanded)
      // Vue.set(this.expanded, page.name, !this.expanded[page.name])
      this.expanded[page.name] = !this.expanded[page.name]
      console.log('expanded', page, this.expanded)
    },
    onInput(field, newValue) {
      const toEmit = {
        fullField: field.name,
        field: field.editKey ? field.editKey : field.name,
        update: newValue,
        newValue,
        put: true,
      }
      this.$emit('edit', toEmit)
    },
    //
  },
  // created() {

  // }
  // "dob": {
  //     "date": "2000-07-30 00:00:00.000000",
  //     "timezone_type": 3,
  //     "timezone": "UTC"
  //   },
}
</script>
