import { Module } from 'vuex';
import { StateInterface } from '../index';
import state, { EchoStateInterface } from './state'
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const echoModule: Module<EchoStateInterface, StateInterface> = {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
}

export default echoModule;
