<template>
    <div class="container">
        <div class="articles">
            <ArticleList :articles="articles" />
        </div>
        <div class="sidebar">
            <Sidebar />
        </div>
    </div>
</template>

<script setup>
import ArticleList from './ArticleList.vue';
import Sidebar from './Sidebar.vue';


</script>

<style scoped>
.container {
    display: flex;
    justify-content: center;
    /* 使子元素居中对齐 */
    gap: 20px;
    /* 添加子元素之间的间距 */
    align-items: flex-start;
    /* 垂直对齐到顶部 */

}

.articles {
    /* background-color: #f5f5f5; */
    margin-top: 100px;
    display: flex;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.sidebar {
    margin-top: 120px;
    /* margin-left: 20px; */
    width: 300px;
    /* 固定侧边栏宽度 */
}
</style>