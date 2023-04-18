import Echo from 'laravel-echo'
import { PresenceChannel } from './presence-channel'
// import { NullPresenceChannel } from 'laravel-echo/src/channel'

export interface EchoStateInterface {
  echo: Echo | null
  display: PresenceChannel | null
  judges: PresenceChannel | null
  scrutineers: PresenceChannel | null
  members: Record<string, unknown>
  otherDisplays: Record<string, PresenceChannel>
  status: string
  round: Record<string, unknown>
  otherRounds: Record<string, unknown>
  event: Record<string, unknown>
  result: Record<string, unknown>
  competitor: Record<string, unknown>
  announceText: string
  numbers: Set<number>
  results: Set<{ text: string; place: number }>
  connected: boolean
  handshake: number | NodeJS.Timer
}

function state(): EchoStateInterface {
  return {
    echo: null,
    handshake: -1,
    display: null,
    judges: null,
    scrutineers: null,
    otherDisplays: {},
    status: 'home',
    members: { judges: [] },
    numbers: new Set(),
    results: new Set(),
    round: {},
    otherRounds: {},
    event: {},
    result: {},
    connected: false,
    announceText: '',
    competitor: {},
  }
}

export default state
