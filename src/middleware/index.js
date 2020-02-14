import routerList from "../router";
import Vue from 'vue'
let Router = VueRouter|| require('vue-router');
Vue.use(Router);
const router = new Router({routes : routerList});
router.beforeEach((to, from, next) => {
    next();
});
export default router