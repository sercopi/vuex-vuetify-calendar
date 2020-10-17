//IMPORTANTE! Inicializar las variables
const state = {
  todos: [],
  newTodo: {
    value: {
      id: null,
      details: '',
      name: null,
      type: 'normal',
      completed: false
    }
  },
  valid: { value: false },
  initialName: { value: '' },
  dialogAddTodo: { value: false },
  dialogUpdateTodo: { value: false },
  showCompleted: { value: false },
  types: {
    important: 'purple darken-3',
    normal: 'blue darken-4',
    'not important': 'blue accent-1'
  }
};
const getters = {
  allTodos: state => state.todos,
  newTodo: state => state.newTodo,
  valid: state => state.valid,
  initialName: state => state.initialName,
  dialogAddTodo: state => state.dialogAddTodo,
  dialogUpdateTodo: state => state.dialogUpdateTodo,
  showCompleted: state => state.showCompleted,
  types: state => state.types
};
import db from '@/components/firebaseInit';
import firebase from 'firebase';
const actions = {
  async fetchTodos({ commit }) {
    let todos = await db
      .collection('Todos')
      .where('user_id', '==', firebase.auth().currentUser.uid)
      .get()
      .then(querySnapshot => {
        const todos = [];
        querySnapshot.forEach(doc => todos.push({ ...doc.data(), id: doc.id }));
        return todos;
      })
      .catch(() => console.log('an erro has occurred'));
    commit('setTodos', todos);
  },
  addTodo({ commit, getters }) {
    const id = db.collection('Todos').doc().id;
    console.log(id);
    db.collection('Todos')
      .doc(id)
      .set({
        ...getters.newTodo.value,
        user_id: firebase.auth().currentUser.uid
      })
      .catch(() => alert('a problem has occurred'));
    commit('addTodo', { ...getters.newTodo.value, id: id, completed: false });
  },
  deleteTodo({ commit, getters }) {
    db.collection('Todos')
      .doc(getters.newTodo.value.id)
      .delete()
      .catch(() => alert('a problem has occurred'));

    commit('deleteTodo');
  },
  updateTodo({ commit, getters }) {
    const todo = getters.newTodo.value;
    db.collection('Todos')
      .doc(todo.id)
      .set({ name: todo.name, details: todo.details, type: todo.type });
    commit('updateTodo');
  },
  completeTodo({ commit }, todo) {
    todo.completed = !todo.completed;
    db.collection('Todos')
      .doc(todo.id)
      .update({ completed: !todo.completed });
    commit('completeTodo', todo);
  }
  /*  async filterTodos({ commit, dispatch }, name) {
    await dispatch('fetchTodos');
    commit('filterTodos', name);
  } */
};
const mutations = {
  setTodos: (state, todos) => (state.todos = todos),
  addTodo: (state, todo) => {
    state.todos.push({ ...todo });
    state.newTodo.value = {
      id: null,
      details: '',
      name: null,
      type: 'normal',
      completed: false
    };
  },
  deleteTodo: state => {
    state.todos = state.todos.filter(({ id }) => id !== state.newTodo.value.id);
    state.newTodo.value = {
      id: null,
      details: '',
      name: null,
      type: 'normal',
      completed: false
    };
  },

  updateTodo: state => {
    state.todos[
      state.todos.findIndex(({ id }) => id == state.newTodo.value.id)
    ] = { ...state.newTodo.value };
    state.newTodo.value = {
      id: null,
      details: '',
      name: null,
      type: 'normal',
      completed: false
    };
  },
  completeTodo: (state, todo) => {
    state.todos[state.todos.findIndex(({ id }) => id == todo.id)].completed =
      todo.completed;
  }
};
export default {
  state,
  getters,
  actions,
  mutations
};
