import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { ScrutineerStateInterface } from './state'
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const scrutineerModule: Module<ScrutineerStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
}

export default scrutineerModule
