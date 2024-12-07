<template>
    <div class="search-bar">
        <input type="text" v-model="query" placeholder="请输入文章标题" @keyup.enter="search" />
        <button @click="search">🔍</button>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useArticleStore } from '@/stores/article';

const query = ref('');
const articleStore = useArticleStore();

const search = () => {
    articleStore.fetchArticlesByTitle(query.value);
};
</script>

<style scoped>
.search-bar {
    position: absolute;
    /* 或者使用 relative */
    top: 100px;
    /* 距离顶部100px */
    left: 50%;
    transform: translateX(-50%);
    /* 使搜索栏水平居中 */
    width: 80%;
    /* 搜索栏的宽度 */
    max-width: 800px;
    /* 最大宽度 */
    height: 40px;
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 20px;
    z-index: 1000;
    display: flex;
    /* 使用 Flexbox 布局 */
    align-items: center;
    /* 垂直居中 */
    justify-content: space-between;
    /* 水平分布 */
    padding: 0 10px;
    /* 内边距 */
}

.search-bar input {
    flex-grow: 1;
    padding: 0 10px;
    font-size: 16px;
    line-height: 40px;
    border: none;
    outline: none;
    background: transparent;
    color: #333;
    /* 文本颜色 */
}

.search-bar button {
    margin-left: 10px;
    padding: 0 10px;
    border: none;
    background-color: transparent;
    color: #007bff;
    /* 按钮文字颜色 */
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    /* 平滑过渡动画 */
}

.search-bar button:hover {
    color: #fff;
    /* 鼠标悬停时的颜色 */
    background-color: #007bff;
    /* 鼠标悬停时的背景色 */
}
</style>