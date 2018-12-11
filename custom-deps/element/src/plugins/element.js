import Vue from 'vue'
import Element from 'element-ui'
<% if (vuei18n) { %>
//import enLocale from 'element-ui/lib/locale/lang/en'
import zhCNLocale from 'element-ui/lib/locale/lang/zh-CN'
<% } %>
import '../styles/element-variables.scss'

Vue.use(
  Element
  <% if (vuei18n) { %>
  , {locale: zhCNLocale}
  <% } %>
)
