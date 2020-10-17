//IMPORTANTE! Inicializar las variables
import db from '@/components/firebaseInit';
import firebase from 'firebase';
const state = {
  newEvent: {
    value: {
      name: null,
      details: null,
      start: null,
      end: null,
      color: '#1976D2',
      timeStop: '',
      timeStart: ''
    }
  },
  dialog: { value: false },
  events: []
};
const getters = {
  newEvent: state => state.newEvent,
  dialog: state => state.dialog,
  allEvents: state => state.events
};
const actions = {
  async fetchEvents({ commit }) {
    const snapshot = await db
      .collection('calEvent')
      .where('user_id', '==', firebase.auth().currentUser.uid)
      .get();
    let events = [];

    snapshot.forEach(doc =>
      events.push({
        ...doc.data(),
        start: doc.data().start,
        end: doc.data().end,
        id: doc.id
      })
    );
    commit('setEvents', events);
  },
  addEvent({ commit, getters }) {
    const id = db.collection('calEvent').doc().id;
    const eventFormatted = {
      ...getters.newEvent.value,
      start:
        getters.newEvent.value.start +
        (getters.newEvent.value.timeStart
          ? 'T' + getters.newEvent.value.timeStart
          : ''),
      end:
        getters.newEvent.value.end +
        (getters.newEvent.value.timeStop
          ? 'T' + getters.newEvent.value.timeStop
          : ''),
      id: id,
      user_id: firebase.auth().currentUser.uid
    };
    db.collection('calEvent')
      .doc(id)
      .set(eventFormatted);
    commit('addEvent', eventFormatted);

    getters.newEvent.value.name = '';
    getters.newEvent.value.details = '';
    getters.newEvent.value.color = '#1976D2';
    getters.newEvent.value.start = '';
    getters.newEvent.value.end = '';
    getters.newEvent.value.timeStart = null;
    getters.newEvent.value.timeStop = null;
  },
  updateEvent({ commit }, event) {
    const eventFormatted = {
      name: event.name,
      details: event.details,
      color: event.color,
      id: event.id,
      start:
        event.start.substr(0, 10) +
        (event.timeStart ? 'T' + event.timeStart : ''),
      end:
        event.end.substr(0, 10) + (event.timeStop ? 'T' + event.timeStop : ''),
      user_id: firebase.auth().currentUser.uid,
      timeStart: event.timeStart,
      timeStop: event.timeStop
    };

    db.collection('calEvent')
      .doc(event.id)
      .set(eventFormatted);
    commit('updateEvent', eventFormatted);
  },
  deleteEvent({ commit }, event) {
    db.collection('calEvent')
      .doc(event.id)
      .delete();
    commit('deleteEvent', event);
  }
};
const mutations = {
  setEvents: (state, events) => (state.events = events),
  addEvent: (state, event) => state.events.push({ ...event }),
  updateEvent: (state, _event) =>
    (state.events[state.events.findIndex(event => event.id == _event.id)] = {
      ..._event
    }),
  deleteEvent: (state, _event) =>
    (state.events = state.events.filter(event => event.id !== _event.id))
};
export default {
  state,
  getters,
  actions,
  mutations
};
