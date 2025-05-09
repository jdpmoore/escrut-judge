import { MutationTree } from 'vuex'
import {
  CommandStateInterface,
  initialState,
  TempMark,
  TempMarks,
  TempMarksExport,
  blankRound,
} from './state'
import { v1, v2 } from 'src/@types/command'
import _ from 'lodash'
import { LocalStorage, Cookies, extend } from 'quasar'

const mutation: MutationTree<CommandStateInterface> = {
  storePin(state: CommandStateInterface, val: number) {
    state.pin = val
  },
  setLogo(state: CommandStateInterface, val: string) {
    state.logo = val ?? '/assets/ivda/ivda_website_logo_2.svg'
  },
  setIcon(state: CommandStateInterface, val: string) {
    state.icon = val ?? '/assets/ivda/ivda_logo_only.svg'
  },
  setDemo(state, val: boolean) {
    state.demo = val
  },
  setCurrentHeat(state: CommandStateInterface, val: number) {
    state.currentHeat = val
  },
  setCurrentDance(state: CommandStateInterface, val: string) {
    state.currentDance = val
  },
  setHandwriting(state: CommandStateInterface, val: boolean) {
    state.handwriting = val
  },
  setOffline(state: CommandStateInterface, val: boolean) {
    state.offline = val
  },
  storeAuth(state: CommandStateInterface, val: string) {
    state.auth.authToken = val
    state.auth.timeStamp = Date.now()
    state.loggedIn = val.length > 0
  },
  clearUser(state: CommandStateInterface, val: string) {
    state.userDetails = { avatar: '', roles: [''], firstName: '', lastName: '' }
    state.loggedIn = false
  },
  storeUser(
    state: CommandStateInterface,
    val: {
      firstName: string
      lastName: string
      avatar: string
      roles: string[]
    }
  ) {
    state.userDetails = val
  },
  withdrawCompetitor(state: CommandStateInterface, val: number) {
    const found = state.competitors.find((competitor) => {
      return competitor.number === val
    })
    if (found) {
      found.events = []
      found.withdrawn = true
      found.background = 'pink'
    }
  },
  storeCompetitions(state: CommandStateInterface, val: v2.Competition[]) {
    state.competitions = val
  },
  storeDances(state: CommandStateInterface, val: v1.Dance[]) {
    state.dances = val
  },
  storeFloors(state: CommandStateInterface, val: v1.Floor[]) {
    state.floors = val
  },
  storeJudges(state: CommandStateInterface, val: v1.Judge[]) {
    state.judges = val
  },
  storeCompetitors(state: CommandStateInterface, val: v1.Competitor[]) {
    state.competitors = val
  },
  storeTeamCompetitors(state: CommandStateInterface, val: v1.Competitor[]) {
    state.teamCompetitors = val
  },
  storeEvents(state: CommandStateInterface, val: v1.LongEvent[]) {
    state.events = val
  },
  completeScrutineeringSetup(
    state: CommandStateInterface,
    {
      roundById,
      roundIdToEventId,
    }: {
      roundById: Map<number, v1.Round>
      roundIdToEventId: Map<number, number>
    }
  ) {
    state.scrutineering.roundById = roundById
    state.scrutineering.roundIdToEventId = roundIdToEventId
  },
  storeStartEndTimes(state: CommandStateInterface) {
    // const toReturn = _.values(
    //   extend<v1.LongEvent[]>(
    //     true,
    //     {},
    //     state.events.length > 0 ? state.events : state.rawEvents
    //   )
    // )
    const startTimesByRoundId = new Map()
    const startTimes = new Map()
    const finalTimes = new Map()
    // const numberCompetitors =
    state.timetable.map(({ roundId, startTime }) => {
      const round = state.scrutineering.roundById.get(roundId)
      if (!round) return
      startTimesByRoundId.set(roundId, startTime)
      const eventId = state.scrutineering.roundIdToEventId.get(roundId)
      if (round.round == 1) {
        startTimes.set(eventId, startTime)
      } else if (round.round == 'SF' && !startTimes.has(eventId)) {
        startTimes.set(eventId, startTime)
      } else if (round.round == 'F') {
        finalTimes.set(eventId, startTime)
        if (!startTimes.has(eventId)) startTimes.set(eventId, startTime)
      }
    })
    // state.events.map((event) => {
    //   event.rounds = _.values(event.rounds)
    //   event.rounds.map((round) => {
    //     const foundTimetable = state.timetable.find((timetableItem) => {
    //       return timetableItem.roundId === round.id
    //     })
    //     if (round.round === '1') {
    //       event.startTime = foundTimetable?.startTime
    //       round.numberCompetitors = state.competitors.filter((competitor) => {
    //         return competitor.events
    //           .map((event) => {
    //             return event.id
    //           })
    //           .includes(event.eventId)
    //       }).length
    //     }
    //     if (round.round === 'SF' && event.rounds.length === 2) {
    //       event.startTime = foundTimetable?.startTime
    //       round.numberCompetitors = state.competitors.filter((competitor) => {
    //         return competitor.events
    //           .map((event) => {
    //             return event.id
    //           })
    //           .includes(event.eventId)
    //       }).length
    //     }
    //     if (round.round === 'F') {
    //       event.finalTime = foundTimetable?.startTime
    //       if (event.rounds.length === 1) {
    //         event.startTime = foundTimetable?.startTime
    //         round.numberCompetitors = state.competitors.filter((competitor) => {
    //           return competitor.events
    //             .map((event) => {
    //               return event.id
    //             })
    //             .includes(event.eventId)
    //         }).length
    //       }
    //     }
    //     round.startTime = foundTimetable?.startTime
    //     round.timetableOrder = foundTimetable?.timetableOrder
    //   })
    // })
    state.startTimes = startTimes
    state.finalTimes = finalTimes
    state.startTimesByRoundId = startTimesByRoundId
  },
  // completeScrutineeringSetup(
  //   state: CommandStateInterface,
  //   {
  //     roundById,
  //     roundIdToEventId,
  //   }: {
  //     roundById: Map<number, v1.Round>
  //     roundIdToEventId: Map<number, number>
  //   }
  // ) {
  //   state.scrutineering.roundById = roundById
  //   state.scrutineering.roundIdToEventId = roundIdToEventId
  // },
  storeCompetitorsByRoundId(
    state: CommandStateInterface,
    { competitors, roundId }: { competitors: v1.Competitor[]; roundId: number }
  ) {
    state.scrutineering.competitors[roundId] = competitors
    // if (!state.scrutineering.roundById.has(roundId)) {
    //   state.scrutineering.roundById.set(roundId, round)
    // }
  },
  storeTimetable(state: CommandStateInterface, val: v2.TimetableItem[]) {
    state.timetable = val
    for (const floor of state.floors) {
      const timetabledEventsByFloor = _.sortBy(state.timetable, [
        'timetableOrder',
      ])
      state.timetableOrder.set(floor.id, timetabledEventsByFloor)
    }
  },
  checkCurrent(state: CommandStateInterface) {
    const active = state.timetable.find((t) => {
      return t.status === 'active'
    })
    if (active) {
      const currentId = state.current.id
      const activeTimetableOrder = active.timetableOrder
      const currentTimetableOrder = state.current.timetableOrder
      const currentNoRound = !Boolean(state.current.round)
      if (
        active.id != currentId &&
        currentNoRound &&
        activeTimetableOrder > currentTimetableOrder
      ) {
        state.compere.completedTimetableEvents.add(currentId)
        const floorEvents = _.sortBy(
          state.timetable.filter((timetableEvent) => {
            if (timetableEvent.status === 'skipped') {
              return false
            }
            if (timetableEvent.status === 'completed') {
              return false
            }
            return !state.compere.completedTimetableEvents.has(
              timetableEvent.id
            )
          }),
          ['timetableOrder']
        )
        if (floorEvents && floorEvents.length > 0) {
          state.current = floorEvents[0]
          state.floor = floorEvents[0].round?.floor ?? floorEvents[0].floor
          if (floorEvents.length > 1) {
            state.next = floorEvents[1]
          } else {
            state.next = blankRound
          }
        } else {
          const allFloorEvents = _.sortBy(state.timetable, ['timetableOrder'])
          state.current = allFloorEvents[allFloorEvents.length - 1]
          state.next = blankRound
        }
      }
    }
  },
  overrideCurrent(state: CommandStateInterface, newCurrent: v2.TimetableItem) {
    state.current = newCurrent
    state.compere.timetableOrder = newCurrent.timetableOrder
  },
  resetCurrentTimetableOrder(state: CommandStateInterface) {
    state.compere.timetableOrder = state.current.timetableOrder
  },
  setCurrent(state: CommandStateInterface, newCurrent: v2.TimetableItem) {
    state.current = newCurrent
  },
  setNext(state: CommandStateInterface, newNext: v2.TimetableItem) {
    state.next = newNext
  },
  setCurrentNext(state: CommandStateInterface) {
    const floorEvents = _.sortBy(
      state.timetable.filter((timetableEvent) => {
        // if (!timetableEvent.round) {
        //   return false
        // }
        // console.log(timetableEvent.round.floor.id === state.floor.id)
        // console.log(state.compere.completedRounds.has(timetableEvent.round.id))
        // const floorId =
        //   timetableEvent.round?.floor?.id ?? timetableEvent.floor?.id
        // if (!floorId) {
        if (timetableEvent.status === 'skipped') {
          return false
        }
        if (timetableEvent.status === 'completed') {
          return false
        }
        return !state.compere.completedTimetableEvents.has(timetableEvent.id)
        // ||        ['new', 'active'].includes(timetableEvent.status)
        // } else {
        //   return (
        //     floorId === state.floor.id &&
        //     !(
        //       timetableEvent.round?.id &&
        //       state.compere.completedRounds.has(timetableEvent.round.id)
        //     ) &&
        //     !state.compere.completedTimetableEvents.has(timetableEvent.id)
        //   )
        // }
      }),
      ['timetableOrder']
    )
    if (floorEvents && floorEvents.length > 0) {
      state.current = floorEvents[0]
      state.floor = floorEvents[0].round?.floor ?? floorEvents[0].floor
      if (floorEvents.length > 1) {
        state.next = floorEvents[1]
      } else {
        state.next = blankRound
      }
    } else {
      const allFloorEvents = _.sortBy(
        state.timetable,
        // .filter((timetableEvent) => {
        //   const floorId =
        //     timetableEvent.round?.floor?.id ?? timetableEvent.floor?.id
        //   if (floorId) {
        //     return floorId === state.floor.id
        //   }
        //   return false
        // }),
        ['timetableOrder']
      )
      state.current = allFloorEvents[allFloorEvents.length - 1]
      state.next = blankRound
    }
  },
  setCompetition(state: CommandStateInterface, val: v2.Competition) {
    state.competition = val
    if (val.circuit.logo) {
      state.logo = val.circuit.logo
    }
    if (val.circuit.icon) {
      state.icon = val.circuit.icon
    }
  },
  setFloor(state: CommandStateInterface, val: v1.Floor) {
    state.floor = val
  },
  setFloorById(state: CommandStateInterface, floorId: number) {
    state.floor =
      state.floors.find((floor) => {
        return floor.id === floorId
      }) ?? state.floor
  },
  setDefaultRecall(state: CommandStateInterface, val: v1.Option) {
    state.defaultRecall = val
  },
  setDefaultMissingNumber(state: CommandStateInterface, val: v1.Option) {
    state.defaultMissingNumber = val
  },
  setDefaultOverfull(state: CommandStateInterface, val: v1.Option) {
    state.defaultOverfull = val
  },
  setDefaultScrutineering(state: CommandStateInterface, val: v1.Option) {
    state.defaultScrutineering = val
  },
  saveState(state: CommandStateInterface) {
    const authToken = state.auth.authToken
    // console.log('saving state and cookie', authToken)
    if (authToken !== '') {
      // console.log('saving cookie')
      Cookies.set('eScrut_command_JWT', authToken, state.cookieDetails)
    }
    // state.auth.authToken = ''
    // const toSave = extend<CommandStateInterface>(true, {}, state)
    // toSave.scrutineering.competitors = {}
    // LocalStorage.set('savedState-eScrut-command-v2', toSave)
    // saveMapSet(
    //   'completedScrutineeringRounds',
    //   state.scrutineering.completedRounds
    // )
    // saveMapSet('completedRounds', state.compere.completedRounds)
    // saveMapSet(
    //   'completedTimetableEvents',
    //   state.compere.completedTimetableEvents
    // )
    // saveMapSet('roundIdToEventId', state.scrutineering.roundIdToEventId)
    // saveMapSet('roundById', state.scrutineering.roundById)
    // saveMapSet('startTimes', state.startTimes)
    // saveMapSet('finalTimes', state.finalTimes)
    // saveMapSet('startTimesByRoundId', state.startTimesByRoundId)
    // saveMapSet('timetableOrder', state.timetableOrder)
    // saveMapSet('canSubmit', state.canSubmit)
    // saveTempMarks(state.scrutineering.tempMarks)
    // state.auth.authToken = authToken
  },
  // clearStore() {
  // state: CommandStateInterface
  // state.loggedIn = false
  // // return
  // LocalStorage.clear()
  // if (Cookies.has('eScrut_command_JWT')) {
  //   Cookies.remove('eScrut_command_JWT', {
  //     path: '/',
  //   })
  // }
  // const s = initialState()
  // Object.keys(state).map((key) => {
  //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   // @ts-ignore
  //   state[key as keyof CommandStateInterface] =
  //     s[key as keyof CommandStateInterface]
  // })
  // },
  clearStore(state: CommandStateInterface) {
    state.loggedIn = false
    console.log('clearing store')
    // return
    LocalStorage.clear()
    if (Cookies.has('eScrut_competitor_JWT')) {
      Cookies.remove('eScrut_competitor_JWT', {
        path: '/',
      })
    }
    const icon = state.icon
    const logo = state.logo
    const s = initialState()
    Object.keys(state).map((key) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      state[key as keyof CommandStateInterface] =
        s[key as keyof CommandStateInterface]
    })
    state.icon = icon
    state.logo = logo
  },
  updateNumberHeatsRoundId(
    state: CommandStateInterface,
    { newHeats, roundId }: { newHeats: number; roundId: number }
  ) {
    if (state.current.round.id === roundId) {
      state.current.round.heats = newHeats
    }
    const toUpdate = state.scrutineering.roundById.get(roundId)
    if (toUpdate) {
      toUpdate.heats = newHeats
      state.scrutineering.roundById.set(roundId, toUpdate)
    }
  },
  updateNumberRecallsRoundId(
    state: CommandStateInterface,
    { newRecalls, roundId }: { newRecalls: number; roundId: number }
  ) {
    if (state.current.round.id === roundId) {
      console.log('updating recalls', newRecalls)
      state.current.round.recall = newRecalls
    }
    const toUpdate = state.scrutineering.roundById.get(roundId)
    if (toUpdate) {
      toUpdate.recall = newRecalls
      state.scrutineering.roundById.set(roundId, toUpdate)
    }
  },
  setTimetableOrder(state: CommandStateInterface, val: number) {
    state.compere.timetableOrder = val
  },
  setTimetableOrderToNext(state: CommandStateInterface) {
    const active = state.timetable.find((t) => {
      return t.status === 'active'
    })
    if (active) {
      state.compere.timetableOrder = active.timetableOrder
    } else {
      const newTimeTableOrders = state.timetable
        .filter((t) => {
          return t.status === 'new'
        })
        .map((ti) => {
          return ti.timetableOrder
        })
      state.compere.timetableOrder = Math.min(...newTimeTableOrders)
    }
  },

  timetableOrders() {
    return this.timetable.map((o) => {
      return o.timetableOrder
    })
  },
  forceCurrentTimetableOrder(state: CommandStateInterface, id: number) {
    console.log('this should force the order', id)
    state.timetable.forEach((ti) => {
      if (ti.id == id) {
        ti.status = 'active'
        state.compere.timetableOrder = ti.timetableOrder
      }
    })
  },
  setTimetableIdActive(state: CommandStateInterface, id: number) {
    console.log('we set it active now...', id)
    state.timetable.forEach((ti) => {
      if (ti.id == id) {
        ti.status = 'active'
      }
    })
    if (state.current?.id === id) {
      state.current.status = 'active'
    }
  },
  setTimetableIdSkipped(state: CommandStateInterface, id: number) {
    console.log('we set it skipped now...')
    state.timetable.forEach((ti) => {
      if (ti.id == id) {
        ti.status = 'skipped'
      }
    })
    if (state.current?.id === id) {
      state.current.status = 'skipped'
    }
  },
  setCanSubmit(state: CommandStateInterface, id: number) {
    if (!state.canSubmit) {
      state.canSubmit = new Set()
    }
    state.canSubmit.add(id)
  },
  setTimetableOrderToCurrent(state: CommandStateInterface) {
    state.compere.timetableOrder = state.current.timetableOrder
  },
  setActiveHeat(state: CommandStateInterface, val: number) {
    state.compere.activeHeat = val
  },
  setScrutineeringActiveHeat(state: CommandStateInterface, val: number) {
    state.scrutineering.activeHeat = val
  },
  setHeat(state: CommandStateInterface, val: number) {
    state.compere.heat = val
  },
  setScrutineeringHeat(state: CommandStateInterface, val: number) {
    state.scrutineering.heat = val
  },
  setDanceLetterIndex(state: CommandStateInterface, val: number) {
    state.compere.danceLetterIndex = val
  },
  completedRounds(state: CommandStateInterface, val: number[]) {
    state.compere.completedRounds = new Set([
      ...val,
      ...state.compere.completedRounds,
    ])
    // val.forEach((no) => {
    // state.compere.completedRounds.add(no)
    // })
  },
  completedRound(state: CommandStateInterface, val: number) {
    state.compere.completedRounds.add(val)
  },
  completedTimetableEvents(state: CommandStateInterface, val: number[]) {
    state.compere.completedTimetableEvents = new Set([
      ...val,
      ...state.compere.completedTimetableEvents,
    ])
    // val.forEach((no) => {
    //   state.compere.completedTimetableEvents.add(no)
    // })
  },
  completedTimetableEvent(state: CommandStateInterface, val: number) {
    state.compere.completedTimetableEvents.add(val)
  },
  saveTempMarks(
    state: CommandStateInterface,
    { roundId, marks }: { roundId: number; marks: TempMark }
  ) {
    state.scrutineering.tempMarks[roundId] = marks
  },
  newJudgeHeatTempImage(
    state: CommandStateInterface,
    {
      roundId,
      judgeHeat,
      image,
    }: { roundId: number; judgeHeat: string; image: string }
  ) {
    if (!state.scrutineering.tempImages[roundId]) {
      state.scrutineering.tempImages[roundId] = new Map()
    }
    state.scrutineering.tempImages[roundId].set(judgeHeat, image)
    // console.log('new set', state.scrutineering.tempMarks[roundId])
  },
  // newJudgeHeatTempMarks(
  //   state: CommandStateInterface,
  //   { roundId, judgeHeat }: { roundId: number; judgeHeat: string }
  // ) {
  //   if (!state.scrutineering.tempMarks[roundId]) {
  //     state.scrutineering.tempMarks[roundId] = new Map()
  //   }
  //   if (!state.scrutineering.tempMarks[roundId].has(judgeHeat)) {
  //     state.scrutineering.tempMarks[roundId].set(judgeHeat, new Set())
  //   }
  //   // console.log('new set', state.scrutineering.tempMarks[roundId])
  // },
  newJudgeHeatTempMarks(
    state: CommandStateInterface,
    { roundId, judgeHeat }: { roundId: number; judgeHeat: string }
  ) {
    if (!state.scrutineering.tempMarks[roundId]) {
      state.scrutineering.tempMarks[roundId] = new Map()
    }
    if (!state.scrutineering.tempMarks[roundId].has(judgeHeat)) {
      state.scrutineering.tempMarks[roundId].set(judgeHeat, new Set())
    }
    // console.log('new set', state.scrutineering.tempMarks[roundId])
  },
  judgeHeatTempMark(
    state: CommandStateInterface,
    {
      roundId,
      judgeHeat,
      no,
      action,
    }: { roundId: number; judgeHeat: string; no: number; action: string }
  ) {
    // console.log('in vuex', judgeHeat, roundId, no, action)
    if (!state.scrutineering.tempMarks[roundId]) {
      state.scrutineering.tempMarks[roundId] = new Map()
    }
    if (!state.scrutineering.tempMarks[roundId].has(judgeHeat)) {
      state.scrutineering.tempMarks[roundId].set(judgeHeat, new Set())
    }
    const currentJudgeMarks =
      state.scrutineering.tempMarks[roundId].get(judgeHeat)
    // console.log('currentJudgeMarks', currentJudgeMarks)
    if (action === 'add') {
      currentJudgeMarks?.add(no)
    } else if (action === 'delete') {
      currentJudgeMarks?.delete(no)
    }
  },
  // setDanceLetters(state, val: string) {
  //   const dances = val.split('')
  //   state.compere.dances = dances
  //   state.compere.danceLetter = dances[0]
  // },
}

function saveMapSet(key: string, value: Map<number, unknown> | Set<number>) {
  LocalStorage.set(`savedState-eScrut-command-v2-${key}`, [...value])
}

function saveTempMarks(value: TempMarks) {
  const toSave: TempMarksExport = {}
  for (const key in value) {
    toSave[key] = [...value[key]]?.map((inner) => {
      return [inner[0], [...inner[1]]]
    })
  }
  LocalStorage.set('savedState-eScrut-command-v2-TempMarks', toSave)
}

export default mutation
