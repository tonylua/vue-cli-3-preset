import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'whatwg-fetch'
import 'normalize.css'

Vue.config.productionTip = false;

new Vue({
  <% if (vuei18n) { %>
  i18n,
  <% } %>
  router,
  store,
  render: h => h(App),
}).$mount('#app');
