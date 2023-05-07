export namespace v1 {
  export interface Competition {
    address: string
    date: string
    id: number
    status: string
    title: string
    venue: string
  }

  export interface Floor {
    id: number
    maxHeatSize: number
    name: string
  }

  export interface userDetails {
    avatar: string | boolean
    firstName: string
    lastName: string
    roles: Array<string>
    // level: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  }

  export interface authorisation {
    authToken: string
    timeStamp: number
  }

  export interface organisation {
    id: number
    name: string
  }

  export interface Option {
    label: string
    value: number
  }

  export interface Judge {
    id: number
    adjudicatorId: number
    compAdjId: number
    isChair: boolean
    name: string
    userId: number | null
    letter?: string
  }

  export interface ShortJudge {
    id: number
    letter: string
    name: string
  }

  export interface Event {
    displayOrder: number
    id: number
    title: string
  }

  export interface LongEvent {
    danceNo: number
    dances: string
    displayId: number
    eventId: number
    name: string
    title: string
    rounds: Round[]
    team: boolean
    isTeam: boolean
    startTime?: string
    finalTime?: string
  }

  export interface Dance {
    abbreviation: string
    id: number
    name: string
  }

  export interface Round {
    adjudicatorLetters: string
    adjudicators: number[]
    floorId: number
    floorName: string
    heats: number
    id: number
    recall: number
    startTime?: string
    timetableOrder?: number
    numberCompetitors?: number
    // event: string
    round: string | number
  }

  export interface Competitor {
    descriptor: string
    events: Event[]
    follower: string
    id: number
    leader: string
    number: number
    withdrawn?: true
    background?: string
  }

  interface LaravelDate {
    date: string
    timezone_type: number
    timezone: string
  }

  export interface fvFile {
    description: string
    ext: string
    id: number
    folder: number
    hasVersions: boolean
    icon: string
    name: string
    pdfConversion: boolean | null
    treeId: string
  }

  export interface fvFolder {
    children?: fvFolder[]
    created: LaravelDate
    description: string
    files: fvFile[]
    icon: string
    id: number
    modified: LaravelDate
    name: string
    parentId: number
  }

  export interface TimetableItem {
    adjudicatorLetters: string
    adjudicators: ShortJudge[]
    dances: string
    event: string
    floorId: number
    floorName: string
    heats: number
    recall: number
    roundId: number
    startTime: string
    timetableOrder: number
  }
}

export namespace v2 {
  export interface Competition {
    address: string
    date: string
    id: number
    status: string
    title: string
    venue: string
  }

  export interface Floor {
    id: number
    maxHeatSize: number
    name: string
  }

  export interface userDetails {
    avatar: string | boolean
    firstName: string
    lastName: string
    roles: Array<string>
    // level: string
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
  }

  export interface authorisation {
    authToken: string
    timeStamp: number
  }

  export interface organisation {
    id: number
    name: string
  }

  export interface Option {
    label: string
    value: number
  }

  export interface Judge {
    id: number
    adjudicatorId: number
    compAdjId: number
    isChair: boolean
    name: string
    userId: number | null
    letter?: string
  }

  export interface ShortJudge {
    id: number
    letter: string
    name: string
  }

  export interface Event {
    displayOrder: number
    id: number
    title: string
  }

  export interface LongEvent {
    id: number
    danceNo: number
    dances: string
    displayId: number
    eventId: number
    name: string
    rounds: Round[]
    team: boolean
    startTime?: string
    finalTime?: string
  }

  export interface Dance {
    abbreviation: string
    id: number
    name: string
  }

  export interface Round {
    adjudicatorLetters: string
    adjudicators: number[]
    floorId: number
    floorName: string
    heats: number
    id: number
    recall: number
    entered: number
    startTime?: string
    timetableOrder?: number
    numberCompetitors?: number
    // event: string
    round: string | number
  }

  export interface Competitor {
    descriptor: string
    events: Event[]
    follower: string
    id: number
    leader: string
    number: number
    withdrawn?: true
    background?: string
  }

  interface LaravelDate {
    date: string
    timezone_type: number
    timezone: string
  }

  export interface fvFile {
    description: string
    ext: string
    id: number
    folder: number
    hasVersions: boolean
    icon: string
    name: string
    pdfConversion: boolean | null
    treeId: string
  }

  export interface fvFolder {
    children?: fvFolder[]
    created: LaravelDate
    description: string
    files: fvFile[]
    icon: string
    id: number
    modified: LaravelDate
    name: string
    parentId: number
  }

  export interface Dance {
    id: number
    name: string
    abbreviation: string
  }

  export interface DanceMap {
    round: number
    oldDance: Dance
    newDance: Dance
  }

  export interface ShortRound {
    danceOrder: Dance[]
    danceMapping: DanceMap[]
    id: number
    heats: number
    recall: number
    dances: Dance[]
    adjudicators: ShortJudge[]
    floor: Floor
    round: string | number
    isQualifier: boolean
    isFirstRound: boolean
  }

  export interface TimetableItem {
    id: number
    title: string
    adjudicatorLetters: string
    adjudicators: ShortJudge[]
    dances: number[]
    danceOrder: number[] | undefined
    round: ShortRound
    floor: Floor
    floorId: number
    floorName: string
    heats: number
    recall: number
    roundId: number
    startTime: LaravelDate
    timetableOrder: number
  }
}
