import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
      token: getToken(),
      name: '',
      id: '',
      avatar: '',
      buttons: [],
      roles: []
  },


  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_ID: (state, id) =>{
      state.id = id
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_BUTTONS: (state, buttons) => {
      state.buttons = buttons
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
  },

  actions: {
    // user login
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()

      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response.data
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // get user info
    async GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const { data } = response

          if (!data) {
            return reject('Verification failed, please Login again.')
          }
          if (data.roles && data.roles.length > 0) {
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          console.log(data)
          const buttonAuthList = []
          data.permissionValueList.forEach(button => {
            buttonAuthList.push(button)
          })

          commit('SET_NAME', data.name)
          commit('SET_ID', data.id)
          commit('SET_AVATAR', data.avatar)
          commit('SET_BUTTONS', buttonAuthList)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // user logout
    Logout({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          debugger
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_BUTTONS', [])
          removeToken() // must remove  token  first
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // remove token
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        // debugger
        commit('SET_TOKEN', '')
        removeToken() // must remove  token  first
        resolve()
      })
    }
  }
}
export default user

