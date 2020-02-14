import Vue from 'vue'
import App from './App.vue'
import router from './middleware'
import {pxToRem} from './units'
import store from "./store";
import Omiv, { render } from 'omiv'
Vue.config.productionTip = false;
if (process.env.config.px2rem){pxToRem(process.env.config.px2remWith, process.env.config.px2remValue)}
Vue.use(Omiv);
render(App, '#app', store,{router});