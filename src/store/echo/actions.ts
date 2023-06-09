import { ActionTree } from 'vuex'
import { StateInterface } from '../index'
import { EchoStateInterface } from './state'
import client from 'socket.io-client'
import Echo from 'laravel-echo'
import { axiosInstance } from 'boot/axios'
import { uid } from 'quasar'
import { v2 } from 'src/@types/command'

const actions: ActionTree<EchoStateInterface, StateInterface> = {
  connectEcho({ rootState, commit, dispatch }) {
    return new Promise<void>((resolve) => {
      if (window.echo) {
        commit('closeEcho')
        commit('setConnected', false)
      }
      const authToken = rootState.command.auth.authToken
        ? `Bearer ${rootState.command.auth.authToken}`
        : axiosInstance.defaults.headers.common.Authorization
      console.log('we have auth token', authToken)
      const echo = new Echo({
        broadcaster: 'socket.io',
        host: process.env.ECHO,
        namespace: '',
        client,
        forceTLS: false,
        auth: {
          headers: {
            Authorization: authToken,
          },
        },
      })
      console.log(authToken, echo)
      echo.connector.socket.on('connect', () => {
        const time = new Date().toLocaleTimeString()
        console.log(`we connected at ${time}`)
        commit('setConnected', true)
      })
      echo.connector.socket.on(
        'disconnect',
        (attemptNumber: number, no: number) => {
          const time = new Date().toLocaleTimeString()
          console.log(
            `connection down (disconnect) at ${time}: `,
            attemptNumber,
            no
          )
          commit('setConnected', false)
        }
      )
      echo.connector.socket.on(
        'reconnecting',
        (attemptNumber: number, no: number) => {
          const time = new Date().toLocaleTimeString()
          console.log(
            `connection down (reconnecting) at ${time}: `,
            attemptNumber,
            no
          )
          commit('setConnected', false)
        }
      )
      echo.connector.socket.on(
        'subscription_error',
        (err: string, status: string) => {
          const time = new Date().toLocaleTimeString()
          console.log(`subscription error at ${time}: `, err, status)
          // commit('setConnected', false)
        }
      )
      commit('saveEcho', echo)
      dispatch('joinDisplay', rootState.command.floor.id).then(() => {
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
      judges.listenForWhisper(
        'markCompletedSetCurrent',
        (payload: { round: v2.TimetableItem }) => {
          // const { round } = payload
          console.log('we have a round', payload)
          const round = payload
          commit('command/setDanceLetterIndex', 0, { root: true })
          dispatch('command/getCompetitorsByRoundId', round.round.id, {
            root: true,
          })
          commit('command/overrideCurrent', round, { root: true })
          dispatch('command/getNextCompetitors', {}, { root: true })
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
  judgesMarks({ rootState, commit, dispatch }, scrut) {
    // es-comp.{compId}.judges
    console.log('now we whisper', scrut, window.echo)
    if (!window.echo) {
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
        commit('setConnected', true)
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
      commit('setConnected', true)
    }
  },
  completedRound({ rootState, commit, dispatch }, completed) {
    // es-comp.{compId}.judges
    if (!window.echo) {
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
        commit('setConnected', true)
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
      commit('setConnected', true)
    }
  },
}

export default actions
