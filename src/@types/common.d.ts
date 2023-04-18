export namespace Common {
  export interface Common {
    blankAvatar: () => string
    popup: (details: PopupDetails) => void
    axiosError: (err: ErrorObject, optionalMsg?: string) => void
  }

  interface PopupDetails {
    title: string
    message: string
    html?: boolean
    persistent?: boolean
  }

  interface ResponseObject {
    data: { error: string; message: string; exception: string }
    status: number
    responseURL?: string
    headers: { Authorization: string }
    config: { headers: { Authorization: string } }
  }

  interface ErrorObject {
    response: ResponseObject | null
    request: ResponseObject | null
    message: string
  }

  export interface LaravelDate {
    date: string
    timezone_type: number
    timezone: string
  }
}

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

export interface Versions {
  competitor: string
  judge: string
  command: string
  display: string
}

export interface userDetails {
  avatar: string | boolean
  firstName: string
  lastName: string
  roles: Array<string>
  versions: Versions
  // level: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

interface authorisation {
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
  adjudicatorId: number
  compAdjId: number
  isChair: boolean
  name: string
  userId: number | null
  letter?: string
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
  rounds: Round[]
  team: boolean
}

export interface Round {
  adjudicatorLetters: string
  adjudicators: number[]
  floorId: number
  floorName: string
  heats: number
  id: number
  recall: number
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

export interface LaravelDate {
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
