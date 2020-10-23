import Vue from "vue";
<% if (elementUI) { %>
import ElementUI from "element-ui";
<% } %>
<% if (compositionAPI) { %>
import VueCompositionApi from "@vue/composition-api";
<% } %>
import "normalize.css";

<% if (elementUI) { %>
Vue.use(ElementUI);
<% } %>
<% if (compositionAPI) { %>
Vue.use(VueCompositionApi);
<% } %>

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};
