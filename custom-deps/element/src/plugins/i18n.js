import Vue from 'vue';
import VueCookie from 'vue-cookie';
import VueI18n from 'vue-i18n';
import eleEn from '~/element-ui/lib/locale/lang/en';
import eleZh from '~/element-ui/lib/locale/lang/zh-CN';
import appEn from '@/locale/en';
import appZh from '@/locale/zh-CN';

Vue.use(VueI18n);

const messages = {
  'en': {
    ...eleEn,
    ...appEn
  },
  'zh-CN': {
    ...eleZh,
    ...appZh
  }
};

const i18n = new VueI18n({
  locale: VueCookie.get('lang') || 'zh-CN',
  fallbackLocale: 'zh-CN',
  messages
});

export default i18n;
