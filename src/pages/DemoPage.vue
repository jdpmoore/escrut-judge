<template>
  <q-page
    class="row justify-center items-center"
    :class="isHandwriting ? 'bg-primary text-primary-inv' : 'bg-dark'"
  >
    <q-card
      v-if="showStartPage"
      inline
      flat
      class="full-width full-height bg-dark q-pa-none"
      style="user-select: none"
    >
      <q-card-section
        horizontal
        class="bg-primary text-primary-inv text-center q-pa-sm q-mb-none"
      >
        <div class="row full-width items-center no-wrap">
          <div class="col">
            <div class="text-h6 text-bold">{{ competitionTitle }}</div>
          </div>
        </div>
      </q-card-section>
      <q-separator inset />
      <q-card-section class="bg-white q-pa-sm q-pb-lg">
        <div class="col justify-center" style="width: 100%">
          <div class="text-center" style="font-size: 175%">
            <div class="row flex-center q-mb-lg q-pt-lg">Welcome to eScrut</div>
            <div class="row flex-center q-mb-lg text-bold text-accent">
              Demonstration mode
            </div>
            <div class="row flex-center q-mb-lg" style="font-size: 75%">
              You will now judge a first round, semi, and final. This is a demo,
              and no marks will be recorded.
            </div>
            <div class="col flex-left q-mb-lg" style="font-size: 75%">
              <ul>
                <li class="text-left">Tap numbers to mark them (green)</li>
                <li class="text-left">
                  Tap a number again to remember but not mark them (yellow)
                </li>
                <li class="text-left">
                  Click "Next Heat" to go to the next heat
                </li>
                <li class="text-left">
                  Click "Submit marks" to submit your marks
                </li>
                <li class="text-left">
                  You may move back to the previous heat using the left arrow
                </li>
                <li class="text-left">
                  You may move between heats by swiping left and right
                </li>
                <li class="text-left">
                  When you click "Submit" all green numbers will be recalled
                </li>
                <li class="text-left">Yellow numbers will NOT be recalled</li>
              </ul>
            </div>
            <q-btn
              dense
              unelevated
              color="positive"
              icon="done"
              label="start"
              class="q-pa-md text-black"
              @click="startDemo"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
    <q-card
      v-else
      v-touch-swipe.horizontal="handleSwipe"
      inline
      flat
      class="full-width full-height bg-dark q-pa-none"
      style="user-select: none"
    >
      <q-card-section
        horizontal
        class="bg-primary text-primary-inv text-center q-pa-sm q-mb-none"
        style="max-height: 56px"
      >
        <div class="row full-width items-center no-wrap">
          <div class="col">
            <div class="text-h6 text-bold">
              {{ titleText }}
              <tippy
                ref="help-btn"
                content="Tap here for round info"
                trigger="manual"
                allow-h-t-m-l
                interactive
                :hide-on-click="true"
              >
                <q-btn
                  color="warning"
                  flat
                  dense
                  icon="help"
                  @click="getDetails"
                />
              </tippy>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-separator inset />
      <q-card-section class="bg-white q-pa-none">
        <div>
          <div class="col justify-center" style="width: 100%">
            <div class="text-center" style="font-size: 175%">
              <!-- <div v-if="isFinal" style="font-size: 100%">
                Placing {{ computedNumCouples }}
                {{ isTeam ? 'teams' : 'couples' }} in {{ dance?.name
                }}<span v-if="isOxbridgeVarsity"
                  >, round {{ heat }} of 9<br />{{ varsityPairs }}</span
                >
              </div> -->
              <div style="font-size: 100%">
                {{ roundText }}
              </div>
              <span style="font-size: 225%; font-weight: bold">{{
                isFinal ? placedCompetitorNumbers.length : marked?.size ?? 0
              }}</span>
              <span style="font-size: 120%"
                >/ {{ isFinal ? computedCompetitors.length : demoRecall }}</span
              >
            </div>
            <div class="row justify-center" style="width: 100%">
              <div
                v-if="isFinal"
                class="number-column items-center"
                :style="`height: ${computedFlexBoxHeight}px; width: ${
                  isFinal ? computedFlexBoxWidth / 2 : computedFlexBoxWidth
                }px;`"
              >
                <div
                  v-for="(placing, index) in placings"
                  :key="index"
                  :class="placingClass(placing)"
                  @click="selectedFinalPlacing = placing"
                >
                  <div class="text-center" style="font-size: 225%">
                    {{ placing.label }}
                  </div>
                </div>
              </div>
              <div
                v-if="isFinal"
                class="number-column items-center"
                :style="`height: ${computedFlexBoxHeight}px; width: ${
                  isFinal ? computedFlexBoxWidth / 2 : computedFlexBoxWidth
                }px;`"
              >
                <div
                  v-for="(placing, index) in placedCompetitors"
                  :key="index"
                  :class="placingClassCompetitors(placing)"
                  @click="unsetPlacing(placing)"
                >
                  <div class="text-center" style="font-size: 225%">
                    {{ placing.number }}
                  </div>
                </div>
              </div>
              <div
                class="number-column items-center"
                :style="`height: ${computedFlexBoxHeight}px; width: ${
                  isFinal ? computedFlexBoxWidth / 2 : computedFlexBoxWidth
                }px;`"
              >
                <div
                  v-for="(competitor, index) in computedCompetitorsSuper"
                  :key="index"
                  :class="competitorClass(competitor.number)"
                  @click="markCompetitor(competitor)"
                >
                  <div class="text-center" style="font-size: 225%">
                    {{ competitor.number }}
                  </div>
                </div>
                <tippy
                  ref="add-btn"
                  content="Tap here to add a number"
                  trigger="manual"
                  allow-h-t-m-l
                  interactive
                  :hide-on-click="true"
                >
                  <div
                    v-if="isFirstRound"
                    class="text-center bg-info text-info-inv"
                    :class="isFinal ? 'competitor-add-final' : 'competitor-add'"
                    @click="addNumber"
                  >
                    Add
                  </div>
                </tippy>
              </div>
            </div>
          </div>
          <q-card-section
            horizontal
            class="text-center q-pa-sm q-mb-none q-mt-xs"
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
              <div class="col q-mx-lg">
                <!-- <q-btn
                    v-if="isCurrentEvent && !isNonCompereEvent"
                    class="bg-info text-info-inv q-mr-lg"
                    icon="add"
                    label="Add number(s)"
                    style="font-size: 150%"
                    @click="submitMarks"
                  /> -->
                <q-btn
                  v-if="heat == competitors.length"
                  class="full-width"
                  :disable="
                    isFinal &&
                    finalPlacings?.size != computedCompetitors.length &&
                    computedCompetitors.length > 1
                  "
                  :class="
                    (marked?.size == demoRecall && demoRecall > 0) ||
                    (isFinal &&
                      finalPlacings?.size == computedCompetitors.length) ||
                    (computedCompetitorsSuper.length == 1 && !isFinal)
                      ? 'bg-positive text-positive-inv'
                      : 'bg-negative text-negative-inv'
                  "
                  icon="done"
                  :label="
                    computedCompetitorsSuper.length == 1 && !isFinal
                      ? 'Skip event'
                      : 'Submit marks'
                  "
                  style="font-size: 150%"
                  @click="submitMarks"
                />
                <q-btn
                  v-if="heat < competitors.length"
                  class="full-width bg-warning"
                  icon="keyboard_arrow_right"
                  label="Next heat"
                  style="font-size: 150%"
                  @click="heat++"
                />
              </div>
              <!-- <div class="col-auto">
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
              </div> -->
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
      </q-card-section>
      <q-inner-loading :showing="loadingState">
        <q-spinner color="primary" size="50px" />
      </q-inner-loading>
    </q-card>
  </q-page>
</template>

<script>
// import JudgePad from 'components/JudgePad.vue'
import AddNumber from 'components/dialog/AddNumber.vue'
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
    // JudgePad,
    // AnnounceResults,
  },
  data() {
    return {
      addedNumber: false,
      demoRound: 1,
      recalledOne: [],
      showStartPage: true,
      triggerPlacingUpdate: false,
      showPlacings: true,
      toClear: false,
      handwritingTrigger: false,
      allAnnounced: false,
      resultsTrigger: false,
      showNames: false,
      loadingState: false,
      loadingDialog: null,
      // roundIdtoRound: this.$store.getters['command/roundIdtoRound'],
      roundById: this.$store.state.command.scrutineering.roundById,
      active: true,
      announceRestart: 'Activate display',
      subYes: 'bg-primary text-primary-inv',
      submitButtonText: 'Start Heat',
      announced: new Set(),
      marked: new Set(),
      considering: new Set(),
      finalPlacings: new Map(),
      additionalNumbers: { 1: new Set(), 2: new Set() },
      tempHeat: 1,
      selectedFinalPlacing: null,
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
    helpButton() {
      return this.$refs['help-btn']
    },
    addBtnRef() {
      return this.$refs['add-btn']
    },
    demoRecall() {
      switch (this.demoRound) {
        case 1:
          return 12
        case 2:
          return 6
        case 3:
          return 0
        default:
          return ''
      }
    },
    isFirstRound() {
      return this.demoRound == 1
    },
    isFinal() {
      return this.demoRound == 3
    },
    titleText() {
      switch (this.demoRound) {
        case 1:
          return 'Demo first round'
        case 2:
          return 'Demo semi-final'
        case 3:
          return 'Demo final'
        default:
          return ''
      }
    },
    roundText() {
      switch (this.demoRound) {
        case 1:
          return `Heat ${this.tempHeat}/2, Waltz: recall ${this.demoRecall}`
        case 2:
          return `Heat 1/1, Waltz: recall ${this.demoRecall}`
        case 3:
          return 'Final'
        default:
          return ''
      }
    },
    submitText() {
      switch (this.demoRound) {
        case 1:
          return `Heat ${this.tempHeat}/2, Waltz: ${this.computedNumCouples} couples`
        case 2:
          return `Heat 1/1, Waltz: ${this.computedNumCouples} couples`
        case 3:
          return 'Final'
        default:
          return ''
      }
    },
    competitionTitle() {
      return this.$store.state.command.competition.title
    },
    canSubmit() {
      if (this.current) {
        const isCompleted = this.current.status === 'completed'
        const inCanSubmit = this.$store.state.command.canSubmit?.has(
          this.current.id
        )
        return isCompleted || inCanSubmit
      }
      return false
    },
    placedObject() {
      const keys = [...this.finalPlacings.keys()]
      const toReturn = {}
      keys.forEach((key) => {
        toReturn[key] = this.finalPlacings.get(key)
      })
      return toReturn
    },
    placedCompetitorNumbers() {
      return [...this.finalPlacings.values()]
    },
    placedCompetitors() {
      // const theCompetitors = this.computedCompetitors.map((competitor) => {
      //   console.log(
      //     this.placedCompetitorNumbers.includes(competitor.number),
      //     competitor.number
      //   )
      //   const toReturn = { ...competitor }
      //   if (!this.placedCompetitorNumbers.includes(competitor.number)) {
      //     toReturn.number = ''
      //   }
      //   return toReturn
      // })
      const theReturn = this.placings.map((placing) => {
        return (
          this.computedCompetitors.find((competitor) => {
            return this.finalPlacings.get(placing.value) == competitor.number
          }) ?? { number: '' }
        )
      })
      // console.log('the return', theReturn)
      return theReturn
    },
    placings() {
      const fir = this.triggerPlacingUpdate ? 1 : 0
      let size = fir
      size = size + this.competitors[this.heat - 1].length
      size = size - fir
      const toReturn = new Array(size).fill(1).map((o, i) => {
        const value = i + 1
        return {
          label: this.$common.ordinal_suffix_of(value),
          value,
          col: 'grey',
          number: '',
        }
      })
      console.log('we are returning', toReturn)
      return toReturn
    },
    computedCompetitorsSuper() {
      if (this.isFinal) {
        return this.computedCompetitors.filter((competitor) => {
          // console.log(this.placedCompetitorNumbers, comp)
          return !this.placedCompetitorNumbers.includes(competitor.number)
        })
      }
      return this.computedCompetitors
    },
    computedCompetitors() {
      console.log(this.competitors, this.heat)
      return this.$_.sortBy(this.competitors[this.heat - 1], 'number')
    },
    computedCompetitorsNumbers() {
      return this.computedCompetitors.map((o) => {
        return o.number
      })
    },
    computedFlexBoxHeight() {
      if (this.isFinal) {
        return 560
      }
      return this.computedNumberColumns < 5 ? 540 : 642
    },
    computedNumberColumns() {
      if (this.isFinal) {
        return Math.max(Math.ceil((this.computedCompetitors.length + 1) / 6), 2)
      }
      return Math.ceil((this.computedCompetitors.length + 1) / 6)
    },
    computedFlexBoxWidth() {
      const colPx = 0.2 * window.innerWidth + 18
      const nCols = Math.min(this.computedNumberColumns, 4)
      // console.log(nCols)
      return Math.round(nCols * colPx)
    },
    isHandwriting: {
      get() {
        return false
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
    noCurrentEvent() {
      return Object.keys(this.currentEvent).length === 0
    },
    noCurrentOrIsNewOrSkippedEvent() {
      return (
        this.noCurrentEvent || ['new', 'skipped'].includes(this.current?.status)
      )
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
    isCompleted() {
      return this.$store.state.command.compere.completedRounds.has(
        this.currentRound.roundId
      )
    },
    isCurrentEvent() {
      return this.timetableOrder === this.current.timetableOrder
    },
    lastDance() {
      // console.log('the last dance', this.currentRound.round.dances, this.dance)
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
          return 0
        }
      },
    },
    timetableOrder: {
      get() {
        return this.$store.state.command.compere.timetableOrder
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
    },
    heat: {
      get() {
        return this.tempHeat
      },
      set(val) {
        this.tempHeat = val
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
      console.log(this.demoRound, this.recalledOne)
      // console.log(this.competitorsCurrent)
      // console.log(this.timetableOrder, this.current.timetableOrder)
      if (this.demoRound == 1) {
        const heat1 = Array.from({ length: 12 }, (_, i) => {
          return { number: i + 1, id: i + 1 }
        })
        heat1.push(...this.additionalNumbers[1])
        const heat2 = Array.from({ length: 12 }, (_, i) => {
          return { number: i + 13, id: i + 13 }
        })
        heat2.push(...this.additionalNumbers[2])
        return [heat1, heat2]
      } else {
        return [
          this.recalledOne.map((no) => {
            return { number: no, id: no }
          }),
        ]
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
      // console.log('to return', toReturn)
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
    theRoundText() {
      const roundId = this.currentRound?.round?.round
      const isResults = this.currentRound?.result?.id
      if (roundId === 'F') {
        return ', Final'
      } else if (roundId === 'SF') {
        return ', Semi-final'
      } else if (roundId === 'PO') {
        return ', Play-off'
      } else if (isResults) {
        return ', Results'
      } else if (roundId) {
        return `, Round ${roundId}`
      } else {
        return ''
      }
    },
    nextRoundTextResults() {
      return this.$store.getters['command/timetableEntryByTimetableOrder'](
        Number(this.timetableOrder) + 1
      )?.title
    },
    computedNumCouples() {
      // console.log(this.competitors, this.heat, this.isOffbeat)
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
      return {
        adjudicators: [],
        comp: {
          id: 22,
          status: 'live',
          date: {
            date: '2024-02-10 00:00:00.000000',
            timezone: 'UTC',
            timezone_type: 3,
          },
          title: 'SUDC 2024',
        },
        floor: { id: 24, name: 'Main floor', max: 16, maxBySection: Array(4) },
        heatLength: null,
        id: 2445,
        length: null,
        result: null,
        roles: [],
        round: {
          adjudicators: [
            {
              id: 125,
              letter: 'A',
              name: 'Nick Miles',
              user: {},
              isChair: true,
            },

            {
              id: 126,
              letter: 'B',
              name: 'Joanne Banham',
              user: {},
              isChair: false,
            },

            {
              id: 127,
              letter: 'C',
              name: 'Tomasz Gazda',
              user: {},
              isChair: false,
            },

            {
              id: 128,
              letter: 'D',
              name: 'Vlad Shalnev',
              user: {},
              isChair: false,
            },

            {
              id: 129,
              letter: 'E',
              name: 'Frank Venables',
              user: {},
              isChair: false,
            },
          ],
          danceMapping: [],
          danceOrder: [1, 6, 5, 10],
          dances: ['1', '6', '5', '10'],
          entered: 6,
          floor: {
            id: 24,
            name: 'Main floor',
            max: 16,
            maxBySection: Array(4),
          },
          heats: 1,
          id: 2083,
          isFirstRound: false,
          isQualifier: false,
          isRepechage: true,
          recall: 0,
          recalled: null,
          round: 'F',
          status: 'active',
        },
        section: { id: 57, name: 'Team' },
        startTime: {
          date: '2024-02-10 18:54:00.000000',
          timezone_type: 3,
          timezone: 'UTC',
        },
        status: 'completed',
        timetableOrder: 108,
        title: 'Team Match Div 1',
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
    timetableCurrent() {
      return this.timetable.find((t) => {
        return t.status === 'active'
      })
    },
    timetableOrders() {
      return this.timetable.map((o) => {
        return o.timetableOrder
      })
    },
  },
  watch: {
    placings() {
      //
    },
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
    currentRound(oldValue, newValue) {
      if (oldValue.id != newValue.id) {
        this.marked = new Set()
        this.considering = new Set()
        this.finalPlacings = new Map()
        this.heat = 1
        this.activeHeat = 1
      }
    },
  },
  created() {
    // this.getState()
    // POST padmarks (returns padmarks) - takes roundId, compAdjId
    // this.$axios.post('padmarks', {
    //   roundId: 400,
    //   compAdjId: this.myAdjudicator.id,
    //   danceId: 17,
    // })
    this.submitButtonText = 'Start heat'
  },
  methods: {
    finishDemo() {
      this.$q
        .dialog({
          dark: false,
          title: 'Demo concluded',
          class: 'bg-primary text-primary-inv',
          message:
            'That concludes the demo of eScrut. Would you like to repeat the demo?',
          html: true,
          cancel: { label: 'No', color: 'positive', textColor: 'positive-inv' },
          ok: { label: 'Yes', color: 'warning', textColor: 'warning-inv' },
          focus: 'cancel',
        })
        .onOk(() => {
          this.addedNumber = false
          this.demoRound = 1
          this.recalledOne = []
          this.showStartPage = true
          this.marked = new Set()
          this.considering = new Set()
          this.finalPlacings = new Map()
          this.additionalNumbers = { 1: new Set(), 2: new Set() }
        })
        .onCancel(() => {
          this.$store.commit('command/setDemo', false)
          this.$router.push('/judge')
        })
    },
    startDemo() {
      let message = ''
      switch (this.demoRound) {
        case 1:
          message =
            'You will now judge a first round.<ul><li>Recall 12 couples from 24 in two heats.</li><li>Add at least one number to the event with the "Add" button</li></ul>'
          break
        case 2:
          message =
            'You will now judge a semi-final.<ul><li>Recall 6 couples from 12 in one heat.</li></ul>'
          break
        case 3:
          message =
            'You will now place a final.<ul><li>Tap the placing on the left, it will turn blue to indicate it is active</li><li>Tap a number on the right to assign it that place</li><li>You may reallocate placings as many times as you like by tapping on the placing again</li></ul>'
        default:
      }
      this.$q
        .dialog({
          dark: false,
          title: this.titleText,
          class: 'bg-primary text-primary-inv',
          message,
          html: true,
          cancel: false, //{ label: 'Cancel', color: 'positive', flat: true },
          ok: { label: 'Ok', color: 'positive', textColor: 'positive-inv' },
          focus: 'cancel',
        })
        .onDismiss(() => {
          this.showStartPage = false

          if (this.demoRound == 1) {
            setTimeout(() => {
              console.log(this.demoRound, this.helpButton)
              this.helpButton.show()
            }, 50)
          }
        })
    },
    checkNoCurrentEvent() {
      if (this.noCurrentEvent) {
        if (this.timetableCurrent) {
          // console.log(
          //   'checking for current event',
          //   this.timetableOrder,
          //   this.timetableCurrent
          // )
          this.timetableOrder = this.timetableCurrent.timetableOrder
        }
      }
    },
    unsetPlacing(placing) {
      const number = placing.number
      const storedNumbers = [...this.finalPlacings.values()]
      if (storedNumbers.includes(number)) {
        const keys = [...this.finalPlacings.keys()]
        keys.forEach((key) => {
          if (this.finalPlacings.get(key) == number) {
            this.finalPlacings.delete(key)
          }
        })
      }

      if (this.selectedFinalPlacing) {
        const { value } = this.selectedFinalPlacing
        this.finalPlacings.set(value, number)
        this.selectedFinalPlacing = null
      }
    },
    clearPage() {
      this.$q
        .dialog({
          title: this.roundText,
          message: `Are you sure you wish to clear the page for ${this.roundText} and start again?`,
          focus: 'cancel',
          dark: false,
          class: 'bg-dark text-dark-inv',
          cancel: {
            label: 'Cancel',
            color: 'negative',
            textColor: 'negative-inv',
          },
          ok: { label: 'Yes', color: 'positive', textColor: 'positive-inv' },
          focus: 'cancel',
        })
        .onOk(() => {
          this.toClear = !this.toClear
        })
    },
    getDetails() {
      this.helpButton.hide()
      const approx = Math.round(this.demoRecall / this.competitors.length)
      const message = `Recall ${this.demoRecall} from
                ${
                  this.competitors.length > 1
                    ? `${this.competitors.length} heats`
                    : '1 heat'
                }, ${this.competitors.flat().length} competitors<br>
                <span class="text-body1">(recall approx. ${approx} per heat)</span>`
      // const message = `Recall ${this.currentRound?.round?.recall} from
      //           ${
      //             this.currentRound?.round?.heats > 1
      //               ? `${this.currentRound?.round?.heats} heats`
      //               : '1 heat'
      //           }<br>
      //           <span class="text-body1">(recall approx. ${approx} per heat)</span>

      //           <br><br>
      //           Heat ${this.heat}, ${this.dance?.name}<br><br>
      //           No. on floor: ${this.computedNumCouples}<br>
      //                           <div class="text-info">${this.floor.name}</div>`
      this.$q.dialog({
        title: this.roundText,
        message,
        dark: true,
        html: true,
        class: 'bg-dark text-dark-inv text-subtitle1',
        cancel: false,
        ok: { label: 'OK', color: 'positive', textColor: 'positive-inv' },
        focus: 'ok',
      })
      // .onDismiss(() => {
      //   this.startDemo()
      // })
      // .onCancel(() => {
      //   this.viewCompetitors(this.currentRound)
      // })
    },
    viewCompetitors() {
      //
    },
    startHandwritingSubmit() {
      // this.loadingDialog = this.$q.dialog({
      //   message: 'Submitting marks',
      //   progress: true, // we enable default settings
      //   persistent: true, // we want the user to not be able to close it
      //   ok: false, // we want the user to not be able to close it
      // })
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
    getEvent(roundId) {
      const currentEvent = this.$store.state.command.events.find((evt) => {
        const roundIds = evt.rounds.map((round) => {
          return round.id
        })
        return roundIds.includes(roundId)
      })
      return currentEvent
    },
    placingClassCompetitors(competitor) {
      let toReturn = ''
      if (!competitor.number) {
        toReturn = 'bg-white'
      } else {
        toReturn = 'bg-positive text-positive-inv'
      }
      toReturn = `${toReturn} ${
        this.isFinal ? 'competitor-number-final' : 'competitor-number'
      }`
      return toReturn
    },
    placingClass(placing) {
      let toReturn = ''
      if (this.selectedFinalPlacing?.value == placing.value) {
        toReturn = 'bg-info text-info-inv'
      } else if (this.finalPlacings.has(placing.value)) {
        toReturn = 'bg-positive text-positive-inv'
      }
      toReturn = `${toReturn} ${
        this.isFinal ? 'competitor-number-final' : 'competitor-number'
      }`
      return toReturn
    },
    competitorClass(no) {
      let toReturn = ''
      if (this.marked.has(no)) {
        toReturn = 'bg-positive text-positive-inv'
      } else if (this.considering.has(no)) {
        toReturn = 'bg-warning text-warning-inv'
      }

      if (this.isFinal) {
        if (this.placedCompetitorNumbers.includes(no)) {
          toReturn = 'bg-positive text-positive-inv'
        }
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
      toReturn = `${toReturn} ${
        this.isFinal ? 'competitor-number-final' : 'competitor-number'
      }`
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
      // console.log('tOrder', tOrder)
      return tOrder.round?.id
      // const { roundId } =
      //   this.$store.getters['command/timetableEntryByTimetableOrder'](
      //     timetableOrder
      //   )
      // return roundId
    },
    getCompetitors() {
      // // console.log('in get competitors', this.competitors)
      // if (!this.$store.state.command.current.round) {
      //   return
      // }
      // if (this.$store.state.command.current.round.id === 0) {
      //   this.$store.commit('command/setCurrentNext')
      //   // this.$store.dispatch('command/getNextCompetitors')
      // }
      // if (this.$store.state.command.current.round.id === 0) {
      //   this.$common.popup({
      //     title: 'No first round',
      //     message: 'No first round found',
      //   })
      //   return
      // }
      // if (this.competitors.length === 0) {
      //   this.loadingState = true
      // }
      // this.$store.dispatch('command/updateCurrent')
      // this.$store
      //   .dispatch(
      //     'command/getCompetitorsByRoundId',
      //     this.$store.state.command.current.round.id
      //   )
      //   .then((dat) => {
      //     this.loadingState = false
      //     // console.log(dat)
      //     if (dat.length === 0) {
      //       setTimeout(() => {
      //         this.getCompetitors()
      //       }, 5000)
      //     }
      //   })
      //   .catch(() => {
      //     this.loadingState = false
      //     // setTimeout(() => {
      //     //   this.getCompetitors()
      //     // }, 5000)
      //   })
    },
    announceEndOfDays() {
      this.announceRestart = this.isNonCompereEvent
        ? 'Repeat announcement'
        : 'Restart heat'
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
            dark: false,
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
      if (this.currentRound.round?.isFirstRound) {
        this.subYes = 'bg-warning text-warning-inv'
        // this.start()
      }
      this.active = true
    },
    markCompetitorFinal(number) {
      // console.log('now we place', this.selectedFinalPlacing, number)
      if (!this.selectedFinalPlacing) {
        return
      }
      const { value } = this.selectedFinalPlacing
      const storedNumbers = [...this.finalPlacings.values()]
      if (storedNumbers.includes(number)) {
        const keys = [...this.finalPlacings.keys()]
        keys.forEach((key) => {
          if (this.finalPlacings.get(key) == number) {
            this.finalPlacings.delete(key)
          }
        })
      }
      this.finalPlacings.set(value, number)
      this.selectedFinalPlacing = null
    },
    markCompetitor({ number }) {
      // console.log(number, this.marked, this.considering)
      if (this.isFinal) {
        this.markCompetitorFinal(number)
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
    },
    showAdjudicator(adjudicator) {
      this.$common.popup({
        title: `Adjudicator ${adjudicator.letter}`,
        message: `${adjudicator.name}`,
      })
    },
    addNumber() {
      this.addBtnRef.hide()
      this.$q
        .dialog({
          component: AddNumber,
          componentProps: {
            title: 'Add number',
          },
        })
        .onOk((newNumber) => {
          if (newNumber < 13) {
            this.$common.popup({
              title: 'Already added',
              message:
                'Number already in round - please add a number not in the event.',
            })
          }
          this.addedNumber = true
          // this.showPlacings = false
          console.log(newNumber)
          console.log(Number(newNumber))
          const newNumbers = [Number(newNumber)]
          if (newNumbers.length === 0) return
          if (!(this.heat in this.additionalNumbers)) {
            this.additionalNumbers[this.heat] = new Set()
          }
          console.log(this.additionalNumbers)
          newNumbers.map((num) => {
            if (!this.isFinal) {
              this.marked.add(num)
            }
            if (!this.computedCompetitorsNumbers.includes(num)) {
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
            }
          })
          // setTimeout(() => {
          //   this.showPlacings = true
          // }, 1000)
        })
    },
    handleSwipe(info) {
      if (this.isHandwriting) {
        return
      }
      console.log('swipg', info)
      if (info.duration < 25) {
        return
      }
      const numHeats = this.demoRound == 1 ? 2 : 1
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

      this.loadingState = false
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
    },
    submitMarks() {
      if (this.demoRound == 1 && !this.addedNumber) {
        this.$q
          .dialog({
            title: 'Add number',
            message:
              'Please add a number to this demo first round before continuing (you do not have to mark them)',
            focus: 'cancel',
            dark: true,
            class: 'bg-negative text-negative-inv',
            cancel: false,
            ok: { label: 'Ok', color: 'warning', textColor: 'warning-inv' },
          })
          .onDismiss(() => {
            console.log(this.addBtnRef)
            this.addBtnRef.show()
          })
        return
      }
      if (this.demoRound == 2 && this.marked?.size > 8) {
        this.$q.dialog({
          title: 'Demo final recall too high',
          message: 'Please only recall 8 or fewer couples into the demo final',
          focus: 'cancel',
          dark: true,
          class: 'bg-negative text-negative-inv',
          cancel: false,
          ok: { label: 'Ok', color: 'warning', textColor: 'warning-inv' },
        })
        return
      }
      let message = `Are you sure you wish to submit your ${
        this.isFinal ? 'placings' : 'marks'
      } for ${this.titleText}`
      const spotOn =
        this.marked?.size == this.demoRecall || this.demoRecall == 0
      // ||
      // this.computedCompetitorsSuper.length != 1
      // console.log(
      //   this.marked?.size,
      //   this.currentRound.round.recall,
      //   this.marked?.size == this.currentRound.round.recall,
      //   this.isHandwriting,
      //   this.currentRound.round.recall == 0,
      //   this.computedCompetitorsSuper.length != 1,
      //   spotOn,
      //   this.computedCompetitorsSuper,
      //   !this.isFinal
      // )
      if (!spotOn && !this.isFinal) {
        message = `${message}, you have recalled ${this.marked?.size} out of ${this.demoRecall}`
      }
      if (this.computedCompetitorsSuper.length != 1) {
        this.$q
          .dialog({
            title: this.titleText,
            message,
            focus: 'cancel',
            dark: true,
            class: spotOn
              ? 'bg-dark text-dark-inv'
              : 'bg-negative text-negative-inv',
            cancel: {
              label: 'Cancel',
              color: 'warning',
              textColor: 'warning-inv',
            },
            ok: { label: 'Yes', color: 'positive', textColor: 'positive-inv' },
            focus: 'cancel',
          })
          .onOk(() => {
            this.toClear = !this.toClear
            const loadingDialog = this.$q.dialog({
              message: 'Processing marks...',
              dark: false,
              progress: true, // we enable default settings
              persistent: true, // we want the user to not be able to close it
              ok: false, // we want the user to not be able to close it
            })
            setTimeout(() => {
              loadingDialog.hide()
              if (this.isFinal) {
                this.finishDemo()
                return
              } else {
                this.demoRound = this.demoRound + 1
                this.recalledOne = [...this.marked]
              }
              this.heat = 1
              this.activeHeat = 1
              this.marked = new Set()
              this.considering = new Set()
              this.finalPlacings = new Map()
              this.additionalNumbers = {}
              this.startDemo()
            }, 1500)
          })
      } else {
        setTimeout(() => {
          loadingDialog.hide()
          if (this.isFinal) {
            this.finishDemo()
            return
          } else {
            this.demoRound = this.demoRound + 1
            this.recalledOne = [...this.marked]
          }
          this.heat = 1
          this.activeHeat = 1
          this.marked = new Set()
          this.considering = new Set()
          this.finalPlacings = new Map()
          this.additionalNumbers = {}
          this.startDemo()
        }, 1500)
      }
    },
    checkForNewTimetable() {
      //
    },
    postPadMarks() {
      return
    },
    // POST padmarks/add (adds padmarks) - takes roundId, compAdjId, type (file or array) - if type==file then fileData or if type==array then marks)
    start() {
      // this.pingRecallAPI()
      if (this.submitButtonText === 'Proceed to next event') {
        this.announceRestart = 'Activate display'
        this.danceLetterIndex = 0
        this.heat = 1
        this.activeHeat = 1
        this.active = false
        // console.log('completed timetable event', this.timetableId)

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
          // console.log(this.lastDance)
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
    pageChange(direction) {
      this.heat = this.heat + direction
    },
    editHeats() {
      this.$q.dialog({
        title: 'Heats',
        message: 'Change number of heats',
        prompt: {
          model: this.currentRound.round.heats,
          type: 'number',
        },
        cancel: true,
        persistent: true,
        dark: false,
        class: 'bg-primary text-primary-inv',
      })
    },
    restartRound() {
      const foundDance = this.currentEvent.dances.find((o) => {
        // console.log(o.id, o.danceOrder)
        return o.id == o.danceOrder?.[0]
      })
      this.$q
        .dialog({
          title: this.currentEvent.title,
          message: `Are you sure you wish to restart ${this.roundText} from:`,
          focus: 'cancel',
          dark: false,
          class: 'bg-dark text-dark-inv',
          cancel: {
            label: 'Cancel',
            color: 'positive',
            textColor: 'positive-inv',
          },
          ok: { label: 'Yes', color: 'warning', textColor: 'positive-inv' },
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
