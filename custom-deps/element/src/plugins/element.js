import Vue from 'vue'
import Element from 'element-ui'
<% if (vuei18n) { %>
import i18n from './i18n';
<% } %>
import '../styles/element-variables.scss'

Vue.use(
  Element
  <% if (vuei18n) { %>
  , {
    i18n: (k, v) => i18n.t(k, v)
  }
  <% } %>
)
