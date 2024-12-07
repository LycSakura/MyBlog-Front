<template>
    <div class="category-list">
        <div class="title" @click="fetchCategories">
            <el-icon>
                <Folder />
            </el-icon>
            分类列表
        </div>
        <div class="category-items">
            <div v-for="(category, index) in visibleCategories" :key="index" class="category-item"
                @click="fetchArticlesByCategoryName(category.categoryName)">
                <span class="category-name">{{ category.categoryName }}</span>
                <span class="category-count">({{ category.articleCount }})</span>
            </div>
        </div>
        <button v-if="showMoreButton" class="show-more" @click="toggleMore">
            {{ showMore ? '收回' : '更多' }}
        </button>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { ElIcon } from 'element-plus';
import { Folder } from '@element-plus/icons-vue';
import { getCategoryList } from '@/api/category';
import { useArticleStore } from '@/stores/article';

const maxVisibleCategories = 5; // 最多显示的分类数量
const showMore = ref(false);
const categories = ref([]);
const articleStore = useArticleStore();
// 获取分类列表
const fetchCategories = async () => {
    const res = await getCategoryList();
    await articleStore.fetchArticlesByTitle('', 1, 6);
    categories.value = res.data;
};

// 根据分类名获取文章列表
const fetchArticlesByCategoryName = async (categoryName) => {
    try {
        console.log('根据标分类名获取文章:', categoryName);
        await articleStore.fetchArticlesByCategoryName(categoryName);
        scrollToTop();
    } catch (error) {
        console.error('获取文章失败: ' + error.message);
    }
};

const visibleCategories = computed(() => {
    return showMore.value ? categories.value : categories.value.slice(0, maxVisibleCategories);
});

const showMoreButton = computed(() => {
    return categories.value.length > maxVisibleCategories;
});

const toggleMore = () => {
    showMore.value = !showMore.value;
};
// 滚动到顶部
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

onMounted(() => {
    fetchCategories();
});
</script>

<style scoped>
.category-list {
    list-style-type: none;
    padding: 0;
    margin-top: 50px;
    background-color: #f0f0f0;
    padding: 20px;
    border: 2px dashed #21cee9;
    border-radius: 10px;
    width: 300px;
    /* 固定宽度 */
    display: flex;
    flex-direction: column;
    height: 100%;
}

.category-list .title {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    font-size: 18px;
    color: #333;
    cursor: pointer;
}

.category-list .title .el-icon {
    margin-right: 5px;
}

.category-items {
    flex: 1;
    overflow-y: auto;
    /* 内容超出时可以滚动 */
}

.category-item {
    color: black;
    background-color: #f4f6e6;
    border-radius: 10px;
    padding: 10px;
    text-align: center;
    margin: 5px 0;
    word-wrap: break-word;
    /* 超过宽度时换行 */
    cursor: pointer;
}

.category-link {
    color: purple;
    text-decoration: none;
    display: block;
    /* 使链接块级元素，方便设置高度 */
}

.category-name {
    font-weight: bold;
}

.category-count {
    color: #666;
}

.show-more {
    background-color: #4CAF50;
    color: white;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
    display: block;
    /* 默认显示 */
}

.show-more:hover {
    background-color: #45a049;
}
</style>