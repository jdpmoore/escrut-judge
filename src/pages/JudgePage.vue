<template>
  <q-page class="bg-dark row justify-center items-center">
    <q-card
      v-touch-swipe.horizontal="handleSwipe"
      inline
      flat
      class="full-width full-height bg-dark q-pa-none"
    >
      <q-card-section
        horizontal
        class="bg-primary text-white text-center q-pa-sm q-mb-none"
      >
        <div class="row full-width items-center no-wrap">
          <!-- <div class="col-auto">
            <q-btn
              round
              dense
              color="accent"
              icon="keyboard_arrow_left"
              :disable="timetableOrders.indexOf(timetableOrder) === 0"
              @click="eventChange(-1)"
              ><q-tooltip> Previous event </q-tooltip></q-btn
            >
          </div> -->
          <div class="col">
            <div class="text-h6 text-bold">
              {{ roundText }}
              <q-btn
                color="warning"
                flat
                dense
                icon="help"
                @click="getDetails"
              />
            </div>
            <!-- <div>
              {{ dance?.name }}
            </div> -->
          </div>
          <!-- :disable="timetableOrder === lastDisplay" -->
          <!-- <div class="col-auto">
            <q-btn
              round
              dense
              color="accent"
              icon="keyboard_arrow_right"
              :disable="
                timetableOrders.indexOf(timetableOrder) ===
                  timetableOrders.length - 1 || endOfDays
              "
              @click="eventChange(1)"
              ><q-tooltip> Next event </q-tooltip></q-btn
            >
          </div> -->
        </div>
      </q-card-section>
      <q-separator inset />
      <q-card-section v-if="!isHandwriting" class="bg-white">
        <!-- <q-page-sticky position="top-left" :offset="[18, 18]">
      <q-fab
        v-model="fab2"
        label="Actions"
        vertical-actions-align="left"
        color="purple"
        icon="keyboard_arrow_down"
        direction="down"
      >
        <q-fab-action color="primary" @click="onClick" icon="mail" label="Email" />
        <q-fab-action color="secondary" @click="onClick" icon="alarm" label="Alarm" />
        <q-fab-action color="orange" @click="onClick" icon="airplay" label="Airplay" />
        <q-fab-action color="accent" @click="onClick" icon="room" label="Map" />
      </q-fab>
      </q-page-sticky> -->
        <div class="row">
          <div style="width: 100%">
            <!-- <q-btn
              color="accent"
              square
              no-caps
              :label="$q.screen.lt.md ? '' : 'Menu'"
              icon="settings"
              class="topLeft"
            >
              <q-menu>
                <q-list
                  square
                  style="min-width: 100px"
                  class="bg-dark text-primary-inv"
                >
                  <q-item v-if="!isNonCompereEvent" v-close-popup>
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
                    v-if="showEditHeats"
                    v-close-popup
                    clickable
                    @click="editHeats"
                  >
                    <q-item-section avatar>
                      <q-icon name="edit" color="info" size="sm" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Edit number of heats</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    v-if="!isNonCompereEvent && isCurrentEvent"
                    v-close-popup
                    clickable
                    @click="restartRound"
                  >
                    <q-item-section avatar>
                      <q-icon name="restart_alt" color="warning" size="sm" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Restart round</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    v-if="isCurrentEvent"
                    v-close-popup
                    clickable
                    @click="skipRound"
                  >
                    <q-item-section avatar>
                      <q-icon name="skip_next" color="negative" size="sm" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Skip round</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn> -->
            <div v-if="isResults" class="text-center" style="font-size: 175%">
              <!-- <div class="row flex-center">
                Now we announce the results of
              </div> -->
              <div style="font-size: 125%">
                {{ roundText }}
              </div>
              <!-- <div class="text-primary">Next: {{ nextRoundTextResults }}</div> -->
              <div class="text-primary">Next: {{ nextRound.title }}</div>
            </div>
            <div
              v-else-if="isNonCompereEvent"
              class="text-center"
              style="font-size: 175%"
            >
              <div v-if="!endOfDays" class="row flex-center">
                {{ isCurrentEvent ? 'The current' : 'This' }} event is
              </div>
              <div style="font-size: 125%">
                {{ roundText }}
              </div>
            </div>
            <div v-else class="text-center" style="font-size: 175%">
              <div v-if="!isFinal" style="font-size: 125%">
                {{ competitors.flat().length }} competitors,
                <!-- <q-toggle
                  v-model="showNames"
                  label="Details"
                  checked-icon="check"
                  color="positive"
                  style="font-size: 50%"
                  unchecked-icon="clear"
                /> -->
                <!-- <br /> -->
                recall {{ currentRound?.round?.recall }} from
                {{
                  currentRound?.round?.heats > 1
                    ? `${currentRound?.round?.heats} heats`
                    : '1 heat'
                }}
                <!-- <q-btn
                  v-if="
                    (heat === 1 && activeHeat === 1) ||
                    (!isCurrentEvent && !isCompleted)
                  "
                  color="primary"
                  flat
                  label="(Edit)"
                  @click="editHeats"
                /> -->
              </div>
              <div v-if="isOffbeat" style="font-size: 125%">
                {{ computedNumCouples }} teams
                <!-- <q-btn
                  color="accent"
                  flat
                  label="(Restart)"
                  @click="restartRound"
                /> -->
              </div>
              <div v-else-if="isFinal" style="font-size: 125%">
                Placing {{ computedNumCouples }}
                {{ isTeam ? 'teams' : 'couples' }} in {{ dance?.name
                }}<span v-if="isOxbridgeVarsity"
                  >, round {{ heat }} of 9<br />{{ varsityPairs }}</span
                >
                <!-- <q-btn
                  color="accent"
                  flat
                  label="(Restart)"
                  @click="restartRound"
                /> -->
              </div>
              <div v-else style="font-size: 125%">
                Heat {{ heat }}, {{ dance?.name }}: {{ computedNumCouples }}
                {{ isTeam ? 'teams' : 'couples' }}
                <!-- <q-btn
                  color="accent"
                  flat
                  label="(Restart)"
                  @click="restartRound"
                /> -->
              </div>
              <!-- <div class="text-primary">Next: {{ nextRound.title }}</div> -->
              <span style="font-size: 225%; font-weight: bold">{{
                marked?.size ?? 0
              }}</span>
              <span style="font-size: 120%"
                >/ {{ currentRound.round.recall }}</span
              >
            </div>
            <q-card-section
              horizontal
              class="text-center q-pa-sm q-mb-none q-mt-md"
            >
              <!-- <div class="row flex-center full-width">
                <q-btn
                  v-if="isCurrentEvent && heat === activeHeat"
                  class="full-width"
                  :class="computedAnnounceClass"
                  icon="announcement"
                  :label="`${announceRestart}${
                    announceRestart === 'Activate display'
                      ? ' and introduce'
                      : ''
                  }`"
                  style="font-size: 150%"
                  :disable="heat !== activeHeat"
                  @click="announce"
                />
                <q-btn
                  v-if="endOfDays"
                  class="full-width"
                  :class="
                    active
                      ? 'bg-primary text-primary-inv'
                      : 'bg-warning text-warning-inv guide'
                  "
                  icon="announcement"
                  :label="announceRestart"
                  style="font-size: 150%"
                  @click="announceEndOfDays"
                />
              </div> -->
            </q-card-section>
            <!-- <AnnounceResults
              v-if="isResults"
              :active="!booleanVarSub"
              :results-trigger="resultsTrigger"
              :results="results"
              @allAnnounced="allAnnounced = true"
            /> -->
            <div class="row flex-center">
              <div
                v-for="(competitor, index) in competitors[heat - 1]"
                :key="index"
                :class="competitorClass(competitor.number)"
                @click="markCompetitor(competitor)"
              >
                <div v-if="isOffbeat" class="q-ma-xs">
                  <div
                    style="font-size: 220%"
                    :class="competitorClassDetails(competitor.number)"
                  >
                    {{ competitor.university?.name }}
                  </div>
                  <div style="font-size: 180%">
                    {{ competitor.title }}
                  </div>
                </div>
                <div v-else-if="showNames" class="q-ma-xs">
                  <div
                    class="text-left text-caption float-left text-bold"
                    style="font-size: 120%"
                    :class="competitorClassDetails(competitor.number)"
                  >
                    {{ competitor.number }}
                  </div>
                  <span v-if="isTeam" style="font-size: 120%">
                    {{ competitor.university?.name }}
                    {{
                      competitor.university?.id != 99
                        ? competitor.letter
                        : competitor.description
                    }}
                  </span>
                  <span v-else>
                    {{ competitor.leader }} and {{ competitor.follower }} ({{
                      competitor.university?.name
                    }})
                  </span>
                </div>
                <div v-else class="text-center" style="font-size: 225%">
                  {{ competitor.number }}
                </div>
              </div>
              <div
                v-if="isFirstRound"
                class="text-center competitor-add bg-info text-info-inv"
                @click="addNumber"
              >
                Add
              </div>
            </div>
            <q-card-section
              horizontal
              class="text-center q-pa-sm q-mb-none q-mt-md"
            >
              <div class="row full-width items-center no-wrap">
                <div class="col-auto">
                  <q-btn
                    round
                    color="primary"
                    icon="keyboard_arrow_left"
                    :disable="heat === 1 || isNonCompereEvent || endOfDays"
                    @click="pageChange(-1)"
                    ><q-tooltip> Previous heat </q-tooltip></q-btn
                  >
                </div>
                <div class="col q-mx-xl">
                  <q-btn
                    v-if="
                      isCurrentEvent &&
                      !isNonCompereEvent &&
                      heat === competitors.length
                    "
                    class="full-width bg-positive"
                    icon="done"
                    label="Submit marks"
                    style="font-size: 150%"
                    @click="submitMarks"
                  />
                  <q-btn
                    v-if="
                      isCurrentEvent &&
                      !isNonCompereEvent &&
                      heat < competitors.length
                    "
                    class="full-width bg-warning"
                    icon="keyboard_arrow_right"
                    label="Next heat"
                    style="font-size: 150%"
                    @click="heat++"
                  />
                  <!-- :disable="booleanVarSub" -->
                  <q-btn
                    v-else-if="isCurrentEvent && isNonCompereEvent"
                    class="full-width bg-primary text-warning-inv"
                    icon="done"
                    label="Goto next event"
                    style="font-size: 150%"
                    :class="allAnnounced || active ? 'guide bg-warning' : ''"
                    :disable="booleanVarSub"
                    @click="gotoNext"
                  />
                  <q-btn
                    v-else-if="!endOfDays && !isCurrentEvent"
                    class="full-width bg-info text-info-inv guide"
                    icon="keyboard_return"
                    label="Goto current event"
                    style="font-size: 150%"
                    @click="timetableOrder = current.timetableOrder"
                  />
                </div>
                <div class="col-auto">
                  <q-btn
                    round
                    color="primary"
                    icon="keyboard_arrow_right"
                    :disable="
                      heat === competitors.length ||
                      isNonCompereEvent ||
                      endOfDays
                    "
                    @click="pageChange(1)"
                    ><q-tooltip> Next heat </q-tooltip></q-btn
                  >
                </div>
              </div>
              <!-- <q-btn
          color="accent"
          flat
          label="(Restart)"
          class="absolute"
          style="top: 12px; right: 12px"
          @click="restartRound"
        /> -->
            </q-card-section>
          </div>
        </div>
      </q-card-section>
      <q-card-section v-else class="bg-white q-pa-none">
        <JudgePad :trigger="handwritingTrigger" @submit="submitMarks" />
      </q-card-section>
      <q-card-section
        v-if="isHandwriting"
        horizontal
        class="bg-primary text-white text-center q-pa-sm q-mb-none"
      >
        <div class="row full-width items-center no-wrap">
          <!-- <div class="col-auto">
            <q-btn
              round
              color="primary"
              icon="keyboard_arrow_left"
              :disable="heat === 1 || isNonCompereEvent || endOfDays"
              @click="pageChange(-1)"
              ><q-tooltip> Previous heat </q-tooltip></q-btn
            >
          </div> -->
          <div class="col q-mx-xl">
            <q-btn
              v-if="isCurrentEvent"
              class="full-width bg-positive"
              icon="done"
              label="Submit marks"
              style="font-size: 150%"
              @click="startHandwritingSubmit"
            />

            <!-- :disable="booleanVarSub" -->
            <q-btn
              v-else-if="!endOfDays && !isCurrentEvent"
              class="full-width bg-info text-info-inv guide"
              icon="keyboard_return"
              label="Goto current event"
              style="font-size: 150%"
              @click="timetableOrder = current.timetableOrder"
            />
          </div>
          <!-- <div class="col-auto">
            <q-btn
              round
              color="primary"
              icon="keyboard_arrow_right"
              :disable="
                heat === competitors.length || isNonCompereEvent || endOfDays
              "
              @click="pageChange(1)"
              ><q-tooltip> Next heat </q-tooltip></q-btn
            >
          </div> -->
        </div>
      </q-card-section>
      <q-inner-loading :showing="loadingState">
        <q-spinner color="primary" size="50px" />
      </q-inner-loading>
    </q-card>
  </q-page>
</template>

<script>
import JudgePad from 'components/JudgePad.vue'
// import AnnounceResults from 'components/AnnounceResults.vue'
// import { transmitR, stateGet } from './eScruit.js'
// import { date } from 'quasar'
// import Pusher from 'pusher-js'
// var Pusher = require('pusher')
// import './touch-style.styl'
// import Echo from 'laravel-echo'
//  var pusher = new Pusher('acb1ea25663537cf155b', {
//  cluster: 'eu',
//  forceTLS: true
//  // authEndpoint: '/pusher_auth.php'
//  })
// var channel = pusher.subscribe('my-channel')
// var pusher = new Pusher('acb1ea25663537cf155b')
// var channel = pusher.subscribe('private-channel')

// import { date } from 'quasar'
export default {
  components: {
    JudgePad,
    // AnnounceResults,
  },
  data() {
    return {
      handwritingTrigger: false,
      allAnnounced: false,
      resultsTrigger: false,
      showNames: false,
      loadingState: false,
      // roundIdtoRound: this.$store.getters['command/roundIdtoRound'],
      roundById: this.$store.state.command.scrutineering.roundById,
      active: true,
      announceRestart: 'Activate display',
      subYes: 'bg-primary text-primary-inv',
      submitButtonText: 'Start Heat',
      announced: new Set(),
      marked: new Set(),
      considering: new Set(),
      additionalNumbers: {},
      tempHeat: 1,
      // liveJudges: [],
      // competitorsTeam: [],
      // lastDisplay: 200,
      // tablets: true,
      //
      // compereState: [],
      // roundExceptions: [],
      // floors: {},
      // floorsNo: 1,
      // submittedJudges: [],

      //
      // currentRoundText: '',
      // activeJudges: {},
      // chatMessages: [],
      // competitorNo: [],
      // heatText: '',
      // compId: 0,
      // floorId: 0,
      // numCompetitors: 0,
      // toRecall: 0,
      // numRecalling: 0,

      // floorIndex: 0,
      // numFloors: 0,
      // numDances: 0,
      // danceNo: 0,
      // oldRoundId: 0,
      // completedRoundIds: [],

      //
      // danceLetters: [],
      // currentRoundId: [],
      // nextRoundId: [],
      // activeEvents: [],
      // nextEvents: [],
      // currentEventId: [],
      // nextEventId: [],
      // authToken: '',
      //
      // judgeExceptions: [],
      // numHeats: 0,
      // info: null,

      // activeEvent: 0,
      // nextUp: 0,
      // judge: {
      //   name: '',
      //   letter: '',
      //   isChair: false,
      //   timetableDisplay: false,
      // },
      // judgeLetters: [],
      // judges: [],
      // events: [],
      // temp: [],
      //
      // allCompetitors: [],
      // cRound: '',
      // nRound: '',
    }
  },
  computed: {
    isHandwriting: {
      get() {
        return this.$store.state.command.handwriting
      },
      set(val) {
        this.$store.commit('command/setHandwriting', val)
      },
    },
    userDetails() {
      return this.$store.state.command.userDetails
    },
    myAdjudicator() {
      return this.currentRound?.round?.adjudicators.find(({ user }) => {
        return user.id === this.userDetails.id
      })
    },
    sortedAdjudicators() {
      return this.$_.sortBy(this.currentRound?.round?.adjudicators, 'letter')
    },
    varsityPairs() {
      const pairs = this.$store.getters['command/varsityPairs'](this.dance)[
        this.heat - 1
      ]
      return `${pairs[0]} vs ${pairs[1]}`
    },
    isOffbeat() {
      return this.currentEvent?.isOffbeat
    },
    isOxbridgeVarsity() {
      return this.currentEvent?.isOxbridgeVarsity
    },
    echoStatus() {
      return this.$store.state.echo.status
    },
    echoRound() {
      return this.$store.state.echo.round
    },
    echoCompetitor() {
      return this.$store.state.echo.competitor
    },
    showEditHeats() {
      // console.log(this.heat, this.activeHeat, this.isCurrentEvent, this.isCompleted, (this.heat === 1 && this.activeHeat === 1), (!this.isCurrentEvent && !this.isCompleted), (this.heat === 1 && this.activeHeat === 1) || (!this.isCurrentEvent && !this.isCompleted))
      let toReturn =
        (this.heat === 1 && this.activeHeat === 1) ||
        (!this.isCurrentEvent && !this.isCompleted)
      // console.log(toReturn, this.isNonCompereEvent)
      toReturn = toReturn && !this.isNonCompereEvent
      return toReturn
    },
    timetableId() {
      return this.$store.state.command.current.id
    },
    currentEvent() {
      if (this.currentRound.round?.id) {
        return this.getEvent(this.currentRound.round.id)
      } else {
        return {}
      }
    },
    isTeam() {
      return this.currentEvent.isTeam
    },
    endOfDays() {
      return !this.timetableOrder
    },
    isNonCompereEvent() {
      return !this.currentTimetableEntry.round
    },
    results() {
      return this.currentTimetableEntry.result
    },
    isResults() {
      return !!this.results
    },
    currentTimetableEntry() {
      return this.$store.getters['command/timetableEntryByTimetableOrder'](
        this.timetableOrder
      )
    },
    isFinal() {
      return this.currentRound?.round?.round === 'F'
      // (
      //   this.roundIdtoRound(this.currentRound.roundId).toLowerCase() === 'final'
      // )
    },
    isCompleted() {
      return this.$store.state.command.compere.completedRounds.has(
        this.currentRound.roundId
      )
    },
    isCurrentEvent() {
      return this.timetableOrder === this.current.timetableOrder
    },
    lastDance() {
      console.log('the last dance', this.currentRound.round.dances, this.dance)
      return (
        this.currentRound.round.dances[
          this.currentRound.round.dances.length - 1
        ] == this.dance.id
      )
      // this.$store.getters['command/lastDance']
    },
    dance() {
      if (this.isCurrentEvent) {
        return this.$store.getters['command/dance']
      } else {
        return this.currentRound.danceOrder ?? this.currentRound.dances
      }
    },
    danceLetterIndex: {
      get() {
        if (this.isCurrentEvent) {
          return this.$store.state.command.compere.danceLetterIndex
        } else {
          return 1
        }
      },
      set(val) {
        if (this.isCurrentEvent) {
          console.log(val)
          this.$store.commit('command/setDanceLetterIndex', val)
        }
      },
    },
    timetableOrder: {
      get() {
        return this.$store.state.command.compere.timetableOrder
      },
      set(val) {
        this.$store.commit('command/setTimetableOrder', val)
      },
    },
    activeHeat: {
      get() {
        if (this.isCurrentEvent) {
          return this.$store.state.command.compere.activeHeat
        } else {
          return -1
        }
      },
      set(val) {
        this.$store.commit('command/setActiveHeat', val)
      },
    },
    heat: {
      get() {
        if (this.isCurrentEvent) {
          return this.$store.state.command.compere.heat
        } else {
          return this.tempHeat
        }
      },
      set(val) {
        if (this.isCurrentEvent) {
          this.$store.commit('command/setHeat', val)
        } else {
          this.tempHeat = val
        }
      },
    },
    computedAnnounceClass() {
      if (this.heat === this.activeHeat) {
        return this.active
          ? 'bg-primary text-primary-inv'
          : 'bg-warning text-warning-inv guide'
      }
      return 'bg-grey text-white'
    },
    competitors() {
      console.log(this.competitorsCurrent)
      console.log(this.timetableOrder, this.current.timetableOrder)
      if (this.timetableOrder === this.current.timetableOrder) {
        return this.competitorsCurrent
      } else {
        return this.competitorsByTimetable
      }
    },
    current() {
      return this.$store.state.command.current
    },
    competitorsByTimetable() {
      const roundId = this.roundIdFromTimetableOrder(this.timetableOrder)
      const toReturn =
        this.$store.getters['command/competitorsByRoundId'](roundId)
      return toReturn
    },
    competitorsCurrent() {
      const roundId = this.current.round?.id
      if (!roundId) {
        return []
      }
      if (this.isOxbridgeVarsity) {
        return this.$store.getters['command/competitorsByRoundId'](
          roundId,
          true,
          this.dance
        )
      }
      let toReturn =
        this.$store.getters['command/competitorsByRoundId'](roundId)
      console.log('to return', toReturn)
      if (this.heat in this.additionalNumbers) {
        toReturn = [...toReturn]
        toReturn[this.heat - 1] = toReturn[this.heat - 1].concat([
          ...this.additionalNumbers[this.heat],
        ])
      } else if (Object.keys(this.additionalNumbers).length > 0) {
        const test = _.values(this.additionalNumbers)
          .map((heatAdditionalNumbers) => {
            return [...heatAdditionalNumbers].map((competitor) => {
              return competitor.number
            })
          })
          .flat()
        toReturn[this.heat - 1] = toReturn[this.heat - 1].filter(
          (competitor) => {
            return !test.includes(competitor.number)
          }
        )
      }
      return toReturn
    },
    floor() {
      return this.$store.state.command.floor
    },
    isQualifierText() {
      if (
        this.currentRound?.round?.isQualifier &&
        this.currentRound.round?.isFirstRound
      ) {
        return ' (qualifier first round)'
      } else if (
        this.currentRound.round?.isRepechage &&
        this.currentRound.round?.isFirstRound
      ) {
        return ' (repechage)'
      }
      return ''
    },
    isFirstRoundSFF() {
      if (
        this.currentRound.round?.isFirstRound &&
        this.currentRound.round?.round != 1 &&
        !this.currentRound.round?.isRepechage
      ) {
        return ' (first round)'
      }
      return ''
    },
    isFirstRound() {
      return this.currentRound?.round?.isFirstRound
    },
    roundText() {
      let toReturn = ''
      if (this.endOfDays) {
        return 'Competition completed!'
      }
      if (this.currentRound) {
        toReturn = `${this.currentRound.title}${this.isFirstRoundSFF}${this.isQualifierText}`
        // if (
        //   this.currentRound.round?.dances &&
        //   this.currentRound.round.dances.length > 1
        // ) {
        //   const danceIds =
        //     this.currentRound.round.danceOrder ?? this.currentRound.round.dances
        //   const danceLetters = danceIds.map((danceId) => {
        //     return this.$store.getters['command/danceById'](danceId)
        //       ?.abbreviation
        //   })
        //   toReturn = `${toReturn} (${danceLetters})`
        // }
        // const nDances = this.currentRound.round.dances.length
        // if (nDances > 1) {
        //   toReturn = `${toReturn} - dance ${
        //     this.danceLetterIndex + 1
        //   }/${nDances}`
        // }
        // if (this.isCurrentEvent && !this.isNonCompereEvent) {
        //   toReturn = `${toReturn}, heat ${this.activeHeat}`
        // }
      }
      return toReturn
    },
    nextRoundTextResults() {
      return this.$store.getters['command/timetableEntryByTimetableOrder'](
        Number(this.timetableOrder) + 1
      )?.title
    },
    computedNumCouples() {
      console.log(this.competitors, this.heat, this.isOffbeat)
      if (this.isOffbeat) {
        return this.competitors.flat().length
      }
      if (this.competitors.length > 0 && this.competitors[this.heat - 1]) {
        return this.competitors[this.heat - 1].length
      } else {
        return ''
      }
    },
    currentfloor() {
      return this.$store.state.command.floor
    },
    currentRound() {
      if (this.isCurrentEvent) {
        return this.$store.state.command.current
      } else {
        return this.$store.getters['command/timetableEntryByTimetableOrder'](
          this.timetableOrder
        )
      }
    },
    nextRound() {
      return this.$store.state.command.next
    },
    subYesBool() {
      return 'guide text-warning-inv bg-warning'
      // let toReturn = 'bg-grey'
      // if (this.submitButtonText === 'Proceed to next event') {
      //   toReturn = this.subYes
      // }
      // if (this.heat === this.activeHeat) {
      //   toReturn = this.subYes
      // }
      // const heatNos = this.competitors[this.heat - 1]
      //   ?.map((o) => {
      //     return o.number
      //   })
      //   .sort()
      // const announcedNos = [...this.announced]
      // const diffNos = this.$_.difference(heatNos, announcedNos)
      // if (diffNos.length === 0 || (this.isFirstRound && this.active)) {
      //   toReturn = `${toReturn} guide text-warning-inv bg-warning`
      // }
      // return toReturn
    },
    booleanVarSub() {
      if (this.submitButtonText === 'Proceed to next event') {
        return false
      }
      if (this.heat === this.activeHeat && this.active) {
        return false
      } else {
        return true
      }
    },
    timetable() {
      return this.$store.getters['command/timetableOrderByFloorId']()
    },
    timetableOrders() {
      return this.timetable.map((o) => {
        return o.timetableOrder
      })
    },
  },
  watch: {
    echoStatus() {
      if (newValue === 'round' && this.currentRound.id === this.echoRound.id) {
        //
      }
    },
    echoCompetitor() {
      console.log(
        'we have received a new competitor on',
        this.echoRound,
        'who is',
        this.echoCompetitor
      )
    },
    currentRound() {
      console.log('current round changed')
      this.marked = new Set()
      this.considering = new Set()
      this.heat = 1
      this.activeHeat = 1
    },
  },
  created() {
    // this.getState()
    this.submitButtonText = 'Start heat'
    if (this.$store.state.command.floor.id === 0) {
      this.$q
        .dialog({
          dark: true,
          title: 'Select floor',
          message: 'Please select the floor:',
          options: {
            type: 'radio',
            model: '',
            items: this.$store.getters['command/floorOptions'],
          },
          class: 'bg-primary',
          persistent: true,
          // cancel: { label: 'Close', outline: true, flat: true, color: 'amber' },
          ok: { label: 'Ok', outline: true, flat: true, color: 'positive' },
        })
        .onOk((floor) => {
          this.$store.commit('command/setFloor', floor)
          this.getCompetitors()
        })
    } else {
      this.getCompetitors()
    }
    // void this.$store.dispatch('command/getFloors')
    // void this.$store.dispatch('command/getJudges')
    // void this.$store.dispatch('command/getCompetitors')
    // void this.$store.dispatch('command/getEvents')
    // void this.$store.dispatch('command/getTimetable')
  },
  methods: {
    getDetails() {
      const message = `${this.competitors.flat().length} competitors, recall ${
        this.currentRound?.round?.recall
      } from
                ${
                  this.currentRound?.round?.heats > 1
                    ? `${this.currentRound?.round?.heats} heats`
                    : '1 heat'
                }`
      this.$common.popup({ title: this.roundText, message })
    },
    startHandwritingSubmit() {
      this.loadingState = true
      this.handwritingTrigger = !this.handwritingTrigger
    },
    // markCompetitor({ number }) {
    //   if (!this.isCurrentEvent || this.heat !== this.activeHeat) {
    //     return
    //   }
    //   const roundId = this.currentRound.round.id
    //   this.checkJudgeSetExists()
    //   // if (this.active && this.heat === this.activeHeat) {
    //   if (this.currentJudgeMarks.has(number)) {
    //     // this.currentJudgeMarks.delete(number)
    //     this.$store.commit('command/judgeHeatTempMark', {
    //       roundId,
    //       judgeHeat: this.judgeHeat,
    //       no: number,
    //       action: 'delete',
    //     })
    //     this.textScrutFilter(number)
    //   } else {
    //     // this.currentJudgeMarks.add(number)
    //     this.$store.commit('command/judgeHeatTempMark', {
    //       roundId,
    //       judgeHeat: this.judgeHeat,
    //       no: number,
    //       action: 'add',
    //     })
    //     this.manualScrutData = `${this.manualScrutData}\n${number}`
    //   }
    //   const tapMarked = [...this.currentJudgeMarks]
    //   this.$store.dispatch('echo/scrutineeringMarks', {
    //     roundId,
    //     judgeHeat: this.judgeHeat,
    //     numbers: tapMarked,
    //   })
    //   // this.$store.dispatch('echo/announceCompetitor', competitor)
    //   // }
    // },
    skipRound() {
      const roundId = this.roundIdFromTimetableOrder(this.timetableOrder)
      this.$q
        .dialog({
          title: this.roundText,
          message: `Are you sure you wish to skip ${this.roundText}?`,
          focus: 'cancel',
          dark: true,
          class: 'bg-dark text-dark-inv',
          cancel: { label: 'Cancel', color: 'positive', flat: true },
          ok: { label: 'Yes', color: 'warning', flat: true },
          focus: 'cancel',
        })
        .onOk(() => {
          this.$axios
            .post(`/round/${roundId}/skip`)
            .then(() => {
              this.gotoNext()
            })
            .catch(this.$common.axiosError)
        })
    },
    getEvent(roundId) {
      const currentEvent = this.$store.state.command.events.find((evt) => {
        const roundIds = evt.rounds.map((round) => {
          return round.id
        })
        return roundIds.includes(roundId)
      })
      return currentEvent
    },
    competitorClass(no) {
      let toReturn = ''
      if (this.marked.has(no)) {
        toReturn = 'bg-positive text-positive-inv'
      } else if (this.considering.has(no)) {
        toReturn = 'bg-warning text-warning-inv'
      }
      // if (
      //   !this.marked.has(no) &&
      //   this.heat === this.activeHeat &&
      //   !this.isCompleted &&
      //   this.active
      // ) {
      //   const heatNos = this.competitors[this.heat - 1]
      //     .map((o) => {
      //       return o.number
      //     })
      //     .sort()
      //   const announcedNos = [...this.announced]
      //   const diffNos = this.$_.difference(heatNos, announcedNos)
      //   const minNo = this.$_.min(diffNos)
      //   if (no == minNo && !this.isFirstRound) {
      //     toReturn = 'guide bg-warning text-warning-inv'
      //   }
      // }
      // if (!this.isCurrentEvent) {
      //   toReturn = ''
      // }
      // if (this.isOffbeat) {
      //   toReturn = `${toReturn} offbeat-names`
      // } else if (this.showNames) {
      //   toReturn = `${toReturn} competitor-names`
      // } else {
      toReturn = `${toReturn} competitor-number`
      // }
      return toReturn
    },
    competitorClassDetails(no) {
      if (!this.isCurrentEvent) {
        return 'text-info'
      }
      let toReturn =
        this.announced.has(no) ||
        this.heat < this.activeHeat ||
        this.isCompleted
          ? 'text-accent'
          : 'text-info'
      return toReturn
    },
    roundIdFromTimetableOrder(timetableOrder) {
      const tOrder =
        this.$store.getters['command/timetableEntryByTimetableOrder'](
          timetableOrder
        )
      console.log('tOrder', tOrder)
      return tOrder.round?.id
      // const { roundId } =
      //   this.$store.getters['command/timetableEntryByTimetableOrder'](
      //     timetableOrder
      //   )
      // return roundId
    },
    updateStateValidated() {
      let toSubmit = { floorId: this.floorId, finishedRoundId: this.roundId }
      this.$axios
        .post(this.comp.id + '/state/update', toSubmit)
        .then(({ data }) => {
          console.log(data)
          this.$q.notify({
            message: this.currentRound[this.floorId] + ' completed!',
            type: 'positive',
            color: 'positive',
            position: 'bottom',
            closeBtn: true,
            timeout: 2000,
          })
          // window.Echo.join('es-comp.' + this.comp.id + '.judges').whisper('trigger', { updateState: 'true' })
          this.$root.$emit('whisper', {
            channel: 'es-comp.' + this.comp.id + '.judges',
            event: 'trigger',
            data: { updateState: 'true' },
          })
          this.submitButtonText = 'Start heat'
          this.activeHeat = 1
          this.active = false
          this.subYes = 'primary'
          this.loadData()
          // console.log(response)
        })
        .catch(function (err) {
          if (err) {
            if (err.response) {
              if (err.response.status === 500) {
                this.$q
                  .dialog({
                    title: 'Confirm',
                    message: 'Error on updating current event?',
                    ok: 'Try again',
                    cancel: 'Cancel',
                    preventClose: true,
                  })
                  .onOk(() => {
                    this.updateState()
                  })
              }
            }
          }
          this.$q.notify({
            color: 'negative',
            position: 'bottom',
            message: 'Error updating state, please reload',
            icon: 'report_problem',
          })
          // console.log(error)
        })
    },
    getState() {
      this.$axios
        .get(this.$store.state.command.competition.id + '/state')
        .then(({ data }) => {
          console.log(data)
          // let temp = response.data
          // this.activeEvents = []
          // this.nextEvents = []
          // for (let i = 0; i < Object.keys(temp.currentEvent).length; i++) {
          //   let currKey = Object.keys(temp.currentEvent)[i]
          //   this.activeEvents.push(temp.currentEvent[currKey].roundId)
          //   this.nextEvents.push(temp.nextEvent[currKey].roundId)
          // }
          // // alert('current events ' + this.activeEvents)
          // alert('next events ' + this.nextEvents)
        })
        .catch((err) => {
          this.$q.notify({
            color: 'negative',
            position: 'bottom',
            message: err.message,
            icon: 'report_problem',
          })
        })
    },
    getCompetitors() {
      if (!this.$store.state.command.current.round) {
        return
      }
      if (this.$store.state.command.current.round.id === 0) {
        this.$store.commit('command/setCurrentNext')
        // this.$store.dispatch('command/getNextCompetitors')
      }
      if (this.$store.state.command.current.round.id === 0) {
        this.$common.popup({
          title: 'No first round',
          message: 'No first round found',
        })
        return
      }
      if (this.competitors.length === 0) {
        this.loadingState = true
      }
      this.$store
        .dispatch(
          'command/getCompetitorsByRoundId',
          this.$store.state.command.current.round.id
        )
        .then((dat) => {
          this.loadingState = false
          console.log(dat)
          if (dat.length === 0) {
            setTimeout(() => {
              this.getCompetitors()
            }, 5000)
          }
        })
        .catch(() => {
          this.loadingState = false
          // setTimeout(() => {
          //   this.getCompetitors()
          // }, 5000)
        })
    },
    announceEndOfDays() {
      this.announceRestart = this.isNonCompereEvent
        ? 'Repeat announcement'
        : 'Restart heat'
      this.$store.dispatch('echo/displayEndOfDays')
      this.active = true
    },
    announce() {
      if (
        ['Repeat announcement', 'Restart heat'].includes(this.announceRestart)
      ) {
        const message = this.isNonCompereEvent
          ? 'Are you sure you wish to repeat this announcement?'
          : 'Are you sure you wish to restart this heat?'
        this.$q
          .dialog({
            title: this.isNonCompereEvent
              ? 'Repeat announcement'
              : 'Restart heat',
            message,
            cancel: true,
            dark: true,
            class: 'bg-primary text-primary-inv',
          })
          .onOk(() => {
            this.concludeAnnounce()
          })
      } else {
        this.concludeAnnounce()
      }
    },
    concludeAnnounce() {
      this.resultsTrigger = !this.resultsTrigger
      this.announced = new Set()
      this.announceRestart = this.isNonCompereEvent
        ? 'Repeat announcement'
        : 'Restart heat'
      this.submitButtonText = 'Start heat'
      this.subYes = 'bg-primary text-primary-inv'
      let toAnnounce = {
        dance: this.dance,
        floor: this.floor,
        round: this.currentRound.round,
        event: this.currentEvent,
        // this.roundIdtoRound(this.currentRound.roundId),
        heat: this.activeHeat,
        current: this.currentRound,
        next: this.nextRound,
      }
      if (this.currentRound.round?.isFirstRound) {
        this.subYes = 'bg-warning text-warning-inv'
        // this.start()
      }
      this.$store.dispatch('echo/announceEvent', toAnnounce)
      this.active = true
    },
    markCompetitor({ number }) {
      console.log(number, this.marked, this.considering)
      if (!this.isCurrentEvent) {
        return
      }
      if (this.marked.has(number)) {
        this.marked.delete(number)
        this.considering.add(number)
      } else if (this.considering.has(number)) {
        this.considering.delete(number)
      } else {
        this.marked.add(number)
      }
      this.whisperMarks()
      this.$store.dispatch('echo/announceCompetitor', competitor)
    },
    whisperMarks() {
      const roundId = this.currentRound.round.id
      const tapMarked = [...this.marked]
      const danceIds =
        this.currentRound.round.danceOrder ?? this.currentRound.round.dances
      const toPost = {
        roundId,
        dance: danceIds[this.danceLetterIndex],
        judge: this.myAdjudicator,
        numbers: tapMarked,
        handwriting: false,
      }
      if (!this.$store.state.command.scrutineering.tempMarks[roundId]) {
        this.$store.commit('command/saveTempMarks', {
          roundId,
          marks: new Map(),
        })
      }
      const savedMarks =
        this.$store.state.command.scrutineering.tempMarks[roundId]
      const judgeHeat = `${toPost.judge.letter}-${toPost.dance}`
      if (!savedMarks.has(judgeHeat)) {
        this.$store.commit('command/newJudgeHeatTempMarks', {
          roundId,
          judgeHeat,
        })
      }
      const toAdd = _.difference(toPost.numbers, [...savedMarks.get(judgeHeat)])
      const toRemove = _.difference(
        [...savedMarks.get(judgeHeat)],
        toPost.numbers
      )
      console.log(tapMarked, toAdd, toRemove)
      for (const no of toAdd) {
        this.$store.commit('command/judgeHeatTempMark', {
          roundId,
          judgeHeat: judgeHeat,
          no,
          action: 'add',
        })
        // this.currentJudgeMarks.add(no)
      }
      for (const no of toRemove) {
        this.$store.commit('command/judgeHeatTempMark', {
          roundId,
          judgeHeat: this.judgeHeat,
          no,
          action: 'delete',
        })
      }
      this.$store.dispatch('echo/judgesMarks', toPost)
    },
    showAdjudicator(adjudicator) {
      this.$common.popup({
        title: `Adjudicator ${adjudicator.letter}`,
        message: `${adjudicator.name}`,
      })
    },
    addNumber() {
      this.$q
        .dialog({
          title: 'Add number',
          message: 'Add additional number to heat.',
          prompt: {
            model: '',
          },
          cancel: true,
          dark: true,
          class: 'bg-primary text-primary-inv',
        })
        .onOk((newNumbers) => {
          newNumbers = newNumbers
            .split(',')
            .map((num) => {
              return parseInt(num, 10)
            })
            .filter(Number)
          if (newNumbers.length === 0) return
          if (!(this.heat in this.additionalNumbers)) {
            this.additionalNumbers[this.heat] = new Set()
          }
          newNumbers.map((num) => {
            this.marked.add(num)
            this.whisperMarks()
            const competitor = this.$store.state.command.competitors.find(
              (competitor) => {
                return competitor.number === num
              }
            )
            if (competitor) {
              this.additionalNumbers[this.heat].add(competitor)
            } else {
              // this.$q.notify({
              //   message: `Number ${num} not found - exception generated`,
              //   type: 'warning',
              //   color: 'warning',
              //   position: 'top',
              //   closeBtn: true,
              //   timeout: 2000,
              // })
              // FIXME: generation EXCEPTION for adding a new competitor - they need a name and follower etc.
              // let toAnnounce = {
              //  type: 'Add competitor', floorId: this.floorId, floor: this.floors[this.floorId].name, roundId: this.roundId, adjudicatorLetters: this.judgeLetters, eventId: this.eventId, danceId: this.cDance, heat: this.heat, eventName: this.currentRound[this.floorId], danceLetter: this.danceLetters[this.floorId][this.cDance].danceLetter, number: data, added: 'Scrutineer', round: this.cRound, id: ('newCompetitor' + data), leader: leader, follower: follower, descriptor: descriptor
              // }
              // if (this.$q.localStorage.has('round-exceptions')) { this.roundExceptions = this.$q.localStorage.getItem('round-exceptions') } else { this.roundExceptions = [] }
              const noCompetitor = {
                id: -1,
                number: num,
                leader: '',
                follower: '',
                descriptor: '',
              }
              this.additionalNumbers[this.heat].add(noCompetitor)
            }
          })
        })
    },
    handleSwipe(info) {
      if (this.isHandwriting) {
        return
      }
      const numHeats = this.currentRound?.round?.heats
      console.log('swipg', info, this.heat, numHeats)
      if (info.direction === 'right' && this.heat > 1) {
        this.heat = this.heat - 1
      }
      if (info.direction === 'left' && this.heat < numHeats) {
        this.heat = this.heat + 1
      }
      // native Javascript event
      // console.log(evt)
    },
    eventChange(direction) {
      // this.loadingState = true
      // this.pingRecallAPI()
      // this.checkRoundExceptions()
      // this.announceRestart = 'Activate display'
      // this.$store.commit('command/getNextEvent')
      if (direction === -1 && this.endOfDays) {
        this.timetableOrder =
          this.timetableOrders[this.timetableOrders.length - 1]
      } else {
        const currentTimetableIndex = this.timetableOrders.indexOf(
          this.timetableOrder
        )
        this.timetableOrder =
          this.timetableOrders[currentTimetableIndex + direction]
      }
      if (this.competitors.length === 0) {
        this.loadingState = true
      }
      const roundId = this.roundIdFromTimetableOrder(this.timetableOrder)
      if (roundId) {
        this.$store
          .dispatch('command/getCompetitorsByRoundId', roundId)
          .then(() => {
            this.loadingState = false
          })
          .catch(() => {
            this.loadingState = false
          })
      } else {
        this.loadingState = false
      }
      // this.submitButtonText = 'Start heat'
      // this.activeHeat = 1
      this.tempHeat = 1
      // this.active = false
    },
    gotoNext() {
      this.submitButtonText = 'Proceed to next event'
      this.allAnnounced = false
      this.start()
    },
    submitHandwritingMarks(jpgDownload) {
      console.log('now we submit the test')
      console.log(jpgDownload)
      const roundId = this.currentRound.round.id
      const danceIds =
        this.currentRound.round.danceOrder ?? this.currentRound.round.dances
      const toPost = {
        roundId,
        dance: danceIds[this.danceLetterIndex],
        judge: this.myAdjudicator,
        image: jpgDownload,
        handwriting: true,
      }
      // if (!this.$store.state.command.scrutineering.tempMarks[roundId]) {
      //   this.$store.commit('command/saveTempMarks', {
      //     roundId,
      //     marks: new Map(),
      //   })
      // }
      // const savedMarks =
      //   this.$store.state.command.scrutineering.tempMarks[roundId]
      // const judgeHeat = `${toPost.judge.letter}-${toPost.dance}`
      // if (!savedMarks.has(judgeHeat)) {
      //   this.$store.commit('command/newJudgeHeatTempMarks', {
      //     roundId,
      //     judgeHeat,
      //   })
      // }
      // const toAdd = _.difference(toPost.numbers, [...savedMarks.get(judgeHeat)])
      // const toRemove = _.difference(
      //   [...savedMarks.get(judgeHeat)],
      //   toPost.numbers
      // )
      // console.log(tapMarked, toAdd, toRemove)
      // for (const no of toAdd) {
      //   this.$store.commit('command/judgeHeatTempMark', {
      //     roundId,
      //     judgeHeat: judgeHeat,
      //     no,
      //     action: 'add',
      //   })
      //   // this.currentJudgeMarks.add(no)
      // }
      // for (const no of toRemove) {
      //   this.$store.commit('command/judgeHeatTempMark', {
      //     roundId,
      //     judgeHeat: this.judgeHeat,
      //     no,
      //     action: 'delete',
      //   })
      // }
      this.$store.dispatch('echo/judgesMarks', toPost)
    },
    submitMarks(jpgDownload) {
      this.loadingState = true
      if (this.isHandwriting) {
        this.submitHandwritingMarks(jpgDownload)
      } else {
        this.whisperMarks()
      }
      this.heat = 1
      this.activeHeat = 1
      this.marked = new Set()
      this.considering = new Set()
      this.$store.dispatch('command/getEvents')
      this.$store.dispatch('command/updateTimetable')
      this.loadingState = false
      console.log('we submit the marks!')
      console.log(this.lastDance, 'is last dance', this.currentRound)
      if (this.lastDance) {
        this.danceLetterIndex = 0
        if (this.currentRound.round) {
          this.$store.commit(
            'command/completedRound',
            this.currentRound.round.id
          )
        }
        console.log('completed timetable event', this.timetableId)
        this.$store.commit('command/completedTimetableEvent', this.timetableId)
        this.$store.commit('command/setCurrentNext')
        this.$store.dispatch('command/getNextCompetitors')
        const currentTimetableIndex = this.timetableOrders.indexOf(
          this.timetableOrder
        )
        this.timetableOrder = this.timetableOrders[currentTimetableIndex + 1]
        this.announced = new Set()
        this.getCompetitors()
      } else {
        this.danceLetterIndex++
      }
    },
    start() {
      // this.pingRecallAPI()
      if (this.submitButtonText === 'Proceed to next event') {
        this.$store.dispatch('command/getEvents')
        this.$store.dispatch('command/updateTimetable')
        this.announceRestart = 'Activate display'
        this.danceLetterIndex = 0
        this.heat = 1
        this.activeHeat = 1
        this.active = false
        if (this.currentRound.round) {
          this.$store.commit(
            'command/completedRound',
            this.currentRound.round.id
          )
        }
        console.log('completed timetable event', this.timetableId)
        this.$store.commit('command/completedTimetableEvent', this.timetableId)
        this.$store.commit('command/setCurrentNext')
        this.$store.dispatch('command/getNextCompetitors')
        this.submitButtonText = 'Start heat'
        this.subYes = 'bg-primary text-primary-inv'
        // this.subYes = 'bg-warning text-warning-inv'
        // this.timetableOrder++
        const currentTimetableIndex = this.timetableOrders.indexOf(
          this.timetableOrder
        )
        this.timetableOrder = this.timetableOrders[currentTimetableIndex + 1]
        this.announced = new Set()
        // this.subYes = 'bg-warning text-warning-inv'
        this.getCompetitors()
      } else if (this.submitButtonText === 'Proceed to next dance') {
        this.submitButtonText = 'Start Heat'
        this.announceRestart = 'Activate display'
        this.subYes = 'bg-primary text-primary-inv'
        this.danceLetterIndex++
        this.heat = 1
        this.activeHeat = 1
        this.active = false
        this.announced = new Set()
      } else {
        this.competitors[this.heat - 1]?.map((competitor) => {
          this.announced.add(competitor.number)
        })
        let toAnnounce = {
          dance: this.dance,
          floor: this.floor,
          round: this.currentRound.round,
          event: this.currentEvent,
          // this.roundIdtoRound(this.currentRound.roundId),
          heat: this.activeHeat,
          current: this.currentRound,
          next: this.nextRound,
          competitors: this.competitors[this.heat - 1],
        }
        this.$store.dispatch('echo/startHeat', toAnnounce)
        if (this.heat < this.currentRound.round.heats) {
          // this.subYes = 'bg-positive text-positive-inv'
          this.subYes = 'bg-warning text-warning-inv'
          this.submitButtonText = 'Next heat'
          // this.announceRestart = 'Activate display'
          // this.heat = this.heat + 1
          // this.activeHeat = this.activeHeat + 1
          // this.active = false
          // this.subYes = 'primary'
        } else {
          console.log(this.lastDance)
          if (this.lastDance) {
            this.submitButtonText = 'Proceed to next event'
            this.subYes = 'bg-warning text-warning-inv'
          } else {
            this.submitButtonText = 'Proceed to next dance'
            this.subYes = 'bg-warning text-warning-inv'
          }
        }
      }
    },
    generateFullRoundTable() {
      let newFullArray = []
      for (let j = 0; j < this.events.length; j++) {
        let kKeys = Object.keys(this.events[j].rounds)
        for (let k = 0; k < kKeys.length; k++) {
          let adjudicators = this.events[j].rounds[kKeys[k]].adjudicators
          let adjLen = adjudicators.length
          for (let l = 0; l < adjLen; l++) {
            for (let m = 0; m < this.events[j].danceNo; m++) {
              newFullArray.push({
                roundId: this.events[j].rounds[kKeys[k]].id,
                adjudicatorId: adjudicators[l],
                dance: this.events[j].dances.charAt(m),
              })
            }
          }
        }
      }
      return newFullArray
    },
    checkRoundExceptions() {
      this.$axios
        .get('/comp/' + this.comp.id + '/submittedMarks')
        .then((response) => {
          this.judgeExceptions = []
          // if (this.$q.localStorage.has('judge-exceptions')) { this.judgeExceptions = this.$q.localStorage.getItem('judge-exceptions') } else { this.judgeExceptions = [] }
          let data = response.data
          let oKeys = Object.keys(data)
          let intersection = oKeys.filter((x) =>
            this.completedRoundIds.includes(parseInt(x, 10))
          )
          let dLen = 0
          let adjLen = 0
          let test = 0
          let adjudicators = []
          let tempSubmit = {}
          let newFullArray = this.generateFullRoundTable()
          for (let i = 0; i < intersection.length; i++) {
            test = parseInt(intersection[i], 10)
            dLen = Object.keys(data[intersection[i]]).length
            for (let j = 0; j < this.events.length; j++) {
              let kKeys = Object.keys(this.events[j].rounds)
              for (let k = 0; k < kKeys.length; k++) {
                // alert(this.events[j].rounds[kKeys[k]].id)
                // alert(test)
                if (this.events[j].rounds[kKeys[k]].id === test) {
                  tempSubmit.danceNo = this.events[j].danceNo
                  tempSubmit.dances = this.events[j].dances
                  tempSubmit.eventId = this.events[j].eventId
                  tempSubmit.name = this.events[j].name
                  tempSubmit.roundId = this.events[j].rounds[kKeys[k]].id
                  tempSubmit.round = this.events[j].rounds[kKeys[k]].round
                  adjudicators = this.events[j].rounds[kKeys[k]].adjudicators
                  adjLen = adjudicators.length
                  // for (let l = 0; l < adjLen; l++) {
                  //  for (let m = 0; m < tempSubmit.danceNo; m++) {
                  //    newFullArray.push({ roundId: tempSubmit.roundId, adjudicatorId: adjudicators[l], dance: tempSubmit.dances.charAt(m) })
                  //  }
                  // }
                }
              }
            }
            if (tempSubmit.danceNo > 1) {
              let jKeys = Object.keys(data[oKeys[i]])
              let found = []
              for (let j = 0; j < jKeys.length; j++) {
                let kKeys = Object.keys(data[oKeys[i]][jKeys[j]].submitted)
                let adjId = data[oKeys[i]][jKeys[j]].adjudicatorId
                let adjLetter = data[oKeys[i]][jKeys[j]].letter
                let adjName = data[oKeys[i]][jKeys[j]].name
                for (let k = 0; k < kKeys.length; k++) {
                  found.push({
                    name: tempSubmit.name,
                    eventId: tempSubmit.eventId,
                    round: tempSubmit.round,
                    roundId: tempSubmit.roundId,
                    dance: kKeys[k],
                    adjudicatorId: adjId,
                    judgeLetter: adjLetter,
                    judge: adjName,
                  })
                }
              }
              for (let j = 0; j < found.length; j++) {
                for (let k = 0; k < newFullArray.length; k++) {
                  if (found[j].roundId === newFullArray[k].roundId) {
                    if (
                      found[j].adjudicatorId === newFullArray[k].adjudicatorId
                    ) {
                      if (found[j].dance === newFullArray[k].dance) {
                        newFullArray[k] = false
                      }
                    }
                  }
                }
              }
              let testArrFiltered = []
              for (let j = 0; j < newFullArray.length; j++) {
                if (newFullArray[j]) {
                  if (newFullArray[j].roundId === test) {
                    testArrFiltered.push(newFullArray[j])
                  }
                }
              }
              for (let j = 0; j < testArrFiltered.length; j++) {
                for (let k = 0; k < this.judges.length; k++) {
                  if (
                    this.judges[k].compAdjId ===
                    testArrFiltered[j].adjudicatorId
                  ) {
                    this.judgeExceptions.push({
                      name: tempSubmit.name,
                      eventId: tempSubmit.eventId,
                      round: tempSubmit.round,
                      roundId: testArrFiltered[j].roundId,
                      dance: testArrFiltered[j].dance,
                      adjudicatorId: testArrFiltered[j].adjudicatorId,
                      judgeLetter: this.judges[k].value,
                      judge: this.judges[k].label,
                    })
                  }
                }
              }
            } else {
              let jKeys = Object.keys(data[oKeys[i]])
              let found = []
              for (let j = 0; j < jKeys.length; j++) {
                found.push(data[oKeys[i]][jKeys[j]].adjudicatorId)
              }
              if (dLen < adjLen) {
                let difference = adjudicators.filter((x) => !found.includes(x))
                for (let j = 0; j < difference.length; j++) {
                  for (let k = 0; k < this.judges.length; k++) {
                    if (this.judges[k].compAdjId === difference[j]) {
                      this.judgeExceptions.push({
                        name: tempSubmit.name,
                        eventId: tempSubmit.eventId,
                        round: tempSubmit.round,
                        roundId: tempSubmit.roundId,
                        dance: tempSubmit.dances,
                        adjudicatorId: difference[j],
                        judgeLetter: this.judges[k].value,
                        judge: this.judges[k].label,
                      })
                    }
                  }
                }
              }
            }
          }
          this.$q.localStorage.set('judge-exceptions', this.judgeExceptions)
          this.$root.$emit('whisper', {
            event: 'addNo',
            data: { type: 'Exceptions generated' },
          })
        })
        .catch(function (err) {
          this.$q.notify({
            color: 'negative',
            position: 'bottom',
            message: err.message,
            icon: 'report_problem',
          })
        })
    },
    pageChange(direction) {
      this.heat = this.heat + direction
    },
    editHeats() {
      this.$q
        .dialog({
          title: 'Heats',
          message: 'Change number of heats',
          prompt: {
            model: this.currentRound.round.heats,
            type: 'number',
          },
          cancel: true,
          persistent: true,
          dark: true,
          class: 'bg-primary text-primary-inv',
        })
        .onOk((numHeats) => {
          if (numHeats && numHeats !== this.currentRound.round.heats) {
            this.$store.dispatch('command/updateNumberHeats', {
              newHeats: parseInt(numHeats, 10),
              roundId: this.currentRound.round.id,
            })
          }
        })
    },
    restartRound() {
      const foundDance = this.currentEvent.dances.find((o) => {
        console.log(o.id, o.danceOrder)
        return o.id == o.danceOrder?.[0]
      })
      this.$q
        .dialog({
          title: this.currentEvent.title,
          message: `Are you sure you wish to restart ${this.roundText} from:`,
          focus: 'cancel',
          dark: true,
          class: 'bg-dark text-dark-inv',
          cancel: { label: 'Cancel', color: 'positive', flat: true },
          ok: { label: 'Yes', color: 'warning', flat: true },
          focus: 'cancel',
          options: {
            type: 'radio',
            model: '1',
            // inline: true
            items: [
              {
                label: `Heat 1 of the current dance, ${this.dance?.name}`,
                value: '1',
                color: 'positive',
              },
              {
                label: `Heat 1 of the first dance, ${foundDance?.name}`,
                value: '2',
                color: 'negative',
              },
            ],
          },
        })
        .onOk((val) => {
          // if (this.$q.localStorage.has('compere-state')) {
          //   this.$q.localStorage.remove('compere-state')
          // }
          this.heat = 1
          this.activeHeat = 1
          this.announceRestart = 'Activate display'
          // this.submittedJudges = []
          this.announced = new Set()
          this.active = false
          this.submitButtonText = 'Start heat'
          if (val == 2) {
            this.danceLetterIndex = 0
          }
          this.subYes = 'bg-primary text-primary-inv'
        })
    },
  },
}
</script>
