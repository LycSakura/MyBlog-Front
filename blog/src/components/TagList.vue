<template>
    <div class="tag-list">
        <div class="title" @click="fetchTags">
            <el-icon>
                <CollectionTag />
            </el-icon>
            文章标签
        </div>
        <ul>
            <li v-for="tag in visibleTags" :key="tag.id" @click="fetchArticlesByTagName(tag.tagName)">
                {{ tag.tagName }}
            </li>
        </ul>
        <button v-if="tags.length > 6" @click="toggleTags">
            {{ showAll ? '收回' : '更多' }}
        </button>
    </div>
</template>

<script setup>
import { CollectionTag } from '@element-plus/icons-vue';
import { ref, onMounted, computed } from 'vue';
import { getTags } from '@/api/tag';
import { useArticleStore } from '@/stores/article';


const tags = ref([]);
const loading = ref(true);
const error = ref(null);
const showAll = ref(false); // 控制是否显示所有标签
const articleStore = useArticleStore();

const visibleTags = computed(() => {
    return showAll.value ? tags.value : tags.value.slice(0, 6);
});

const toggleTags = () => {
    showAll.value = !showAll.value;
};

// 获取标签数据
const fetchTags = async () => {
    try {
        const response = await getTags();
        await articleStore.fetchArticlesByTitle('', 1, 6);
        if (response.code === 200 && response.message === '成功') {
            tags.value = response.data || [];
            console.log('获取标签成功:', tags.value);
        } else {
            error.value = '获取标签失败: ' + (response.message || '未知错误');
        }
    } catch (err) {
        error.value = '获取标签失败: ' + err.message;
    } finally {
        loading.value = false;
    }
};

// 根据标签名获取文章
const fetchArticlesByTagName = async (tagName) => {
    try {
        console.log('根据标签名获取文章:', tagName);
        await articleStore.fetchArticlesByTagName(tagName);
        scrollToTop();
    } catch (error) {
        console.error('获取文章失败: ' + error.message);
    }
};

// 滚动到顶部
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

onMounted(() => {
    fetchTags();
});
</script>

<style scoped>
.title {
    margin: 5px;
    padding: 5px 10px;
    background-color: #f4f6e6;
    color: purple;
    border: 2px dashed purple;
    border-radius: 5px;
    text-align: center;
    cursor: pointer;
}

.tag-list {
    list-style-type: none;
    padding: 0;
    margin-top: 50px;
    background-color: #f0f0f0;
    padding: 20px;
    border: 2px dashed #21cee9;
    border-radius: 10px;
    width: 300px;
    /* 固定宽度 */
    overflow: hidden;
    /* 超出高度隐藏内容 */
    display: flex;
    flex-direction: column;
}

.tag-list ul {
    display: flex;
    flex-wrap: wrap;
    /* 超出宽度换行 */
    margin: 0;
    padding: 0;
}

.tag-list li {
    display: inline-block;
    margin: 5px;
    padding: 5px 10px;
    background-color: #f4f6e6;
    color: purple;
    border: 2px dashed purple;
    border-radius: 5px;
    text-align: center;
    cursor: pointer;
}

.tag-list button {
    margin-top: 10px;
    padding: 5px 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
</style>