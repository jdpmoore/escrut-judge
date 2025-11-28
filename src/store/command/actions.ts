import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { CommandStateInterface } from './state'
import { v1, v2 } from 'src/@types/command'
import { axiosInstance, axiosError } from 'boot/axios'
import _ from 'lodash'
import { Notify, Dialog } from 'quasar'
import { themeHelper } from 'src/components/script/themeHelper'

// function orderedDances(dances: v2.Dance[], danceOrder: number[]) {
//   if (danceOrder) {
//     let toReturn = [...dances]
//     toReturn = toReturn.sort(
//       (a, b) => danceOrder.indexOf(a.id) - danceOrder.indexOf(b.id)
//     )
//     return toReturn
//   }
//   return dances
// }

const actions: ActionTree<CommandStateInterface, StateInterface> = {
  getUserDetails({ commit, state }) {
    return new Promise((resolve, reject) => {
      if (state.loggedIn) {
        axiosInstance
          .get('/user')
          .then(({ data }) => {
            if (
              state.userDetails.theme &&
              !data.theme &&
              state.competition.circuit
            ) {
              themeHelper().setTheme(state.competition.circuit)
            } else if (data.theme) {
              themeHelper().setTheme(data)
            }
            commit('storeUser', data)

            commit('saveState')
            resolve(data)
          })
          .catch((err) => {
            axiosError(err)
            reject(err)
          })
      }
    })
  },
  prepScrutineering({ dispatch, commit }) {
    return new Promise<void>((resolve) => {
      const loadingDialog = Dialog.create({
        message: 'Preparing competition',
        dark: true,
        class: 'bg-primary text-primary-inv',
        progress: {
          // spinner: QSpinnerGears,
          color: 'amber',
        },
        persistent: true, // we want the user to not be able to close it
        ok: false, // we want the user to not be able to close it
      })
      void dispatch('getJudges')
      void dispatch('getCompetitors')
      void dispatch('getEvents')
      void dispatch('getFirstRoundCompetitors')
      dispatch('getFloors').then(() => {
        dispatch('getTimetable', loadingDialog)
          .then(() => {
            commit('resetCurrentTimetableOrder')
            commit('saveState')
            resolve()
          })
          .catch(() => {
            Dialog.create({
              dark: true,
              title: 'No timetable / round order',
              message:
                'Please construct a timetable or order of rounds before attempting to judge a competition',
              class: 'bg-primary text-primary-inv',
              persistent: true,
              // cancel: { label: 'Close', outline: true, flat: true, color: 'amber' },
              ok: { label: 'Ok', outline: true, flat: true, color: 'positive' },
            })
            loadingDialog.hide()
          })
      })
    })
  },
  // processRounds({ state, commit }) {
  //   const roundById: { [id: number]: v1.Round } = {}
  //   const roundIdToEventId: { [id: number]: number } = {}
  //   state.events.map((event) => {
  //     event.rounds.map((round) => {
  //       roundById[round.id] = round
  //       roundIdToEventId[round.id] = event.eventId
  //     })
  //   })
  //   // console.log(roundIdToEventId)
  //   commit('completeScrutineeringSetup', { roundById, roundIdToEventId })
  //   commit('saveState')
  // },
  getFirstRoundCompetitors(context) {
    const loadingDialog = Dialog.create({
      message: 'Downloading first round competitors, please wait',
      dark: true,
      class: 'bg-primary',
      progress: {
        // spinner: QSpinnerGears,
        color: 'amber',
      },
      persistent: true, // we want the user to not be able to close it
      ok: false, // we want the user to not be able to close it
    })
    axiosInstance
      .get(`/competition/${context.state.competition.id}/roundcompetitors`)
      .then(({ data }) => {
        data.forEach((roundCompetitors) => {
          context.commit('storeCompetitorsByRoundId', roundCompetitors)
        })
        loadingDialog.hide()
      })
      .catch(() => {
        loadingDialog.hide()
      })
    // const firstRounds: number[] = []
    // context.state.timetable.map((timetableItem) => {
    //   const round = timetableItem?.round
    //   if (!round) return
    //   // const eventId = context.state.scrutineering.roundIdToEventId.get(roundId)
    //   if (round.round == 1) {
    //     firstRounds.push(round.id)
    //   }
    // })
    // if (firstRounds.length > 0) {
    //   const loadingDialog = Dialog.create({
    //     message: 'Downloading first round competitors, please wait',
    //     dark: true,
    //     class: 'bg-primary text-primary-inv',
    //     progress: {
    //       // spinner: QSpinnerGears,
    //       color: 'amber',
    //     },
    //     persistent: true, // we want the user to not be able to close it
    //     ok: false, // we want the user to not be able to close it
    //   })
    //   Promise.all(
    //     firstRounds.map((roundId) => {
    //       return context.dispatch('getCompetitorsByRoundId', roundId)
    //     })
    //   )
    //     .then(() => {
    //       loadingDialog.hide()
    //     })
    //     .catch(() => {
    //       loadingDialog.hide()
    //     })
    // }
  },
  getAllCompetitorsByFloorId(context, floorIdFilter: number) {
    const loadingDialog = Dialog.create({
      message: 'Downloading competitors, please wait',
      dark: true,
      class: 'bg-primary text-primary-inv',
      progress: {
        // spinner: QSpinnerGears,
        color: 'amber',
      },
      persistent: true, // we want the user to not be able to close it
      ok: false, // we want the user to not be able to close it
    })
    const rounds: number[] = []
    context.state.timetable.map(({ round }) => {
      const floorFilter = round?.floor?.id
      if (floorFilter && floorFilter === floorIdFilter) {
        rounds.push(round.id)
      }
    })
    console.log(rounds)
    Promise.all(
      rounds.map((roundId) => {
        return context.dispatch('getCompetitorsByRoundId', roundId)
      })
    ).then(() => {
      loadingDialog.hide()
    })
  },
  getCompetition(context, compId: number) {
    return new Promise<void>((resolve, reject) => {
      axiosInstance
        .get(`/competition/${compId}`)
        .then(({ data: comp }) => {
          context.commit('setCompetition', comp)
          if (comp.circuit && !context.state.userDetails.theme) {
            themeHelper().setTheme(comp.circuit)
          }
          context.commit('saveState')
          context.dispatch('prepScrutineering').then(() => {
            resolve()
          })
        })
        .catch((err) => {
          axiosError(err)
          reject()
        })
    })
  },
  getCompetitions(context) {
    return new Promise<void>((resolve, reject) => {
      axiosInstance
        .get('/competitions/live')
        // .get('/competitions/archive')
        .then(({ data }) => {
          context.commit('storeCompetitions', _.values(data))
          context.commit('saveState')
          if (context.state.competition.id > 0) {
            console.log('competition exists')
            void context.dispatch('getFloors').then(() => {
              resolve()
            })
            resolve()
          } else {
            console.log('no competition, must dispatch')
            context
              .dispatch('selectCompetition')
              .then(() => {
                resolve()
              })
              .catch(() => {
                reject()
              })
          }
        })
        .catch((err) => {
          axiosError(err)
          reject()
        })
    })
  },
  selectCompetition(context) {
    return new Promise<void>((resolve, reject) => {
      const compOptions = context.getters.competitionsOptions
      if (compOptions.length > 0) {
        Dialog.create({
          dark: true,
          title: 'Select competition',
          message: 'Please select the competition:',
          options: {
            type: 'radio',
            model: '',
            items: compOptions,
          },
          class: 'bg-primary',
          persistent: true,
          // cancel: { label: 'Close', outline: true, flat: true, color: 'amber' },
          ok: { label: 'Ok', outline: true, flat: true, color: 'positive' },
        }).onOk((comp: v2.Competition) => {
          context.commit('setCompetition', comp)
          if (comp.circuit) {
            themeHelper().setTheme(comp.circuit)
          }
          context.dispatch('prepScrutineering').then(() => {
            resolve()
          })
        })
      } else {
        Dialog.create({
          dark: true,
          title: 'No live competitions',
          message:
            'There are currently no live competitions on the system, please set the competition live first before logging into the compere and scrutineering app.',
          class: 'bg-primary text-primary-inv',
          persistent: true,
          // cancel: { label: 'Close', outline: true, flat: true, color: 'amber' },
          ok: { label: 'Ok', outline: true, flat: true, color: 'positive' },
        }).onOk(() => {
          reject()
        })
      }
    })
  },
  getFloors(context) {
    // if (context.state.competition) {
    return new Promise<void>((resolve, reject) => {
      console.log(`get floors...${context.state.competition.id}`)
      axiosInstance
        .get(`/comp/${context.state.competition.id}/floors`)
        .then(({ data }) => {
          context.commit('storeFloors', _.values(data))
          // if (context.state.floors.length === 1) {
          context.commit('setFloor', context.state.floors[0])
          resolve()
          // } else {
          //   const floorOptions = context.getters.floorOptions
          //   Dialog.create({
          //     dark: true,
          //     title: 'Select floor',
          //     message: 'Please select the floor:',
          //     options: {
          //       type: 'radio',
          //       model: floorOptions[0].value,
          //       items: floorOptions,
          //     },
          //     class: 'bg-primary',
          //     persistent: true,
          //     // cancel: { label: 'Close', outline: true, flat: true, color: 'amber' },
          //     ok: { label: 'Ok', outline: true, flat: true, color: 'positive' },
          //   }).onOk((floor: v1.Floor) => {
          //     context.commit('setFloor', floor)
          //     resolve()
          //   })
          // }
          context.commit('saveState')
        })
        .catch((err) => {
          axiosError(err)
          reject()
        })
    })
    // }
  },
  getJudges(context) {
    // if (context.state.competition) {
    axiosInstance
      .get(`/competition/${context.state.competition.id}/adjudicators`)
      .then(({ data }: { data: { [key: string]: v1.Judge } }) => {
        let judges: v1.Judge[] = []
        const judgeLetters = _.keys(data)
        judgeLetters.map((judge) => {
          const toPush: v1.Judge = { letter: judge, ...data[judge] }
          judges.push(toPush)
        })
        judges = _.sortBy(judges, ['letter'])
        context.commit('storeJudges', judges)
        context.commit('saveState')
      })
      .catch(axiosError)
    // }
  },
  getCompetitors(context) {
    // if (context.state.competition) {
    return new Promise<void>((resolve) => {
      Promise.all([
        axiosInstance.post(
          `/competition/${context.state.competition.id}/entries`
        ),
        axiosInstance.get(`/competition/${context.state.competition.id}/teams`),
      ])
        .then((response) => {
          context.commit('storeCompetitors', response[0].data)
          context.commit('storeTeamCompetitors', response[1].data)
          context.commit('saveState')
          resolve()
        })
        .catch((err) => {
          axiosError(err)
          context.commit('setOffline', true)
          resolve()
        })
    })
  },
  getEvents(context) {
    return new Promise<void>((resolve, reject) => {
      // if (context.state.competition) {
      axiosInstance
        .get(`/competition/${context.state.competition.id}`)
        .then(({ data }: { data: { events: v1.LongEvent[] } }) => {
          context.commit('storeEvents', data.events)
          const roundById: Map<number, v1.Round> = new Map()
          const roundIdToEventId: Map<number, number> = new Map()
          data.events.map((event) => {
            for (const round of Object.values(event.rounds)) {
              roundIdToEventId.set(round.id, event.eventId)
              roundById.set(round.id, round)
            }
          })
          context.commit('completeScrutineeringSetup', {
            roundById,
            roundIdToEventId,
          })
          if (context.state.timetable.length > 0) {
            context.commit('storeStartEndTimes')
          }
          context.commit('saveState')
          resolve()
        })
        .catch((err) => {
          axiosError(err)
          reject()
        })
      // }
    })
  },
  updateCurrent(context) {
    if (context.state.current) {
      const { id } = context.state.current
      if (id > 0) {
        axiosInstance
          .get(`/timetableitem/${id}`)
          .then(({ data: timetableItem }: { data: v2.TimetableItem }) => {
            if (timetableItem.danceOrder) {
              timetableItem.dances = timetableItem.danceOrder
            }
            context.commit('setCurrent', timetableItem)
          })
          .catch(axiosError)
      }
    }
  },
  updateTimetable(context) {
    return new Promise<void>((resolve) => {
      console.log('now we update the timetable')
      const { id } = context.state.competition
      if (id > 0) {
        axiosInstance
          .get(`/competition/${id}/mytimetable`)
          .then(({ data }: { data: v2.TimetableItem[] }) => {
            const noActive = !data.some((d) => {
              return d.status === 'active'
            })
            console.log('do we have no active?', noActive)
            data.forEach((timetableItem) => {
              if (timetableItem.danceOrder) {
                timetableItem.dances = timetableItem.danceOrder
              }
              if (timetableItem.id == context.state.current.id) {
                console.log(
                  'this is the item',
                  context.state.current,
                  timetableItem
                )
                if (noActive && context.state.current.status === 'active') {
                  timetableItem.status = 'active'
                }
                // if (noActive && timetableItem.status === 'active') {
                context.commit('setCurrent', timetableItem)
                // }
                // console.log(
                //   'now we set new current',
                //   context.state.current,
                //   timetableItem
                // )
                // if (context.state.current.id == timetableItem.id) {
                //   context.commit('setCurrent', timetableItem)
                // }
              }
              if (timetableItem.id == context.state.next.id) {
                context.commit('setNext', timetableItem)
              }
            })
            context.commit('storeTimetable', data)
            context.commit('checkCurrent')
            context.commit('saveState')
            resolve()
          })
          .catch(axiosError)
      }
    })
  },
  getTimetable(context, loadingDialog) {
    return new Promise<void>((resolve, reject) => {
      // if (context.state.competition) {
      // competition/{id}/mytimetable
      axiosInstance
        .get(`/competition/${context.state.competition.id}/mytimetable`)
        .then(({ data }: { data: v2.TimetableItem[] }) => {
          data.forEach((timetableItem) => {
            if (timetableItem.danceOrder) {
              timetableItem.dances = timetableItem.danceOrder
            }
            // timetableItem.round.dances = orderedDances(
            //   timetableItem.round.dances
            // )
          })
          console.log('store timetable', data)
          context.commit('storeTimetable', data)
          console.log('set current next')
          context.commit('setCurrentNext')
          console.log('store start end times')
          // if (context.state.events.length > 0) {
          context.commit('storeStartEndTimes')
          // console.log('now we processRounds')
          // context.dispatch('processRounds')
          // }
          // context.commit('prepScrutineering')
          // resolve(data)
          console.log('save state')
          context.commit('saveState')
          if (loadingDialog) {
            loadingDialog.hide()
          }
          if (data.length === 0) {
            reject()
          }
          resolve()
        })
        .catch(axiosError)
      // }
      //  else {
      //   // reject()
      // }
    })
  },
  getDances(context) {
    axiosInstance
      .get('/system/dances')
      .then(({ data }) => {
        context.commit('storeDances', data)
        context.commit('saveState')
      })
      .catch(axiosError)
  },
  getCompetitorsByRoundId({ commit, state }, roundId: number) {
    return new Promise<void>((resolve, reject) => {
      if (roundId === 0) {
        commit('setFirstRound')
        roundId = state.current.roundId
      }
      axiosInstance
        .get(`/round/${roundId}/competitors`)
        .then(({ data }) => {
          // console.log('to store', _.sortBy(data, 'number'))
          commit('storeCompetitorsByRoundId', {
            competitors: _.sortBy(data, 'number'),
            roundId,
          })
          resolve(data)
          // if (data.length === 0) {
          //   setTimeout(() => {
          //     dispatch('getCompetitorsByRoundId', roundId)
          //   }, 3000)
          // }
          // commit('saveState')
        })
        .catch((err) => {
          axiosError(err)
          reject(err)
        })
    })
  },
  getNextCompetitors({ dispatch, state }) {
    console.log('in get next competitors', state.next.round)
    if (state.next.round && state.next.round.id > 0) {
      dispatch('getCompetitorsByRoundId', state.next.round.id)
    }
  },
  updateNumberHeats(
    { commit },
    { newHeats, roundId }: { newHeats: number; roundId: number }
  ) {
    // if (state.competition) {
    axiosInstance
      .put(`/round/${roundId}`, {
        field: 'heats',
        newValue: newHeats,
      })
      // .post(`/manager/${state.competition.id}/round/${roundId}/adjustHeats`, {
      //   heats: newHeats,
      // })
      .then(() => {
        commit('updateNumberHeatsRoundId', { newHeats, roundId })
        commit('saveState')
        Notify.create({
          message: 'Number of heats updated',
          type: 'positive',
          color: 'positive',
          textColor: 'positive-inv',
          position: 'top',
          closeBtn: true,
          timeout: 2000,
        })
        // TODO: DISPATCH WHISPER HERE TO TELL JUDGES APPS TO UPDATE CURRENT NUMBER IN HEAT
      })
      .catch(axiosError)
    // }
  },
  updateNumberRecalls(
    { commit },
    { newRecalls, roundId }: { newRecalls: number; roundId: number }
  ) {
    // if (state.competition) {
    axiosInstance
      .put(`/round/${roundId}`, {
        field: 'recall',
        newValue: newRecalls,
      })
      // .post(`/manager/${state.competition.id}/round/${roundId}/adjustHeats`, {
      //   heats: newHeats,
      // })
      .then(() => {
        console.log('to update', { newRecalls, roundId })
        commit('updateNumberRecallsRoundId', { newRecalls, roundId })
        commit('saveState')
        Notify.create({
          message: 'Number of recalls updated',
          type: 'positive',
          color: 'positive',
          textColor: 'positive-inv',
          position: 'top',
          closeBtn: true,
          timeout: 2000,
        })
        // TODO: DISPATCH WHISPER HERE TO TELL JUDGES APPS TO UPDATE CURRENT RECALLS IN HEAT
      })
      .catch(axiosError)
    // }
  },
  setAllPreviousComplete(
    { state, commit },
    { timetableOrder }: { timetableOrder: number }
  ) {
    return new Promise<void>((resolve) => {
      console.log('starting set all previous complete')
      const roundIds = []
      const timetableEntryIds = []
      for (const timetableEntry of state.timetable) {
        // state.timetable.forEach((timetableEntry) => {
        // console.log(timetableEntry.id)
        if (timetableOrder && timetableEntry.timetableOrder < timetableOrder) {
          if (timetableEntry.round) {
            roundIds.push(timetableEntry.round.id)
            // commit('completedRound', timetableEntry.round.id)
            // state.compere.completedRounds.add(timetableEntry.round.id)
          }
          // console.log(timetableEntry.id)
          timetableEntryIds.push(timetableEntry.id)
          // commit('completedTimetableEvent', timetableEntry.id)
          // state.compere.completedTimetableEvents.add(timetableEntry.id)
        }
      }
      commit('completedRounds', roundIds)
      commit('completedTimetableEvents', timetableEntryIds)
      resolve()
    })
  },
  echoScrutineer({ commit }, { roundId, judgeHeat, numbers }) {
    commit('newJudgeHeatTempMarks', {
      roundId,
      judgeHeat,
    })
    for (const no of numbers) {
      commit('judgeHeatTempMark', {
        roundId,
        judgeHeat,
        no,
        action: 'add',
      })
    }
  },
}

export default actions
