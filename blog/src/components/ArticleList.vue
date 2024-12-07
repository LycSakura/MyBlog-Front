<template>
    <div class="article-list-container">
        <div v-if="total > 0" class="grid-container">
            <ArticleCard v-for="(article, index) in articles" :key="index" :article="article"
                @click="handleArticleClick(article)"></ArticleCard>
        </div>
        <NoData v-else />
        <div class=" pagination">
            <div class="demo-pagination-block">
                <el-pagination :current-page="currentPage" :page-size="pageSize" :page-sizes="[3, 6, 9, 12]"
                    :size="size" :disabled="disabled" :background="background"
                    layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useArticleStore } from '@/stores/article';
import ArticleCard from './ArticleCard.vue';
import NoData from './NoData.vue';
import { ElPagination } from 'element-plus';
import { useRouter } from 'vue-router';

const router = useRouter();
const articleStore = useArticleStore();
const background = ref(false);
const disabled = ref(false);

const articles = computed(() => articleStore.getSearchResults);
const total = computed(() => articleStore.getTotal);
const currentPage = computed(() => articleStore.currentPage);
const pageSize = computed(() => articleStore.pageSize);

const fetchData = async () => {
    try {
        await articleStore.fetchArticlesByTitle('', currentPage.value, pageSize.value);
    } catch (error) {
        console.error('Failed to fetch articles:', error);
    }
};

const handleSizeChange = (newPageSize) => {
    articleStore.pageSize = newPageSize;
    fetchData();
};

const handleCurrentChange = (newCurrentPage) => {
    articleStore.currentPage = newCurrentPage;
    fetchData();
};

const handleArticleClick = (article) => {
    console.log('Clicked article id:', article.id);

    router.push(`/articleDetail/${article.id}`);
};


onMounted(() => {
    fetchData();
});
</script>

<style scoped>
.article-list-container {
    /* height: 100vh; */
    /* 设置高度为视口高度 */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.grid-container {
    display: grid;
    margin-top: 100px;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    flex: 1;
    /* 确保 grid 容器占据剩余空间 */
}

.pagination {
    display: flex;
    margin-top: 50px;
    justify-content: center;
}

.demo-pagination-block+.demo-pagination-block {
    margin-top: 10px;
}

.demo-pagination-block .demonstration {
    margin-bottom: 16px;
}

/* 使用深度选择器 */
/* 使用 :deep() 穿透 scoped 样式 */
:deep(.el-pagination__sizes),
:deep(.el-pagination__total),
:deep(.el-pagination__goto) {
    color: white !important;
    font-weight: normal !important;
    margin-left: var(--el-pagination-item-gap) !important;
}
</style>