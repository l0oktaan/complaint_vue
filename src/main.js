import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';
import axios from 'axios';
import VueAxios from 'vue-axios';
import store from './store';
import VTiptap from "@peepi/vuetify-tiptap";
import fonts from './assets/css/fonts.css';
import VueExcelXlsx from "vue-excel-xlsx"


Vue.config.productionTip = false

Vue.use(VueAxios, axios)

Vue.use(VueExcelXlsx);

Vue.use(VTiptap)

axios.defaults.baseURL = '';

axios.defaults.headers.common = {
  "Content-Type": "application/json",
  'X-Requested-With': 'XMLHttpRequest',
};

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if(token){
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

new Vue({
  vuetify,
  router,
  store,
  fonts,
  render: h => h(App)
}).$mount('#app')
