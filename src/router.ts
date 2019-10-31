import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'

Vue.use(Router);

export const asyncRouterMap = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/aboutMe',
    name: 'aboutMe',
    component: () => import('./views/AboutMe.vue'),
  },
    {
        path: '/forMore',
        name: 'forMore',
        component: () => import('./views/ForMore.vue'),
    },
  {
    path: '/aboutMe/publishList',
    name: 'publishList',
    component: () => import('./views/PublishList.vue'),
  },
  {
    path: '/blank',
    name: 'blank',
    component: () => import('./views/Blank.vue'),
  },
  {
    path: '/addInfo',
    name: 'addInfo',
    component: () => import('./views/AddInfo.vue'),
  },
];

// @ts-ignore
const router: any = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: asyncRouterMap
});

export default router
