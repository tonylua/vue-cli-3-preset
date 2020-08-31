import 'whatwg-fetch'
import 'normalize.css'
import Vue from 'vue'
import App from './App.vue'
import filters from './filters'
import directives from './directives'

Object.keys(filters).forEach(key=>{
  Vue.filter(key, filters[key]);
});
Object.keys(directives).forEach(key=>{
  Vue.directive(key, directives[key]);
});

Vue.config.productionTip = false;

const init = async () => {
  // @ts-ignore
  const store = await import('./store');
  // @ts-ignore
  const router = await import('./router');
  return new Vue({
    // @ts-ignore
    <% if (opt_i18n) { %>
    i18n,
    <% } %>
    router: router.default,
    store: store.default,
    render: h => h(App),
  }).$mount('#app');
}

init().then(app => {});
