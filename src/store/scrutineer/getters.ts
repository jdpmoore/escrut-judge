import { GetterTree } from 'vuex';
import { StateInterface } from '../index';
import { ScrutineerStateInterface } from './state'

const getters: GetterTree<ScrutineerStateInterface, StateInterface> = {
    competitorsByRoundId: (state) => (roundId: number) => {
    if (roundId in state.competitors) {
      return [...state.competitors[roundId]]
    } else {
      return []
    }
  },
}

export default getters;
