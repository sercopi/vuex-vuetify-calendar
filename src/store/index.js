import Vue from 'vue';
import Vuex from 'vuex';
import Todos from '@/store/modules/todos';
import Calendar from '@/store/modules/calendar';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    Todos,
    Calendar
  }
});
