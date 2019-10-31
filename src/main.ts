import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './utils/http'
Vue.prototype.$axios = axios;
// 引入iconfont字体图标
import '@/assets/iconfont.css'
// 引入ant-design-vue组件
import {Tab, Tabs, Toast, Dialog, PullRefresh, Field, Loading} from 'vant';
Vue.use(Tab).use(Tabs).use(Toast).use(Dialog).use(PullRefresh).use(Field).use(Loading);

// Vue.prototype.baseUrl = 'http://192.168.0.116:8190';  // 2A311
// Vue.prototype.baseUrl = 'http://10.111.210.229:8081';  // SUST
// Vue.prototype.baseUrl = 'http://192.168.43.188:8081';  // 热点
Vue.prototype.baseUrl = 'http://express.duizhankeji.com:8081';   // 服务器

// 时间转换函数
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

//时间戳解码
Vue.filter('formatDate',function (value: string | number | Date) {
    let date = new Date(value);
    let y = date.getFullYear();
    let MM: string | number = date.getMonth() + 1;
    MM = MM < 10 ? ('0' + MM) : MM;
    let d: string | number = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    let h: string | number = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    let m: string | number = date.getMinutes();
    m = m < 10 ? ('0' + m) : m;
    let s: string | number = date.getSeconds();
    s = s < 10 ? ('0' + s) : s;
    return y + '年' + MM + '月' + d + '日 ' + h + ':' + m + ':' + s;
})

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
