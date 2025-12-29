<template>
  <!-- <div :class="$q.screen.lt.sm ? 'p-mb-md full-width' : 'q-ml-md q-mr-md p-mb-md q-pt-md full-width'">
    class="full-width"  -->
  <div class="full-width full-height" :class="$q.screen.lt.md ? '' : 'q-pa-md'">
    <q-table
      :id="tableRef"
      :ref="tableRef"
      v-model:pagination="pagination"
      color="accent"
      :title="!hideHeaders ? tableTitle : ''"
      :filter="localFilter"
      :filter-method="customFilter"
      :columns="computedTableHeaders"
      :rows="tableDataCopy"
      :row-key="rowKey"
      :loading="loadingState"
      :rows-per-page-options="[50, 75, 100, 250, 500]"
      :style="`max-height: calc(100vh - ${computedOffset}px)`"
      :class="computedClass"
      :table-class="$q.screen.lt.sm ? '' : 'my-table-border'"
      :visible-columns="visibleColumns"
      virtual-scroll
      dense
      :hide-header="hideColHeaders"
      :hide-bottom="hideHeaders"
      :selected-rows-label="getSelectedString"
      :selection="selection"
      :selected="selectedToEmit"
    >
      <!-- <template v-slot:header-selection="scope">
              :selected-rows-label="getSelectedString"
      selection="multiple"
      :selected.sync="selected"
        <q-toggle v-model="scope.selected" />
      </template>
      <template v-slot:body-selection="scope">
        <q-toggle v-model="scope.selected" />
      </template> -->
      <template #loading>
        <q-inner-loading showing color="primary" />
      </template>
      <template v-if="!hideHeaders" #top>
        <div class="row justify-center items-center" style="width: 100%">
          <div class="col-3 no-wrap items-left justify-left text-left">
            <q-btn
              v-if="addButton"
              dense
              type="a"
              icon="add_box"
              :label="$q.screen.lt.sm ? '' : 'Add'"
              color="warning"
              flat
              class="q-pl-sm q-pr-sm"
              @click="$emit('add')"
            />
            <q-btn
              v-if="returnButton"
              dense
              type="a"
              icon="keyboard_return"
              :label="$q.screen.lt.sm ? '' : 'Return'"
              color="info"
              flat
              class="q-pl-sm q-pr-sm"
              @click="$emit('close')"
            />
            <q-btn
              v-if="selected.length > 0 && !noAction"
              dense
              type="a"
              :icon="actionIcon"
              :label="$q.screen.lt.sm ? '' : actionLabel"
              :color="actionColor"
              flat
              class="q-pl-sm q-pr-sm"
              @click="emitSelected"
            />
            <FilterList
              v-if="filters.length > 0"
              :filters="filters"
              color="light-blue-2"
              @filter-fn="filterTable"
            />
            <slot name="actions"></slot>

            <!-- <q-select dense use-input outlined class="q-pa-sm" label-color="primary" color="primary"></q-select> -->
          </div>
          <div class="col-6 text-center q-table__title">{{ tableTitle }}</div>
          <div v-if="!noSearch" class="col-3 no-wrap text-right">
            <q-input
              ref="tableSearchInput"
              v-model="localFilter"
              dense
              standout="bg-secondary text-secondary-inv"
              label="Search"
              input-class="text-secondary-inv"
              debounce="300"
            >
              <template #prepend>
                <q-icon name="search" color="black" />
              </template>
              <template #append>
                <q-icon
                  v-if="localFilter !== ''"
                  color="accent"
                  name="clear"
                  class="cursor-pointer"
                  @click.stop="localFilter = ''"
                />
              </template>
            </q-input>
            <!-- <q-input
              v-model="localFilter"
              dense
              label-color="white"
              bg-color="dark"
              standout="bg-secondary text-black"
              class="text-black"
              debounce="300"
              label="Search"
            >
              <template #prepend>
                <q-icon name="search" color="black" />
              </template>
              <template #append>
                <q-icon
                  v-if="localFilter !== ''"
                  name="clear"
                  class="cursor-pointer"
                  @click.stop="localFilter = ''"
                />
              </template>
            </q-input> -->
          </div>
          <div v-if="noSearch" class="col-3 no-wrap text-right"></div>
        </div>
        <div v-if="caption" class="row q-pt-sm q-pb-sm">
          {{ caption }}
        </div>
        <div
          v-if="tabs"
          class="row justify-center items-center full-width q-px-none q-mx-none q-pt-sm"
        >
          <Tabs
            :tabs="tabs"
            :model-value="tab"
            @update:model-value="
              (val) => {
                pagination.sortBy = null
                $emit('newTab', val)
              }
            "
          />
        </div>
      </template>
      <template #header="props">
        <q-tr :props="props">
          <q-th v-if="selection !== 'none'" auto-width>
            <q-checkbox
              v-if="selection === 'multiple'"
              dense
              :model-value="areAllSelected"
              color="green"
              keep-color
              @update:model-value="selectAll"
            />
          </q-th>
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            auto-width
            class="text-bold text-white"
          >
            {{ col.label }}
            <q-tooltip v-if="col.tooltip">{{ col.tooltip }}</q-tooltip>
          </q-th>
          <!-- <q-th v-if="reportButtons" auto-width /> -->
          <q-th v-if="deleteButtons" auto-width />
          <q-th v-if="computedDraggable" auto-width />
        </q-tr>
      </template>
      <!--
          <q-td
                :auto-width="$q.screen.lt.sm"
            v-for="col in $q.screen.gt.sm ? props.cols : props.cols.slice(1,2)"
            :key="col.name"
            :props="props"
            :style="props.row.color"
                class="cursor-pointer"
            @click="props.expand = !props.expand"
          >
            {{ col.value }}
          </q-td>
-->

      <template #body="props">
        <q-tr
          :data-key="props.key"
          :data-index="props.row[rowKey]"
          :data-row="JSON.stringify(props.row)"
          :props="props"
          @dblclick="rowDblClick(props)"
          @click="rowClick(props)"
        >
          <q-td v-if="refreshTrick"></q-td>
          <q-td
            v-if="selection !== 'none'"
            auto-width
            class="items-center text-center"
            :style="computedTdStyle({}, props.row)"
          >
            <!--  -->
            <q-checkbox
              :model-value="isSelected(props.key)"
              color="green"
              dense
              @update:model-value="select(props.key, props.row)"
            />
          </q-td>
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            auto-width
            :style="computedTdStyle(col, props.row)"
          >
            <div v-if="['btn', 'delete'].includes(col.type)">
              <q-btn
                dense
                unelevated
                :color="badgeColorsComp(col.colors, col.value)"
                :label="col.label"
                @click="btnClick(props, col)"
              ></q-btn>
            </div>
            <div v-else-if="col.type === 'btn-obj'">
              <q-btn
                v-if="col.value"
                dense
                unelevated
                :color="badgeColorsComp(col.colors, col.value)"
                :class="badgeTextComp(col.colors, col.value)"
                :label="col.value.label"
                :no-caps="col.value.noCaps"
                :size="col.value.size ? col.value.size : 'md'"
                :padding="col.value.padding ? col.value.padding : 'sm sm'"
                @click="btnClick(props, col)"
              ></q-btn>
            </div>
            <div v-else-if="col.type === 'btn-dropdown'" class="col">
              <q-btn-dropdown
                v-if="col.value"
                dense
                no-caps
                unelevated
                :color="col.value?.color"
                :label="col.value?.label"
                padding="none xs"
              >
                <q-list class="bg-blue-2">
                  <q-item
                    v-for="(dropdown, index) in col.value.menu"
                    :key="index"
                    v-close-popup
                    clickable
                    @click="$emit('btnClick', props, col, dropdown)"
                  >
                    <q-item-section>
                      <q-item-label>{{ dropdown.label }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </div>
            <div v-else-if="col.type === 'btn-up-down'" class="col">
              <div class="row">
                <q-btn
                  v-if="col.value"
                  dense
                  flat
                  color="primary"
                  icon="arrow_upward"
                  size="sm"
                  padding="none none"
                  @click="
                    $emit('btnClick', props, col, {
                      action: 'updown',
                      direction: -1,
                    })
                  "
                ></q-btn>
              </div>
              <div class="row">
                <q-btn
                  v-if="col.value"
                  dense
                  flat
                  color="primary"
                  icon="arrow_downward"
                  size="sm"
                  padding="none none"
                  @click="
                    $emit('btnClick', props, col, {
                      action: 'updown',
                      direction: 1,
                    })
                  "
                ></q-btn>
              </div>
              <!-- {{ col.value }} -->
            </div>
            <div v-else-if="col.type === 'multi-btn'">
              <q-btn
                v-for="(label, index) in col.value"
                :key="index"
                dense
                unelevated
                class="q-mr-sm"
                style="font-weight: 600; font-size: 1em"
                :color="badgeColorsComp(col.colors, label)"
                :label="label"
              ></q-btn>
            </div>
            <div v-else-if="col.type === 'btn-url'">
              <q-btn
                v-if="col.value"
                type="a"
                dense
                padding="none xs"
                unelevated
                :color="badgeColorsComp(col.colors, col.label)"
                :label="col.label"
                :href="col.value"
                target="_blank"
              ></q-btn>
            </div>
            <div v-else-if="col.type === 'email'">
              <a
                style="
                  border: none;
                  background: none;
                  text-transform: lowercase;
                "
                :href="'mailto:' + col.value"
                >{{ col.value }}</a
              >
            </div>
            <div v-else-if="col.type === 'url'">
              <a
                style="
                  border: none;
                  background: none;
                  text-transform: lowercase;
                "
                :href="col.value"
                target="_blank"
                >{{ col.value }}</a
              >
            </div>
            <div v-else-if="col.type === 'toggle'">
              <q-toggle
                keep-color
                value="col.value"
                checked-icon="check"
                class="text-white"
                unchecked-icon="clear"
                :toggle-indeterminate="col.indeterminate"
                :true-value="col.true"
                :false-value="col.false"
                :color="col.colors[col.value]"
                @input="
                  (value, event) => {
                    $emit('toggle', props, col, value, event)
                  }
                "
              >
                <q-tooltip
                  v-if="col.tooltip && col.tooltip[col.value.toLowerCase()]"
                  >{{ col.tooltip[col.value.toLowerCase()] }}</q-tooltip
                >
                <q-tooltip v-else-if="col.tooltip && col.tooltip.null">{{
                  col.tooltip.null
                }}</q-tooltip>
              </q-toggle>
            </div>
            <div v-else-if="col.type === 'badge-link'">
              <q-badge
                v-if="col.value"
                style="cursor: pointer"
                :color="col.color ? col.color : 'secondary'"
                @click="goto(col.location + props.key)"
                >{{ col.value }}</q-badge
              >
            </div>
            <div v-else-if="col.type === 'badge'">
              <q-badge
                v-if="col.value"
                :color="badgeColorsComp(col.colors, col.value)"
                :class="badgeTextComp(col.colors, col.value)"
              >
                <!--  -->
                {{ badgeLabelComp(col.labels, col.value) }}
              </q-badge>
            </div>
            <div v-else-if="col.type === 'multi-badge'">
              <q-badge
                v-for="(label, index) in col.value"
                :key="index"
                :color="badgeColorsComp(col.colors, label)"
                :class="badgeTextComp(col.colors, label)"
                class="q-mr-sm"
                :outline="label.outline"
                :style="label.click ? 'cursor: pointer' : ''"
                @click="
                  label.click
                    ? $emit('badgeClick', { props, col, value: label })
                    : null
                "
              >
                {{
                  badgeLabelComp(col.labels, label.label ? label.label : label)
                }}
                <q-tooltip v-if="label.tooltip">{{ label.tooltip }}</q-tooltip>
              </q-badge>
            </div>
            <div v-else-if="col.type === 'multi-badge-link'">
              <q-badge
                v-for="(label, index) in col.value"
                :key="index"
                :color="badgeColorsComp(col.colors, label)"
                :class="badgeTextComp(col.colors, label)"
                class="q-mr-sm"
                style="cursor: pointer"
                @click="goto(`${col.location}${label.value}`)"
              >
                {{ badgeLabelComp(col.labels, label.label) }}
              </q-badge>
            </div>
            <div v-else-if="col.type === 'isoDay'">
              {{ $moment().isoWeekday(col.value).format('dddd') }}
            </div>
            <div v-else-if="col.type === 'html'" v-sanitize="col.value"></div>
            <div v-else-if="col.value && col.value.tooltip && col.value.label">
              {{ col.value.label }}
              <q-tooltip>{{ col.value.tooltip }}</q-tooltip>
            </div>
            <div v-else-if="col.type === 'icon'" auto-width>
              <q-icon v-if="col.value" :name="col.value" />
            </div>
            <div v-else-if="col.type === 'editable'" auto-width>
              {{ col.value }}
              <q-btn
                icon="edit"
                size="sm"
                flat
                color="info"
                round
                dense
                @click="btnClick(props, col)"
              />
            </div>
            <div v-else>
              {{ col.value }}
            </div>
          </q-td>
          <!-- <q-td
            v-if="reportButtons"
            auto-width
            :style="computedTdStyle({}, props.row)"
          >
            <q-btn
              size="sm"
              flat
              color="positive"
              round
              dense
              icon="bug_report"
              @click="reportError(props)"
              ><q-tooltip>Report issue</q-tooltip></q-btn
            >
          </q-td> -->
          <q-td
            v-if="deleteButtons"
            auto-width
            :style="computedTdStyle({}, props.row)"
          >
            <q-btn
              v-if="!props.row.readonly"
              size="sm"
              flat
              color="red"
              round
              dense
              icon="delete"
              @click="removeRow(props)"
            />
          </q-td>
          <q-td
            v-if="computedDraggable"
            class="drag-handle"
            auto-width
            :style="computedTdStyle({}, props.row)"
          >
            <q-icon name="drag_handle" color="accent"></q-icon>
          </q-td>
          <!-- <draggable v-model="dragger(props)" tag="tbody" item-key="name">
        <template #item>hi</template>
      </draggable> -->
        </q-tr>
      </template>
      <!-- <template #body-cell-dance-order="props">

      </template> -->
      <template #pagination="scope">
        {{ paginationLabel(scope) }}
        <q-btn
          v-if="scope.pagesNumber > 2"
          icon="first_page"
          round
          size="sm"
          class="q-ml-xs"
          dense
          flat
          :disable="scope.isFirstPage"
          @click="scope.firstPage"
        />

        <q-btn
          icon="chevron_left"
          round
          size="sm"
          dense
          flat
          :disable="scope.isFirstPage"
          @click="scope.prevPage"
        />

        <q-btn
          icon="chevron_right"
          round
          size="sm"
          dense
          flat
          :disable="scope.isLastPage"
          @click="scope.nextPage"
        />

        <q-btn
          v-if="scope.pagesNumber > 2"
          icon="last_page"
          round
          size="sm"
          dense
          flat
          :disable="scope.isLastPage"
          @click="scope.lastPage"
        />

        <q-btn v-if="!noDownload" icon="more_vert" round size="sm" dense flat
          ><q-menu>
            <q-list square style="min-width: 100px" class="bg-cream">
              <!-- <q-item v-close-popup clickable @click="downloadXLSX">
                <q-item-section avatar>
                  <q-icon name="border_all" color="primary" size="sm" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Download Excel</q-item-label>
                </q-item-section>
              </q-item> -->
              <q-item v-close-popup clickable @click="downloadPDF">
                <q-item-section avatar>
                  <q-icon name="picture_as_pdf" color="accent" size="sm" />
                </q-item-section>
                <q-item-section>
                  <q-item-label>Download PDF</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </template>
      <template v-if="addBottom" #bottom-row>
        <q-tr @click="$emit('add')">
          <q-td colspan="100%">
            <q-btn
              dense
              type="a"
              icon="add_box"
              :label="$q.screen.lt.sm ? '' : 'Add'"
              color="accent"
              flat
              size="md"
              class="q-pl-sm q-pr-sm"
            />
          </q-td>
        </q-tr>
      </template>
      <template v-if="error" #bottom>
        <div class="full-width row flex-center q-gutter-sm bg-negative">
          <q-icon size="2em" name="error" color="white" />
          <span style="font-size: 14px">
            {{ errorMessage }}
          </span>
        </div>
      </template>
      <template v-if="error" #no-data>
        <div class="full-width row flex-center q-gutter-sm bg-negative">
          <q-icon size="2em" name="error" color="white" />
          <span style="font-size: 14px">
            {{ errorMessage }}
          </span>
        </div>
      </template>
    </q-table>
  </div>
</template>

<script>
import FilterList from 'components/FilterList.vue'
import Tabs from 'components/JTabs.vue'
// import draggable from 'vuedraggable'
import Sortable from 'sortablejs'
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'ListTable',
  components: {
    FilterList,
    Tabs,
    // draggable,
  },
  props: {
    dragOptions: {
      type: Object,
      default() {
        return {}
      },
    },
    draggable: { type: Boolean, default: false },
    printHeaders: {
      type: Array,
      default(props) {
        return props.tableHeaders
      },
    },
    noDownload: { type: Boolean, default: false },
    reportButtons: { type: Boolean, default: true },
    selection: { type: String, default: 'none' },
    actionLabel: { type: String, default: 'Export' },
    actionIcon: { type: String, default: 'download' },
    actionColor: { type: String, default: 'info' },
    deleteButtons: { type: Boolean, default: false },
    addButton: { type: Boolean, default: false },
    addBottom: { type: Boolean, default: false },
    returnButton: { type: Boolean, default: false },
    error: { type: Boolean, default: false },
    noAction: { type: Boolean, default: false },
    errorMessage: { type: String, default: '' },
    caption: { type: String, default: '' },
    tableTitle: { type: String, required: true },
    tableHeaders: { type: Array, required: true },
    tableData: {
      type: Array,
      default: function () {
        return []
      },
    },
    filters: {
      type: Array,
      default: function () {
        return []
      },
    },
    tabs: {
      type: Array,
      default: function () {
        return []
      },
    },
    preSelected: {
      type: Array,
      default: function () {
        return []
      },
    },
    tab: { type: String || Number, default: '' },
    contentClass: { type: String, default: '' },
    offset: { type: Number, default: 0 },
    rowKey: { type: String, required: true },
    rowClickTarget: { type: String, default: '' },
    rowClickParam: { type: String, default: '' },
    loadingState: { type: Boolean, default: false },
    hideHeaders: { type: Boolean, default: false },
    hideColHeaders: { type: Boolean, default: false },
    defaultFilter: { type: String, default: '' },
    noSearch: { type: Boolean, default: false },
    wordWrap: { type: Number, default: 300 },
    visibleColumns: {
      type: Array,
      default(props) {
        return props.tableHeaders.map((o) => {
          return o.name
        })
      },
    },
  },
  emits: [
    'toggle',
    'action',
    'updateSelected',
    'btnClick',
    'dblClick',
    'filterFn',
    'add',
    'newTab',
    'close',
    'rowClick',
    'report',
    'badgeClick',
    'delete',
    'dragEnd',
    'dragAdd',
  ],
  data() {
    return {
      tableRef: 'listTable',
      selected: [],
      selectedKeys: [],
      pagination: { rowsPerPage: 50 },
      modelType: [],
      modelStatus: [],
      localFilter: '',
      filterBool: true,
      tempExamId: 0,
      refreshTrick: false,
      referenceForm: false,
      tutorReportDialog: false,
      examReportDialog: false,
      postTarget: '/examreport/add',
      tempRowIndex: 0,
      tempUploadedFiles: [],
      candidateId: 0,
      tempTutorId: 0,
      tempReportId: 0,
      tempData: {},
      tempExamPaperId: 0,
      tempEditing: false,
    }
  },
  computed: {
    computedOffset() {
      const header = this.$q.screen.lt.sm ? 58 : 64
      return header + this.offset
    },
    computedDraggable() {
      return (
        this.draggable &&
        this.pagination.sortBy === null &&
        this.localFilter === ''
      )
    },
    dragging: {
      get() {
        return this.tableDataCopy
      },
      set(val) {
        this.tableDataCopy = val
      },
    },
    isLive() {
      if (process.env.LIVE === 'true') {
        return true
      } else {
        return false
      }
    },
    filteredPrintHeaders() {
      return this.printHeaders.filter((o) => {
        return (
          (this.visibleColumns.includes(o.name) || o.show) &&
          !['btn-dropdown', 'btn-obj', 'btn-up-down'].includes(o.type)
        )
      })
    },
    computedTableHeaders() {
      return this.tableHeaders.concat([
        {
          label: 'background',
          field: 'background',
          name: 'background',
        },
        {
          label: 'readonly',
          field: 'readonly',
          name: 'readonly',
        },
      ])
    },
    showFilters() {
      return this.filters.length > 0
    },
    computedWrapping() {
      var toReturn = ''
      if (this.wordWrap > 0) {
        toReturn = `white-space: normal !important; min-width: ${this.wordWrap}px;`
      }
      return toReturn
    },
    computedClass() {
      var toReturn = 'my-sticky-virtscroll-table'
      if (this.contentClass.length > 0) {
        toReturn = `${toReturn} ${this.contentClass}`
      }
      if (this.error) {
        toReturn = `${toReturn} ${this.validationError}`
      }
      return toReturn
    },
    // maxHeight() {
    //   var newOffset = this.headerSize.height
    //   if (this.offset > -1) {
    //     newOffset = newOffset + this.offset
    //   }
    //   if (!this.$q.screen.lt.sm) {
    //     newOffset = newOffset + 32
    //   }
    //   return 'max-height: calc(100vh - ' + newOffset + 'px);'
    // },
    tableDataCopy() {
      const fieldNames = this.tableHeaders.map((o) => {
        return o.field
      })
      fieldNames.push('background')
      fieldNames.push('readonly')
      return this.tableData.map((item) => {
        var toReturn = fieldNames.map((o) => {
          return [o, _.get(item, o)]
        })
        toReturn.push([this.rowKey, item[this.rowKey]])
        toReturn = this.$_.fromPairs(toReturn)
        return toReturn
      })
    },
    areAllSelected() {
      if (this.selected.length === 0) {
        return false
      } else if (this.selected.length === this.tableDataCopy.length) {
        return true
      } else {
        return null
      }
    },
    selectedToEmit() {
      const toEmit = this.tableDataCopy.filter((o) => {
        return this.selected.includes(o[this.rowKey])
      })
      return toEmit
    },
  },
  watch: {
    tableData: function () {
      // newVal, oldVal
    },
    draggable(newVal) {
      if (newVal) {
        this.setDraggable()
      }
    },
  },
  created() {
    this.tableRef = `listTable-${this.$uid()}`
    this.selected = this.preSelected
    // this.$emit('updateSelected', this.selectedToEmit)
  },
  mounted() {
    if (this.draggable) {
      this.setDraggable()
    }
    if (this.defaultFilter) {
      this.localFilter = this.defaultFilter
      this.$nextTick(() => {
        this.$refs.tableSearchInput.focus()
      })
    }
  },
  methods: {
    setDraggable() {
      // const emit = this.$emit
      // const pagination = this.pagination
      const element = document.querySelector(
        `#${this.tableRef} tbody.q-virtual-scroll__content`,
      ) // grab the element containing the <tr> elements
      // const preExisting = Sortable.get(element)
      // if (preExisting) {
      //   preExisting.destroy()
      // }
      const sortableConfig = {
        ...this.dragOptions,
        handle: '.drag-handle',
        dataIdAttr: 'data-index',
        // setData: (
        //   /** DataTransfer */ dataTransfer,
        //   /** HTMLElement*/ dragEl
        // ) => {
        //   dataTransfer.setData('Text', dragEl.textContent) // `dataTransfer` object of HTML5 DragEvent
        // },
        onEnd: (event) => {
          this.$emit('dragEnd', {
            event,
            key: event.item.dataset.key,
            row: JSON.parse(event.item.dataset.row),
            pagination: this.pagination,
            options: this.dragOptions,
          })
          // gets called when dragging ended
          // Sortable.js only swaps the elements in the DOM,
          // so we need to swap the elements in the table data using the indexes (event.oldIndex and event.newIndex) or probably better by using ids if you have pagination
        },
        onAdd: (event) => {
          this.$emit('dragAdd', {
            event,
            key: event.item.dataset.key,
            row: JSON.parse(event.item.dataset.row),
            pagination: this.pagination,
            options: this.dragOptions,
          })
          // gets called when dragging ended
          // Sortable.js only swaps the elements in the DOM,
          // so we need to swap the elements in the table data using the indexes (event.oldIndex and event.newIndex) or probably better by using ids if you have pagination
        },
      }
      Sortable.create(element, sortableConfig)
    },
    downloadPDF() {
      const makingDialog = this.$q.dialog({
        message: 'Creating PDF',
        dark: true,
        class: 'bg-dark',
        progress: {
          // spinner: QSpinnerGears,
          color: 'amber',
        },
        persistent: true, // we want the user to not be able to close it
        ok: false, // we want the user to not be able to close it
      })
      let headers = []
      const cellKeys = []
      const formatter = {}
      // const filteredHeaders = this.tableHeaders.filter(o => { return this.visibleColumns.includes(o.name) && !['btn-dropdown', 'btn-obj','btn-up-down'].includes(o.type) })
      for (const header of this.filteredPrintHeaders) {
        headers.push(`<th>${header.label}</th>`)
        const { field, name } = header
        cellKeys.push({ field, name })
        formatter[header.name] = header.format
      }
      headers = headers.join('')
      console.log('headers', headers)
      // this.tableDataCopy
      const body = this.$refs[this.tableRef].filteredSortedRows
        .map((row) => {
          return `<tr>${cellKeys
            .map((key) => {
              let toReturn = ''
              if (formatter[key.name]) {
                toReturn = formatter?.[key.name]?.(row?.[key.field], row)
              } else {
                toReturn = row?.[key.field] ?? ''
              }
              // console.log(toReturn)
              if (Array.isArray(toReturn)) {
                toReturn = toReturn
                  .map((item) => {
                    return item.label ?? item
                  })
                  .join(', ')
              }
              if (toReturn?.label) {
                toReturn = toReturn.label
              }
              // console.log(toReturn)
              return `<td>${toReturn}</td>`
            })
            .join('')}</tr>`
        })
        .join('')
      const htmlContent = `<h1>${this.tableTitle}</h1><table><tr>${headers}</tr>${body}</table>`
      console.log(htmlContent)
      //       <table>
      //   <tr>
      //     <th>Date</th>
      //     <th>Origin airport</th>
      //     <th>Destination airport</th>
      //     <th>Segment class</th>
      //   </tr>
      //   <tr v-for="segment in computedSegments" :key="segment.id">
      //     <td>{{ $moment(segment.date).format('Do MMMM YYYY') }}</td>
      //     <td>{{ `${segment.start.Name} (${segment.start.IATACode})` }}</td>
      //     <td>{{ `${segment.end.Name} (${segment.end.IATACode})` }}</td>
      //     <td>{{ classMap[segment.class] }}</td>
      //   </tr>
      // </table>
      // const htmlContent = document.getElementsByClassName(
      //   `${this.tableRef}-inner`
      // )[0].innerHTML
      // console.log(htmlContent)
      // `<h1>Heading 1</h1><p>Some body content</p>`
      const toPost = {
        htmlContent,
        pdfTitle: `${this.tableTitle}.pdf`,
      }
      if (!this.isLive) {
        toPost.runTest = 'please'
      }
      this.$axios
        .post('/pdf/make', toPost)
        .then(({ data }) => {
          const elem = document.createElement('a')
          elem.style.cssText = 'display: none;'
          elem.download = data.title
          elem.href = 'data:application/octet-stream;base64,' + data.fileData
          elem.id = 'downloadTheFile'
          // document.body.appendChild(elem)
          setTimeout(() => {
            makingDialog.hide()
            elem.click()
          }, 1500)
          // this.tempHREF =
          //   'data:application/octet-stream;base64,' + data.fileData
          // this.tempFileName = data.title
          // this.$nextTick(() => {
          //   makingDialog.hide()
          //   document.getElementById('downloadTheFile').click()
          // })
        })
        .catch((err) => {
          this.$common.axiosError(err)
          makingDialog.hide()
        })
    },
    total() {
      return this.$refs[this.tableRef].filteredSortedRows.length
    },
    paginationLabel({ pagination }) {
      const total = this.$refs[this.tableRef]
        ? this.$refs[this.tableRef].filteredSortedRows.length
        : this.tableDataCopy.length
      const start =
        (Number(pagination.page) - 1) * Number(pagination.rowsPerPage) + 1
      const end = Math.min(start + Number(pagination.rowsPerPage) - 1, total)
      return `${start}-${end} of ${total}`
    },
    reportError(props) {
      console.log(props.key, props.row)
      this.$q.dialog({
        // FIXME: This dialog needs to have a subject and body, lift from form website
        component: this.$customDialog.ReportIssue,
        componentProps: {
          row: props.row,
          id: props.key,
          source: 'table-row',
        },
      })
      this.$emit('report', props)
    },
    getSelectedString() {
      const total = this.$refs[this.tableRef]
        ? this.$refs[this.tableRef].filteredSortedRows.length
        : this.tableDataCopy.length
      return this.selected.length === 0
        ? ''
        : `${this.selected.length} record${
            this.selected.length > 1 ? 's' : ''
          } selected of ${total}`
    },
    emitSelected() {
      this.$emit('action', this.selectedToEmit)
      this.$refs[this.tableRef].clearSelection()
      this.selected = []
      console.log(this.$refs[this.tableRef])
    },
    selectAll() {
      const filteredSortedRows = this.$refs[this.tableRef].filteredSortedRows
      if (this.areAllSelected) {
        this.selected = []
      } else {
        this.selected = filteredSortedRows.map((o) => {
          return o[this.rowKey]
        })
      }
      this.$emit('updateSelected', this.selectedToEmit)
    },
    select(key) {
      // (key, row)
      if (this.selected.includes(key)) {
        this.selected = this.selected.filter((o) => {
          return o !== key
        })
      } else if (this.selection === 'multiple') {
        this.selected.push(key)
      } else {
        this.selected = [key]
      }
      this.$emit('updateSelected', this.selectedToEmit)
    },
    isSelected(key) {
      return this.selected.includes(key)
    },
    computedTdStyle(col, row) {
      var toReturn = ''
      if (col.wrapping) {
        toReturn = this.computedWrapping
      }
      if (row.background) {
        const brandColor = this.$colors.getPaletteColor(row.background)
        if (brandColor) {
          toReturn = `${toReturn} background-color: ${brandColor};`
        } else {
          toReturn = `${toReturn} background-color: ${row.background};`
        }
        // console.log(toReturn)
        // console.log(this.$common.lightOrDark(row.background))
        if (this.$common.lightOrDark(row.background)) {
          toReturn = `${toReturn} color: white`
        }
      }
      return toReturn
    },
    customFilter(rows, terms, cols, getCellValue) {
      const lowerTerms = terms ? terms.toLowerCase() : ''
      return rows.filter((row) =>
        cols.some((col) => {
          var val
          if (['multi-badge-link', 'multi-badge'].includes(col.type)) {
            val = getCellValue(col, row)
            if (Array.isArray(val)) {
              return val?.some((o) => {
                const haystack =
                  o.label === 'undefined' || o.label === 'null'
                    ? ''
                    : o.label
                      ? o.label.toLowerCase()
                      : (o + '').toLowerCase()
                return haystack?.indexOf(lowerTerms) !== -1
              })
            } else {
              val = getCellValue(col, row) + ''
              const haystack =
                val === 'undefined' || val === 'null' ? '' : val.toLowerCase()
              return haystack.indexOf(lowerTerms) !== -1
            }
          } else {
            val = getCellValue(col, row) + ''
            const haystack =
              val === 'undefined' || val === 'null' ? '' : val.toLowerCase()
            return haystack.indexOf(lowerTerms) !== -1
          }
        }),
      )
    },
    btnClick(props, col) {
      if (col.type === 'delete') {
        let msg = ''
        if (col.deleteKey) {
          msg = props.row[col.deleteKey]
        } else if (props.row.name) {
          msg = props.row.name
        } else if (props.row.title) {
          msg = props.row.title
        } else {
          msg = `row ${col.value}`
        }
        this.$q
          .dialog({
            dark: true,
            title: 'Delete entry?',
            class: 'bg-primary text-white',
            message: `Are you sure you wish to delete ${msg}?`,
            cancel: { label: 'No', outline: true, flat: true, color: 'amber' },
            ok: { label: 'Yes', outline: true, flat: true, color: 'amber' },
            color: 'primary',
          })
          .onOk(() => {
            this.$emit('btnClick', props, col.value, col)
          })
      } else {
        this.$emit('btnClick', props, col.value, col)
      }
    },
    badgeTextComp(badgeColors, arg) {
      if (this.$common.lightOrDark(this.badgeColorsComp(badgeColors, arg))) {
        return 'text-white text-capitalize'
      } else {
        return 'text-black text-capitalize'
      }
    },
    badgeColorsComp(badgeColors, arg) {
      if (arg.color) {
        return arg.color
      }
      if (
        badgeColors &&
        typeof arg === 'string' &&
        Object.keys(badgeColors).includes(arg.toLowerCase())
      ) {
        return badgeColors[arg.toLowerCase()]
      } else if (
        badgeColors &&
        Object.keys(badgeColors).includes(arg.toString())
      ) {
        return badgeColors[arg]
      } else if (badgeColors && Object.keys(badgeColors).includes(arg.label)) {
        return badgeColors[arg.label]
      } else if (badgeColors && Object.keys(badgeColors).includes('*')) {
        return badgeColors['*']
      } else {
        return 'black'
      }
    },
    badgeLabelComp(labels, arg) {
      if (labels && Object.keys(labels).includes(arg.toLowerCase())) {
        return labels[arg.toLowerCase()]
      } else {
        return arg
      }
    },
    rowDblClick(row) {
      if (this.rowClickTarget) {
        this.goto(this.rowClickTarget + row.key + this.rowClickParam)
      } else {
        this.$emit('dblClick', row)
      }
    },
    rowClick(row) {
      if (this.rowClickTarget) {
        // this.goto(this.rowClickTarget + row.key + this.rowClickParam)
      } else {
        this.$emit('rowClick', row)
      }
    },
    goto(destination) {
      if (this.$route.path !== destination) {
        this.$router.push(destination)
      }
    },
    removeRow(row) {
      this.$emit('filterFn', { deleted: row.key, row: row })
    },
    filterTable() {
      var toCall = []
      this.filters.map((o) => {
        const toCallValues = o.values
          .map((v) => {
            if (v.toggle) {
              return v.name
            }
          })
          .filter((w) => {
            return w
          })
        toCall.push({ key: o.key, values: toCallValues })
      })
      this.$emit('filterFn', toCall)
    },
  },
})
</script>

<style lang="scss">
// $
@import '../css/table';
</style>
