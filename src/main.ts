import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './utils/http'
import './registerHooks.js'
// 引入iconfont字体图标
import '@/assets/iconfont.css'
// 引入ant-design-vue组件
import {Dialog, Field, Loading, PullRefresh, Tab, Tabs, Toast} from 'vant';
// 引入下拉加载、上拉刷新组件
import MescrollVue from 'mescroll.js/mescroll.vue'

Vue.prototype.$axios = axios;
Vue.use(Tab).use(Tabs).use(Toast).use(Dialog).use(PullRefresh).use(Field).use(Loading);

// Vue.prototype.baseUrl = 'http://192.168.0.116:8081';  // 2A311
// Vue.prototype.baseUrl = 'http://10.111.210.229:8081';  // SUST
// Vue.prototype.baseUrl = 'http://192.168.43.188:8081';  // 热点
Vue.prototype.baseUrl = 'http://express.duizhankeji.com:8081';   // 服务器

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
    // let s: string | number = date.getSeconds();
    // s = s < 10 ? ('0' + s) : s;
    return y + '年' + MM + '月' + d + '日 ' + h + ':' + m;
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
