<template>
  <q-toolbar
    class="bg-primary text-white shadow-2 q-pr-xs"
    style="position: fixed; top: 0px; z-index: 666; height: 56px"
  >
    <q-toolbar-title class="col-10 q-mr-md">Timetable</q-toolbar-title>
    <div class="col-auto">
      <q-btn icon="close" round dense flat @click="$emit('close')" />
    </div>
  </q-toolbar>
  <div style="height: 56px"></div>
  <q-list no-border link inset-delimiter>
    <!--        :sublabel="event.name" color="red"-->
    <q-item class="bg-primary text-white text-center text-h6">
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
        multiline
        :class="activeCol(event)"
        style="cursor: pointer"
      >
        <q-item-section avatar>
          <!-- event.timetableOrder -->
          {{ formatTime(event.startTime) }}</q-item-section
        >
        <q-item-section>
          <q-item-label>
            {{ eventText(event) }}
            <!-- {{ event.section.name }} - {{ event.title }} -->
          </q-item-label>
          <!-- {{ event.dances }}{{ event.round?.isQualifier ? ' (Qualifier)' : '' }} -->
          <!-- <q-item-label caption :class="activeCol(event)">{{
            roundIdtoRound(event.roundId)
          }}</q-item-label> -->
        </q-item-section>

        <q-item-section avatar
          ><q-avatar
            v-if="roundStatus(event).icon != ''"
            left
            :text-color="roundStatus(event).color"
            :icon="roundStatus(event).icon"
            ><q-tooltip>{{ roundStatus(event).tooltip }}</q-tooltip>
          </q-avatar></q-item-section
        >
      </q-item>
    </div>
  </q-list>
</template>

<script lang="ts">
import { v1, v2 } from 'src/@types/command'
import { defineComponent } from 'vue'
import { mapState } from 'vuex'
import { scroll } from 'quasar'
const { getScrollTarget, setVerticalScrollPosition } = scroll

interface TimetableData {
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
  emits: ['menu', 'close'],
  data(): TimetableData {
    return {
      selectF: this.$store.state.command.floor,
      roundIdtoRound: this.$store.getters['command/roundIdtoRound'],
      // ? this.$store.state.command.floor
      // : null,
    }
  },
  computed: {
    ...mapState('command', ['floors', 'timetable', 'userDetails']),
    filteredTimetable(): v2.TimetableItem[] {
      return this.$store.state.command.timetable
      // getters['command/timetableByFloor'](this.selectF)
    },
    filteredTimetableWithHeaders(): (v2.TimetableItem | HeaderItem)[] {
      const filteredTimetable = [...this.filteredTimetable]
      let timetableOrder = 10000
      if (filteredTimetable.length > 0) {
        let currentSection = filteredTimetable[0].section
        const toReturn: (v2.TimetableItem | HeaderItem)[] = [
          {
            header: true,
            section: currentSection,
            timetableOrder,
          },
        ]
        for (const timetableItem of filteredTimetable) {
          if (
            timetableItem.section &&
            timetableItem.section.id !== currentSection.id
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
      }
    },
  },
  methods: {
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
      const toScroll = `timetable-${this.$store.state.command.current.timetableOrder}`
      const el = (this.$refs[toScroll] as HTMLElement[])?.[0]
      if (el) {
        const target = getScrollTarget(el)
        const offset = el.offsetTop - 56
        const duration = 1
        setVerticalScrollPosition(target, offset, duration)
      }
    },
    roundStatus(event: v2.TimetableItem): RoundStatus {
      // console.log(event.round, this.$store.state.command.compere.completedRounds, this.$store.state.command.compere.completedTimetableEvents )
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
      if (
        event.round &&
        this.$store.state.command.scrutineering.competitors[event.round.id]
          ?.length > 0
      ) {
        return { tooltip: 'Competitors ready', icon: 'people', color: 'white' }
      }
      return { tooltip: '', icon: '', color: 'dark' }
    },
    activeCol(event: v2.TimetableItem): string {
      const current = this.$store.state.command.current
      const next = this.$store.state.command.next
      if (event.id === current.id) {
        return 'bg-positive text-black'
      } else if (event.id === next.id) {
        return 'bg-warning text-black'
      } else if (
        event.round?.id &&
        current.round?.id &&
        event.round.id === current.round.id
      ) {
        return 'bg-positive text-black'
      } else if (
        event.round?.id &&
        next.round?.id &&
        event.round.id === next.round.id
      ) {
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
      if (round.id > current.id) {
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
        message = `${round.round.floor.name} at ${this.formatTime(
          round.startTime
        )}<br>${round.round.heats} heat(s), recalling ${
          round.round.recall
        }<br>Adjudicators: ${round.round.adjudicators
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
