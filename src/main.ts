import { createApp } from 'vue'
import App from './App.vue'

import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import * as Icons from "@element-plus/icons-vue";
import './style.css'

import router from './router';

import pinia from "@/stores";
import SubMenu from './layouts/components/submenu/index.vue'
const app = createApp(App)

app.use(ElementPlus, {
  locale: zhCn,
})
app.component("SubMenu", SubMenu)
// register the element Icons component
Object.keys(Icons).forEach(key => {
  app.component(key, Icons[key as keyof typeof Icons]);
});

app.use(router)
app.use(pinia)
app.mount('#app')
