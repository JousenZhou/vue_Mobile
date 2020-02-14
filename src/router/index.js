import Vue from 'vue'
let Router = VueRouter|| require('vue-router');
Vue.use(Router);
export default new Router({
  routes : [
    {
      path: '/',
      name: 'home',
      component: () => import("@/views/Home.vue"),
    }
  ]
});

