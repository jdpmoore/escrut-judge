import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { ScrutineerStateInterface } from './state'
// import { axiosInstance, axiosError } from 'boot/axios'
// import _ from 'lodash'

const actions: ActionTree<ScrutineerStateInterface, StateInterface> = {
  // prepScrutineering({ dispatch }, competitionId: number) {
  //   dispatch('getTimetable')
  // },
  // getDances(context) {
  //   axiosInstance
  //     .get('/manager/dances')
  //     .then(({ data }) => {
  //       context.commit('storeDances', data)
  //       context.commit('saveState')
  //     })
  //     .catch(axiosError)
  // },

  // getAllRounds({ commit }, competitionId: number) {
  //   axiosInstance
  //     .get(`/${competitionId}/events`)
  //     .then(({ data }: { data: { events: v1.LongEvent[] } }) => {
  //       context.commit('storeEvents', data.events)
  //       if (context.state.timetable.length > 0) {
  //         context.commit('storeEventsWithTimetable')
  //       }
  //       context.commit('saveState')
  //     })
  //     .catch(axiosError)
  // },
  // getFloors(context) {
  //   if (context.state.competition) {
  //     axiosInstance
  //       .get(`/manager/${context.state.competition.id}/floors`)
  //       .then(({ data }) => {
  //         context.commit('storeFloors', _.values(data))
  //         context.commit('saveState')
  //       })
  //       .catch(axiosError)
  //   }
  // },
  // getJudges(context) {
  //   if (context.state.competition) {
  //     axiosInstance
  //       .get(`/${context.state.competition.id}/adjudicators`)
  //       .then(({ data }: { data: { [key: string]: v1.Judge } }) => {
  //         let judges: v1.Judge[] = []
  //         const judgeLetters = _.keys(data)
  //         judgeLetters.map((judge) => {
  //           const toPush: v1.Judge = { letter: judge, ...data[judge] }
  //           judges.push(toPush)
  //         })
  //         judges = _.sortBy(judges, ['letter'])
  //         context.commit('storeJudges', judges)
  //         context.commit('saveState')
  //       })
  //       .catch(axiosError)
  //   }
  // },

  // getEvents(context) {
  //   if (context.state.competition) {
  //     axiosInstance
  //       .get(`/${context.state.competition.id}/events`)
  //       .then(({ data }: { data: { events: v1.LongEvent[] } }) => {
  //         context.commit('storeEvents', data.events)
  //         if (context.state.timetable.length > 0) {
  //           context.commit('storeEventsWithTimetable')
  //         }
  //         context.commit('saveState')
  //       })
  //       .catch(axiosError)
  //   }
  // },
  // getTimetable(context) {
  //   // return new Promise((resolve, reject) => {
  //   if (context.state.competition) {
  //     axiosInstance
  //       .get(`/${context.state.competition.id}/timetable`)
  //       .then(({ data }: { data: v1.TimetableItem[] }) => {
  //         context.commit('storeTimetable', data)
  //         context.commit('setFirstRound')
  //         if (context.state.events.length > 0) {
  //           context.commit('storeEventsWithTimetable')
  //         }
  //         // resolve(data)
  //         context.commit('saveState')
  //       })
  //       .catch(axiosError)
  //   }
  //   //  else {
  //   //   // reject()
  //   // }
  //   // })
  // },
  // getCompetitors(context) {
  //   if (context.state.competition) {
  //     axiosInstance
  //       .get(`/comp/${context.state.competition.id}/competitors`)
  //       .then(({ data }) => {
  //         context.commit('storeCompetitors', _.values(data))
  //         context.commit('saveState')
  //       })
  //       .catch(axiosError)
  //   }
  // },
  // getNumbersByRoundId({ commit }, roundId: number) {
  //   axiosInstance
  //     .get(`/round/${roundId}/competitors`)
  //     .then(({ data }) => {
  //       commit('storeCompetitorsByRoundId', {
  //         competitors: _.sortBy(_.values(data), 'number'),
  //         roundId,
  //       })
  //     })
  //     .catch(axiosError)
  // },
}

export default actions
