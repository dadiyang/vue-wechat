import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import '../theme/index.css'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import ElementUI from 'element-ui'
Vue.use(ElementUI);
Vue.config.productionTip = false
if (process.env.MOCK) {
  // 在开发环境引入mockjs
  require("../mock");
}

const vm = new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})