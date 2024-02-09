import { GetterTree } from 'vuex'
import { StateInterface } from '../index'
import { CommandStateInterface } from './state'
import _ from 'lodash'
import { v1 } from 'src/@types/command'

function chunkify(a: v1.Competitor[], n: number, balanced: boolean) {
  if (n < 2) return [a]

  const len = a.length,
    out = []
  let i = 0
  let size

  if (len % n === 0) {
    size = Math.floor(len / n)
    while (i < len) {
      out.push(a.slice(i, (i += size)))
    }
  } else if (balanced) {
    while (i < len) {
      size = Math.ceil((len - i) / n--)
      out.push(a.slice(i, (i += size)))
    }
  } else {
    n--
    size = Math.floor(len / n)
    if (len % size === 0) size--
    while (i < size * n) {
      out.push(a.slice(i, (i += size)))
    }
    out.push(a.slice(size * n))
  }

  return out
}

const varsityPairsWC = [
  ['A', 'D'],
  ['B', 'F'],
  ['A', 'E'],
  ['C', 'F'],
  ['B', 'D'],
  ['C', 'E'],
  ['A', 'F'],
  ['C', 'D'],
  ['B', 'E'],
]

const varsityPairsQJ = [
  ['C', 'F'],
  ['A', 'E'],
  ['B', 'F'],
  ['A', 'D'],
  ['C', 'E'],
  ['B', 'D'],
  ['A', 'F'],
  ['C', 'D'],
  ['B', 'E'],
]

function varsityChunkify(competitors: v1.Competitor[], dance: v1.Dance) {
  const pairs = ['W', 'C'].includes(dance.abbreviation)
    ? varsityPairsWC
    : varsityPairsQJ
  const toReturn = pairs.map((pair) => {
    return competitors.filter((competitor) => {
      return pair.includes(competitor.descriptor)
    })
  })
  return toReturn
}

const getters: GetterTree<CommandStateInterface, StateInterface> = {
  varsityPairs: () => (dance: v1.Dance) => {
    const pairs = ['W', 'C'].includes(dance.abbreviation)
      ? varsityPairsWC
      : varsityPairsQJ
    return pairs
  },
  competitorsByRoundId:
    (state) =>
    (roundId: number, isOxbridgeVarsity = false, dance: v1.Dance) => {
      // console.log(
      //   state.scrutineering,
      //   roundId in state.scrutineering.competitors,
      //   state.scrutineering.roundById.has(roundId)
      // )
      console.log(
        'we end up here',
        state.scrutineering.competitors,
        state.scrutineering.roundById.has(roundId)
      )
      if (
        roundId in state.scrutineering.competitors &&
        state.scrutineering.roundById.has(roundId)
      ) {
        const nHeats = state.scrutineering.roundById.get(roundId)?.heats ?? 1
        const competitors = [...state.scrutineering.competitors[roundId]]
        // const heatSize = Math.ceil(competitors.length / nHeats)
        // const result = new Array(nHeats)
        //   .fill(1)
        //   .map(() => competitors.splice(0, heatSize))
        //   console.log(competitors, nHeats, result)
        // return result
        if (isOxbridgeVarsity) {
          return varsityChunkify(competitors, dance)
        } else {
          return chunkify(competitors, nHeats, true)
        }
        // return _.chunk(competitors, heatSize)
      } else {
        return []
      }
    },
  competitionsOptions(state) {
    return state.competitions.map((competition) => {
      return { label: competition.title, value: competition }
    })
  },
  floorOptions(state) {
    return state.floors.map((floor) => {
      return { label: floor.name, value: floor }
    })
  },
  events(state) {
    return state.events
  },
  timetableByFloor: (state) => (floor: v1.Floor) => {
    if (floor) {
      return state.timetable.filter((event) => {
        if (event.round) {
          return event.round.floor?.id === floor.id
        } else if (event.floor) {
          return event.floor.id === floor.id
        } else {
          return true
        }
      })
    } else {
      return []
    }
  },
  // timetableOrderByFloorId: (state) => (floorId: number) => {
  //   return state.timetableOrder.get(floorId)
  // },
  timetableOrderByFloorId: (state) => (floorIdIn: number | undefined) => {
    const floorId = floorIdIn ?? state.floor.id
    return _.sortBy(
      state.timetable.filter((timetableEvent) => {
        return (
          timetableEvent.floor?.id === floorId ||
          timetableEvent.round?.floor?.id === floorId
        )
      }),
      ['timetableOrder']
    )
  },
  timetableUncompletedByFloorId: (state) => (floorId: number) => {
    return _.sortBy(
      state.timetable.filter((timetableEvent) => {
        return (
          timetableEvent.floorId === floorId &&
          !state.compere.completedRounds.has(timetableEvent.roundId)
        )
      }),
      ['timetableOrder']
    )
  },
  timetableEntryByTimetableOrder: (state) => (timetableOrder: number) => {
    return (
      state.timetable.find((timetableEvent) => {
        return timetableEvent.timetableOrder === timetableOrder
      }) ?? { roundId: 0 }
    )
  },
  // timetableEntryByTimetableOrder: (state) => (timetableOrder: number) => {
  //   const toReturn = state.timetableOrder.get(state.floor.id)?.find((entry) => {
  //     return entry.timetableOrder === timetableOrder
  //   })
  //   return toReturn ?? { roundId: 0 }
  // },
  rounds(state) {
    const toReturn = state.events
      .map((event) => {
        return _.values(event.rounds)
      })
      .flat()
    return toReturn
  },
  roundIdtoRound:
    (state) =>
    (roundId: number): string => {
      const round = state.scrutineering.roundById.get(roundId)
      if (round) {
        if (round.round === 'SF') {
          return 'Semi-final'
        } else if (round.round === 'F') {
          return 'Final'
        } else if (round.round === 'PO') {
          return 'Play-off'
        } else {
          return `Round ${round.round}`
        }
      }
      return ''
    },
  currentDanceLetters(state) {
    const getDanceLetter = (id) => {
      return state.dances.find((dance) => {
        return dance.id == id
      })
    }
    const dances =
      state.current.round?.danceOrder ?? state.current.round?.dances
    const danceMapping = state.current.round?.danceMapping
    const danceMap = new Map()
    if (danceMapping) {
      for (const dMap of danceMapping) {
        danceMap.set(dMap.oldDance.id, dMap.newDance.id)
      }
    }
    const toReturn = dances?.map((danceId) => {
      const innerReturn = { ...getDanceLetter(danceId) }
      if (danceMap.has(danceId)) {
        const otherDance = getDanceLetter(danceMap.get(danceId))
        innerReturn.abbreviation = otherDance.abbreviation
        innerReturn.name = otherDance.name
      }
      return innerReturn
    })
    console.log('we send back', toReturn)
    return toReturn
    // .split('')
  },
  danceLetter(state, getters) {
    // console.log(
    //   'in danceletter getter',
    //   state.compere.danceLetterIndex,
    //   getters.currentDanceLetters
    // )
    console.log(
      'is the problem here',
      getters.currentDanceLetters,
      state.compere.danceLetterIndex
    )
    return getters.currentDanceLetters?.[state.compere.danceLetterIndex] ?? '0'
  },
  danceById: (state) => (danceId: number) => {
    const danceMapping = state.current.round?.danceMapping
    const danceMap = new Map()
    if (danceMapping) {
      for (const dMap of danceMapping) {
        danceMap.set(dMap.oldDance.id, dMap.newDance.id)
      }
    }
    const foundDance = state.dances.find((dance) => {
      return dance.id == danceId
    })
    if (danceMap.has(danceId)) {
      const foundOtherDance = state.dances.find((dance) => {
        return dance.id == danceMap.get(danceId)
      })
      foundDance.abbreviation = foundOtherDance.abbreviation
      foundDance.name = foundOtherDance.name
    }

    return foundDance
  },
  dance(state, getters) {
    return getters.danceLetter
  },
  lastDance(state, getters) {
    return (
      state.compere.danceLetterIndex === getters.currentDanceLetters.length - 1
    )
  },
  myJudge(state) {
    const userId = state.userDetails.id
    const adj = state.judges.find((judge) => {
      return judge.user.id === userId
    })
    return adj
  },
}

export default getters
