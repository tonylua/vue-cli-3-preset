import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import mixins from './mixins'
import filters from './filters'
import directives from './directives'
import 'whatwg-fetch'
import 'normalize.css'

Object.keys(mixins).forEach(key=>{
  Vue.mixin(key, mixins[key]);
});
Object.keys(filters).forEach(key=>{
  Vue.filter(key, filters[key]);
});
Object.keys(directives).forEach(key=>{
  Vue.directive(key, directives[key]);
});

Vue.config.productionTip = false;

<% if (opt_compositionapi) { %>
Vue.use(VueCompositionApi);
<% } %>

new Vue({
  <% if (opt_i18n) { %>
  i18n,
  <% } %>
  router,
  store,
  render: h => h(App),
}).$mount('#app');
