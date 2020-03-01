import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '*', // Not Found
      redirect: '/'
    },
    {
      path: '/',
      name: 'home',
      component: () => import(/* webpackChunkName: "majorbundle" */ '@/views/Home.vue'),
      meta: {
        title: 'Home'
      }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "majorbundle" */ '@/views/About.vue'),
      meta: {
        title: 'About'
      }
    }
  ]
});
