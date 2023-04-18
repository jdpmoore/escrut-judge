<template>
  <!-- <div class="row justify-center items-center bg-secondary"> -->
  <q-card
    :square="square || $q.screen.lt.sm || maximized"
    flat
    :bordered="$q.screen.gt.sm && !maximized"
    class="col-auto justify-center items-center bg-primary"
    :class="
      $q.screen.lt.sm || embed || maximized ? 'full-width' : 'border-primary'
    "
    style="min-width: 300px"
  >
    <!-- <q-inner-loading :showing="isUploading">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading> -->
    <q-card-section
      v-if="title && !noTitle"
      class="bg-primary text-white text-center q-pa-sm q-mb-none"
    >
      <div class="row items-center no-wrap">
        <div class="col">
          <div class="text-h6">{{ title }}</div>
        </div>
        <div class="col-auto">
          <q-btn
            v-if="close"
            icon="close"
            round
            dense
            flat
            @click="$emit('cancel', true)"
          />
        </div>
      </div>
    </q-card-section>
    <div
      v-for="(field, index) in fields"
      :key="index"
      class="bg-white q-pb-none"
    >
      <q-card-section
        v-if="field.type === 'section' || field.type === 'header'"
        class="bg-primary text-white text-center q-pa-sm"
        :class="field.type === 'header' ? 'q-mb-md' : ''"
      >
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-h6">{{ field.title }}</div>
          </div>
          <div class="col-auto">
            <q-btn
              v-if="close && field.type === 'header'"
              icon="close"
              round
              dense
              flat
              @click="$emit('cancel', true)"
            />
          </div>
        </div>
        <div
          v-if="field.caption"
          class="row items-center no-wrap text-center q-pt-sm"
        >
          <div class="col">{{ field.caption }}</div>
        </div>
      </q-card-section>
      <div class="q-pl-lg q-pr-lg bg-white">
        <div class="row items-left justify-left">
          <q-field
            v-if="showFieldOptional(field) && field.type === 'checkbox'"
            borderless
            :class="isError(field) ? 'q-mb-md' : 'q-pb-none'"
            :error="isError(field)"
            :error-message="errorMessage(field)"
            @input="$v.model[field.name].$touch()"
          >
            <template #control>
              <q-checkbox
                v-model="model[field.name]"
                :disable="field.readonly"
                color="primary"
                class="q-pr-lg"
              />
              <div v-if="showFieldOptional(field) && field.text" class="col">
                {{ field.text }}
              </div>
              <div
                v-else-if="showFieldOptional(field) && field.html"
                v-sanitize="field.html"
                class="col"
              ></div>
            </template>
          </q-field>
          <div
            v-if="
              showFieldOptional(field) &&
              field.text &&
              field.type !== 'checkbox'
            "
            class="col q-py-sm"
          >
            {{ field.text }}
          </div>
          <div
            v-if="
              showFieldOptional(field) &&
              field.html &&
              field.type !== 'checkbox'
            "
            v-sanitize="field.html"
            class="col q-py-sm"
          ></div>
        </div>
        <q-input
          v-if="
            showField(field, ['input', 'textarea', 'email', 'date', 'time'])
          "
          :ref="field.name"
          v-model.trim="model[field.name]"
          :class="isError(field) ? 'q-pb-lg' : 'q-pb-none q-mb-none'"
          :readonly="['date', 'time'].includes(field.type) || field.readonly"
          dense
          outlined
          :error="isError(field)"
          :error-message="errorMessage(field)"
          class="q-pa-sm"
          label-color="primary"
          :label="field.label"
          color="primary"
          :type="field.type"
          bottom-slots
          :counter="field.type === 'textarea'"
          :maxlength="field.maxlength"
          autogrow
          @blur="v$.model[field.name].$touch()"
          @click="showHideDate(field, true)"
          @[dynamicKeyup].enter.stop
        >
          <template v-if="['date', 'time'].includes(field.type)" #prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy
                :ref="field.name + '-' + field.type + '-popup'"
                :breakpoint="1024"
                transition-show="scale"
                transition-hide="scale"
                :offset="[0, 10]"
              >
                <div v-if="!field.readonly">
                  <q-date
                    v-if="field.type === 'date'"
                    v-model="model[field.name]"
                    minimal
                    mask="Do MMMM YYYY"
                    dark
                    class="bg-primary"
                    color="yellow"
                    text-color="black"
                    @update:model-value="showHideDate(field, false)"
                  />
                  <q-time
                    v-else-if="field.type === 'time'"
                    v-model="model[field.name]"
                    now-btn
                    format24h
                    minimal
                    dark
                    class="bg-primary"
                    color="amber"
                    text-color="black"
                    @update:model-value="showHideDate(field, false)"
                  />
                </div>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <!-- clearable     <q-select
      filled
      label="Select multiple values"
      hint="Separate multiple values by [,;|]"
      v-model="model"
      use-input
      use-chips
      multiple
      input-debounce="0"
      @new-value="createValue"
      :options="filterOptions"
      @filter="filterFn"
      style="width: 250px"
                :counter="field.type === 'multi-select'"
                filteredSelect(field)
    />-->
        <q-select
          v-if="showField(field, ['select', 'multi-select'])"
          :ref="`select-${field.name}`"
          v-model="model[field.name]"
          :readonly="field.readonly"
          new-value-mode="add-unique"
          behavior="menu"
          dense
          :option-value="field.optionValue ? field.optionValue : 'value'"
          :option-label="field.optionLabel ? field.optionLabel : 'label'"
          :emit-value="!field.returnOptions"
          :map-options="!field.returnOptions"
          use-input
          :hide-selected="field.type === 'select' && !field.chips"
          :fill-input="field.type === 'select' && !field.chips"
          :multiple="field.type === 'multi-select'"
          :use-chips="field.type === 'multi-select' || field.chips"
          user-chips
          outlined
          :label="field.label"
          class="q-pa-sm"
          :class="isError(field) ? 'q-pb-lg' : 'q-pb-none q-mb-none'"
          label-color="primary"
          color="primary"
          :options-selected-class="
            field.color ? 'text-' + field.color : 'text-accent'
          "
          :options="filteredSelect(field)"
          :error="isError(field)"
          :error-message="errorMessage(field)"
          :loading="field.loading"
          @input="v$.model[field.name].$touch()"
          @[dynamicKeyup].enter.stop
          @new-value="
            (inputValue, doneFn) => createValue(field, inputValue, doneFn)
          "
          @filter="
            (val, update, abort) => {
              filterSelect(val, update, abort, field.name, field)
            }
          "
          @update:model-value="
            () => {
              if (field.type === 'multi-select' && field.api) {
                $refs[`select-${field.name}`].updateInputValue('')
                $refs[`select-${field.name}`].filter()
                $refs[`select-${field.name}`].hidePopup()
              }
            }
          "
        >
          <template
            v-if="field.type === 'multi-select' || field.chips"
            #selected-item="scope"
          >
            <q-chip
              :removable="!field.readonly && field.type === 'multi-select'"
              dense
              :tabindex="scope.tabindex"
              :color="scope.opt.color ? scope.opt.color : 'primary'"
              :text-color="lightOrDark(scope.opt.color)"
              class="q-my-xs q-mr-sm"
              @remove="scope.removeAtIndex(scope.index)"
            >
              {{
                field.optionLabel
                  ? scope.opt[field.optionLabel]
                  : scope.opt.label
              }}
            </q-chip>
          </template>
        </q-select>
        <div
          v-else-if="showField(field, ['bool'])"
          class="row q-pb-none q-pt-sm justify-center"
        >
          <q-field
            borderless
            :class="isError(field) ? 'q-mb-md' : ''"
            :error="isError(field)"
            :error-message="errorMessage(field)"
            @input="v$.model[field.name].$touch()"
          >
            <template #control>
              <q-option-group
                v-model="model[field.name]"
                :disable="field.readonly"
                :options="[
                  {
                    label: 'No',
                    value: false,
                  },
                  {
                    label: 'Yes',
                    value: true,
                  },
                ]"
                :color="model[field.name] ? 'green' : 'red'"
                inline
                class="innerDivPadding q-pb-none"
              />
            </template>
          </q-field>
        </div>
        <div
          v-else-if="
            showField(field, ['multi-checkbox', 'multi-radio', 'multi-toggle'])
          "
          class="row q-pb-none q-pt-sm justify-left"
        >
          <q-field
            borderless
            :class="isError(field) ? 'q-mb-md' : ''"
            :error="isError(field)"
            :error-message="errorMessage(field)"
            @input="v$.model[field.name].$touch()"
          >
            <template #control>
              <q-option-group
                v-if="model[field.name] || field.type === 'multi-radio'"
                v-model="model[field.name]"
                :disable="field.readonly"
                :type="field.type.split('-')[1]"
                :options="field.options"
                :color="field.color ? field.color : 'green'"
                :inline="!field.stack"
                class="q-pb-none innerDivPadding"
              />
            </template>
          </q-field>
        </div>
      </div>
      <div
        v-if="showField(field, ['uploader'])"
        class="row q-pt-sm q-pb-sm items-center text-center justify-center"
        :class="$q.screen.lt.sm ? '' : 'q-pl-md q-pr-md'"
      >
        <FileUpload
          no-refresh
          no-filters
          post-api="/file/upload"
          :title="field.title"
          :type="field.uploadType"
          get-api="field.getAPI ? field.getAPI : '/file/'"
          :accept="field.accept"
          :multiple="field.multiple"
          :caption="field.caption"
          :uploader-title="field.uploaderTitle"
          @delete="(response) => deleteFile(response, field.name)"
          @uploaded="(response) => addToFileList(response, field.name, field)"
        />
        <!-- :
            :headers="field.headers ? field.headers : {}"
            :params="field.params ? field.params : {}"
            no-search
            :readonly="field.readonly"
            :no-delete="field.readonly || field.noDelete"
            
            :upload-types="field.uploadTypes"
            :file-types="field.uploadTypes"
            :error="isError(field)"
            :error-message="errorMessage(field)"
            :visible-columns="['contentType', 'name', 'fileType']"
            
             -->
      </div>
      <div
        v-if="showField(field, ['form'])"
        class="row q-pt-lg q-pb-lg items-center text-left justify-center"
        :class="$q.screen.lt.sm ? '' : 'q-pl-md q-pr-md'"
      >
        <ListTable
          :add-bottom="!field.readonly"
          :delete-buttons="!field.readonly"
          :table-title="field.title"
          :caption="field.caption ? field.caption : ''"
          :table-headers="tableHeaders(field)"
          :table-data="model[field.name]"
          row-key="id"
          no-search
          :error="isError(field)"
          :error-message="errorMessage(field)"
          @filter-fn="(response) => filterSubformList(response, field.name)"
          @add="handleAdd(field)"
          @dbl-click="
            (arg, val) => {
              handleAdd(field, arg, val)
            }
          "
        />
      </div>
      <div
        v-if="showField(field, ['html'])"
        class="row q-pa-none items-center text-center justify-center"
        :class="$q.screen.lt.sm ? '' : 'q-pl-md q-pr-md'"
      >
        <q-field
          borderless
          :class="isError(field) ? 'q-mb-md' : 'q-pb-none'"
          :error="isError(field)"
          :error-message="errorMessage(field)"
          @input="v$.model[field.name].$touch()"
        >
          <template #control>
            <FieldCard
              :fields="[
                {
                  title: field.label ? field.label : field.text,
                  key: field.name,
                  value: model[field.name] ? model[field.name] : defaultComment,
                  format: 'html',
                  field: 'id',
                },
              ]"
              :class="field.readonly ? '' : 'editingProfileTable'"
              @click="updateHTMLField(field)"
            />
          </template>
        </q-field>
      </div>
    </div>
    <div class="q-pt-md bg-white"></div>
    <q-card-section
      v-if="!embed"
      class="bg-primary text-white shadow-2 text-center q-pa-sm"
    >
      <div class="row items-center no-wrap">
        <div class="col q-gutter-md justify-between">
          <q-btn
            v-if="!noClear"
            icon="clear"
            :label="clear"
            color="amber"
            flat
            class="q-pl-sm q-pr-sm"
            @click="clearForm"
          />
          <q-btn
            v-if="!noSubmit"
            icon="done"
            :label="submit"
            color="positive"
            flat
            class="q-pl-sm q-pr-sm"
            @click="submitForm"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
  <!-- </div> -->
</template>

<script>
import { defineComponent } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import {
  required,
  email,
  minLength,
  maxLength,
  // alpha,
  // alphaNum,
  numeric,
  integer,
  decimal,
  sameAs,
  minValue,
  maxValue,
  between,
  helpers,
} from '@vuelidate/validators'
export const currencyOld = helpers.regex('currency', /^[0-9]+(\.[0-9]{1,2})?$/)
export const time = helpers.regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
export const currency = helpers.regex(/^[0-9]+(\.[0-9]{1,2})?$/)
export const alphaSpace = helpers.regex(/^[a-zA-Z\s]*$/)
export const alphaNumSpace = helpers.regex(/^[a-zA-Z0-9\s]*$/)
export const phone = helpers.regex(/^[0-9+]*$/)
export const alphaDiacritic = helpers.regex(/^[a-zA-ZÀ-ž]*$/)
export const alphaWhiteDiacritic = helpers.regex(/^[a-zA-ZÀ-ž\s]*$/)
export const alphaNumDiacritic = helpers.regex(/^[a-zA-Z0-9À-ž]*$/)
export const alphaNumWhiteDiacritic = helpers.regex(/^[a-zA-Z0-9À-ž\s]*$/)
import FileUpload from 'components/FileUpload.vue'
// import ListTable from 'components/common/ListTable'
// import FormDialog from 'components/common/dialog/Form'

export default defineComponent({
  name: 'CustomForm',
  validations() {
    return {
      model: { ...this.dataValidations },
    }
  },
  components: {
    FileUpload,
  },
  props: {
    fields: {
      type: Array,
      default: function () {
        return []
      },
    },
    // uploadedFiles: {
    //   type: Array,
    //   default: function() {
    //     return []
    //   }
    // },
    // data: { type: Object, default: function () { return {} } },
    title: { type: String, default: '' },
    // type: { type: String, default: '' },
    // size: { type: String, default: '' },
    // examId: { type: Number, default: 0 },
    // candidateId: { type: String, default: '0' },
    // reportId: { type: Number, default: 0 },
    // ewcId: { type: Number, default: 0 },
    noTitle: { type: Boolean, default: false },
    noErrorPopup: { type: Boolean, default: false },
    popupEdit: { type: Boolean, default: false },
    noClear: { type: Boolean, default: false },
    embed: { type: Boolean, default: false },
    noSubmit: { type: Boolean, default: false },
    clear: { type: String, default: 'clear' },
    submit: { type: String, default: 'submit' },
    cancel: { type: Boolean, default: false },
    close: { type: Boolean, default: false },
    square: { type: Boolean, default: false },
    maximized: {
      type: Boolean,
      default: false,
    },
    triggerSubmit: { type: Boolean, default: false },
    // uploadedFiles: { type: Array, default: function () { return [] } },
    // reportType: { type: String, default: 'report' },
    // uploadTypes: { type: Array, default: function () { return ['markedexam'] } },
    // tutorId: { type: Number, default: 0 }
  },
  emits: [
    'update',
    'addNew',
    'deleted',
    'submitForm',
    'cancel',
    'newAnnot',
    'saveCurrent',
  ],
  setup: () => ({ v$: useVuelidate() }),
  data() {
    return {
      options: [],
      defaultComment:
        '<div style="text-align: center; font-size: 12px; line-height: 12px; background: rgb(156, 39, 176); color: #FFFEF4; padding: 4px 8px 4px 8px; border-radius: 5px;">Edit</div>',
      formTypes: [
        'input',
        'email',
        'bool',
        'textarea',
        'select',
        'multi-checkbox',
        'multi-radio',
        'multi-toggle',
        'multi-select',
        'date',
        'time',
        'form',
        'uploader',
        'checkbox',
        'html',
      ],
      model: {},
      filters: {},
      dataValidations: {},
    }
  },
  computed: {
    /** @returns { string } */
    dynamicKeyup() {
      if (this.popupEdit) {
        return 'keyup'
      } else {
        return ''
      }
    },
    /** @returns { object } */
    formFields() {
      var toReturn = {}
      var isError = false
      var errorList = []
      this.fields
        .map((o) => {
          if (this.formTypes.includes(o.type)) {
            if (this.showField(o, o.type)) {
              if (o.type === 'date') {
                toReturn[o.name] = this.model[o.name]
                  ? this.$moment(this.model[o.name], 'Do MMMM YYYY').format(
                      'YYYY-MM-DD'
                    )
                  : null
              } else if (o.type === 'uploader') {
                if (o.fileList) {
                  toReturn[o.name] = this.model[o.name]
                } else {
                  toReturn[o.name] = this.model[o.name].map((o) => {
                    return o.id
                  })
                }
              } else if (o.type === 'form') {
                toReturn[o.name] = this.model[o.name]
                // .map((o) => {
                //   return this.$GOcommon.filterRemoveKey(o, ['id'])
                // })
              } else if (
                o.type === 'select' &&
                this.model[o.name] &&
                this.model[o.name].value
              ) {
                if (o.returnOptions) {
                  toReturn[o.name] = this.model[o.name]
                } else {
                  toReturn[o.name] = this.model[o.name].value
                }
              } else if (o.type === 'multi-select') {
                if (this.model[o.name]) {
                  toReturn[o.name] = this.model[o.name].map((o) => {
                    if (o.value) {
                      return o.value
                    } else {
                      return o
                    }
                  })
                } else {
                  toReturn[o.name] = []
                }
              } else {
                if (o.returnOptions) {
                  toReturn[o.name] = this.model[o.name]
                  // } else if (o.validation?.content === 'currency') {
                  //   toReturn[o.name] = this.model[o.name]
                } else {
                  toReturn[o.name] = this.$sanitize(this.model[o.name])
                }
              }
              // console.log(this.v$.model[o.name].$anyError, this.v$.model[o.name].$error)
              if (this.v$.model[o.name]?.$error) {
                isError = true
                errorList.push(o)
              }
            }
          }
        })
        .filter((o) => {
          return o
        })
      return { data: toReturn, error: isError, errorList: errorList }
    },
  },

  watch: {
    triggerSubmit(newValue) {
      console.log('triggered...', newValue)
      this.submitForm()
    },
    fields() {
      // console.log(newValue, oldValue)
      this.resetForm()
    },
    noErrorPopup() {
      //
    },
  },
  beforeMount() {
    this.resetForm()
  },
  methods: {
    updateHTMLField(field) {
      if (field.readonly) {
        return
      }
      let toEdit = this.model[field.name]
      if (!toEdit || toEdit === this.defaultComment) {
        toEdit = '<div style="text-align: left;"><br></div>'
      }
      this.$q
        .dialog({
          component: this.$customDialog.TextEditor,
          componentProps: {
            persistent: true,
            label: field.text,
            title: field.label ? field.label : field.text,
            Ok: 'Submit',
            text: toEdit,
          },
        })
        .onOk((comment) => {
          this.model[field.name] = comment
        })
    },
    lightOrDark(color) {
      return this.$common.lightOrDark(color) ? 'white' : 'black'
      // switch (color) {
      //   case 'amber':
      //     return 'black'
      //   default:
      //     return 'white'
      // }
    },
    createValue(field, val, done) {
      // if (field.add) {
      //   this.model[field.name] = val.toLowerCase()
      // }

      // Calling done(var) when new-value-mode is not set or "add", or done(var, "add") adds "var" content to the model
      // and it resets the input textbox to empty string
      // ----
      // Calling done(var) when new-value-mode is "add-unique", or done(var, "add-unique") adds "var" content to the model
      // only if is not already set
      // and it resets the input textbox to empty string
      // ----
      // Calling done(var) when new-value-mode is "toggle", or done(var, "toggle") toggles the model with "var" content
      // (adds to model if not already in the model, removes from model if already has it)
      // and it resets the input textbox to empty string
      // ----
      // If "var" content is undefined/null, then it doesn't tampers with the model
      // and only resets the input textbox to empty string
      if (val.length > 0 && field.add) {
        const lcVal = val.toLowerCase()
        const toAdd = {
          label: this.$GOcommon.capitalizeFirstLetter(lcVal),
          value: lcVal,
        }
        if (!field.options.includes(toAdd)) {
          field.options.push(toAdd)
        }
        done(toAdd, 'toggle')
      }
    },
    filteredSelect(field) {
      // if (field.api && this.filters[field.name].length > 2) {
      //   const toReturn = this.getSelectOptions(field)
      //   console.log(toReturn)
      //   return toReturn
      // }
      if (field.api) {
        return this.options
      }
      let options = field.options
      if (options === 'titles') {
        options = this.$store.state.GOstore.titles
      } else if (options === 'cities') {
        options = this.$GOcommon.getCountryList()
      }
      if (this.filters[field.name]) {
        const toReturn = options.filter((v) => {
          if (v.label) {
            return v.label.toLowerCase().indexOf(this.filters[field.name]) > -1
          } else if (field.optionLabel && v[field.optionLabel]) {
            return (
              v[field.optionLabel]
                .toLowerCase()
                .indexOf(this.filters[field.name]) > -1
            )
          } else if (v) {
            return v.toLowerCase().indexOf(this.filters[field.name]) > -1
          }
        })

        return toReturn
      } else {
        return options
      }
    },
    filterSelect(val, update, abort, fieldName, field) {
      // console.log('filter select', val, fieldName, field)
      const needle = val.toLowerCase().trim()
      if (field.api && needle.length > 2) {
        field.options = []
        this.$axios
          .post(field.api, { searchOn: needle })
          .then(({ data }) => {
            update(
              () => {
                // console.log('api call', data)
                this.options = data
                // console.log(field)
              }
              // (ref) => {
              //   console.log(ref)
              //   ref.options = field.options
              //   ref.refresh()
              // }
            )
            // field.loading = false
          })
          .catch((err) => {
            this.$common.axiosError(err)
            // field.loading = false
            update(() => {
              this.options = []
              field.options = []
            })
          })
      } else if (field.api) {
        update(() => {
          this.options = []
        })
      } else {
        update(() => {
          this.filters[fieldName] = needle
        })
      }
    },
    getSelectOptions(field) {
      // field.loading = true
      this.$axios
        .post(field.api, { searchOn: this.filters[field.name] })
        .then(({ data }) => {
          // field.loading = false
          return data
        })
        .catch((err) => {
          this.$common.axiosError(err)
          // field.loading = false
          return []
        })
    },
    handleAdd(field, arg) {
      if (field.dblClick && arg) {
        field.dblClick(field, arg, this.model)
      } else if (field.add && !arg) {
        field
          .add(field)
          .then((data) => {
            var toPush = data
            if (Array.isArray(data)) {
              for (let i = 0; i < toPush.length; i++) {
                let newPush = toPush[i]
                newPush.id = this.model[field.name].length + i + 1
                this.model[field.name].push(newPush)
              }
            } else {
              toPush.id = this.model[field.name].length + 1
              this.model[field.name].push(toPush)
            }
            this.v$.model[field.name].$touch()
          })
          .catch(() => {
            this.formPopup(field, arg)
          })
      } else {
        this.formPopup(field, arg)
      }
    },
    formPopup(field, arg) {
      let popupFields = field.fields
      if (arg) {
        popupFields.map((o) => {
          console.log(
            this.model[field.name],
            o.name,
            this.model[field.name].find((w) => {
              return w.id === arg.key
            })
          )
          o.value = arg.row[o.name]
            ? arg.row[o.name]
            : this.model[field.name].find((w) => {
                return w.id === arg.key
              })[o.name]
          if (o.type === 'date' && o.value) {
            o.value = this.$moment(o.value).format('Do MMMM YYYY')
          }
        })
      } else {
        popupFields.map((o) => {
          o.value = null
        })
      }
      this.$q
        .dialog({
          component: this.$customDialog.Form,
          parent: this,
          componentProps: {
            fields: popupFields,
            maximized: field.maximized,
            samples: field.samples,
            cancel: field.cancel,
            title: `Add ${field.title}`,
            clear: field.clear ? field.clear : 'Reset',
          },
        })
        .onOk((data) => {
          if (arg) {
            this.$emit('update', { data: data, field: field, row: arg })
            const oKeys = Object.keys(data)
            this.model[field.name] = this.model[field.name].map((o) => {
              if (o.id === arg.key) {
                if (field.update) {
                  field.update(o, data)
                }
                oKeys.map((key) => {
                  o[key] = data[key]
                })
              }
              return o
            })
            this.v$.model[field.name].$touch()
            // console.log(arg, data, this.model[field.name])
          } else {
            this.$emit('addNew', { data: data, field: field })
            var toPush = data
            if (field.idCallback) {
              toPush.id = field.idCallback(data)
            } else {
              toPush.id = this.model[field.name].length + 1
            }
            this.model[field.name].push(toPush)
            this.v$.model[field.name].$touch()
          }
        })
    },
    tableHeaders(field) {
      var tempHeaders = []
      field.fields.forEach((o) => {
        if (o.label) {
          // format:
          var toPush = {
            name: o.name,
            label: o.label,
            align: 'left',
            field: o.name,
            sortable: true,
          }
          if (o.format) {
            toPush.format = o.format
          }
          switch (o.type) {
            case 'date':
              toPush.format = (val) => this.$moment(val).format('Do MMMM YYYY')
              break
            case 'bool':
              toPush.format = (val) => (val === 'true' ? 'Yes' : 'No')
              break
            case 'uploader':
              toPush.format = (val) => {
                return `Uploaded ${val.length} files`
              }
              break
            case 'html':
              toPush.type = 'html'
              toPush.wrapping = true
              break
            default:
          }
          tempHeaders.push(toPush)
        }
      })
      return tempHeaders
    },
    filteredFileList(data, field) {
      if (data && data.length > 0) {
        const toReturn = data.filter((o) => {
          return this.filters[field].includes(o.contentType)
        })
        return toReturn
      } else {
        return []
      }
    },
    filterSubformList(arg, fieldName) {
      // || Object.keys(arg).includes('deleted')
      if (arg.deleted) {
        this.$q
          .dialog({
            dark: true,
            title: 'Delete?',
            class: 'bg-primary text-white',
            message: 'Are you sure you wish to delete this item?',
            cancel: {
              label: 'No',
              outline: true,
              flat: true,
              color: 'amber',
            },
            ok: { label: 'Yes', outline: true, flat: true, color: 'amber' },
            color: 'primary',
          })
          .onOk(() => {
            this.model[fieldName] = this.model[fieldName].filter((o) => {
              return o.id !== arg.deleted
            })
            this.$emit('deleted', arg)
          })
      }
    },
    filterFileList(arg, fieldName) {
      if (arg.deleted) {
        this.model[fieldName] = this.model[fieldName].filter((o) => {
          return o.id !== arg.deleted
        })
        this.v$.model[fieldName].$touch()
      } else {
        this.filters[fieldName] = arg
      }
    },
    addToFileList(arg, fieldName) {
      arg.files.forEach((o) => {
        this.model[fieldName].push(o)
      })
      this.v$.model[fieldName].$touch()
    },
    isError(field) {
      if (this.v$.model[field.name]) {
        return this.v$.model[field.name].$error
      } else {
        return false
      }
    },
    errorClassify(field) {
      const oKeys = Object.keys(this.v$.model[field.name]).filter((o) => {
        return o.charAt(0) !== '$'
      })
      // const toReturn = oKeys
      //   .map((o) => {
      //     if (!this.v$.model[field.name][o]) {
      //       return o
      //     }
      //   })
      //   .filter((w) => {
      //     return w
      //   })
      return oKeys
      // oKeys.includes(type) && !this.v$.model[field.name][type]
    },
    errorMessage(field) {
      if (this.v$.model[field.name]) {
        const toTest = this.errorClassify(field)
        if (toTest.length > 0) {
          switch (toTest[toTest.length - 1]) {
            case 'required':
              return 'Field is required'
            case 'requiredTrue':
              return 'You must agree before submission'
            case 'alpha':
              return 'Alphabet characters only (no spaces allowed)'
            case 'alphaNum':
              return 'Alphanumeric characters only (no spaces allowed)'
            case 'alphaSpace':
              return 'Alphabet characters and spaces only'
            case 'alphaNumSpace':
              return 'Alphanumeric characters and spaces only'
            case 'numeric':
              return 'Positive integer values only'
            case 'currency':
              return 'Positive number with up to two decimal places (e.g. currency)'
            case 'time':
              return 'Time in the 24 hour format HH:mm'
            case 'phone':
              return 'Please enter a telephone number (numbers and + only)'
            case 'integer':
              return 'Positive and negative integer values only'
            case 'decimal':
              return 'Numbers only'
            case 'minLength':
              if (field.type === 'uploader') {
                return `Please upload at least ${
                  this.v$.model[field.name].$params.minLength.min
                } files`
              } else if (field.type === 'form') {
                return `Please add at least ${
                  this.v$.model[field.name].$params.minLength.min
                } entries`
              } else {
                return `Field must have at least ${
                  this.v$.model[field.name].$params.minLength.min
                } characters`
              }
            case 'maxLength':
              if (field.type === 'uploader') {
                return `Please upload at most ${
                  this.v$.model[field.name].$params.maxLength.max
                } files`
              } else if (field.type === 'form') {
                return `Please add at most ${
                  this.v$.model[field.name].$params.maxLength.max
                } entries`
              } else {
                return `Field must have at most ${
                  this.v$.model[field.name].$params.maxLength.max
                } characters`
              }
            case 'email':
              return 'Please enter a valid email address'
            case 'minValue':
              return `Please enter a number greater than ${
                this.v$.model[field.name].$params.minValue.min
              }`
            case 'maxValue':
              return `Please enter a number less than ${
                this.v$.model[field.name].$params.maxValue.max
              }`
            case 'between':
              if (field.type === 'uploader') {
                return `Please upload between ${
                  this.v$.model[field.name].$params.between.min
                } and ${this.v$.model[field.name].$params.between.max} files`
              } else if (field.type === 'form') {
                return `Please add between ${
                  this.v$.model[field.name].$params.between.min
                } and ${this.v$.model[field.name].$params.between.max} entries`
              } else {
                return `Please enter a number between ${
                  this.v$.model[field.name].$params.between.min
                } and ${this.v$.model[field.name].$params.between.max}`
              }
            case 'sameAs':
              return `Field must match ${
                this.model[this.v$.model[field.name].$params.sameAs.eq]
              }`
            case 'isDate':
              return 'Please enter a valid date of the format: 31st July 2020'
            default:
              console.log(toTest[0])
              return 'Unknown validation error (please contact system support)'
          }
        }
      }
    },
    submitForm() {
      // console.log('submitting form')
      this.v$.$touch()
      // console.log(this.formFields)
      if (this.formFields.error) {
        if (!this.noErrorPopup) {
          this.$q.dialog({
            dark: true,
            title: 'Form errors',
            message: 'Please check for errors in the form',
            class: 'bg-primary q-page-container',
          })
        }
        this.$emit('saveCurrent', this.formFields.data)
      } else {
        this.$emit('submitForm', this.formFields.data)
      }
    },
    // submitForm() {
    //   this.v$.$touch()
    //   if (this.v$.$error) {
    //     if (!this.noErrorPopup) {
    //       this.$q.dialog({
    //         dark: true,
    //         title: 'Form errors',
    //         message: 'Please check for errors in the form',
    //         class: 'bg-primary q-page-container',
    //       })
    //     }
    //   } else {
    //     console.log('emitting data', this.formFields.data)
    //     this.$emit('submitForm', this.formFields.data)
    //   }
    // },
    clearForm() {
      // TODO: Add some code to allow for saving form as opposed to just resetting.
      // Maybe that's a pass back up the chain though, with props to determine if that's a thing
      // Also add some code here to delete any orphaned files on the server
      console.log(this.cancel)
      if (this.cancel) {
        this.$emit('cancel', true)
      } else {
        this.$q
          .dialog({
            dark: true,
            title: 'Reset form?',
            message: 'Are you sure you wish to reset the form?',
            cancel: true,
            class: 'bg-primary',
          })
          .onOk(() => {
            this.resetForm()
          })
      }
    },
    showHideDate(field, show) {
      if (['date', 'time'].includes(field.type) && !field.readonly) {
        const tag = field.name + '-' + field.type + '-popup'
        if (this.$refs[tag][0]) {
          if (show) {
            this.$refs[tag][0].show()
          } else {
            this.$refs[tag][0].hide()
          }
        } else if (this.$refs[tag]) {
          if (show) {
            this.$refs[tag].show()
          } else {
            this.$refs[tag].hide()
          }
        }
      }
    },
    showFieldOptional(field) {
      if (field.show) {
        const parent = this.fields.find((o) => {
          return field.show.key === o.name
        })
        if (!parent) {
          return false
        }
        if (field.show.any) {
          const matches = field.show.any.some((o) => {
            if ('child' in o) {
              // console.log(field.show)
              if (this.model[o.key]) {
                let now = this.$moment()
                let birth = this.$moment(this.model[o.key], 'Do MMMM YYYY')
                let years = now.diff(birth, 'years')
                return o.child ? years < 18 : years >= 18
              }
            }
            if (o.value === 'undefined') {
              return this.$_.isUndefined(this.model[o.key])
            }
            return this.model[o.key] === o.value
          })
          // console.log(field, matches)
          return matches
        } else if (field.show.all) {
          const matches = field.show.all.every((o) => {
            return this.$_.isEqual(this.model[o.key], o.value)
            // return this.model[o.key] === o.value
          })
          return matches
        }
        if (field.show.value === null) {
          return this.$_.isEqual(this.model[parent.name], field.show.value)
        }
        if (typeof field.show.value == 'object' && 'not' in field.show.value) {
          if (Array.isArray(field.show.value.not)) {
            return !field.show.value.not.includes(this.model[parent.name])
          } else {
            return !this.$_.isEqual(
              this.model[parent.name],
              field.show.value.not
            )
          }
        } else {
          if (Array.isArray(field.show.value)) {
            return field.show.value.includes(this.model[parent.name])
          } else {
            return this.$_.isEqual(this.model[parent.name], field.show.value)
          }
        }
      } else {
        return true
      }
    },
    showField(field, type) {
      if (type.includes(field.type)) {
        if (field.show) {
          return this.showFieldOptional(field)
        } else {
          return true
        }
      } else {
        return false
      }
    },
    contentSwitch(type) {
      switch (type) {
        case 'alphaSpace':
          return alphaWhiteDiacritic
        case 'alpha':
          return alphaDiacritic
        case 'alphaNum':
          return alphaNumDiacritic
        case 'alphaNumSpace':
          return alphaNumWhiteDiacritic
        case 'numeric':
          return numeric
        case 'integer':
          return integer
        case 'decimal':
          return decimal
        case 'currency':
          return currency
        case 'time':
          return time
        case 'phone':
          return phone
        default:
      }
    },
    defaultValue(arg) {
      if (arg.value) {
        return arg.value
      } else {
        switch (arg.type) {
          case 'checkbox':
            return false
          // case 'bool':
          //   return false
          case 'select':
            return null
          case 'multi-select':
            return null
          case 'multi-checkbox':
            return []
          case 'multi-toggle':
            return []
          case 'uploader':
            return []
          case 'form':
            return []
          default:
            return ''
        }
      }
    },
    handleRefresh() {
      console.log('is refreshing')
    },
    isDate(value) {
      if (value) {
        return this.$moment(value, 'Do MMMM YYYY', true).isValid()
      } else {
        return true
      }
    },
    resetForm() {
      var tempValidation = {}
      var tempModel = {}
      var tempFilters = {}
      this.fields.map((o) => {
        if (o.name) {
          tempModel[o.name] = this.defaultValue(o)
          if (['uploader', 'select', 'multi-select'].includes(o.type)) {
            tempFilters[o.name] = []
            if (o.uploadTypes) {
              o.uploadTypes.forEach((v) => {
                tempFilters[o.name].push(v)
              })
            }
            if (o.contentType) {
              o.contentType.forEach((v) => {
                tempFilters[o.name].push(v)
              })
            }
          }
          tempValidation[o.name] = {}
          if (o.required) {
            tempValidation[o.name].required = required
            if (o.type === 'checkbox') {
              tempValidation[o.name].requiredTrue = sameAs(true)
            } else if (o.type === 'uploader') {
              // tempValidation[o.name].minLength = minLength(1)
            }
          }
          if (o.type === 'email') {
            tempValidation[o.name].email = email
          }
          if (o.type === 'date') {
            tempValidation[o.name].isDate = this.isDate
          }
          if (o.validation) {
            const oKeys = Object.keys(o.validation)
            oKeys.forEach((w) => {
              switch (w) {
                case 'minLength':
                  tempValidation[o.name].minLength = minLength(
                    o.validation.minLength
                  )
                  break
                case 'maxLength':
                  console.log('max length')
                  tempValidation[o.name].maxLength = maxLength(
                    o.validation.maxLength
                  )
                  console.log(tempValidation)
                  break
                case 'content':
                  tempValidation[o.name][o.validation.content] =
                    this.contentSwitch(o.validation.content)
                  break
                case 'minValue':
                  tempValidation[o.name].minValue = minValue(
                    o.validation.minValue
                  )
                  break
                case 'maxValue':
                  tempValidation[o.name].maxValue = maxValue(
                    o.validation.maxValue
                  )
                  break
                case 'between':
                  if (o.validation.between.length === 2) {
                    if (['uploader', 'form'].includes(o.type)) {
                      tempValidation[o.name].minLength = minLength(
                        o.validation.between[0]
                      )
                      tempValidation[o.name].maxLength = maxLength(
                        o.validation.between[1]
                      )
                    } else {
                      tempValidation[o.name].between = between(
                        o.validation.between[0],
                        o.validation.between[1]
                      )
                    }
                  }
                  break
                case 'sameAs':
                  tempValidation[o.name].sameAs = sameAs(o.validation.sameAs)
                  break
                default:
              }
            })
          }
        }
      })
      this.model = tempModel
      this.filters = tempFilters
      this.dataValidations = tempValidation

      // this.v$.$reset()
      // this.$nextTick(() => {
      this.v$.$reset()
      // })
    },
  },
})
</script>

<style lang="scss">
.innerDivPadding .q-radio {
  margin-right: 20px;
}
.innerDivPadding .q-toggle__inner {
  margin-right: 20px;
}
.innerDivPadding .q-toggle__label {
  margin-right: 20px;
}
.innerDivPadding .q-checkbox__inner {
  margin-right: 20px;
}
</style>
