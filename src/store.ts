import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 用户信息
    userInfo: {},
    userId: '',
    userRole: '' // 用户身份  sponsor或receiver
  },
  mutations: {
    SET_USERINFO(state,userInfo){
      // console.log("调用SET_USERINFO");
      state.userInfo = userInfo;
    },
    SET_USERID(state,userId){
      state.userId = userId;
    },
    SET_USERROLE(state,userRole){
      state.userRole = userRole;
    }
  },
  actions: {

  },
  // 对state数据进行操作，例如vue中的computed：计算属性
  getters:{
    userInfo(state){
      return state.userInfo
    },
    userId(state){
      return state.userId
    },
    userRole(state){
      return state.userRole
    },
  }
})
