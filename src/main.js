import Vue from 'vue'
import App from './App.vue'
import router from './middleware'
import store from "./store";
import Omiv, { render } from 'omiv'
Vue.config.productionTip = false;
Vue.use(Omiv);
render(App, '#app', store,{router});