import { MutationTree } from 'vuex'
import { EchoStateInterface } from './state'
import { PresenceChannel } from './presence-channel'
import Echo from 'laravel-echo'
import { uid } from 'quasar'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import client from 'socket.io-client'
// import state from '../command/state'
// import { NullPresenceChannel } from 'laravel-echo/src/channel'
// function connected() {
//   // this.connected = true
//   console.log('Echo connected')
//   // console.log(rest)
// }
type Override<T, O extends { [F in keyof Partial<T>]: unknown }> = Omit<
  T,
  keyof O
> &
  O

type FixEcho = Override<
  Echo,
  {
    join(channel: string): PresenceChannel
  }
>

declare global {
  interface Window {
    echo: FixEcho
  }
}
function echoF(floorId: number, whisper: string, event: string) {
  return window.echo.join(`es-display.${floorId}`).whisper(whisper, event)
}

const mutation: MutationTree<EchoStateInterface> = {
  handshake(state, { floorId, whisper, event }) {
    clearInterval(state.handshake)
    const u = uid()
    const toRepeat = echoF(floorId, whisper, { ...event, uid: u })
    let counter = 0
    state.handshake = setInterval(() => {
      counter++
      echoF(floorId, whisper, event)
      if (counter === 60) {
        clearInterval(state.handshake)
      }
    }, 1000)
    toRepeat.listenForWhisper('confirm', (payload: string) => {
      if (payload === u) {
        clearInterval(state.handshake)
      }
    })
  },
  setJudges(state, members) {
    state.members.judges = members
  },
  setScrutineers(state, members) {
    state.members.scrutineers = members
  },
  saveEcho(state, echo) {
    window.echo = echo
  },
  saveDisplay(state, display) {
    state.display = display
  },
  saveJudges(state, judges) {
    state.judges = judges
  },
  saveScrutineers(state, scrutineers) {
    state.scrutineers = scrutineers
  },
  saveOtherDisplay(state, val) {
    state.otherDisplays[val.floor.id] = val.display
  },
  announcement(state, message) {
    state.status = 'announce'
    state.announceText = message
  },
  setStatus(state, status) {
    state.status = status
  },
  setRound(state, round) {
    state.round = round
  },
  setOtherRound(state, val) {
    state.otherRounds[val.floor.id] = val.payload
  },
  setResult(state, result) {
    console.log('received result', result)
    state.event = result.event
    state.result = result.summary
    state.results.add(result.summary)
  },
  setCurrentCompetitor(state, competitor) {
    state.competitor = competitor
    state.numbers.add(competitor.number)
  },
  clearResults(state) {
    state.results = new Set()
  },
  clearNumbers(state) {
    state.numbers = new Set()
  },
  openEcho(state, dataIn: { authToken: string; floorId: number }) {
    const { authToken, floorId } = dataIn
    console.log('now we open echo', authToken, floorId)
    if (window.echo) {
      window.echo.connector.socket.close()
      state.connected = false
    }
    console.log('now we connect', authToken, floorId)
    window.echo = <FixEcho>new Echo({
      broadcaster: 'socket.io',
      host: process.env.ECHO,
      namespace: '',
      client,
      forceTLS: false,
      auth: {
        headers: {
          Authorization: 'Bearer ' + authToken,
        },
      },
    })
    window.echo.connector.socket.on('connect', () => {
      console.log('we connected')
      state.connected = true
    })
    // window.echo.connector.socket.on('disconnect', () => {
    //   console.log('Echo disconnect')
    // })
    // window.echo.connector.socket.on('reconnecting', () => {
    //   console.log('Echo reconnecting')
    // })
    // window.echo.connector.socket.on('subscription_error', () => {
    //   console.log('Echo subscription_error')
    // })
    // //
    // window.echo.connector.socket.on('disconnect', connectionDown.bind(state))
    // window.echo.connector.socket.on('reconnecting', connectionDown.bind(state))
    // window.echo.connector.socket.on(
    //   'subscription_error',
    //   subscriptionError.bind(state)
    // )
    state.display = window.echo.join(`es-display.${floorId}`)
    state.display.here((members: unknown) => {
      console.log('any members', members)
    })

    // // .whisper('announce', { displayData: { announceText: 'Test on login!' } })
    // console.log(window.echo)
  },
  closeEcho(state) {
    if (window.echo) {
      window.echo.connector.socket.close()
      state.connected = false
    }
  },
  setConnected(state, val: boolean) {
    state.connected = val
  },
  announce(state, text: string) {
    console.log('announce ', text) // _state.data.command.auth.authToken
    console.log(state.display)

    // if (window.echo) {

    // state.display?.whisper('announce', {
    //   displayData: { announceText: text },
    // })
    // } else {
    // this.openEcho(state)
    // if (dataText) { this.$root.$emit('whisper', { channel: 'es-display.' + this.floorId, event: 'announce', data: { displayData: { announceText: dataText } } }) }
    // window.Echo.join(msg.channel).whisper(msg.event, msg.data)
    // window.echo = new Echo({
    //   broadcaster: 'socket.io',
    //   host: process.env.ECHO,
    //   namespace: '',
    //   client,
    //   auth: {
    //     headers: {
    //       Authorization: 'Bearer ' + authToken,
    //     },
    //   },
    // })
    // window.echo.connector.socket.on('connect', () => {
    //   console.log('Echo connected')
    // })
  },
}
// joinDisplay(state, floorId: number) {
//   if (window.echo) {
//     window.echo
//       .join('es-display.' + floorId)
//       .here((members) => {
//         console.log(members)
//       })
//       .listen('test001', (e) => {})
//       .joining((joiningMember, members) => {})
//       .leaving((leavingMember, members) => {})
//   }
// },
// }

export default mutation

// function connected(this: EchoStateInterface, ...rest: unknown[]) {
//   console.log('Echo connected', this.connected)
//   this.connected = true
//   console.log(rest)
// }
// function connectionDown(
//   this: EchoStateInterface,
//   msg: string,
//   ...rest: unknown[]
// ) {
//   this.connected = false
//   console.log(msg)
//   console.log(rest)
// // }
// function subscriptionError(
//   this: EchoStateInterface,
//   err: string,
//   status: number,
//   ...rest: unknown[]
// ) {
//   this.connected = false
//   console.log('subscription error', err, status)
//   console.log(rest)
// }
