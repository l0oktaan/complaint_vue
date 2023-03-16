import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const getDefaultState = () => {
  return {
    user: null,
  }
}

export default new Vuex.Store({

  plugins: [new VuexPersistence().plugin],
  state: getDefaultState(),

  getters: {
    user (state) {
      return state.user
    },
  },
  mutations: {
    authUser (state, data) {
      state.user = data
    },
    clearAuthUser (state){
      state.user = null
      localStorage.removeItem('token')

      localStorage.removeItem('expirationDate')

    }
  },
  actions: {

    async login ( {commit}, authData){

      let path = await '/api/backoffice/login'
      let response =  await axios.post(path,{
          username: authData.username,
          password: authData.password
      })

      const expirationTime = await 1000 * 60 * 60; // 1 hour

      const now = await Date.now();

      await commit('authUser', response.data.userdata)

      await localStorage.setItem('token', response.data.token) 

      await localStorage.setItem("expirationDate", now + expirationTime);

    },
    async userLogin ( {commit}, authData){

      let path = await '/api/user/login'
      let response =  await axios.post(path,{
          email: authData.email,
          password: authData.password
      })

      const expirationTime = await 1000 * 60 * 60; // 1 hour

      const now = await Date.now();

      await commit('authUser', response.data.userdata)

      await localStorage.setItem('token', response.data.token) 

      await localStorage.setItem("expirationDate", now + expirationTime);

    },

    async setName({ commit }, newValue) {

      console.log(newValue, '=======');

      await commit("authUser", newValue);

    },






    async logout({commit}){

      commit('clearAuthUser')
    },

    checkLogin({ commit }){

      const expiration = localStorage.getItem('expirationDate');

      if(expiration < Date.now()){
        console.log('expire','now')
        commit('clearAuthUser')
        return
      }

    },

  },
  modules: {
  }
})
