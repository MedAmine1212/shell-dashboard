import 'mdb-vue-ui-kit/css/mdb.min.css'
import  { createApp } from 'vue'
import router from "./router"
import App from './App.vue'
createApp(App)
.use(router)
.mount('#app');