<template>
  <q-dialog
    ref="dialog"
    class="full-width q-pa-none items-center justify-center text-center"
    :maximized="isMaximized"
    @hide="onDialogHide"
  >
    <!-- my-sticky-virtscroll-table-judges -->
    <q-card flat style="max-width: 100vw" class="bg-dark">
      <!-- style="
        min-width: 400px;
        max-width: 1200px;
        max-height: 900px;
        background: rgba(76, 175, 80, 0);
      " 
      :table-style="
              $q.screen.lt.md
                ? `max-height: ${
                    innerHeight - tableOffset
                  }px; min-width: 100vw; max-width: 100vw !important;`
                : `max-height: ${
                    innerHeight - tableOffset
                  }px; min-width: 800px;`
            "
      -->
      <q-card-section class="row items-center justify-center q-pa-none bg-dark">
        <div class="row items-center bg-dark">
          <q-table
            ref="competitorTable"
            v-model:pagination="paginationJudges"
            dense
            :square="$q.screen.lt.md"
            class="my-sticky-header-column-table"
            :class="$q.screen.lt.md ? 'mobile noLeft' : 'tablet'"
            :title-class="$q.screen.lt.md ? 'text-body1 text-bold' : 'text-h6'"
            :virtual-scroll-sticky-size-start="48"
            :title="title"
            :rows="computedCompetitors"
            :filter="localFilter"
            :columns="computedCompetitorHeaders"
            row-key="id"
            virtual-scroll
            :virtual-scroll-slice-size="200"
            :table-style="
              isMaximized
                ? `min-width: 200px; max-width: 100vw; max-height: ${
                    innerHeight - tableOffset
                  }px;`
                : `min-width: 400px; max-width: calc(100vw - 10px); max-height: ${
                    innerHeight - tableOffset
                  }px);`
            "
            :rows-per-page-options="[0]"
            :visible-columns="visibleColumns"
          >
            <template #top>
              <q-resize-observer @resize="onResizeTop" />
              <!-- class="relative-position row items-center"  -->

              <div
                class="row justify-between full-width items-top"
                style="flex-wrap: nowrap"
              >
                <div class="col-auto">
                  <q-btn
                    icon="more_vert"
                    :flat="
                      !localFilter &&
                      teamFilter === 'All' &&
                      eventFilter === 'All'
                    "
                    :unelevated="
                      !!localFilter &&
                      teamFilter !== 'All' &&
                      eventFilter === 'All'
                    "
                    round
                    dense
                    :color="
                      localFilter ||
                      teamFilter !== 'All' ||
                      eventFilter !== 'All'
                        ? 'accent'
                        : 'primary'
                    "
                  >
                    <q-menu ref="competitorSearch" @show="setFocus">
                      <q-list
                        square
                        style="min-width: 100px"
                        class="bg-dark text-dark-inv"
                      >
                        <q-item v-if="team" v-close-popup>
                          <q-toggle
                            v-model="showNames"
                            v-close-popup
                            label="Competitor details"
                            checked-icon="check"
                            color="positive"
                            unchecked-icon="clear"
                          />
                        </q-item>
                        <q-item
                          v-if="showEvents"
                          clickable
                          :class="eventFilter === 'All' ? '' : 'bg-accent'"
                        >
                          <q-item-section avatar>
                            <q-icon
                              name="filter_list"
                              color="warning"
                              size="sm"
                            />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>Event type</q-item-label>
                          </q-item-section>
                          <q-menu
                            :cover="$q.screen.lt.md"
                            anchor="top end"
                            self="top left"
                          >
                            <q-list
                              square
                              style="min-width: 100px"
                              class="bg-dark text-dark-inv"
                            >
                              <q-item
                                v-for="filter in eventFilters"
                                :key="filter"
                                v-close-popup
                                clickable
                                :class="
                                  filter === eventFilter ? 'bg-accent' : ''
                                "
                                @click="eventFilter = filter"
                              >
                                <q-item-section avatar>
                                  <q-icon
                                    name="people"
                                    color="warning"
                                    size="sm"
                                  />
                                </q-item-section>
                                <q-item-section>
                                  <q-item-label>{{ filter }}</q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </q-menu>
                        </q-item>
                        <q-item
                          v-if="teamRankings"
                          clickable
                          :class="teamFilter === 'All' ? '' : 'bg-accent'"
                        >
                          <q-item-section avatar>
                            <q-icon
                              name="filter_list"
                              color="warning"
                              size="sm"
                            />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>Teams</q-item-label>
                          </q-item-section>
                          <q-menu
                            :cover="$q.screen.lt.md"
                            anchor="top end"
                            self="top left"
                          >
                            <q-list
                              square
                              style="min-width: 100px"
                              class="bg-dark text-dark-inv"
                            >
                              <q-item
                                v-for="letter in teamLetters"
                                :key="letter"
                                v-close-popup
                                clickable
                                :class="
                                  letter === teamFilter ? 'bg-accent' : ''
                                "
                                @click="teamFilter = letter"
                              >
                                <q-item-section avatar>
                                  <q-icon
                                    name="people"
                                    color="warning"
                                    size="sm"
                                  />
                                </q-item-section>
                                <q-item-section>
                                  <q-item-label>{{ letter }}</q-item-label>
                                </q-item-section>
                              </q-item>
                            </q-list>
                          </q-menu>
                        </q-item>
                        <q-item>
                          <q-input
                            ref="competitorSearchInput"
                            v-model="localFilter"
                            dense
                            label-color="white"
                            bg-color="dark"
                            standout="bg-primary"
                            class="text-white"
                            debounce="300"
                            label="Search"
                            @update:model-value="moveMenu"
                          >
                            <template #prepend>
                              <q-icon name="search" />
                            </template>
                            <template #append>
                              <q-icon
                                v-if="localFilter !== ''"
                                name="clear"
                                class="cursor-pointer"
                                @click.stop="clearSearch"
                              />
                            </template>
                          </q-input>
                        </q-item>
                        <q-item
                          v-if="loggedIn"
                          v-close-popup
                          clickable
                          @click="downloadPDF"
                        >
                          <q-item-section avatar>
                            <q-icon
                              name="picture_as_pdf"
                              color="accent"
                              size="sm"
                            />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>Download PDF</q-item-label>
                          </q-item-section>
                        </q-item>
                        <q-item
                          v-close-popup
                          clickable
                          @click="$common.shareLocation(title)"
                        >
                          <q-item-section avatar>
                            <q-icon name="share" color="info" size="sm" />
                          </q-item-section>
                          <q-item-section>
                            <q-item-label>Share link</q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                  <!-- <q-btn
                    color="primary"
                    flat
                    dense
                    no-caps
                    label="Download PDF"
                    @click="downloadPDF"
                  />
                  
                   <q-btn
                    icon="search"
                    :flat="!localFilter"
                    :unelevated="!!localFilter"
                    round
                    dense
                    :color="localFilter ? 'accent' : 'primary'"
                  >
                    <q-menu ref="competitorSearch" @show="setFocus">
                      <q-input
                        ref="competitorSearchInput"
                        v-model="localFilter"
                        dense
                        label-color="white"
                        bg-color="dark"
                        standout="bg-primary"
                        class="text-white"
                        debounce="300"
                        label="Search"
                        @update:model-value="moveMenu"
                      >
                        <template #prepend>
                          <q-icon name="search" />
                        </template>
                        <template #append>
                          <q-icon
                            v-if="localFilter !== ''"
                            name="clear"
                            class="cursor-pointer"
                            @click.stop="clearSearch"
                          />
                        </template>
                      </q-input>
                    </q-menu>
                  </q-btn> -->
                </div>
                <span
                  v-sanitize="computedTitle"
                  :class="$q.screen.lt.md ? 'text-body1 text-bold' : 'text-h6'"
                ></span>
                <div class="col-auto">
                  <q-btn
                    v-close-popup
                    icon="close"
                    color="accent"
                    flat
                    round
                    dense
                  />
                </div>
              </div>
              <!-- <div v-if="showSearch" class="row" style="flex-wrap: nowrap">
                <q-input
                  v-model="localFilter"
                  dense
                  label-color="white"
                  bg-color="dark"
                  standout="bg-secondary"
                  class="text-white"
                  debounce="300"
                  label="Search"
                >
                  <template #prepend>
                    <q-icon name="search" />
                  </template>
                  <template #append>
                    <q-icon
                      v-if="localFilter !== ''"
                      name="clear"
                      class="cursor-pointer"
                      @click.stop="localFilter = ''"
                    />
                  </template>
                </q-input>
              </div> -->
            </template>
            <template #body="props">
              <q-tr :props="props" style="background-color: white">
                <q-td
                  v-for="col in props.cols"
                  :key="col.name"
                  :props="props"
                  auto-width
                >
                  <div v-if="Array.isArray(col.value)">
                    <q-badge
                      v-for="(label, index) in col.value"
                      :key="index"
                      :color="badgeColorsComp(col.colors, label)"
                      :class="badgeTextComp(col.colors, label)"
                      class="q-mr-sm"
                      :outline="label.outline"
                      :style="label.click ? 'cursor: pointer' : ''"
                      @click="showEventDetails(label)"
                    >
                      {{
                        badgeLabelComp(
                          col.labels,
                          label.label ? label.label : label
                        )
                      }}
                      <q-tooltip v-if="label.tooltip">{{
                        label.tooltip
                      }}</q-tooltip>
                    </q-badge>
                  </div>
                  <div v-else-if="col.type == 'btn'">
                    <q-btn
                      v-if="showClaim(props)"
                      dense
                      unelevated
                      color="primary"
                      :label="col.label"
                      padding="none xs"
                      @click="claim(props, col)"
                    ></q-btn>
                    <q-btn
                      v-else-if="showUnClaim(props)"
                      dense
                      unelevated
                      color="accent"
                      label="unclaim"
                      padding="none xs"
                      @click="unclaim(props, col)"
                    ></q-btn>
                    <!-- {{ col.value }} -->
                  </div>
                  <div v-else>
                    {{ col.value }}
                  </div>
                </q-td>
                <q-td v-if="hasMarks" key="recalls" :props="props">
                  {{ props.row.recalls }}
                </q-td>
              </q-tr>
            </template>
            <template #bottom>
              <q-resize-observer @resize="onResizeBottom" />
              <div class="text-left">{{ leftText }}</div>
              <q-space />
              <div class="text-right">{{ computedRightText }}</div>
            </template>
            <!-- <template #bottom>
                  <q-btn
                    color="primary"
                    flat
                    dense
                    no-caps
                    label="Download PDF"
                    @click="downloadPDF"
                  />
              <q-space />
              <div class="text-right">{{ computedRightText }}</div>
            </template> -->
          </q-table>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'CompetitorDialog',
  props: {
    offbeat: { type: Boolean, default: false },
    event: {
      type: Object,
      default() {
        return {}
      },
    },
    showDivisions: { type: Boolean, default: false },
    maximized: { type: Boolean, default: false },
    offset: { type: Number, default: 400 },
    competitors: {
      type: Array,
      default() {
        return []
      },
    },
    marks: {
      type: Object,
      default() {
        return {}
      },
    },
    danceKeys: {
      type: Array,
      default() {
        return []
      },
    },
    leftText: { type: String, default: '' },
    rightText: { type: String, default: '' },
    // recallText: { type: String, default: '' },
    title: { type: String, default: 'Judges' },
    showEvents: { type: Boolean, default: false },
    showRankings: { type: Boolean, default: false },
    teamRankings: { type: Boolean, default: false },
    oldFormat: { type: Boolean, default: false },
    team: { type: Boolean, default: false },
  },
  emits: ['hide', 'ok'],
  data() {
    return {
      showNames: false,
      tableHeaderSize: { height: 600, width: 300 },
      tableFooterSize: { height: 33, width: 300 },
      teamLetters: ['All', 'A', 'B', 'C', 'D', 'E', 'F', 'Amalgamated'],
      teamFilter: 'All',
      eventFilters: ['All', 'Beginners', 'Ex-student'],
      eventFilter: 'All',
      localFilter: '',
      showSearch: false,
      paginationJudges: {
        rowsPerPage: 0,
      },
      coupleHeaders: [
        {
          name: 'number',
          label: 'Number',
          align: 'left',
          field: 'number',
          sortable: true,
        },
        {
          name: 'leader',
          label: 'Leader',
          align: 'left',
          field: 'leader',
          sortable: true,
        },
        {
          name: 'follower',
          label: 'Follower',
          align: 'left',
          field: 'follower',
          sortable: true,
        },
        {
          name: 'events',
          label: 'Events',
          align: 'left',
          field: 'events',
          type: 'multi-badge',
          format: (val) => {
            return val.map((v) => {
              const dances = v.dances
                .map((w) => {
                  return w.abbreviation
                })
                .join('')
              let color = v.isBeginnersOnly ? 'green' : 'black'
              color = v.isExStudentOnly ? 'red' : color
              return {
                label: `${v.title.slice(0, 3)} ${dances}`,
                color,
                outline: true,
                tooltip: `${v.title} (${dances})`,
              }
            })
          },
          sortable: true,
        },
      ],
    }
  },
  computed: {
    competitorHeaders() {
      const toReturn = [
        {
          name: 'number',
          label: 'Number',
          align: 'left',
          field: 'number',
          sortable: true,
        },
        // {
        //   name: 'background',
        //   label: 'Background',
        //   align: 'left',
        //   field: 'background',
        //   sortable: true,
        // },
        {
          name: 'leader',
          label: 'Leader',
          align: 'left',
          field: 'leader',
          sortable: true,
        },
        {
          name: 'leadUser',
          label: 'Lead user',
          align: 'left',
          field: 'leadUser',
          sortable: true,
        },
        {
          name: 'follower',
          label: 'Follower',
          align: 'left',
          field: 'follower',
          sortable: true,
        },
        {
          name: 'followUser',
          label: 'Follow user',
          align: 'left',
          field: 'followUser',
          sortable: true,
        },
        {
          name: 'university',
          label: 'University',
          align: 'left',
          format: (val) => {
            return val?.name
          },
          sort: (a, b) => {
            return a.name.localeCompare(b.name)
          },
          field: 'university',
          sortable: true,
        },
      ]
      if (this.loggedIn) {
        toReturn.unshift({
          name: 'claim',
          label: 'Claim',
          align: 'left',
          type: 'btn',
          field: 'id',
          sortable: true,
        })
      }
      return toReturn
    },
    loggedIn() {
      return this.$store.state.command.loggedIn
    },
    isMaximized() {
      return (
        this.$q.screen.lt.md ||
        (this.showNames && this.isTeam) ||
        this.maximized
      )
    },
    isTeam() {
      return this.team
    },
    teamHeaders() {
      const toReturn = [
        {
          name: 'number',
          label: 'Number',
          align: 'left',
          field: 'number',
          sortable: true,
        },
        {
          name: 'uni',
          label: 'University',
          align: 'left',
          format: (val) => {
            return val?.name
          },
          sort: (a, b) => {
            return a.name.localeCompare(b.name)
          },
          field: 'university',
          sortable: true,
        },
        {
          name: 'letter',
          label: 'Team',
          align: 'left',
          field: 'letter',
          sortable: true,
        },
      ]
      if (this.showNames) {
        const danceOrder =
          this.event?.danceOrder ??
          this.event?.dances.map((o) => {
            return o.id
          })
        console.log('dance order', danceOrder)
        for (const danceId of danceOrder) {
          const label = this.findDanceName(danceId)
          toReturn.push({
            name: `${danceId}-couple`,
            label,
            align: 'left',
            field: 'couples', // `${danceId}-couple`,// 'couples',
            sortable: true,
            format: (val, row) => {
              const competitor = val.find((o) => {
                return o.dance?.id == danceId
              })
              if (competitor) {
                let toReturn = `${competitor.leader} & ${competitor.follower}`
                if (row.university?.id == 99) {
                  toReturn = `${toReturn} (${competitor.university?.name})`
                }
                return toReturn
              }
              return ''
            },
            sublabel: [],
          })
        }
      }

      return toReturn
    },
    innerHeight() {
      return this.$store.state.command.windowHeight
    },
    tableOffset() {
      return this.tableFooterSize.height + this.tableHeaderSize.height
    },
    headerHeight() {
      return this.$store.state.command.headerSize.height
    },
    computedTitle() {
      let toReturn = this.title
      if (this.teamRankings && this.teamFilter !== 'All') {
        toReturn = `${toReturn}: ${this.teamFilter} teams`
      }
      return toReturn
    },
    computedCompetitors() {
      // if (this.team) {

      // }
      if (this.teamRankings && this.teamFilter !== 'All') {
        if (this.teamFilter === 'Amalgamated') {
          return this.competitors.filter((o) => {
            return o.university?.id == 99
          })
        } else {
          // const filter = this.teamFilter === 'Amalgamated' ? '-' : this.teamFilter
          return this.competitors.filter((o) => {
            return o.letter === this.teamFilter
          })
        }
      } else if (this.teamRankings) {
        return this.competitors.filter((o) => {
          if (o.letter.length === 1) {
            return ['A', 'B', 'C', 'D', 'E', 'F', '-'].includes(o.letter)
          }
          return true
        })
      } else if (this.showEvents && this.eventFilter !== 'All') {
        return this.competitors.filter((o) => {
          if (this.eventFilter === 'Beginners') {
            return o.events.find((w) => {
              return w.isBeginnersOnly
            })
          }
          if (this.eventFilter === 'Ex-student') {
            return o.events.find((w) => {
              return w.isExStudentOnly
            })
          }
        })
      } else {
        return this.competitors
      }
    },
    visibleColumns() {
      return this.computedCompetitorHeaders
        .map((o) => {
          return o.name
        })
        .filter((w) => {
          return !['leadUser', 'followUser'].includes(w)
        })
    },
    computedCompetitorHeaders() {
      if (this.offbeat) {
        return [
          {
            name: 'name',
            label: 'Name',
            align: 'left',
            field: 'name',
          },
        ]
      }
      const toReturn = this.team
        ? [...this.teamHeaders]
        : [...this.competitorHeaders]
      if (this.showEvents) {
        toReturn.push({
          name: 'events',
          label: 'Events',
          align: 'left',
          field: 'events',
          type: 'multi-badge',
          format: (val) => {
            return val.map((v) => {
              const dances = v.dances
                .map((w) => {
                  return w.abbreviation
                })
                .join('')
              let color = v.isBeginnersOnly ? 'green' : 'black'
              color = v.isExStudentOnly ? 'red' : color
              let label = v.title
              label = `${label.slice(0, 3)} ${dances}`
              return {
                label,
                color,
                outline: true,
                tooltip: `${v.title} (${dances})`,
                event: v,
              }
            })
          },
          sortable: false,
        })
        // toReturn.push({
        //   name: 'names',
        //   label: 'Names',
        //   align: 'left',
        //   field: 'events',
        //   format: (val) => {
        //     if (val) {
        //       return val
        //         .map((o) => {
        //           return o.title
        //         })
        //         .join(', ')
        //     } else {
        //       return ''
        //     }
        //   },
        //   sortable: true,
        // })
      } else if (this.showRankings && this.team) {
        const toReturn = [
          {
            name: 'rank',
            label: 'Place',
            align: 'left',
            field: 'rank',
            sortable: true,
            sort: this.customSortRank,
          },
          // {
          //   name: 'number',
          //   label: 'Number',
          //   align: 'left',
          //   field: 'number',
          //   sortable: true,
          //   sort: this.customSortRank,
          // },
          ...this.teamHeaders,
          this.showDivisions
            ? {
                name: 'division',
                label: 'Division',
                align: 'left',
                field: 'division',
                sortable: true,
              }
            : {},
          {
            name: 'round',
            label: 'RoundZ',
            align: 'left',
            field: 'round',
            sort: this.$common.roundSort,
            sortable: true,
          },
          {
            name: 'recalls',
            label: 'Marks',
            align: 'left',
            field: 'recalls',
            sortable: true,
          },
        ].filter((o) => {
          return Boolean(o.name)
        })
        if (this.loggedIn) {
          toReturn.unshift({
            name: 'claim',
            label: 'Claim',
            align: 'left',
            type: 'btn',
            field: 'id',
            sortable: true,
          })
        }
        return toReturn
      } else if (this.showRankings) {
        const toReturn = [
          {
            name: 'rank',
            label: 'Place',
            align: 'left',
            field: 'rank',
            sortable: true,
            sort: this.customSortRank,
          },
          {
            name: 'number',
            label: 'Number',
            align: 'left',
            field: 'number',
            sortable: true,
            sort: this.customSortRank,
          },
          {
            name: 'leader',
            label: 'Lead',
            align: 'left',
            field: 'leader',
            sortable: true,
          },
          {
            name: 'follower',
            label: 'Follow',
            align: 'left',
            field: 'follower',
            sortable: true,
          },
          {
            name: 'university',
            label: 'University',
            align: 'left',
            field: 'university',
            format: (val) => {
              return val?.name
            },
            sort: (a, b) => {
              return a.name.localeCompare(b.name)
            },
            sortable: true,
          },
          {
            name: 'round',
            label: 'RoundX',
            align: 'left',
            field: 'round',
            sort: this.$common.roundSort,
            sortable: true,
          },
          {
            name: 'recalls',
            label: 'Marks',
            align: 'left',
            field: 'recalls',
            sortable: true,
          },
        ]
        if (this.loggedIn) {
          toReturn.unshift({
            name: 'claim',
            label: 'Claim',
            align: 'left',
            type: 'btn',
            field: 'id',
            sortable: true,
          })
        }
        return toReturn
      } else if (this.teamRankings && this.oldFormat) {
        return [
          {
            name: 'place',
            label: 'Place',
            align: 'left',
            field: 'place',
            format: (val) => {
              return this.$common.ordinal_suffix_of(val)
            },
            sortable: true,
            sort: this.customSortRank,
          },
          {
            name: 'number',
            label: 'Number',
            align: 'left',
            field: 'number',
            sortable: true,
            sort: this.customSortRank,
          },
          {
            name: 'uni',
            label: 'University',
            align: 'left',
            field: 'uni',
            sortable: true,
          },
          {
            name: 'letter',
            label: 'Team',
            align: 'left',
            field: 'letter',
            sortable: true,
          },
          {
            name: 'W',
            label: 'Waltz',
            align: 'left',
            field: 'W',
            sortable: true,
            sort: (a, b) => {
              return parseInt(a) - parseInt(b)
            },
          },
          {
            name: 'C',
            label: 'Cha',
            align: 'left',
            field: 'C',
            sortable: true,
            sort: (a, b) => {
              return parseInt(a) - parseInt(b)
            },
          },
          {
            name: 'Q',
            label: 'Quickstep',
            align: 'left',
            field: 'Q',
            sortable: true,
            sort: (a, b) => {
              return parseInt(a) - parseInt(b)
            },
          },
          {
            name: 'J',
            label: 'Jive',
            align: 'left',
            field: 'J',
            sortable: true,
            sort: (a, b) => {
              return parseInt(a) - parseInt(b)
            },
          },
          // {
          //   name: 'div',
          //   label: 'Div',
          //   align: 'left',
          //   field: 'div',
          //   sortable: true,
          // },
          // {
          //   name: 'round',
          //   label: 'Round',
          //   align: 'left',
          //   field: 'round',
          //   sortable: true,
          // },
          {
            name: 'marks',
            label: 'Marks',
            align: 'left',
            field: 'marks',
            sortable: true,
            sortOrder: 'da',
            sort: (a, b) => {
              return parseInt(a) - parseInt(b)
            },
          },
        ]
      } else if (this.teamRankings) {
        return [
          {
            name: 'place',
            label: 'Place',
            align: 'left',
            field: 'place',
            sortable: true,
            sort: this.customSortRank,
          },
          {
            name: 'number',
            label: 'Number',
            align: 'left',
            field: 'number',
            sortable: true,
            sort: this.customSortRank,
          },
          {
            name: 'uni',
            label: 'University',
            align: 'left',
            field: 'uni',
            sortable: true,
          },
          {
            name: 'letter',
            label: 'Team',
            align: 'left',
            field: 'letter',
            sortable: true,
          },
          {
            name: 'div',
            label: 'Div',
            align: 'left',
            field: 'div',
            sortable: true,
          },
          {
            name: 'round',
            label: 'RoundY',
            align: 'left',
            field: 'round',
            sort: this.$common.roundSort,
            sortable: true,
          },
          {
            name: 'marks',
            label: 'Marks',
            align: 'left',
            field: 'marks',
            sortable: true,
          },
        ]
      } else {
        toReturn.push({
          name: 'marks',
          label: 'Recalls',
          format: (val) => {
            return val?.total
          },
          sortOrder: 'da',
          sort: (a, b) => {
            if ('total' in a && 'total' in b) {
              return a.total - b.total
            } else {
              return -1
            }
          },
          align: 'left',
          field: 'marks',
          sortable: true,
        })
      }
      return toReturn
    },
    computedRightText() {
      if (this.localFilter || this.teamFilter !== 'All') {
        const filteredSortedRows = this.$refs.competitorTable.filteredSortedRows
        return `${filteredSortedRows.length} of ${this.rightText}`
      } else {
        return this.rightText
      }
    },
    hasMarks() {
      return 'total' in this.marks
    },
    computedAdjudicators() {
      this.adjudicators.forEach((adj) => {
        if (this.hasMarks) {
          adj.color = 'backgroundColor: lightgrey;'
          adj.recalls = this.recallsForAdj(adj)
          adj.marks = this.marksForAdj(adj)
        } else {
          adj.color = 'backgroundColor: white;'
        }
      })
      return this.adjudicators
    },
    recallText() {
      if (this.hasMarks) {
        return `${this.marks.total} recalls`
      } else {
        return ''
      }
    },
    user() {
      return this.$store.state.command.userDetails
    },
    userAffiliationIds() {
      return this.user.affiliations.map((o) => {
        return o.universityId
      })
    },
  },
  methods: {
    showClaim(props) {
      const { leadUser, followUser } = props.row
      const ids = []
      if (leadUser?.id) {
        ids.push(leadUser.id)
      }
      if (followUser?.id) {
        ids.push(followUser.id)
      }
      const uniTest =
        this.userAffiliationIds.includes(props.row.university?.id) ||
        props.row.university?.id == 99
      let hasUnclaimed = false
      if (this.team) {
        hasUnclaimed = props.row.couples.length < 4
      } else {
        hasUnclaimed = !props.row.leadUser || !props.row.followUser
      }
      const alreadyClaimed = ids.includes(this.user.id)
      return uniTest && hasUnclaimed && !alreadyClaimed
    },
    showUnClaim(props) {
      const { leadUser, followUser } = props.row
      const ids = []
      if (leadUser?.id) {
        ids.push(leadUser.id)
      }
      if (followUser?.id) {
        ids.push(followUser.id)
      }
      return ids.includes(this.user.id) && !this.team
    },
    unclaim(arg) {
      const { leader, follower, number } = arg.row
      const competitor = `${number}: ${leader} & ${follower}`
      console.log(competitor)
      this.$q
        .dialog({
          dark: true,
          title: 'Rescind claim',
          class: 'bg-primary text-white',
          cancel: true,
          focus: 'cancel',
          message: `Are you sure you wish to rescind your claim on the results for ${competitor} as your own?`,
        })
        .onOk(() => {
          this.$axios
            .post('/competitor/unclaim', {
              competitorId: arg.row.id,
            })
            .then(() => {
              this.$common.popup({
                title: 'Results claim rescinded',
                message: `You have rescinded your claim over the results for ${competitor}`,
              })
              this.$emit('ok')
              this.hide()
            })
            .catch(this.$common.axiosError)
        })
    },
    claim(arg) {
      console.log(arg)
      let extraMessage = 'Are you the leader or follower?'
      let title = 'Lead or Follow'
      let competitor = ''
      let items = []
      let model = null
      if (this.team) {
        const { couples, number, university, letter } = arg.row
        const claimedDanceIds = couples.map((couple) => {
          return couple.dance.id
        })
        competitor = `${number}: ${university.name} ${letter}`
        extraMessage = 'Which dance were you on?'
        title = 'Select dance'
        console.log(couples, this.event.dances)
        items = this.event.dances
          .filter((o) => {
            return !claimedDanceIds.includes(o.id)
          })
          .map((w) => {
            return { label: w.name, value: w.id }
          })
      } else {
        const { leadUser, followUser, leader, follower, number } = arg.row
        competitor = `${number}: ${leader} & ${follower}`
        const me = `${this.user.firstName} ${this.user.lastName}`
        if (!leadUser) {
          items.push({ label: 'Leader', value: 'lead' })
          if (leader == me) {
            model = 'lead'
          }
        }
        if (!followUser) {
          items.push({ label: 'Follower', value: 'follow' })
          if (follower == me) {
            model = 'follow'
          }
        }
      }
      this.$q
        .dialog({
          dark: true,
          title,
          class: 'bg-primary text-white',
          options: {
            type: 'radio',
            model,
            items,
          },
          html: true,
          cancel: true,
          message: `Are you sure you wish to claim the results for ${competitor} as your own? ${extraMessage}`,
        })
        .onOk((val) => {
          if (this.team) {
            this.claimSelectCompetitor(
              {
                teamId: arg.row.id,
                danceId: val,
              },
              competitor
            )
          } else {
            this.$axios
              .post('/competitor/claim', {
                competitorId: arg.row.id,
                role: val,
              })
              .then(() => {
                this.$common.popup({
                  title: 'Results claimed',
                  message: `You have claimed the results for ${competitor}`,
                })
                this.$emit('ok')
                this.hide()
              })
              .catch(this.$common.axiosError)
          }
        })
    },
    claimSelectCompetitor(toPost, competitor) {
      console.log(this.event)
      this.$axios
        .post('/my/competitors', { eventId: this.event.id })
        .then(({ data }) => {
          this.$q
            .dialog({
              component: this.$customDialog.Table,
              componentProps: {
                headers: this.coupleHeaders,
                data,
                title: 'Please select your team partnership',
                tableTitle: 'Couples',
                selection: 'single',
                rowKey: 'id',
                cancel: {
                  label: 'Cancel',
                  color: 'negative',
                },
                ok: { label: 'Claim' },
                persistent: true,
              },
            })
            .onOk((data) => {
              if (data.length === 0) {
                this.$common.popup({
                  title: 'No couple selected',
                  message:
                    'No couple has been selected, and these results therefore remain unclaimed.',
                })
              } else {
                toPost.competitorId = data[0].id
                this.$axios
                  .post('/competitor/team/claim', toPost)
                  .then(() => {
                    this.$common.popup({
                      title: 'Results claimed',
                      message: `You have claimed the results for ${competitor}`,
                    })
                    this.$emit('ok')
                    this.hide()
                  })
                  .catch(this.$common.axiosError)
              }
              console.log(data, toPost)
            })
        })
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
      for (const header of this.computedCompetitorHeaders) {
        headers.push(`<th>${header.label}</th>`)
        cellKeys.push(header.field)
        formatter[header.field] = header.format
      }
      headers = headers.join('')
      console.log('headers', headers)
      // this.tableDataCopy
      const body = this.$refs.competitorTable.filteredSortedRows
        .map((row) => {
          return `<tr>${cellKeys
            .map((key) => {
              let toReturn = ''
              if (formatter[key]) {
                toReturn = formatter?.[key]?.(row?.[key], row)
              } else {
                toReturn = row?.[key] ?? ''
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
      const htmlContent = `<h1>${this.title}</h1><table><tr>${headers}</tr>${body}</table>`
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
        pdfTitle: `${this.title}.pdf`,
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
    findDanceName(id) {
      const findDance = this.event?.dances.find((dance) => {
        console.log(dance)
        return dance.id == id
      })
      return findDance ? findDance.name : id
      // for (let j = 0; j < this.danceNames.length; j++) {
      //   if (this.danceNames[j].abbreviation === char) {
      //     return this.danceNames[j].name
      //   }
      // }
    },
    showEventDetails(event) {
      console.log(event)
      const dances = event.event.dances
        .map((o) => {
          return o.name
        })
        .join(', ')
      let message = `${event.event.title} with dance${
        dances.length > 1 ? 's' : ''
      } ${dances}`
      let bgClass = 'bg-dark text-dark-inv'
      if (event.event.isBeginnersOnly) {
        bgClass = 'bg-positive text-positive-inv'
        message = `${message}<br/> This is a beginners only event.`
      }
      if (event.event.isExStudentOnly) {
        bgClass = 'bg-negative text-negative-inv'
        message = `${message}<br/> This is an ex-student only event.`
      }
      this.$q.dialog({
        dark: true,
        html: true,
        title: event.label,
        message,
        class: bgClass,
      })
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
    onResizeTop(size) {
      this.tableHeaderSize = size
    },
    onResizeBottom(size) {
      this.tableFooterSize = size
    },
    setFocus() {
      // this.$nextTick(() => {
      //   console.log('setting focus', this.$refs)
      this.$refs.competitorSearchInput.focus()
      // })
    },
    customSortRank(a, b) {
      // const x = descending ? b : a
      // const y = descending ? a : b
      return parseInt(a, 10) - parseInt(b, 10)
    },
    clearSearch() {
      this.localFilter = ''
      // this.$nextTick(() => {
      this.$refs.competitorSearch.hide()
      // })
    },
    moveMenu() {
      this.$nextTick(() => {
        this.$refs.competitorSearch.updatePosition()
      })
    },
    marksForAdj(adj) {
      const toReturn = {}
      this.danceKeys.forEach((dance) => {
        if (this.marks[dance][adj.letter] === 'X') {
          toReturn[dance] = dance
        } else {
          toReturn[dance] = 'O'
        }
      })
      return toReturn
    },
    recallsForAdj(adj) {
      let toReturn = 0
      const dances = this.filterTotal(this.marks)
      dances.forEach((dance) => {
        if (this.marks[dance][adj.letter] === 'X') {
          toReturn++
        }
      })
      console.log(toReturn)
      return toReturn
    },
    filterTotal(row) {
      return Object.keys(row)
        .filter((o) => {
          return o !== 'total'
        })
        .sort()
    },
    show() {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.$refs.dialog.show()
    },
    hide() {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      this.$refs.dialog.hide()
    },
    onDialogHide() {
      this.$emit('hide')
    },
    onOKClick() {
      this.$emit('ok')
      this.hide()
    },
    onCancelClick() {
      this.hide()
    },
  },
})
</script>

<style lang="sass" scoped>
.row
  flex-wrap: nowrap
.my-sticky-virtscroll-table-judges
  /* max height is important */
  .q-table__middle
    max-height: 300px
  background-color: lightyellow
  .q-table__top
    flex-wrap: nowrap
  .q-table__middle
  tr th
    position: sticky
    /* higher than z-index for td below */
    z-index: 2
    /* bg color is important; just specify one */
    background: #fff
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: lightyellow
    flex-wrap: nowrap
  thead tr th
    position: sticky
    z-index: 1
  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
  thead tr:first-child th
    top: 0
.my-sticky-virtscroll-table-finals
  /* max height is important */
  .q-table__middle
    max-height: 300px
  tr th
    position: sticky
    /* higher than z-index for td below */
    z-index: 2
    /* bg color is important; just specify one */
    background: #fff
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: lightyellow
  thead tr th
    position: sticky
    z-index: 1
  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
  thead tr:first-child th
    top: 0
.my-sticky-header-column-table
  /* specifying max-width so the example can
    highlight the sticky column on any browser window */
  max-width: 2000px

  /* max height is important */
  .q-table__middle
    max-height: 600px

  td:first-child
    /* bg color is important for td; just specify one */

  tr th
    position: sticky
    /* higher than z-index for td below */
    z-index: 2
    /* bg color is important; just specify one */
    background: #fff

  /* this will be the loading indicator */
  thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
    /* highest z-index */
    z-index: 3
  thead tr:first-child th
    top: 0
    z-index: 1
  tr:first-child th:first-child
    /* highest z-index */
    z-index: 3

  td:first-child
    z-index: 1

  td:first-child, th:first-child
    position: sticky
    left: 0
  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th /* bg color is important for th; just specify one */
    background-color: lightyellow
</style>
