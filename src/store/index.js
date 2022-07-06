import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
// import app from './modules/app'
// import settings fro./modules/permissionngs'
// import user from './modules/user'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)
// const modulesFiles = reuqire.context('./modules', false, /\.js$/)
const modulesFiles = require.context('./modules', false, /\.js$/)

const modules = modulesFiles.keys().reduce((modules, modulePath)=>{
  const moduleName= modulePath.replace(/^\.\/(.*)\.\w+$/, '$1')
  const value = modulesFiles(modulePath)
  modules[moduleName] = value.default
  return modules
},{})

const store = new Vuex.Store({
  modules,
  getters,
// fix vuex state lose
  plugins: [createPersistedState({
    storage: window.sessionStorage,
    reducer(val){
      return {
        dict: val.dict
      }
    }
  })]
})

export default store
