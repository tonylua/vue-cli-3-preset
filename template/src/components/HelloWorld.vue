<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>hello {{ msg2 }}</h2>
		<% if (opt_elementui && opt_i18n) { %>
		<el-button @click="toggleI18n">{{ $t('toggle') }} i18n</el-button>
		<% } %>
    <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>
    <h3>Installed CLI Plugins</h3>
    <ul>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" target="_blank" rel="noopener">babel</a></li>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint" target="_blank" rel="noopener">eslint</a></li>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-unit-jest" target="_blank" rel="noopener">unit-jest</a></li>
      <li><a href="https://www.npmjs.com/package/%2FUsers/tonylua/my_git/vue-cli-preset-pc-2019" target="_blank" rel="noopener">/Users/tonylua/my_git/vue-cli-preset-pc-2019</a></li>
    </ul>
  </div>
</template>

<script>
<% if (opt_elementui && opt_i18n) { %>
import VueCookie from 'vue-cookie';
<% } %>
import {
  testDelay,
  testHttp,
  testBusiness,
  getInfo,
  downFile
} from '@/requests';

export default {
  name: 'HelloWorld',
  props: {
    msg: String,
  },
  data() {
    return {
      msg2: null
    }
  },
  mounted() {
		
		<% if (opt_express) { %>
    const fetchw = new FetchWrapper({ timeout: 2000 });

    testDelay().catch((ex) => {
      console.log('time out', ex);
    });

    testHttp();

    testBusiness();

    getInfo().then(
      res => res.json()
    ).then(
      json => {
        this.msg2 = json.data.hello
      }
    );

    downFile('abc').then(
      json => {
        if (json.msg) {
          window.alert(json.msg);
        }
      }
    );
		<% } %>

  },
	methods: {
		<% if (opt_elementui && opt_i18n) { %>
		toggleI18n() {
			let curr = VueCookie.get('lang');
			if (!curr) curr = 'zh-CN';
			if (curr === 'zh-CN') curr = 'en';
			else curr = 'zh-CN';
			VueCookie.set('lang', curr);
			// console.log(curr);
			window.location.reload();
		}
		<% } %>
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
