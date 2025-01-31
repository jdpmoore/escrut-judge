import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { EchoStateInterface } from './state'
// import client from 'socket.io-client'
import Pusher from 'pusher-js'
import Echo from 'laravel-echo'
import { axiosInstance } from 'boot/axios'
import { uid } from 'quasar'
// import _ from 'lodash'
import { v2 } from 'src/@types/command'

const actions: ActionTree<EchoStateInterface, StateInterface> = {
  connectEcho({ rootState, commit, dispatch }) {
    return new Promise<void>((resolve) => {
      commit('setConnected', false)
      if (window.echo) {
        commit('closeEcho')
      }
      const authToken = rootState.command.auth.authToken
        ? `Bearer ${rootState.command.auth.authToken}`
        : axiosInstance.defaults.headers.common.Authorization
      //configure Laravel Echo
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.Pusher = Pusher
      const echo = new Echo({
        broadcaster: 'pusher',
        key: process.env.PUSHER_APP_KEY,
        cluster: 'eu',
        forceTLS: true,
        authEndpoint: `${process.env.API}/../broadcasting/auth`,
        auth: {
          headers: {
            Authorization: authToken,
          },
        },
      })
      // const echo = new Echo({
      //   broadcaster: 'socket.io',
      //   host: process.env.ECHO,
      //   namespace: '',
      //   client,
      //   forceTLS: false,
      //   auth: {
      //     headers: {
      //       Authorization: authToken,
      //     },
      //   },
      // })
      // console.log(authToken, echo)
      echo.connector.pusher.connection.bind('initialized', () => {
        const time = new Date().toLocaleTimeString()
        commit('setConnected', false)
        console.log(`we initialized at ${time}`)
      })
      echo.connector.pusher.connection.bind('connecting', () => {
        const time = new Date().toLocaleTimeString()
        commit('setConnected', false)
        console.log(`we are connecting at ${time}`)
      })
      echo.connector.pusher.connection.bind('connected', () => {
        const time = new Date().toLocaleTimeString()
        console.log(`we connected at ${time}`)
        commit('setConnected', true)
      })
      echo.connector.pusher.connection.bind('unavailable', () => {
        const time = new Date().toLocaleTimeString()
        commit('setConnected', false)
        console.log(`we are unavailable at ${time}`)
      })
      echo.connector.pusher.connection.bind('failed', () => {
        const time = new Date().toLocaleTimeString()
        commit('setConnected', false)
        console.log(`we failed at ${time}`)
      })
      echo.connector.pusher.connection.bind('disconnected', () => {
        const time = new Date().toLocaleTimeString()
        console.log(`connection down (disconnected) at ${time}: `)
        commit('setConnected', false)
      })
      echo.connector.pusher.connection.bind('state_change', function (states) {
        // states = {previous: 'oldState', current: 'newState'}
        console.log('Channels current state is ' + states.current, states)
      })
      commit('saveEcho', echo)
      dispatch('joinDisplay').then(() => {
        resolve()
      })
      // commit('openEcho', {
      //   authToken: rootState.command.auth.authToken,
      //   floorId: rootState.command.floor.id,
      // })
    })
  },
  joinDisplay({ commit, rootState, rootGetters, dispatch }) {
    return new Promise<void>(() => {
      // const display = window.echo.join(`es-display.${floorId}`)
      // const scrutineers = window.echo.join(
      //   `es-comp.${rootState.command.competition.id}.scrutineers`
      // )
      const judges = window.echo.join(
        `es-comp.${rootState.command.competition.id}.judges`
      )
      // commit('saveDisplay', display)
      commit('saveJudges', judges)
      // commit('saveScrutineers', scrutineers)
      // display.here((members: unknown) => {
      //   commit('setConnected', true)
      //   console.log('any members', members)
      //   resolve()
      // })
      judges.here((members: unknown) => {
        commit('setConnected', true)
        console.log('any members on judges', members)
        commit('setJudges', members)
        // state.members.judges = members
        // resolve()
      })
      // scrutineers.here((members: unknown) => {
      //   commit('setConnected', true)
      //   console.log('any members on scrutineers', members)
      //   commit('setScrutineers', members)
      //   // state.members.judges = members
      //   // resolve()
      // })
      // display.listenForWhisper('round', (payload: string) => {
      //   commit('clearNumbers')
      //   commit('clearResults')
      //   commit('setRound', payload)
      //   commit('setStatus', 'round')
      // })
      // display.listenForWhisper('start', (payload: string) => {
      //   commit('setRound', payload)
      //   commit('setStatus', 'start')
      // })
      // display.listenForWhisper('competitor', (payload: string) => {
      //   commit('setCurrentCompetitor', payload)
      //   commit('setStatus', 'number')
      // })
      // scrutineers.listenForWhisper('scrutineer', (payload: string) => {
      //   console.log('we received a whisper from a scrutineer', payload)
      //   dispatch('command/echoScrutineer', payload, { root: true })
      // })
      judges.listenForWhisper(
        'recalls',
        (payload: { roundId: number; newRecalls: number }) => {
          commit('command/updateNumberRecallsRoundId', payload, { root: true })
        }
      )
      judges.listenForWhisper('forceDanceIndex', (payload) => {
        const judgeUserIds = payload.judgeUserIds
        const judgeUserId = rootState.command.userDetails.id
        const isMe = judgeUserIds.includes(judgeUserId)
        if (isMe) {
          commit('command/setDanceLetterIndex', payload.danceLetterIndex, {
            root: true,
          })
        }
      })
      judges.listenForWhisper('updateCompetitors', (payload) => {
        dispatch('command/getCompetitorsByRoundId', payload.round.id, {
          root: true,
        })
      })
      judges.listenForWhisper('forceCurrent', (payload) => {
        // : v2.TimetableItem
        // id is the timetable id

        const judgeUserIds = payload.judgeUserIds
        const judgeUserId = rootState.command.userDetails.id
        const isMe = judgeUserIds.includes(judgeUserId)
        // console.log(
        //   'we received',
        //   payload,
        //   'is it for me?',
        //   judgeUserIds,
        //   judgeUserId,
        //   isMe
        // )
        if (isMe) {
          commit('command/forceCurrentTimetableOrder', payload.id, {
            root: true,
          })
          commit('command/overrideCurrent', payload, { root: true })
          commit('command/setDanceLetterIndex', 0, { root: true })
          dispatch('command/getCompetitorsByRoundId', payload.round.id, {
            root: true,
          })
          dispatch('command/getNextCompetitors', {}, { root: true })
          if (payload.force) {
            dispatch('command/setAllPreviousComplete', payload, {
              root: true,
            })
          }
        }
      })
      judges.listenForWhisper(
        'markCompletedSetCurrent',
        (payload: { id: number; round: v2.TimetableItem }) => {
          // const { round } = payload
          console.log('we have a round', payload)
          const round = payload
          commit('command/setDanceLetterIndex', 0, { root: true })
          dispatch('command/getCompetitorsByRoundId', round.round.id, {
            root: true,
          })
          commit('command/overrideCurrent', round, { root: true })
          commit('command/forceCurrentTimetableOrder', payload.id, {
            root: true,
          })
          dispatch('command/getNextCompetitors', {}, { root: true })
          // commit('command/setTimetableIdSkipped', payload.id, { root: true })
          // commit('command/setTimetableOrderToNext')
          dispatch('command/setAllPreviousComplete', round, { root: true })
          commit('command/setCurrentNext', {}, { root: true })
        }
      )
      judges.listenForWhisper(
        'heats',
        (payload: { roundId: number; newHeats: number }) => {
          commit('command/updateNumberHeatsRoundId', payload, { root: true })
        }
      )
      judges.listenForWhisper(
        'round',
        (payload: {
          heat: number
          round: { heats: number }
          current: { id: number; timetableOrder: number }
        }) => {
          const { id } = payload.current
          commit('command/setTimetableIdActive', id, { root: true })
          const isLastHeat = payload.heat === payload.round.heats
          if (isLastHeat) {
            commit('command/setCanSubmit', id, { root: true })
          }
          // const foundTimetableById = rootState.command.timetable.find((ti) => {
          //   return ti.id == id
          // })
          // if (
          //   foundTimetableById &&
          //   foundTimetableById.timetableOrder == timetableOrder
          // ) {
          //   // commit('command/setTimetableOrder', timetableOrder, { root: true })
          //   console.log('set timetable order', timetableOrder)
          // } else {
          //   console.log('we get new timetable then set it!')
          // }
          // console.log('we received', payload, rootState.command.timetable)
          // FIXME: If timetable order matches with found Id then go for it - but if not trigger get new timetable immedaitely then do it
          // commit('command/setTimetableOrder', val, { root: true })
          // commit('command/updateNumberHeatsRoundId', payload, { root: true })
        }
      )
      judges.listenForWhisper(
        'timetable',
        ({ updateTimetable }: { updateTimetable: boolean }) => {
          if (updateTimetable) {
            dispatch(
              'command/updateTimetable',
              { updateTimetable },
              {
                root: true,
              }
            )
            dispatch(
              'command/getEvents',
              { updateTimetable },
              {
                root: true,
              }
            )
          }
        }
      )
      judges.listenForWhisper(
        'completedRound',
        (payload: { roundId: number; timetableId: number }) => {
          commit('command/setDanceLetterIndex', 0, { root: true })
          commit('command/setScrutineeringHeat', 1, { root: true })
          commit('command/setScrutineeringActiveHeat', 1, { root: true })
          commit('command/completedRound', payload.roundId, { root: true })
          commit('command/completedTimetableEvent', payload.timetableId, {
            root: true,
          })
          commit('command/setCurrentNext', null, { root: true })
          dispatch('command/getNextCompetitors', null, { root: true })
          const timetableOrders = rootGetters[
            'command/timetableOrderByFloorId'
          ]().map((o: { timetableOrder: number }) => {
            return o.timetableOrder
          })
          const currentTimetableIndex = timetableOrders.indexOf(
            rootState.command.compere.timetableOrder
          )
          commit(
            'command/setTimetableOrder',
            timetableOrders[currentTimetableIndex + 1],
            { root: true }
          )
          dispatch(
            'command/getCompetitorsByRoundId',
            rootState.command.current.round.id,
            { root: true }
          )
        }
      )
    })
  },
  displayHome({ commit, dispatch, rootState }) {
    console.log('send display home message')
    if (!window.echo) {
      commit('setConnected', false)
      dispatch('connectEcho').then(() => {
        window.echo
          .join(`es-display.${rootState.command.floor.id}`)
          .whisper('home', rootState.command.competition)
        commit('setConnected', true)
      })
    } else {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      window.echo
        .join(`es-display.${rootState.command.floor.id}`)
        .whisper('home', rootState.command.competition)
      commit('setConnected', true)
    }
  },
  displayEndOfDays({ commit, dispatch, rootState }) {
    console.log('send display end message')
    if (!window.echo) {
      commit('setConnected', false)
      dispatch('connectEcho').then(() => {
        commit('handshake', {
          floorId: rootState.command.floor.id,
          wisper: 'end',
          event: rootState.command.competition,
        })
        commit('setConnected', true)
      })
    } else {
      commit('handshake', {
        floorId: rootState.command.floor.id,
        whisper: 'end',
        event: rootState.command.competition,
      })
      commit('setConnected', true)
    }
  },
  announcement({ rootState, commit, dispatch }, text: string) {
    console.log('announcing: ', text)
    console.log('send display home message')
    if (!window.echo) {
      commit('setConnected', false)
      dispatch('connectEcho').then(() => {
        commit('handshake', {
          floorId: rootState.command.floor.id,
          whisper: 'announce',
          event: { message: text },
        })
        commit('setConnected', true)
      })
    } else {
      commit('handshake', {
        floorId: rootState.command.floor.id,
        whisper: 'announce',
        event: { message: text },
      })
      commit('setConnected', true)
    }

    // if (!window.echo || !context.state.display) {
    //   console.log('no echo, auth is ', context.rootState.command.auth)
    //   context.commit('openEcho', {
    //     authToken: context.rootState.command.auth.authToken,
    //     floorId: context.rootState.command.floor.id,
    //   })
    // }
    // context.commit('announce', text)
    // this.$root.$emit('whisper', {
    //   channel: 'es-display.' + this.$store.statfloor.id,
    //   event: 'announce',
    //   data: { displayData: { announceText: dataText } },
    // })
  },
  introduceAdjudicator({ rootState, dispatch, commit }, judge) {
    console.log(judge)
    if (!window.echo) {
      commit('setConnected', false)
      dispatch('connectEcho').then(() => {
        window.echo
          .join(`es-display.${rootState.command.floor.id}`)
          .whisper('announce.judge', judge)
        commit('setConnected', true)
      })
    } else {
      window.echo
        .join(`es-display.${rootState.command.floor.id}`)
        .whisper('announce.judge', judge)
      commit('setConnected', true)
    }
  },
  announceCompetitor({ rootState, commit, dispatch }, competitor) {
    console.log(competitor)
    if (!window.echo) {
      commit('setConnected', false)
      dispatch('connectEcho').then(() => {
        window.echo
          .join(`es-display.${rootState.command.floor.id}`)
          .whisper('competitor', competitor)
        commit('setConnected', true)
      })
    } else {
      window.echo
        .join(`es-display.${rootState.command.floor.id}`)
        .whisper('competitor', competitor)
      commit('setConnected', true)
    }
  },
  announceResult({ rootState, commit, dispatch }, result) {
    const floorId = result.floorId ?? rootState.command.floor.id
    console.log('found floor id', floorId)
    console.log('announce result', result)
    if (!window.echo) {
      commit('setConnected', false)
      dispatch('connectEcho').then(() => {
        commit('handshake', {
          floorId: floorId,
          whisper: 'result',
          event: result,
        })
        commit('setConnected', true)
      })
    } else {
      commit('handshake', {
        floorId: floorId,
        whisper: 'result',
        event: result,
      })
      commit('setConnected', true)
    }
  },
  announceEvent({ rootState, commit, dispatch }, event) {
    event.uid = uid()
    console.log(event)
    const floorId = event.floorId ?? rootState.command.floor.id
    console.log('found floor id', floorId)
    if (!window.echo) {
      commit('setConnected', false)
      dispatch('connectEcho').then(() => {
        commit('handshake', {
          floorId: floorId,
          whisper: 'round',
          event,
        })
        commit('setConnected', true)
      })
    } else {
      commit('handshake', {
        floorId: floorId,
        whisper: 'round',
        event,
      })
      commit('setConnected', true)
    }
    // this.$root.$emit('whisper', { channel: 'es-display.' + this.comp.id, event: 'round', data: toAnnounce })
    // this.$root.$emit('whisper', { channel: 'es-comp.' + this.comp.id + '.judges', event: 'round', data: toAnnounce })
    // this.$root.$emit('whisper', {
    //   channel: 'es-display.' + this.floorId,
    //   event: 'start',
    //   data: toAnnounce,
    // })
    // this.$root.$emit('whisper', {
    //   channel: 'es-comp.' + this.comp.id + '.judges',
    //   event: 'start',
    //   data: toAnnounce,
    // })
  },
  startHeat({ rootState, commit, dispatch }, event) {
    event.uid = uid()
    console.log(event)
    const floorId = event.floorId ?? rootState.command.floor.id
    console.log('found floor id', floorId)
    if (!window.echo) {
      commit('setConnected', false)
      dispatch('connectEcho').then(() => {
        commit('handshake', {
          floorId: floorId,
          whisper: 'start',
          event,
        })
        commit('setConnected', true)
      })
    } else {
      commit('handshake', {
        floorId: floorId,
        whisper: 'start',
        event,
      })
      commit('setConnected', true)
    }
  },
  joinAllFloors({ rootState, commit, dispatch }) {
    for (const floor of rootState.command.floors) {
      if (!window.echo) {
        commit('setConnected', false)
        dispatch('connectEcho').then(() => {
          window.echo
            .join(`es-display.${floor.id}`)
            .here((members: unknown) => {
              commit('setConnected', true)
              console.log(`any members on floor ${floor.name}`, members)
            })
          commit('setConnected', true)
        })
      } else {
        window.echo.join(`es-display.${floor.id}`).here((members: unknown) => {
          commit('setConnected', true)
          console.log(`any members on floor ${floor.name}`, members)
        })
        commit('setConnected', true)
      }
    }
  },
  shareStatus({ rootState, commit, dispatch, rootGetters }) {
    const roundId = rootState.command.current.round?.id
    // const nextRoundId = rootState.command.current.round?.id
    const round = {
      title: rootState.command.current.title,
      round: rootState.command.current.round?.round,
      floor: rootState.command.current.round?.floor.id,
    }
    const nextRound = {
      title: rootState.command.next?.title,
      round: rootState.command.next?.round?.round,
      floor: rootState.command.next?.round?.floor.id,
    }
    const dance = rootGetters['command/dance']
    const competitors = rootGetters['command/competitorsByRoundId'](roundId)
    const toWhisper = {
      status: true,
      current: {
        round,
        heat: rootState.command.currentHeat,
        dance,
        danceLetterIndex: rootState.command.compere.danceLetterIndex,
        // competitors: competitors?.map((heat) => {
        //   return heat.map((h) => {
        //     return h.number
        //   })
        // }),
        numCompetitors: competitors?.map((heat) => {
          return heat.length
        }),
      },
      next: {
        round: nextRound,
      },
      judgeUserId: rootState.command.userDetails.id,
    }
    console.log('status update', toWhisper)
    const state = window.echo?.connector.pusher.connection.state
    const isConnected = state === 'connected'
    if (!window.echo || !isConnected) {
      commit('setConnected', false)
      dispatch('connectEcho').then(() => {
        window.echo
          .join(`es-comp.${rootState.command.competition.id}.judges`)
          .whisper('judge', toWhisper)
        // .error((err) => {
        //   console.log('we have an error on whisper', err)
        // })
        const state = window.echo?.connector.pusher.connection.state
        commit('setConnected', state === 'connected')
      })
    } else {
      window.echo
        .join(`es-comp.${rootState.command.competition.id}.judges`)
        .whisper('judge', toWhisper)
      commit('setConnected', isConnected)
    }
  },
  judgesMarks({ rootState, commit, dispatch }, scrut) {
    // es-comp.{compId}.judges
    console.log('now we whisper', scrut, window.echo)
    const state = window.echo?.connector.pusher.connection.state
    const isConnected = state === 'connected'
    if (!window.echo || !isConnected) {
      commit('setConnected', false)
      dispatch('connectEcho').then(() => {
        window.echo
          .join(`es-comp.${rootState.command.competition.id}.judges`)
          .here((members: unknown) => {
            commit('setConnected', true)
            console.log(
              `any members on judges channel for ${rootState.command.competition.title}`,
              members
            )
            // commit('setScrutineers', members)
          })
          .whisper('judge', scrut)
        const state = window.echo?.connector.pusher.connection.state
        commit('setConnected', state === 'connected')
      })
    } else {
      window.echo
        .join(`es-comp.${rootState.command.competition.id}.judges`)
        .here((members: unknown) => {
          commit('setConnected', true)
          console.log(
            `any members on floor ${rootState.command.competition.title}`,
            members
          )
          commit('setScrutineers', members)
        })
        .whisper('judge', scrut)
      commit('setConnected', isConnected)
    }
  },
  completedRound({ rootState, commit, dispatch }, completed) {
    const state = window.echo?.connector.pusher.connection.state
    const isConnected = state === 'connected'
    if (!window.echo || !isConnected) {
      commit('setConnected', false)
      dispatch('connectEcho').then(() => {
        window.echo
          .join(`es-comp.${rootState.command.competition.id}.judges`)
          .here((members: unknown) => {
            commit('setConnected', true)
            console.log(
              `any members on judges channel for ${rootState.command.competition.title}`,
              members
            )
            commit('setJudges', members)
          })
          .whisper('completedRoundZZZ', completed)
        const state = window.echo?.connector.pusher.connection.state
        commit('setConnected', state === 'connected')
      })
    } else {
      window.echo
        .join(`es-comp.${rootState.command.competition.id}.judges`)
        .here((members: unknown) => {
          commit('setConnected', true)
          console.log(
            `any members on floor ${rootState.command.competition.title}`,
            members
          )
          commit('setJudges', members)
        })
        .whisper('completedRoundZZZ', completed)
      commit('setConnected', isConnected)
    }
  },
}

export default actions
