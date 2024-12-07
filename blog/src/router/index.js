import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user';
import HomeView from '@/views/HomeView.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import Dashboard from '@/views/Dashboard.vue';
import UserManagement from '@/views/UserManagement.vue';
import ArticleManagement from '@/views/ArticleManagement.vue';
import ArticleDetail from '@/views/ArticleDetail.vue';
import { ElMessage } from 'element-plus';
// 路由配置
const routes = [
    { path: '/', redirect: '/home' },
    { path: '/home', component: HomeView },
    { path: '/login', component: Login },
    { path: '/register', component: Register },
    { path: '/articleDetail/:id', component: ArticleDetail },
    // 后台管理及子路由
    {
        path: '/dashboard',
        component: Dashboard,
        children: [
            { path: '', redirect: '/dashboard/article' },
            { path: 'article', component: ArticleManagement },
            { path: 'user', component: UserManagement },
        ],
    },

    // 捕获未定义的路由，重定向到首页
    { path: '/:pathMatch(.*)*', redirect: '/home' },
];
// 创建路由实例
const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});
// 添加路由导航守卫
// router.beforeEach((to, from, next) => {
//     const userStore = useUserStore();
//     const isAuthenticated = !!userStore.token; // 检查是否有 token

//     // 白名单：这些路径可以直接访问
//     const publicPages = ['/login', '/register', '/home'];
//     const isPublicPage = publicPages.includes(to.path);

//     if (!isAuthenticated && !isPublicPage) {
//         // 未登录且访问受限页面时，重定向到登录页
//         ElMessage.error('请先登录');
//         next('/login');
//     } else {
//         next(); // 否则允许访问
//     }
// });

export default router;