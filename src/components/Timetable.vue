<template>
  <q-toolbar
    class="bg-primary text-white shadow-2 q-pr-xs"
    style="position: fixed; top: 0px; z-index: 666; height: 56px"
  >
    <q-toolbar-title class="col-10 q-mr-md">Timetable</q-toolbar-title>
    <div class="col-auto">
      <tippy
        ref="timetable-close-btn"
        content="Tap here to close"
        trigger="manual"
        :placement="'left-end'"
        allow-h-t-m-l
        interactive
        :hide-on-click="false"
        :popper-options="popperOptions"
      >
        <q-btn
          icon="close"
          color="accent"
          round
          dense
          unelevated
          @click="close"
        />
      </tippy>
    </div>
  </q-toolbar>
  <div style="height: 56px"></div>
  <q-list no-border link inset-delimiter>
    <q-item
      class="bg-primary text-white text-center text-h6 row justify-between"
    >
      <q-btn
        dense
        flat
        color="white"
        icon="checklist"
        label="demo"
        @click="$emit('demo')"
      />
      <q-btn
        dense
        flat
        color="white"
        icon="menu"
        label="menu"
        @click="$emit('menu')"
      />
    </q-item>

    <div
      v-for="event in filteredTimetableWithHeaders"
      :key="event.timetableOrder"
      :ref="`timetable-${event.timetableOrder}`"
      @click="viewEventDetails(event)"
    >
      <q-item
        v-if="'header' in event"
        class="bg-accent text-white text-center text-h6"
      >
        {{ event.section.name }}
      </q-item>
      <q-item
        v-else
        :class="activeCol(event)"
        multiline
        style="cursor: pointer"
      >
        <q-item-section avatar>
          {{ formatTime(event.startTime) }}
        </q-item-section>
        <q-item-section>
          <q-item-label>
            {{ eventText(event) }}
          </q-item-label>
          <q-item-label caption :class="captionCol(event)">{{
            event.round.floor.name
          }}</q-item-label>
        </q-item-section>

        <q-item-section v-if="roundStatus(event)" avatar
          ><q-avatar
            v-if="roundStatus(event).icon != ''"
            left
            :text-color="roundStatus(event).color"
            :icon="roundStatus(event).icon"
            ><q-tooltip v-if="roundStatus(event).tooltip">{{
              roundStatus(event).tooltip
            }}</q-tooltip>
          </q-avatar>
        </q-item-section>
      </q-item>
    </div>
  </q-list>
</template>

<script lang="ts">
import { v1, v2 } from 'src/@types/command'
import { defineComponent } from 'vue'
import { mapState } from 'vuex'
import { scroll } from 'quasar'
// import { timeStamp } from 'console'
const { getScrollTarget, setVerticalScrollPosition } = scroll

interface TimetableData {
  popperOptions: Record<string, unknown>
  selectF: v1.Floor | null
  roundIdtoRound: (roundId: number) => string
}
interface RoundStatus {
  tooltip: string
  icon: string
  color: string
}
interface HeaderItem {
  section: { id: number; name: string }
  header: true
  timetableOrder: number
}
export default defineComponent({
  name: 'CompTimetable',
  props: {
    modelValue: { type: Boolean, default: false },
  },
  emits: ['menu', 'close', 'demo'],
  data(): TimetableData {
    return {
      popperOptions: {
        strategy: 'fixed',
        modifiers: [
          {
            name: 'flip',
            options: {
              fallbackPlacements: [],
            },
          },
        ],
      },
      selectF: this.$store.state.command.floor,
      roundIdtoRound: this.$store.getters['command/roundIdtoRound'],
      // ? this.$store.state.command.floor
      // : null,
    }
  },
  computed: {
    ...mapState('command', ['floors', 'timetable', 'userDetails']),
    isDemo() {
      return this.$store.state.command.demo
    },
    timetableCloseButton() {
      return this.$refs['timetable-close-btn']
    },
    current() {
      const toReturn = this.filteredTimetable.find((t) => {
        return t.status === 'active'
      })
      if (!toReturn && !this.next?.round) {
        return this.next
      }
      return toReturn
    },
    nextButOne() {
      const newItems = this.filteredTimetable.filter((t) => {
        return t.status === 'new' && t.id != this.next.id
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
    next() {
      const newItems = this.filteredTimetable.filter((t) => {
        return t.status === 'new'
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
    filteredTimetable(): v2.TimetableItem[] {
      return this.$store.state.command.timetable
      // getters['command/timetableByFloor'](this.selectF)
    },
    filteredTimetableWithHeaders(): (v2.TimetableItem | HeaderItem)[] {
      const filteredTimetable = [...this.filteredTimetable]
      let timetableOrder = 10000
      if (filteredTimetable.length > 0) {
        const toReturn: (v2.TimetableItem | HeaderItem)[] = []
        let currentSection = filteredTimetable[0].section
        if (currentSection) {
          toReturn.push({
            header: true,
            section: currentSection,
            timetableOrder,
          })
        }
        for (const timetableItem of filteredTimetable) {
          if (
            timetableItem.section &&
            timetableItem.section.id !== currentSection?.id
          ) {
            currentSection = timetableItem.section
            timetableOrder++
            toReturn.push({
              header: true,
              section: currentSection,
              timetableOrder,
            })
          }
          toReturn.push(timetableItem)
        }
        return toReturn
      }
      return []
    },
    userRoles() {
      return this.userDetails.roles
    },
    competitionId() {
      return this.$store.state.command.competition.id
    },
  },
  watch: {
    '$store.state.command.floor'() {
      // console.log(this.$store.state.command.floor)
      this.selectF = this.$store.state.command.floor
    },
    modelValue(newVal) {
      if (newVal) {
        this.scrollToNow()
        this.demoCheck()
      } else {
        if (this.isDemo && this.timetableCloseButton) {
          this.timetableCloseButton.hide()
        }
      }
    },
  },
  mounted() {
    this.demoCheck()
  },
  methods: {
    demoCheck() {
      if (this.isDemo && this.modelValue && this.timetableCloseButton) {
        this.$q
          .dialog({
            dark: true,
            title: 'Timetable',
            class: 'bg-primary text-white',
            message:
              'This is your timetable for the day, you can scroll up and down to see events, and tap on them to get more details. The current event will be highlighted in green, and the next event in yellow.',
            html: true,
            cancel: false, //{ label: 'Cancel', color: 'positive', flat: true },
            ok: true, //{ label: 'Options', color: 'warning', flat: true },
            focus: 'cancel',
          })
          .onDismiss(() => {
            setTimeout(() => {
              this.timetableCloseButton.show()
            }, 1500)
          })
      }
      if (!this.isDemo && this.modelValue) {
        this.timetableCloseButton.hide()
      }
    },
    close() {
      if (this.isDemo && this.timetableCloseButton) {
        this.timetableCloseButton.hide()
      }
      this.$emit('close')
    },
    startDemo() {
      //
    },
    theRoundText(evt) {
      const roundId = evt.round?.round
      const isResults = evt.result?.id
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
    eventText(evt) {
      if (this.competitionId > 20) {
        const roundText = this.theRoundText(evt)
        return `${evt.title}${roundText}`
      }
      return evt.title
    },
    scrollToNow() {
      // const toScroll = `timetable-${this.$store.state.command.current.timetableOrder}`
      let toScroll = ''
      if (this.current) {
        toScroll = `timetable-${this.current.timetableOrder}`
      } else if (this.next) {
        toScroll = `timetable-${this.next.timetableOrder}`
      }
      if (toScroll) {
        const el = (this.$refs[toScroll] as HTMLElement[])?.[0]
        if (el) {
          const target = getScrollTarget(el)
          const offset = el.offsetTop - 56
          const duration = 1
          setVerticalScrollPosition(target, offset, duration)
        }
      }
    },
    roundStatus(event: v2.TimetableItem): RoundStatus {
      // console.log(event.round, this.$store.state.command.compere.completedRounds, this.$store.state.command.compere.completedTimetableEvents )
      if (event.status === 'skipped') {
        return { tooltip: 'Skipped', icon: 'close', color: 'negative' }
      }
      // if (event.status === 'completed') {
      //   return { tooltip: 'Skipped', icon: 'close', color: 'negative' }
      // }
      if (
        event.round &&
        this.$store.state.command.compere.completedRounds.has(event.round.id)
      ) {
        return { tooltip: 'Completed', icon: 'done', color: 'positive' }
      }
      if (
        !event.round &&
        this.$store.state.command.compere.completedTimetableEvents.has(event.id)
      ) {
        return { tooltip: 'Completed', icon: 'done', color: 'positive' }
      }
      if (event.status === 'completed') {
        return { tooltip: 'Completed', icon: 'done', color: 'positive' }
      }
      // if (
      //   event.round &&
      //   this.$store.state.command.scrutineering.competitors[event.round.id]
      //     ?.length > 0
      // ) {
      //   return { tooltip: 'Competitors ready', icon: 'people', color: 'white' }
      // }
      return { tooltip: '', icon: '', color: 'white' }
    },
    activeCol(event: v2.TimetableItem): string {
      const current = this.current //this.$store.state.command.current
      const next = this.next //this.$store.state.command.next
      if (event.id === current?.id) {
        return 'bg-positive text-black'
      } else if (event.id === next?.id) {
        return 'bg-warning text-black'
      } else if (
        event.round?.id &&
        current?.round?.id &&
        event.round.id === current?.round.id
      ) {
        return 'bg-positive text-black'
      } else if (
        event.round?.id &&
        next?.round?.id &&
        event.round.id === next?.round.id
      ) {
        return 'bg-warning text-black'
      } else if (current?.id === next?.id && event.id === this.nextButOne?.id) {
        return 'bg-warning text-black'
      }
      return 'bg-dark text-white'
      // alert(inColindex)
      // for (let j = 0; j < this.completedEvents.length; j++) {
      //   if (this.completedEvents[j] === inColindex.roundId) {
      //    return 'backgroundColor: lightgrey'
      //  }
      // }
      // for (let i = 0; i < this.activeEvents.length; i++) {
      //  if (inColindex.roundId === this.activeEvents[i]) {
      //    return 'backgroundColor: lightgreen'
      //  }
      // }
      // for (let i = 0; i < this.nextEvents.length; i++) {
      //  if (inColindex.roundId === this.nextEvents[i]) {
      //    this.$q.localStorage.set('upNext', inColindex)
      //    return 'backgroundColor: lightblue'
      //  }
      // }
      // return 'backgroundColor: white'
      // if (inColindex === activeEvent) {
      //  return 'backgroundColor: Green'
      // } else if (inColindex === activeEvent + 1) {
      //  return 'backgroundColor: Orange'
      // } else if (inColindex < activeEvent) {
      //  return 'backgroundColor: Grey'
      // } else {
      //  return 'backgroundColor: White'
      // }
    },
    captionCol(event: v2.TimetableItem): string {
      const current = this.current //this.$store.state.command.current
      const next = this.next //this.$store.state.command.next
      if (event.id === current?.id) {
        return 'text-dark'
      } else if (event.id === next?.id) {
        return 'text-dark'
      } else if (
        event.round?.id &&
        current?.round?.id &&
        event.round.id === current?.round.id
      ) {
        return 'text-dark'
      } else if (
        event.round?.id &&
        next?.round?.id &&
        event.round.id === next?.round.id
      ) {
        return 'text-dark'
      } else if (current?.id === next?.id && event.id === this.nextButOne?.id) {
        return 'text-dark'
      }
      return 'text-info'
      // alert(inColindex)
      // for (let j = 0; j < this.completedEvents.length; j++) {
      //   if (this.completedEvents[j] === inColindex.roundId) {
      //    return 'backgroundColor: lightgrey'
      //  }
      // }
      // for (let i = 0; i < this.activeEvents.length; i++) {
      //  if (inColindex.roundId === this.activeEvents[i]) {
      //    return 'backgroundColor: lightgreen'
      //  }
      // }
      // for (let i = 0; i < this.nextEvents.length; i++) {
      //  if (inColindex.roundId === this.nextEvents[i]) {
      //    this.$q.localStorage.set('upNext', inColindex)
      //    return 'backgroundColor: lightblue'
      //  }
      // }
      // return 'backgroundColor: white'
      // if (inColindex === activeEvent) {
      //  return 'backgroundColor: Green'
      // } else if (inColindex === activeEvent + 1) {
      //  return 'backgroundColor: Orange'
      // } else if (inColindex < activeEvent) {
      //  return 'backgroundColor: Grey'
      // } else {
      //  return 'backgroundColor: White'
      // }
    },
    timetableOptions() {
      const title = 'Competition options'
      const message = 'Please select from the following options'
      const items =
        this.selectF && this.selectF.id !== this.$store.state.command.floor.id
          ? [
              {
                label: `Set current floor to ${this.selectF?.name}`,
                value: '1',
              },
              { label: 'Check all rounds for competitors', value: '2' },
              {
                label: 'Mark all previous rounds completed and set current',
                value: '3',
                color: 'negative',
              },
            ]
          : [
              { label: 'Check all rounds for competitors', value: '2' },
              {
                label: 'Mark all previous rounds completed and set current',
                value: '3',
                color: 'negative',
              },
            ]
      this.$q
        .dialog({
          dark: true,
          title,
          class: 'bg-primary text-white',
          message,
          html: true,
          cancel: { label: 'Cancel', color: 'positive', flat: true },
          ok: { label: 'Ok', color: 'warning', flat: true },
          focus: 'cancel',
          options: {
            type: 'radio',
            model: '0',
            // inline: true
            items,
          },
        })
        .onOk((option: string) => {
          switch (option) {
            case '1':
              this.$store.commit('command/setFloorById', this.selectF?.id)
              this.$store.commit('command/setCurrentNext')
              this.$store.dispatch('command/getNextCompetitors')
              this.$store.commit('command/setTimetableOrderToCurrent')
              break
            case '2':
              this.$store.dispatch(
                'command/getAllCompetitorsByFloorId',
                this.selectF?.id
              )
              break
            default:
          }
        })
    },
    roundOptions(round: v2.TimetableItem) {
      const title = round.title
      const message = 'Please select from the following options'
      const current = this.$store.state.command.current
      const items = [
        { label: 'Judge this round', value: '1', color: 'positive' },
      ]
      if (round.round) {
        // if (
        //   this.userRoles.includes('sysAdmin') ||
        //   this.userRoles.includes('scrutineer')
        // ) {
        //   items.push({
        //     label: 'Scrutineer this round',
        //     value: '2',
        //     color: 'warning',
        //   })
        // }
        items.push({ label: 'View competitors', value: '4', color: 'positive' })
      }
      if (round.id > current?.id) {
        items.push({
          label: 'Mark all previous rounds completed and set current',
          value: '3',
          color: 'negative',
        })
      }
      this.$q
        .dialog({
          dark: true,
          title,
          class: 'bg-primary text-white',
          message,
          html: true,
          cancel: { label: 'Cancel', color: 'positive', flat: true },
          ok: { label: 'Ok', color: 'warning', flat: true },
          focus: 'cancel',
          options: {
            type: 'radio',
            model: '1',
            // inline: true
            items,
          },
        })
        .onOk((option: string) => {
          // console.log(
          //   'line 219',
          //   round.round.floor.id,
          //   this.$store.state.command.floor.id
          // )
          if (round.round && option != '4') {
            this.$store.commit('command/setDanceLetterIndex', 0)
            if (round.round.floor.id !== this.$store.state.command.floor.id) {
              this.$common.popup({
                title: 'Changing floors',
                message:
                  'You have selected an event which is on a different floor, so we are automatically changing floors',
              })
              this.$store.commit('command/setFloorById', round.round.floor.id)
            }
            this.$store.dispatch(
              'command/getCompetitorsByRoundId',
              round.round.id
            )
            this.$store.commit('command/overrideCurrent', round)
            this.$store.dispatch('command/getNextCompetitors')
          } else if (option != '4') {
            this.$store.commit('command/overrideCurrent', round)
          }
          switch (option) {
            case '1':
              this.$router.push('/judge')
              break
            case '2':
              this.$router.push('/scrutineer/main')
              break
            case '3':
              this.$q.loading.show()
              this.$store
                .dispatch('command/setAllPreviousComplete', round)
                .then(() => {
                  this.$q.loading.hide()
                })
              this.$store.commit('command/setCurrentNext')
              this.$router.push('/judge')
              break
            case '4':
              this.viewCompetitors(round)
            default:
          }
        })
    },
    getEvent(roundId: number) {
      const currentEvent = this.$store.state.command.events.find((evt) => {
        const roundIds = evt.rounds.map((round) => {
          return round.id
        })
        return roundIds.includes(roundId)
      })
      console.log(currentEvent)
      return currentEvent
    },
    viewCompetitors(timetableItem: v2.TimetableItem) {
      const roundId = timetableItem.round.id
      this.$store
        .dispatch('command/getCompetitorsByRoundId', roundId)
        // this.$axios
        //   .get(`/round/${roundId}/competitors`)
        .then(() => {
          const competitors =
            this.$store.getters['command/competitorsByRoundId'](roundId).flat()
          console.log('view competitors in', timetableItem, competitors)
          const evt = this.getEvent(roundId)
          console.log(evt)
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
    formatTime(startTime: { date: string }): string {
      return this.$moment(`${startTime?.date}Z`).format('HH:mm')
    },
    viewEventDetails(round: v2.TimetableItem | HeaderItem) {
      if ('header' in round) {
        return
      }
      const title = round.title
      let message = ''
      if (round.round) {
        const approx = Math.round(round.round.recall / round.round.heats)
        message = `${round.round.floor.name} at ${this.formatTime(
          round.startTime
        )}<br>${round.round.heats} heat(s), recalling ${
          round.round.recall
        } (recall approx. ${approx} per heat)<br>Adjudicators: ${round.round.adjudicators
          .map((o) => {
            return o.letter
          })
          .sort()
          .join('')}`
      } else {
        message = `This is a non-scrutineered event at ${this.formatTime(
          round.startTime
        )}`
      }
      this.$q.dialog({
        dark: true,
        title,
        class: 'bg-primary text-white',
        message,
        html: true,
        cancel: false, //{ label: 'Cancel', color: 'positive', flat: true },
        ok: true, //{ label: 'Options', color: 'warning', flat: true },
        focus: 'cancel',
      })
      // .onOk(() => {
      //   this.roundOptions(round)
      //   // this.$store.commit('command/setCurrentNext')
      // })
    },
  },
})
</script>
