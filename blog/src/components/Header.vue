<template>
    <header class="header">
        <div class="container">
            <nav class="nav">
                <div class="logo">BLOG</div>
                <ul class="nav-links">
                    <li>
                        <a @click="goToHome">
                            <el-icon>
                                <House />
                            </el-icon>
                            首页
                        </a>
                    </li>
                    <li>
                        <a @click="goToAdmin">
                            <el-icon>
                                <Document />
                            </el-icon>
                            我的管理
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <el-icon>
                                <Link />
                            </el-icon>
                            外部链接
                        </a>
                    </li>
                </ul>
                <div class="nav-icons">
                    <span>🌞</span>
                    <span>🌙</span>
                </div>
            </nav>
        </div>
    </header>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ElIcon } from 'element-plus';
import { Document, House, Link } from '@element-plus/icons-vue';

const router = useRouter();

const goToHome = () => {
    router.push('/');
};

const goToAdmin = () => {
    router.push('/dashboard');
};
</script>

<style lang="scss" scoped>
/* Header 样式 */
.header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    z-index: 1000;
}

/* 容器样式 */
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    position: relative;
    /* 使子元素可以相对定位 */
}

/* 导航栏内容样式 */
.nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    padding: 0 20px;

    .logo {
        font-size: 1.5em;
        font-weight: bold;
        color: aqua;
        /* 使 logo 往左一点 */
        position: absolute;
        left: 0;
        margin-left: 20px;
        /* 调整为正数，使 logo 往左移动 */
    }

    .nav-links {
        list-style: none;
        display: flex;
        gap: 20px;
        margin: 0;
        padding: 0;

        li a {
            text-decoration: none;
            color: #333;
            font-weight: 500;
            font-size: 1em;
            display: flex;
            align-items: center;
            cursor: pointer;
            /* 添加鼠标指针样式 */

            .el-icon {
                margin-right: 5px;
                font-size: 1.2em;
            }
        }
    }

    .nav-icons {
        display: flex;
        gap: 10px;
        /* 使太阳和月亮图标往右一点 */
        position: absolute;
        right: 0;
        margin-right: 20px;
        /* 调整为正数，使图标往右移动 */

        span {
            cursor: pointer;
            /* 添加鼠标指针样式 */
        }
    }
}
</style>