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

// 添加带有参数的路径模式
const publicPagePatterns = [
    '/login',
    '/register',
    '/home',
    '/articleDetail/:id', // 注意这里的 :id 是占位符
];

function matchesPublicPagePattern(path) {
    return publicPagePatterns.some(pattern => {
        if (pattern.includes(':')) {
            const regexString = pattern.replace(/:(\w+)/g, '[\\w-]+');
            const regex = new RegExp(`^${regexString}$`);
            return regex.test(path);
        }
        return path === pattern;
    });
}

// 添加一个函数来判断是否是后台管理页面
function isDashboardPage(path) {
    return path.startsWith('/dashboard');
}

// 添加路由导航守卫
router.beforeEach((to, from, next) => {
    const userStore = useUserStore();
    console.log('Current token:', userStore.token); // 打印 token
    const isAuthenticated = !!userStore.token; // 检查是否有 token
    console.log('Is authenticated:', isAuthenticated); // 打印认证状态

    const isPublicPage = matchesPublicPagePattern(to.path);
    const isDashboard = isDashboardPage(to.path);

    if (!isAuthenticated && (!isPublicPage || isDashboard)) {
        ElMessage.error('请先登录');
        next('/login');
    } else {
        next(); // 否则允许访问
    }
});

export default router;