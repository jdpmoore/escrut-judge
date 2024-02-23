// import { ValidatorWrapper } from '@vuelidate/validators'
import { LocalStorage } from 'quasar'
import { v1, v2 } from 'src/@types/command'

export type TempMark = Map<string, Set<number>>

export interface TempMarks {
  [roundId: number]: TempMark
}

export interface TempImages {
  [roundId: number]: Map<string, string>
}

export interface TempMarksExport {
  [roundId: number]: [string, number[]][]
}

interface Scrutineering {
  competitors: { [id: number]: v1.Competitor[] }
  marks: { [id: number]: number[] }
  tempMarks: TempMarks
  tempImages: TempImages
  results: { [id: number]: number[] }
  roundIdToEventId: Map<number, number>
  roundById: Map<number, v1.Round>
  completedRounds: Set<number>
  activeHeat: number
  heat: number
  danceLetterIndex: number
  dances: string[]
}

// interface RoundByDisplayId {
//   floorId: number
//   displayId: number
// }

export interface CommandStateInterface {
  demo: boolean
  canSubmit: Set<number>
  handwriting: boolean
  currentHeat: number
  currentDance: string
  version: string
  offline: boolean
  competition: v1.Competition
  competitions: v1.Competition[]
  scrutineering: Scrutineering
  floors: v2.Floor[]
  floor: v1.Floor
  userDetails: v1.userDetails
  loggedIn: boolean
  cookieDetails: {
    expires: string
    path: string
    domain: string
    sameSite?: 'Lax' | 'Strict' | 'None' | undefined
    secure?: boolean
  }
  judges: v1.Judge[]
  competitors: v1.Competitor[]
  teamCompetitors: v1.Competitor[]
  defaultRecall: v1.Option
  defaultMissingNumber: v1.Option
  defaultOverfull: v1.Option
  defaultScrutineering: v1.Option
  events: v1.LongEvent[]
  timetable: v2.TimetableItem[]
  timetableOrder: Map<number, v2.TimetableItem[]>
  current: v2.TimetableItem
  next: v2.TimetableItem
  auth: v1.authorisation
  dances: v1.Dance[]
  startTimes: Map<number, string>
  finalTimes: Map<number, string>
  startTimesByRoundId: Map<number, string>
  compere: {
    completedRounds: Set<number>
    completedTimetableEvents: Set<number>
    activeRound: number
    round: number
    // roundByDisplayId: Map<RoundByDisplayId, v2.TimetableItem[]>
    timetableOrder: number
    activeHeat: number
    heat: number
    danceLetterIndex: number
    dances: string[]
  }
}

const blankFloor: v1.Floor = {
  id: 0,
  maxHeatSize: 0,
  name: '',
}

const blankCompetition: v1.Competition = {
  address: '',
  date: '',
  id: 0,
  status: '',
  title: '',
  venue: '',
}

export const blankRound: v2.TimetableItem = {
  id: 0,
  title: '',
  adjudicatorLetters: '',
  adjudicators: [],
  dances: [],
  danceOrder: [],
  // event: '',
  round: {
    id: 0,
    heats: 0,
    recall: 0,
    floor: blankFloor,
    adjudicators: [],
    danceMapping: [],
    dances: [],
    danceOrder: [],
    round: 0,
    isQualifier: false,
    isFirstRound: false,
  },
  floor: blankFloor,
  floorId: 0,
  floorName: '',
  heats: 0,
  recall: 0,
  roundId: 0,
  startTime: {
    date: '',
    timezone_type: 0,
    timezone: '',
  },
  timetableOrder: 0,
  status: '',
}

export function initialState(): CommandStateInterface {
  // console.log(window.location.hostname)
  let domain = process.env.DEV ? 'quakefire.com' : 'greenes.online'
  if (window.location.hostname === 'localhost') {
    domain = 'localhost'
  }
  const defaultState: CommandStateInterface = {
    demo: false,
    canSubmit: new Set(),
    handwriting: false,
    currentHeat: 1,
    currentDance: '',
    version: process.env.version ? process.env.version : '1.0.0',
    offline: false,
    userDetails: { avatar: '', roles: [''], firstName: '', lastName: '' },
    competition: blankCompetition,
    floors: [],
    floor: blankFloor,
    competitions: [],
    defaultRecall: { label: 'Nearest (or greater)', value: 1 },
    defaultMissingNumber: { label: 'Ask (default add)', value: 1 },
    defaultOverfull: { label: 'Ask (default ignore)', value: 1 },
    defaultScrutineering: { label: 'Number pad', value: 1 },
    judges: [],
    competitors: [],
    teamCompetitors: [],
    scrutineering: {
      competitors: {},
      marks: {},
      tempMarks: {},
      tempImages: {},
      results: {},
      roundIdToEventId: new Map(),
      roundById: new Map(),
      completedRounds: new Set(),
      activeHeat: 1,
      heat: 1,
      danceLetterIndex: 0,
      dances: [],
    },
    compere: {
      // activeDisplayId: 1,
      // roundByDisplayId: new Map(),
      completedRounds: new Set(),
      completedTimetableEvents: new Set(),
      activeRound: 0,
      round: 0,
      timetableOrder: 1,
      activeHeat: 1,
      heat: 1,
      danceLetterIndex: 0,
      dances: [],
    },
    events: [],
    timetable: [],
    timetableOrder: new Map(),
    dances: [],
    current: blankRound,
    next: blankRound,
    auth: { authToken: '', timeStamp: Date.now() },
    loggedIn: false,
    startTimes: new Map(),
    finalTimes: new Map(),
    startTimesByRoundId: new Map(),
    cookieDetails: {
      expires: '4h',
      path: '/',
      domain,
      sameSite: 'Lax',
      // secure: true
    },
  }
  if (LocalStorage.has('savedState-eScrut-command-v2')) {
    const savedState: CommandStateInterface = <CommandStateInterface>(
      LocalStorage.getItem('savedState-eScrut-command-v2')
    )
    // let roundIdToEventId: Map<number, number> = new Map()
    // let roundById: Map<number, v1.Round> = new Map()
    // let startTimes: Map<number, string> = new Map()
    // let finalTimes: Map<number, string> = new Map()
    // if (LocalStorage.has('savedState-eScrut-command-v2-roundIdToEventId')) {
    //   const savedR2EI = LocalStorage.getItem(
    //     'savedState-eScrut-command-v2-roundIdToEventId'
    //   ) as [number, number][]
    //   roundIdToEventId = new Map(savedR2EI)
    // }
    // if (LocalStorage.has('savedState-eScrut-command-v2-roundById')) {
    //   const savedRbI = LocalStorage.getItem(
    //     'savedState-eScrut-command-v2-roundById'
    //   ) as [number, v1.Round][]
    //   roundById = new Map(savedRbI)
    // }
    savedState.scrutineering.roundIdToEventId =
      checkSavedMap<number>('roundIdToEventId')
    savedState.scrutineering.roundById = checkSavedMap<v1.Round>('roundById')
    savedState.scrutineering.completedRounds = checkSavedSet<number>(
      'completedScrutineeringRounds'
    )
    savedState.scrutineering.tempMarks = getSavedTempMarks()
    savedState.compere.completedRounds =
      checkSavedSet<number>('completedRounds')
    savedState.canSubmit = checkSavedSet<number>('canSubmit')
    savedState.compere.completedTimetableEvents = checkSavedSet<number>(
      'completedTimetableEvents'
    )
    savedState.startTimes = checkSavedMap<string>('startTimes')
    savedState.finalTimes = checkSavedMap<string>('finalTimes')
    savedState.startTimesByRoundId = checkSavedMap<string>(
      'startTimesByRoundId'
    )
    savedState.timetableOrder =
      checkSavedMap<v2.TimetableItem[]>('timetableOrder')
    // const defaultSKeys = Object.keys(savedState).length
    const diffMin = (Date.now() - savedState.auth.timeStamp) / 60000
    if (diffMin < 240) {
      return savedState
    } else {
      return defaultState
    }
  } else {
    return defaultState
  }
}

function checkSavedMap<T>(name: string): Map<number, T> {
  let toReturn: Map<number, T> = new Map()
  if (LocalStorage.has(`savedState-eScrut-command-v2-${name}`)) {
    const savedData = LocalStorage.getItem(
      `savedState-eScrut-command-v2-${name}`
    ) as [number, T][]
    toReturn = new Map(savedData)
  }
  return toReturn
}

function checkSavedSet<T>(name: string): Set<T> {
  let toReturn: Set<T> = new Set()
  if (LocalStorage.has(`savedState-eScrut-command-v2-${name}`)) {
    const savedData = LocalStorage.getItem(
      `savedState-eScrut-command-v2-${name}`
    ) as T[]
    toReturn = new Set(savedData)
  }
  return toReturn
}

function getSavedTempMarks() {
  // for (const key in value) {
  //   toSave[key] = [...value[key]]?.map((inner) => {
  //     return [...inner]
  //   })
  // }
  // console.log(toSave)
  if (LocalStorage.has('savedState-eScrut-command-v2-TempMarks')) {
    const toReturn: TempMarks = {}
    const savedData = LocalStorage.getItem(
      'savedState-eScrut-command-v2-TempMarks'
    ) as TempMarksExport
    // console.log(savedData)
    for (const key in savedData) {
      toReturn[key] = new Map()
      for (const heatJudge of savedData[key]) {
        toReturn[key].set(heatJudge[0], new Set(heatJudge[1]))
      }
    }
    return toReturn
  } else {
    return {}
  }
}

const state: CommandStateInterface = initialState()

export default state
