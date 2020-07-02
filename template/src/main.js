import 'whatwg-fetch'
import 'normalize.css'
import Vue from 'vue'
import App from './App.vue'
// import mixins from './mixins'
import filters from './filters'
import directives from './directives'

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

const init = async () => {
  const store = await import('./store');
  const router = await import('./router');
  return new Vue({
    <% if (opt_i18n) { %>
    i18n,
    <% } %>
    router: router.default,
    store: store.default,
    render: h => h(App),
  }).$mount('#app');
}

// eslint-disable-next-line no-undef
if (RUNTIME_ENV === 'prod') {
  fetch('/endpoint.json').then(res => res.json()).then(cfg => {
    window.API_ENDPOINT = cfg.ENDPOINT;
    // lazy loading to ensure API_ENDPOINT
    init();
  });
} else {
  init();
}
