import Vue from 'vue';
import { configure, addDecorator } from '@storybook/vue';
import { withInfo, setDefaults } from 'storybook-addon-vue-info';
import 'normalize.css';
<% if (elementUI) { %>
import Element from 'element-ui';
<% } %>
<% if (compositionAPI) { %>
import VueCompositionApi from '@vue/composition-api';
<% } %>

<% if (elementUI) { %>
Vue.use(Element);
<% } %>
<% if (compositionAPI) { %>
Vue.use(VueCompositionApi);
<% } %>

setDefaults({
  header: false
});
addDecorator(withInfo);
const req = require.context('../src', true, /\.stories\.js$/);
function loadStories() {
  req.keys().forEach(filename => {
    try {
      req(filename)
    } catch (ex) {
      console.log('storybook-req', ex)
    }
  });
}
configure(loadStories, module);
