import { createStore } from 'vuex'

const store = createStore({
  state: {
    user: JSON.parse(sessionStorage.getItem('user') || '{}')
  },
  getters: {
  },
  mutations: {
    setUser(state,user) {
      console.log("store user：", user);
      state.user = user
      sessionStorage.setItem('user',JSON.stringify(user))
    }
  },
  actions: {
  },
  modules: {
  }
})

export default store;
