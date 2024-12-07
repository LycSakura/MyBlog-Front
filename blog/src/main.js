import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// 导入elementPlus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 导入pinia
import { createPinia } from 'pinia'
// 导入路由
import router from './router'
// 导入全局样式
import './assets/styles/global.css'


const app = createApp(App);
const pinia = createPinia();

app.use(ElementPlus);
app.use(ElementPlusIconsVue);
app.use(pinia);
app.use(router);
app.mount('#app');

app.config.devtools = true;

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
