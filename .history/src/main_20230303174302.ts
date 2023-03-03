import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import router from './router'
import store from './store'
Vue.config.silent = process.env.NODE_ENV === 'pro'
createApp(App).use(store).use(router).use(Antd).mount('#app')

console.log('环境',process.env.NODE_ENV);
console.log('服务端',process.env.VUE_APP_SERVER);

