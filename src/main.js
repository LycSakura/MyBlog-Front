import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
// 导入elementPlus
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
// 导入pinia
import { createPinia } from 'pinia';
// 导入路由
import router from './router';
// 导入全局样式
import './assets/styles/global.css';
// 导入用户状态管理
import { useUserStore } from '@/stores/user';

async function initApp() {
    const app = createApp(App);
    const pinia = createPinia();

    app.use(ElementPlus);
    app.use(pinia);
    app.use(router);

    // 注册所有 Element Plus 图标组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
        app.component(key, component);
    }

    // 提前加载用户信息
    const userStore = useUserStore();
    await userStore.fetchUserInfo();

    app.config.devtools = true;

    // 挂载应用
    app.mount('#app');
}

initApp().catch(error => {
    console.error('Application initialization failed:', error);
});