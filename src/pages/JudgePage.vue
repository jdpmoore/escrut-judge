<template>
  <q-page
    class="row justify-center items-top"
    :class="isHandwriting ? 'bg-primary' : 'bg-dark'"
  >
    <q-card
      v-if="noCurrentOrIsNewOrSkippedEvent"
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
      <q-card-section class="bg-white q-pa-none">
        <div v-if="isBreak" class="col justify-center" style="width: 100%">
          <div class="text-center q-pb-sm" style="font-size: 175%">
            <div style="font-size: 125%" class="q-pt-lg">
              {{ current.title }}
            </div>

            <div style="font-size: 100%" class="q-mt-lg">
              Your next event is at {{ nextStartTime }} in the
            </div>
            <div style="font-size: 100%" class="q-my-lg text-bold text-accent">
              {{ nextTimetableItem.floor.name }}
            </div>
            <div style="font-size: 100%" class="q-mb-md">
              {{ nextTimetableItem.title }}
            </div>
          </div>
        </div>
        <div v-else class="col justify-center" style="width: 100%">
          <div class="text-center" style="font-size: 175%">
            <div class="row flex-center q-mb-lg q-pt-lg">Welcome to eScrut</div>
            <q-spinner color="primary" size="3em" :thickness="10" />
            <div style="font-size: 125%" class="q-mt-lg">
              Please stand by...
            </div>
          </div>
          <q-card-section
            class="row items-center text-center justify-center q-pt-none"
          >
            <q-btn
              class="q-ma-sm"
              color="accent"
              text-color="white"
              label="Switch judge"
              style="width: 315px"
              @click="switchJudge"
            />
          </q-card-section>
        </div>
      </q-card-section>
    </q-card>
    <q-card
      v-else-if="isOffbeat"
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
      <q-card-section class="bg-white q-pa-none">
        <div class="col justify-center" style="width: 100%">
          <div class="text-center q-pb-sm" style="font-size: 165%">
            <div style="font-size: 125%" class="q-pt-lg">
              {{ current.title }} is judged on paper
            </div>

            <div style="font-size: 100%" class="q-mt-lg">
              Your next event is at {{ nextStartTime }} in the
            </div>
            <div style="font-size: 100%" class="q-my-lg text-bold text-accent">
              {{ nextTimetableItem.floor.name }}
            </div>
            <div style="font-size: 100%" class="q-mb-md">
              {{ nextTimetableItem.title }}
            </div>
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
          <div v-if="isHandwriting" class="col-auto">
            <q-btn
              dense
              color="accent"
              icon="clear"
              label="clear"
              @click="clearPage"
            ></q-btn>
          </div>
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
          </div>
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
      <q-card-section v-if="!isHandwriting" class="bg-white q-pa-none">
        <div>
          <div class="col justify-center" style="width: 100%">
            <div v-if="isResults" class="text-center" style="font-size: 165%">
              <div style="font-size: 125%">
                {{ roundText }}
              </div>
              <div class="text-primary">Next: {{ nextRound.title }}</div>
            </div>
            <div
              v-else-if="isNonCompereEvent"
              class="text-center"
              style="font-size: 165%"
            >
              <div v-if="!endOfDays" class="row flex-center">
                {{ isCurrentEvent ? 'The current' : 'This' }} event is
              </div>
              <div style="font-size: 125%">
                {{ roundText }}
              </div>
            </div>
            <div v-else class="text-center" style="font-size: 165%">
              <div v-if="isOffbeat" style="font-size: 125%">
                {{ computedNumCouples }} teams
              </div>
              <div v-else-if="isFinal" style="font-size: 100%">
                Placing {{ computedNumCouples }}
                {{ isTeam ? 'teams' : 'couples' }} in {{ dance?.name
                }}<span v-if="isOxbridgeVarsity"
                  >, round {{ heat }} of 9<br />{{ varsityPairs }}</span
                >
              </div>
              <div v-else style="font-size: 100%">
                Heat {{ heat }}/{{ currentRound?.round?.heats }},
                {{ dance?.name }}: recall {{ currentRound?.round?.recall }}
              </div>
              <span style="font-size: 225%; font-weight: bold">{{
                isFinal ? placedCompetitorNumbers.length : (marked?.size ?? 0)
              }}</span>
              <span style="font-size: 120%"
                >/
                {{
                  isFinal
                    ? computedCompetitors.length
                    : currentRound.round.recall
                }}</span
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
                  @click="selectPlacing(placing)"
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
                  v-if="isFirstRound && !isOxbridgeVarsity"
                  class="text-center bg-info text-info-inv"
                  :class="isFinal ? 'competitor-add-final' : 'competitor-add'"
                  @click="addNumber"
                >
                  Add
                </div>
                <div
                  v-if="showRefresh"
                  class="text-center bg-info text-info-inv"
                  :class="isFinal ? 'competitor-add-final' : 'competitor-add'"
                  @click="getCompetitors"
                >
                  Refresh
                </div>
              </div>
            </div>
          </div>
          <q-card-section
            horizontal
            class="text-center q-pb-sm q-mb-none q-pt-none"
          >
            <div class="row full-width items-center no-wrap">
              <div class="col-auto">
                <q-btn
                  v-if="!isFinal"
                  round
                  color="primary"
                  icon="keyboard_arrow_left"
                  :disable="
                    heat === 1 ||
                    isNonCompereEvent ||
                    endOfDays ||
                    isOxbridgeVarsity
                  "
                  @click="pageChange(-1)"
                  ><q-tooltip> Previous heat </q-tooltip></q-btn
                >
              </div>
              <div class="col q-mx-lg">
                <q-btn
                  v-if="
                    isCurrentEvent &&
                    !isNonCompereEvent &&
                    heat == competitors.length &&
                    !isOxbridgeVarsity
                  "
                  class="full-width"
                  :disable="
                    isFinal &&
                    finalPlacings?.size != computedCompetitors.length &&
                    computedCompetitors.length > 1
                  "
                  :class="computedSubmitClass"
                  icon="done"
                  :label="
                    computedCompetitorsSuper.length == 1 && !isFinal
                      ? 'Skip event'
                      : 'Submit marks'
                  "
                  style="font-size: 150%"
                  :disabled="!canSubmit"
                  @click="submitMarks"
                />
                <q-btn
                  v-if="
                    isCurrentEvent &&
                    !isNonCompereEvent &&
                    (heat < competitors.length || isOxbridgeVarsity)
                  "
                  :disable="isOxbridgeVarsity && finalPlacings?.size < 6"
                  :class="computedHeatClass"
                  :icon="isOxbridgeVarsity ? 'done' : 'keyboard_arrow_right'"
                  :label="isOxbridgeVarsity ? 'Submit marks' : 'Next heat'"
                  style="font-size: 150%"
                  @click="gotoNextHeat"
                />
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
            </div>
          </q-card-section>
        </div>
      </q-card-section>
      <q-card-section v-else class="bg-white q-pa-none">
        <JudgePad
          :trigger="handwritingTrigger"
          :to-clear="toClear"
          @submit="submitMarks"
        />
      </q-card-section>
      <q-card-section
        v-if="isHandwriting"
        horizontal
        class="bg-primary text-primary-inv text-center q-pa-sm q-mb-none"
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
    JudgePad,
    // AnnounceResults,
  },
  data() {
    return {
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
      additionalNumbers: {},
      tempHeat: 1,
      selectedFinalPlacing: null,
      selectedFinalNumber: null,
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
    showRefresh() {
      // console.log(
      //   'what is wrong with showing the refresh',
      //   this.isCurrentEvent,
      //   this.isFinal,
      //   this.computedCompetitorsSuper,
      //   this.finalPlacings,
      //   computedCompetitorsSuper
      // )
      if (!this.isCurrentEvent) {
        return false
      }
      if (this.isFinal) {
        return (
          this.computedCompetitorsSuper.length == 0 &&
          this.finalPlacings?.size == 0
        )
      }
      return this.computedCompetitorsSuper.length == 0
    },
    computedHeatClass() {
      if (this.isOxbridgeVarsity) {
        return this.finalPlacings?.size == 6
          ? 'full-width bg-positive'
          : 'full-width bg-warning'
      }
      return 'full-width bg-warning'
    },
    computedSubmitClass() {
      const test1 =
        this.marked?.size == this.currentRound.round.recall &&
        this.currentRound.round.recall > 0
      const test2 =
        this.isFinal &&
        this.finalPlacings?.size == this.computedCompetitors.length
      const test3 = this.computedCompetitorsSuper.length == 1 && !this.isFinal
      const test4 = this.isOxbridgeVarsity && this.finalPlacings?.size == 6
      console.log(
        this.isOxbridgeVarsity,
        this.finalPlacings,
        this.computedCompetitors,
      )
      return test1 || test2 || test3 || test4
        ? 'bg-positive text-positive-inv'
        : 'bg-negative text-negative-inv'
    },
    competitionTitle() {
      return this.$store.state.command.competition.title
    },
    canSubmit() {
      if (this.current) {
        return true
        // const isCompleted = this.current.status === 'completed'
        // const inCanSubmit = this.$store.state.command.canSubmit?.has(
        //   this.current.id
        // )
        // return isCompleted || inCanSubmit
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
      if (
        this.competitors &&
        this.heat &&
        this.competitors[this.heat - 1] &&
        this.competitors[this.heat - 1].length > 0
      ) {
        size = size + this.competitors[this.heat - 1]?.length
      }
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
      // console.log('we are returning', toReturn)
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
      return this.$_.sortBy(this.competitors[this.heat - 1], 'number')
    },
    computedCompetitorsNumbers() {
      return this.computedCompetitors.map((o) => {
        return o.number
      })
    },
    computedFlexBoxHeight() {
      if (this.isOxbridgeVarsity) {
        return 440
      }
      if (this.isFinal) {
        // Add in "but what about 9 couple finals"
        return 560
      }
      return this.computedNumberColumns < 5 ? 530 : 642
    },
    computedNumberColumns() {
      if (this.isFinal) {
        const toReturn = Math.max(
          Math.ceil((this.computedCompetitors.length + 1) / 6),
          2,
        )
        console.log('number of columns', toReturn)
        return toReturn
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
    noCurrentEvent() {
      if (this.currentEvent) {
        return Object.keys(this.currentEvent).length === 0
      }
      return true
    },
    noCurrentOrIsNewOrSkippedEvent() {
      console.log(
        'is there a current',
        this.current,
        this.noCurrentEvent,
        this.current.status,
      )
      return (
        this.noCurrentEvent || ['new', 'skipped'].includes(this.current?.status)
      )
    },
    isBreak() {
      return !this.current.round
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
        this.timetableOrder,
      )
    },
    isFinal() {
      // return this.currentRound?.round?.round === 'F'
      return ['F', 'PO'].includes(this.currentRound?.round?.round)
      // (
      //   this.roundIdtoRound(this.currentRound.roundId).toLowerCase() === 'final'
      // )
    },
    isCompleted() {
      return this.$store.state.command.compere.completedRounds.has(
        this.currentRound.roundId,
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
      // const danceId = (this.currentRound.round.danceOrder ??
      //   this.currentRound.round.dances)[this.danceLetterIndex]

      console.log(
        'do we have a dance',
        this.timetableOrder,
        this.current.timetableOrder,
        this.isCurrentEvent,
        this.$store.getters['command/dance'],
        this.currentRound,
        this.currentRound.round.danceOrder,
        this.currentRound.round.dances,
        // danceId,
        // theDance
      )
      if (this.isCurrentEvent) {
        return this.$store.getters['command/dance']
      } else {
        const danceId = (this.currentRound.round.danceOrder ??
          this.currentRound.round.dances)[this.danceLetterIndex]
        const theDance = this.$store.getters['command/danceById'](danceId)
        console.log('we return the dance', danceId, theDance)
        return theDance
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
      set(val) {
        if (this.isCurrentEvent) {
          // console.log(val)
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
      // console.log(this.competitorsCurrent)
      // console.log(this.timetableOrder, this.current.timetableOrder)
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
    competitorsInRound() {
      const roundId = this.current.round?.id
      if (!roundId) {
        return []
      }
      const toReturn =
        this.$store.getters['command/competitorsByRoundId'](roundId) ?? []
      console.log(toReturn)
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
          this.dance,
        )
      }
      let toReturn = this.competitorsInRound
      // this.$store.getters['command/competitorsByRoundId'](roundId)
      // console.log('to return', toReturn)
      if (this.heat in this.additionalNumbers) {
        toReturn = [...toReturn]
        toReturn[this.heat - 1] = toReturn[this.heat - 1].concat([
          ...this.additionalNumbers[this.heat],
        ])
      } else if (Object.keys(this.additionalNumbers).length > 0) {
        const test = this.$_.values(this.additionalNumbers)
          .map((heatAdditionalNumbers) => {
            return [...heatAdditionalNumbers].map((competitor) => {
              return competitor.number
            })
          })
          .flat()
        toReturn[this.heat - 1] = toReturn[this.heat - 1].filter(
          (competitor) => {
            return !test.includes(competitor.number)
          },
        )
      }
      return toReturn
    },
    floor() {
      return this.currentRound?.floor
      //this.$store.state.command.floor
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
    roundText() {
      let toReturn = ''
      if (this.endOfDays) {
        return 'Competition completed!'
      }
      if (this.currentRound) {
        // toReturn = `${this.currentRound.title}${this.isFirstRoundSFF}${this.isQualifierText}`
        toReturn = `${this.currentRound.title}${this.theRoundText}${this.isFirstRoundSFF}${this.isQualifierText}`
        // if (
        //   this.currentRound.round?.dances &&
        //   (this.currentRound.round.dances.length > 1 || this.isHandwriting)
        // ) {
        //   const danceIds =
        //     this.currentRound.round.danceOrder ?? this.currentRound.round.dances
        //   const danceLetters = danceIds
        //     .map((danceId) => {
        //       const key = this.isHandwriting ? 'name' : 'abbreviation'
        //       return this.$store.getters['command/danceById'](danceId)?.[key]
        //     })
        //     .join(this.isHandwriting ? ', ' : '')
        //   toReturn = `${toReturn} (${danceLetters})`
        // }
        // if (this.isHandwriting) {
        //   toReturn = `${toReturn} (${})`
        // }
        const nDances = this.currentRound.round.dances.length
        if (nDances > 1) {
          toReturn = `${toReturn} - dance ${
            this.danceLetterIndex + 1
          }/${nDances}`
        }
        if (this.isHandwriting) {
          toReturn = `${toReturn} - ${this.dance?.name}`
        }
        // if (this.isCurrentEvent && !this.isNonCompereEvent) {
        //   toReturn = `${toReturn}, heat ${this.activeHeat}`
        // }
      }
      return toReturn
    },
    nextRoundTextResults() {
      return this.$store.getters['command/timetableEntryByTimetableOrder'](
        Number(this.timetableOrder) + 1,
      )?.title
    },
    computedNumCouples() {
      // console.log(this.competitors, this.heat, this.isOffbeat)
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
          this.timetableOrder,
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
      return this.$store.state.command.timetable
    },
    timetableCurrent() {
      return this.timetable.find((t) => {
        return t.status === 'active'
      })
    },
    timetableNextBreak() {
      console.log('next item', this.nextTimetableItem)
      return `Next: ${this.nextTimetableItem.title}<br>Floor: ${this.nextTimetableItem.floor?.name}`
    },
    nextStartTime() {
      const { startTime } = this.nextTimetableItem
      console.log('format time', startTime)
      return this.$moment(`${startTime?.date}Z`).format('HH:mm')
    },
    nextTimetableItem() {
      const newItems = this.timetable.filter((t) => {
        return ['new', 'active'].includes(t.status) && t.round
      })
      if (newItems.length > 1) {
        const toReturn = newItems.reduce((prev, curr) => {
          if (!prev) {
            return curr
          } else if (prev && curr.timetableOrder < prev.timetableOrder) {
            return curr
          } else {
            return prev
          }
        })
        return toReturn
      } else if (newItems.length === 1) {
        return newItems[0]
      }
      return null
    },
    timetableOrders() {
      return this.timetable.map((o) => {
        return o.timetableOrder
      })
    },
  },
  watch: {
    noCurrentOrIsNewOrSkippedEvent() {
      const roundId = this.current.round?.id
      if (roundId) {
        this.getCompetitors()
      }
    },
    // competitorsInRound(val) {
    //   const newLength = val.flat().length
    //   const roundId = this.current.round?.id
    //   if (newLength === 0 && roundId) {
    //     setTimeout(() => {
    //       this.getCompetitors()
    //     }, 5000)
    //   }
    // },
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
        this.echoCompetitor,
      )
    },
    currentRound(oldValue, newValue) {
      console.log('are we wathcing current round', oldValue.id != newValue.id)
      if (oldValue.id != newValue.id) {
        this.marked = new Set()
        this.considering = new Set()
        this.finalPlacings = new Map()
        this.heat = 1
        this.$store.commit('command/setCurrentHeat', this.heat)
        this.activeHeat = 1
        this.$store.dispatch('echo/shareStatus')
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
    this.checkNoCurrentEvent()
    // void this.$store.dispatch('command/getFloors')
    // void this.$store.dispatch('command/getJudges')
    // void this.$store.dispatch('command/getCompetitors')
    // void this.$store.dispatch('command/getEvents')
    // void this.$store.dispatch('command/getTimetable')
  },
  methods: {
    switchJudge() {
      this.$q
        .dialog({
          title: 'Change adjudicator',
          message: 'Are you sure you wish to change adjudicator?',
          focus: 'cancel',
          dark: true,
          class: 'bg-dark text-dark-inv',
          cancel: { label: 'No', color: 'negative', textColor: 'negative-inv' },
          ok: { label: 'Yes', color: 'positive', textColor: 'positive-inv' },
          focus: 'cancel',
        })
        .onOk(() => {
          this.$q
            .dialog({
              component: AddNumber,
              componentProps: {
                title: 'Enter Passcode',
                pin: true,
              },
            })
            .onOk((pin) => {
              if (pin == this.$store.state.command.pin) {
                return
              } else {
                const loadingDialog = this.$q.dialog({
                  message: 'Changing adjudicator, please stand by...',
                  dark: false,
                  class: 'bg-dark text-dark-inv',
                  progress: true, // we enable default settings
                  persistent: true, // we want the user to not be able to close it
                  ok: false, // we want the user to not be able to close it
                })
                this.$axios
                  .post('/auth/judgelogin', { pin })
                  .then((response) => {
                    this.$store.commit('command/storePin', pin)
                    console.log(response)
                    this.$axios.defaults.headers.common.Authorization = `Bearer ${response.headers.authorization}`
                    this.$store.commit(
                      'command/storeAuth',
                      response.headers.authorization,
                    )
                    this.$store.dispatch('command/getUserDetails').then(() => {
                      this.$store.dispatch('command/getEvents')
                      this.$store
                        .dispatch('command/updateTimetable')
                        .then(() => {
                          this.$store.commit('command/setCurrentNext')
                          this.$store.commit(
                            'command/resetCurrentTimetableOrder',
                          )
                          this.getCompetitors()
                          loadingDialog.hide()
                        })

                      this.$store.dispatch('echo/connectEcho')
                    })
                  })
                  .catch(() => {
                    this.loggingIn = false
                    loadingDialog.hide()
                    this.$q.notify({
                      color: 'negative',
                      position: 'bottom',
                      message: 'Incorrect PIN',
                      icon: 'report_problem',
                    })
                  })
              }
            })
        })
    },
    gotoNextHeat() {
      if (this.isOxbridgeVarsity) {
        this.$store.dispatch('command/getEvents')
        this.$store.dispatch('command/updateTimetable')
        let message = `Are you sure you wish to submit your placings for ${this.roundText} - ${this.varsityPairs}`
        this.$q
          .dialog({
            title: `${this.currentEvent.title} - ${this.varsityPairs}`,
            message,
            focus: 'cancel',
            dark: true,
            class: 'bg-dark text-dark-inv',
            cancel: { label: 'Cancel', color: 'positive', flat: true },
            ok: { label: 'Yes', color: 'warning', flat: true },
            focus: 'cancel',
          })
          .onOk(() => {
            this.toClear = !this.toClear
            const loadingDialog = this.$q.dialog({
              message: 'Processing marks...',
              class: 'bg-dark text-dark-inv',
              dark: false,
              progress: true, // we enable default settings
              persistent: true, // we want the user to not be able to close it
              ok: false, // we want the user to not be able to close it
            })
            this.whisperMarks(true)
            if (this.isFinal) {
              this.postPadMarks('array', {
                placed: this.placedObject,
              })
            } else {
              this.postPadMarks('array', {
                marked: [...this.marked],
                considered: [...this.considering],
              })
            }
            if (this.heat == this.competitors.length) {
              console.log(this.lastDance, 'is last dance', this.currentRound)
              if (this.lastDance) {
                this.danceLetterIndex = 0
                if (this.currentRound.round) {
                  this.$store.commit(
                    'command/completedRound',
                    this.currentRound.round.id,
                  )
                }
                // console.log('completed timetable event', this.timetableId)
                this.$store.commit(
                  'command/completedTimetableEvent',
                  this.timetableId,
                )
                this.$store.commit('command/setCurrentNext')
                this.$store.dispatch('command/getNextCompetitors')
                // const currentTimetableIndex = this.timetableOrders.indexOf(
                //   this.timetableOrder
                // )

                // this.timetableOrder =
                //   this.timetableOrders[currentTimetableIndex + 1]
                // if (!this.timetableOrder) {
                //   this.checkForNewTimetable(currentTimetableIndex + 1)
                // }
                this.$store.commit('command/resetCurrentTimetableOrder')
                this.announced = new Set()
                this.getCompetitors()
              } else {
                this.danceLetterIndex++
              }
              this.heat = 1
            } else {
              this.heat++
            }

            this.$store.commit('command/setCurrentHeat', this.heat)
            this.$store.dispatch('echo/shareStatus')
            this.activeHeat = this.heat
            this.marked = new Set()
            this.considering = new Set()
            this.finalPlacings = new Map()
            this.additionalNumbers = {}

            // console.log(loadingDialog)
            setTimeout(() => {
              loadingDialog.hide()
            }, 350)
          })
      } else {
        this.heat++
        this.$store.commit('command/setCurrentHeat', this.heat)
        this.$store.dispatch('echo/shareStatus')
      }
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
          dark: true,
          class: 'bg-dark text-dark-inv',
          cancel: { label: 'Cancel', color: 'positive', flat: true },
          ok: { label: 'Yes', color: 'warning', flat: true },
          focus: 'cancel',
        })
        .onOk(() => {
          this.toClear = !this.toClear
        })
    },
    getDetails() {
      // console.log(this.$store.getters['command/judgeMarks'])
      // this.$store.dispatch('echo/shareStoredMarks', {
      //   roundId: 2920,
      //   judgeHeat: 'D1-1',
      // })
      const approx = Math.round(
        this.currentRound?.round?.recall / this.currentRound?.round?.heats,
      )
      const message = `Recall ${this.currentRound?.round?.recall} from
                ${
                  this.currentRound?.round?.heats > 1
                    ? `${this.currentRound?.round?.heats} heats`
                    : '1 heat'
                }<br>
                <span class="text-body1">(recall approx. ${approx} per heat)</span>

                <br><br>
                Heat ${this.heat}, ${this.dance?.name}`
      // <br><br>
      // No. on floor: ${this.computedNumCouples}<br>
      //<div class="text-info">${this.floor.name}</div>
      //           ${this.isTeam ? 'teams' : 'couples'} <br>out of ${
      //   this.competitors.flat().length
      // } competitors
      this.$q.dialog({
        title: this.roundText,
        message,
        dark: true,
        html: true,
        class: 'bg-dark text-dark-inv text-subtitle1',
        cancel: false,
        ok: {
          label: 'OK',
          color: 'positive',
          class: 'text-positive-inv',
          unelevated: true,
        },
        focus: 'ok',
      })
      // .onCancel(() => {
      //   this.viewCompetitors(this.currentRound)
      // })
    },
    viewCompetitors(timetableItem) {
      const roundId = timetableItem.round.id
      this.$store
        .dispatch('command/getCompetitorsByRoundId', roundId)
        // this.$axios
        //   .get(`/round/${roundId}/competitors`)
        .then(() => {
          const competitors =
            this.$store.getters['command/competitorsByRoundId'](roundId).flat()
          // console.log('view competitors in', timetableItem, competitors)
          const evt = this.getEvent(roundId)
          // console.log(evt)
          // const isFinal = timetableItem.round.round === 'F'
          let title = ''
          // if (isFinal) {
          //   title = 'final'
          // } else {
          title = `round ${timetableItem.round.round}`
          if (timetableItem.round.round === 'SF') {
            title = 'semi-final'
          } else if (timetableItem.round.round === 'F') {
            title = 'final'
          } else if (timetableItem.round.round === 'PO') {
            title = 'play-off'
          }
          if (timetableItem.round.isQualifier) {
            title = 'qualifier'
          }
          // }
          if (evt) {
            this.$q.dialog({
              component: this.$customDialog.Competitors,
              componentProps: {
                title: `${evt.title}, ${title}`,
                competitors,
                isFinal: false,
                team: evt.isTeam,
                // team: this.event.team,
                leftText: '',
                // `${this.round.heats} heat${
                //   this.round.heats > 1 ? 's' : ''
                // }`,
                rightText: '', //`${recalled.length} recalled`,
              },
            })
          }
        })
        .catch(this.$common.axiosError)
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
    placingClassCompetitors(competitor) {
      let toReturn = ''
      if (!competitor.number) {
        toReturn = 'bg-white'
      } else {
        toReturn = 'bg-positive text-positive-inv'
      }
      toReturn = `${toReturn} ${
        this.isFinal
          ? `competitor-number-final competitor-number-final-${this.placings.length}`
          : 'competitor-number'
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
        this.isFinal
          ? `competitor-number-final competitor-number-final-${this.placings.length}`
          : 'competitor-number'
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
        if (this.selectedFinalNumber === no) {
          toReturn = 'bg-info text-info-inv'
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
        this.isFinal
          ? `competitor-number-final competitor-number-final-${this.placings.length}`
          : 'competitor-number'
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
          timetableOrder,
        )
      // console.log('tOrder', tOrder)
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
      // console.log('in get competitors', this.competitors)
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
      this.$store.dispatch('command/updateCurrent')
      this.$store
        .dispatch(
          'command/getCompetitorsByRoundId',
          this.$store.state.command.current.round.id,
        )
        .then((dat) => {
          this.loadingState = false
          // console.log(dat)
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
    selectPlacing(placing) {
      if (!this.selectedFinalNumber) {
        this.selectedFinalPlacing = placing
        return
      }
      const { value } = placing
      console.log('we selected a value', value, this.selectedFinalNumber)
      const storedNumbers = [...this.finalPlacings.values()]
      if (storedNumbers.includes(this.selectedFinalNumber)) {
        const keys = [...this.finalPlacings.keys()]
        keys.forEach((key) => {
          if (this.finalPlacings.get(key) == this.selectedFinalNumber) {
            this.finalPlacings.delete(key)
          }
        })
      }
      this.finalPlacings.set(value, this.selectedFinalNumber)
      this.selectedFinalNumber = null
      console.log('what do we have as finals placings', this.finalPlacings)
      console.log('and as a placed list', placedList)
    },
    markCompetitorFinal(number) {
      // console.log('now we place', this.selectedFinalPlacing, number)
      if (!this.selectedFinalPlacing) {
        this.selectedFinalNumber = number
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
      console.log('what do we have as finals placings', this.finalPlacings)
      const placedList = this.placings.map((placing) => {
        return this.placedObject[placing.value] ?? -1
      })
      console.log('and as a placed list', placedList)
      this.whisperMarks()
    },
    markCompetitor({ number }) {
      // console.log(number, this.marked, this.considering)
      if (!this.isCurrentEvent) {
        return
      }
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
      this.whisperMarks()
    },
    whisperMarks(completed = false) {
      const roundId = this.currentRound.round.id
      let unmarked = -10000
      const placedList = this.placings.map((placing) => {
        unmarked--
        return this.placedObject[placing.value] ?? unmarked
      })
      console.log('now we start the whisper stuff', placedList)
      const tapMarked = this.isFinal ? placedList : [...this.marked]
      const danceIds =
        this.currentRound.round.danceOrder ?? this.currentRound.round.dances
      const toPost = {
        roundId,
        id: this.currentRound.id,
        dance: danceIds[this.danceLetterIndex],
        judge: this.myAdjudicator,
        numbers: tapMarked,
        isFinal: this.isFinal,
        handwriting: false,
        completed,
        isOxbridgeVarsity: this.isOxbridgeVarsity,
        heat: this.heat,
      }
      let judgeHeat = `${toPost.judge.letter}-${toPost.dance}`
      if (this.isOxbridgeVarsity) {
        judgeHeat = `${toPost.judge.letter}-${toPost.dance}-${this.heat}`
      }
      console.log('now we start the whisper stuff 2', toPost)
      this.$store.commit('command/newJudgeHeatTempMarks', {
        roundId,
        judgeHeat,
        force: this.isFinal,
      })
      console.log('do we finish whisper', this.isFinal)
      // if (!this.$store.state.command.scrutineering.tempMarks[roundId]) {
      //   this.$store.commit('command/saveTempMarks', {
      //     roundId,
      //     marks: new Map(),
      //   })
      // }
      const savedMarks =
        this.$store.state.command.scrutineering.tempMarks[roundId]

      console.log(savedMarks, judgeHeat, toPost.numbers, [
        ...savedMarks.get(judgeHeat),
      ])
      // if (!savedMarks.has(judgeHeat)) {

      // }
      const toAdd = this.$_.difference(toPost.numbers, [
        ...savedMarks.get(judgeHeat),
      ])
      console.log('what is to add?', toAdd)
      const toRemove = this.$_.difference(
        [...savedMarks.get(judgeHeat)],
        toPost.numbers,
      )
      console.log(tapMarked, toAdd, toRemove, toPost.numbers, [
        ...savedMarks.get(judgeHeat),
      ])
      for (const no of toAdd) {
        this.$store.commit('command/judgeHeatTempMark', {
          roundId,
          judgeHeat: judgeHeat,
          no,
          action: 'add',
        })
        // this.currentJudgeMarks.add(no)
      }
      console.log('we did the add')
      for (const no of toRemove) {
        this.$store.commit('command/judgeHeatTempMark', {
          roundId,
          judgeHeat: this.judgeHeat,
          no,
          action: 'delete',
        })
      }
      console.log('we did the remove')
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
          component: AddNumber,
          componentProps: {
            title: 'Add number',
          },
        })
        .onOk((newNumber) => {
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
              this.whisperMarks()
              const competitor = this.$store.state.command.competitors.find(
                (competitor) => {
                  return competitor.number === num
                },
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
      console.log(info)
      if (this.isHandwriting || this.isOxbridgeVarsity) {
        return
      }
      // console.log('swipg', info)
      // if (info.duration < 50) {
      //   return
      // }
      // const numHeats = this.currentRound?.round?.heats
      // if (info.direction === 'right' && this.heat > 1) {
      //   this.heat = this.heat - 1
      // }
      // if (info.direction === 'left' && this.heat < numHeats) {
      //   this.heat = this.heat + 1
      // }
      // this.$store.commit('command/setCurrentHeat', this.heat)
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
          this.timetableOrder,
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
      const dance = danceIds[this.danceLetterIndex]
      const toPost = {
        roundId,
        dance,
        judge: this.myAdjudicator,
        image: jpgDownload,
        handwriting: true,
      }
      this.$store.commit('command/newJudgeHeatTempImage', {
        roundId,
        judgeHeat: `${this.myAdjudicator.letter}-${dance}`,
        image: jpgDownload,
      })
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
      // const toAdd = this.$_.difference(toPost.numbers, [...savedMarks.get(judgeHeat)])
      // const toRemove = this.$_.difference(
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
      this.$store.dispatch('command/getEvents')
      this.$store.dispatch('command/updateTimetable')
      let message = `Are you sure you wish to submit your ${
        this.isFinal ? 'placings' : 'marks'
      } for ${this.roundText}`
      const spotOn =
        this.marked?.size == this.currentRound.round.recall ||
        this.isHandwriting ||
        this.currentRound.round.recall == 0
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
        message = `${message}, you have recalled ${this.marked?.size} out of ${this.currentRound.round.recall}`
      }
      if (this.computedCompetitorsSuper.length != 1) {
        this.$q
          .dialog({
            title: this.currentEvent.title,
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
              class: 'bg-dark text-dark-inv',
              progress: true, // we enable default settings
              persistent: true, // we want the user to not be able to close it
              ok: false, // we want the user to not be able to close it
            })
            if (this.isHandwriting) {
              this.submitHandwritingMarks(jpgDownload)
              this.postPadMarks('file', jpgDownload)
            } else {
              this.whisperMarks(true)
              if (this.isFinal) {
                this.postPadMarks('array', {
                  placed: this.placedObject,
                })
              } else {
                this.postPadMarks('array', {
                  marked: [...this.marked],
                  considered: [...this.considering],
                })
              }
            }
            this.heat = 1
            this.$store.commit('command/setCurrentHeat', 1)
            this.activeHeat = 1
            this.marked = new Set()
            this.considering = new Set()
            this.finalPlacings = new Map()
            this.additionalNumbers = {}
            // console.log(this.lastDance, 'is last dance', this.currentRound)
            if (this.lastDance) {
              this.danceLetterIndex = 0
              if (this.currentRound.round) {
                this.$store.commit(
                  'command/completedRound',
                  this.currentRound.round.id,
                )
              }
              // console.log('completed timetable event', this.timetableId)
              this.$store.commit(
                'command/completedTimetableEvent',
                this.timetableId,
              )
              this.$store.commit('command/setCurrentNext')
              this.$store.dispatch('command/getNextCompetitors')
              // const currentTimetableIndex = this.timetableOrders.indexOf(
              //   this.timetableOrder
              // )
              this.$store.commit('command/resetCurrentTimetableOrder')
              // this.timetableOrder =
              //   this.timetableOrders[currentTimetableIndex + 1]
              // if (!this.timetableOrder) {
              //   this.checkForNewTimetable(currentTimetableIndex + 1)
              // }
              this.announced = new Set()
              this.getCompetitors()
            } else {
              this.danceLetterIndex++
            }
            // console.log(loadingDialog)
            setTimeout(() => {
              loadingDialog.hide()
              this.$store.dispatch('echo/shareStatus')
            }, 350)
          })
      } else {
        if (this.isHandwriting) {
          this.submitHandwritingMarks(jpgDownload)
          this.postPadMarks('file', jpgDownload)
        } else {
          this.whisperMarks(true)
          if (this.isFinal) {
            this.postPadMarks('array', {
              placed: this.placedObject,
            })
          } else {
            this.postPadMarks('array', {
              marked: [...this.marked],
              considered: [...this.considering],
            })
          }
        }
        this.heat = 1
        this.$store.commit('command/setCurrentHeat', 1)
        this.activeHeat = 1
        this.marked = new Set()
        this.considering = new Set()
        this.finalPlacings = new Map()
        this.additionalNumbers = {}
        // console.log(this.lastDance, 'is last dance', this.currentRound)
        if (this.lastDance) {
          this.danceLetterIndex = 0
          if (this.currentRound.round) {
            this.$store.commit(
              'command/completedRound',
              this.currentRound.round.id,
            )
          }
          // console.log('completed timetable event', this.timetableId)
          this.$store.commit(
            'command/completedTimetableEvent',
            this.timetableId,
          )
          this.$store.commit('command/setCurrentNext')
          this.$store.dispatch('command/getNextCompetitors')
          this.$store.commit('command/resetCurrentTimetableOrder')
          // const currentTimetableIndex = this.timetableOrders.indexOf(
          //   this.timetableOrder
          // )
          // this.timetableOrder = this.timetableOrders[currentTimetableIndex + 1]
          // if (!this.timetableOrder) {
          //   this.checkForNewTimetable(currentTimetableIndex + 1)
          // }
          this.announced = new Set()
          this.getCompetitors()
        } else {
          this.danceLetterIndex++
        }
        // console.log(loadingDialog)
        setTimeout(() => {
          loadingDialog.hide()
          this.$store.dispatch('echo/shareStatus')
        }, 350)
      }
    },
    checkForNewTimetable(nextIndex) {
      this.$store.dispatch('command/updateTimetable').then(() => {
        this.timetableOrder = this.timetableOrders[nextIndex]
        if (!this.timetableOrder) {
          setTimeout(() => {
            this.checkForNewTimetable(nextIndex)
          }, 1500)
        }
      })
    },
    postPadMarks(type, data) {
      const toPost = {
        roundId: this.currentRound.round.id,
        compAdjId: this.myAdjudicator.id,
        danceId: this.dance.id,
        type,
      }
      if (type === 'file') {
        toPost.fileData = data
      } else {
        toPost.marks = data
      }
      if (this.isOxbridgeVarsity) {
        toPost.varsityHeat = this.heat - 1
      }
      this.$axios.post('padmarks/add', toPost).catch(this.$common.axiosError)
    },
    // POST padmarks/add (adds padmarks) - takes roundId, compAdjId, type (file or array) - if type==file then fileData or if type==array then marks)
    start() {
      // this.pingRecallAPI()
      if (this.submitButtonText === 'Proceed to next event') {
        this.$store.dispatch('command/getEvents')
        this.$store.dispatch('command/updateTimetable')
        this.announceRestart = 'Activate display'
        this.danceLetterIndex = 0
        this.$store.commit('command/setCurrentDance', 0)
        this.heat = 1
        this.$store.commit('command/setCurrentHeat', 1)
        this.activeHeat = 1
        this.active = false
        if (this.currentRound.round) {
          this.$store.commit(
            'command/completedRound',
            this.currentRound.round.id,
          )
        }
        // console.log('completed timetable event', this.timetableId)
        this.$store.commit('command/completedTimetableEvent', this.timetableId)
        this.$store.commit('command/setCurrentNext')
        this.$store.dispatch('command/getNextCompetitors')
        this.submitButtonText = 'Start heat'
        this.subYes = 'bg-primary text-primary-inv'
        // this.subYes = 'bg-warning text-warning-inv'
        // this.timetableOrder++
        // const currentTimetableIndex = this.timetableOrders.indexOf(
        //   this.timetableOrder
        // )
        // this.timetableOrder = this.timetableOrders[currentTimetableIndex + 1]
        this.$store.commit('command/resetCurrentTimetableOrder')
        this.announced = new Set()
        // this.subYes = 'bg-warning text-warning-inv'
        this.getCompetitors()
      } else if (this.submitButtonText === 'Proceed to next dance') {
        this.submitButtonText = 'Start Heat'
        this.announceRestart = 'Activate display'
        this.subYes = 'bg-primary text-primary-inv'
        this.danceLetterIndex++
        this.heat = 1
        this.$store.commit('command/setCurrentHeat', 1)
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
    checkRoundExceptions() {
      this.$axios
        .get('/comp/' + this.comp.id + '/submittedMarks')
        .then((response) => {
          this.judgeExceptions = []
          // if (this.$q.localStorage.has('judge-exceptions')) { this.judgeExceptions = this.$q.localStorage.getItem('judge-exceptions') } else { this.judgeExceptions = [] }
          let data = response.data
          let oKeys = Object.keys(data)
          let intersection = oKeys.filter((x) =>
            this.completedRoundIds.includes(parseInt(x, 10)),
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
      this.$store.commit('command/setCurrentHeat', this.heat)
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
        // console.log(o.id, o.danceOrder)
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
          this.$store.commit('command/setCurrentHeat', this.heat)
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
