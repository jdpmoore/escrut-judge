interface CompetitorsByRoundId {
  [id: number]: number[]
}

interface MarksByRoundId {
  [id: number]: number[]
}

interface ResultsByRoundId {
  [id: number]: number[]
}

interface RoundsByRoundId {
  [id: number]: number[]
}

interface EventsByRoundId {
  [id: number]: number[]
}

export interface ScrutineerStateInterface {
  events: EventsByRoundId
  rounds: RoundsByRoundId
  competitors: CompetitorsByRoundId
  marks: MarksByRoundId
  results: ResultsByRoundId
}

function state(): ScrutineerStateInterface {
  return {
    rounds: {},
    events: {},
    competitors: {},
    marks: {},
    results: {},
  }
}

export default state
