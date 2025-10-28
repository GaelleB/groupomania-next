import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { SpeedInsights } from "@vercel/speed-insights/vue"

createApp(App).use(store).use(router).use(SpeedInsights).mount('#app')