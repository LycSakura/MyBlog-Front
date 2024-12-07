<template>
    <el-container style="height: 100vh; display: flex;">
        <!-- 左侧菜单 -->
        <el-aside width="200px" style="background-color: #3a3f45; color: #fff;">
            <el-menu :default-active="activeMenu" class="el-menu-vertical-demo" @select="handleSelect"
                background-color="#3a3f45" text-color="#fff" active-text-color="#ffd04b">
                <el-menu-item index="article">文章管理</el-menu-item>
                <el-menu-item v-if="isAdmin" index="user">用户管理</el-menu-item>
            </el-menu>
        </el-aside>

        <!-- 右侧内容 -->
        <el-container style="flex: 1; display: flex; flex-direction: column; height: 100%;">
            <el-header
                style="padding: 0 20px; height: 60px; line-height: 60px; background-color: #fff; box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);">
                <div style="float: left; font-size: 20px; color: #555;">管理系统</div>
                <div style="float: right; font-size: 14px; color: #555;">
                    欢迎回来: {{ username }}
                    <el-button type="text" style="color: #555;" @click="logout">退出登录</el-button>
                </div>
            </el-header>
            <el-main
                style="flex: 1; overflow: auto; padding: 20px; background-color: #f0f2f5; min-height: calc(100vh - 60px);">
                <!-- 动态加载的组件 -->
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>


<script setup>
import { ref, computed,onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
// 用户名
const username = computed(() => {
    const userInfo = userStore.getUserInfo;
    return userInfo ? userInfo.username : 'admin';
});
// 当前激活的菜单项
const router = useRouter();
const activeMenu = ref(router.currentRoute.value.name); // 路由名称同步到菜单
const handleSelect = (index) => {
    activeMenu.value = index; // 更新菜单选中状态
    router.push(`/dashboard/${index}`); // 切换路由
};
// 是否是管理员
const isAdmin = computed(() => {
    const userInfo = userStore.getUserInfo;
    const roleId = userInfo ? userInfo.roleId : 0;
    return roleId == 1;
}); 

// 退出登录
const logout = () => {
    localStorage.clear();
    router.push('/login');
};

// 页面加载时读取 localStorage 中的用户信息
onMounted(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserInfo = localStorage.getItem('userInfo');

    if (storedToken) {
        userStore.setToken(storedToken);
    }

    if (storedUserInfo) {
        userStore.setUserInfo(JSON.parse(storedUserInfo));
    }
});
</script>


<style scoped>
.el-aside .el-menu {
    border-right: none;
}

.el-aside .el-menu-item {
    height: 50px;
    line-height: 50px;
    background-color: transparent;
}

.el-aside .el-menu-item.is-active {
    background-color: #495060;
}

.el-aside .el-menu-item:hover {
    background-color: #495060;
}

.el-main {
    padding: 20px;
    background-color: #f0f2f5;
    overflow: auto;
    min-height: calc(100vh - 60px);
}
</style>
