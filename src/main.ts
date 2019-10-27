import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
Vue.prototype.$axios = axios;
// 引入iconfont字体图标
import '@/assets/iconfont.css'
// 引入ant-design-vue组件
import {Tab, Tabs, Toast, Dialog, PullRefresh, Field, Loading} from 'vant';
Vue.use(Tab).use(Tabs).use(Toast).use(Dialog).use(PullRefresh).use(Field).use(Loading);

Vue.prototype.baseUrl = 'http://192.168.0.116:8190';
// Vue.prototype.baseUrl = 'http://192.168.43.188:8190';
// Vue.prototype.baseUrl = 'http://10.111.210.229:8190';

//时间转换函数
Vue.prototype.resolvingDate = function(date: any){
    //date是传入的时间
    let d = new Date(date);
    let month = (d.getMonth() + 1) < 10 ? '0'+(d.getMonth() + 1) : (d.getMonth() + 1);
    let day = d.getDate()<10 ? '0'+d.getDate() : d.getDate();
    let hours = d.getHours()<10 ? '0'+d.getHours() : d.getHours();
    let min = d.getMinutes()<10 ? '0'+d.getMinutes() : d.getMinutes();
    let sec = d.getSeconds()<10 ? '0'+d.getSeconds() : d.getSeconds();

    let times=d.getFullYear() + '-' + month + '-' + day + ' ' + hours + ':' + min + ':' + sec;

    return times
};


Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
