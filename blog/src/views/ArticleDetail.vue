<template>
    <div class="article-detail-container">
        <Header />

        <!-- 文章详情部分 -->
        <div v-if="!article" class="loading-message">
            <el-spinner size="large" />
            <p>加载中...</p>
        </div>

        <div v-if="article" class="article-content">
            <el-card :body-style="{ padding: '20px' }" class="article-card">
                <h1 class="article-title">{{ article.title }}</h1>
                <div class="article-meta">
                    <span class="meta-item">作者: {{ article.author }}</span>
                    <span class="meta-item">创建时间: {{ article.createTime }}</span>
                    <span class="meta-item">更新时间: {{ article.updateTime }}</span>
                </div>
                <p class="article-tags">
                    分类:
                    <span v-for="(category, index) in article.categoryNames" :key="index">
                        {{ category }}{{ index < article.categoryNames.length - 1 ? ', ' : '' }} </span>
                </p>
                <p class="article-tags">
                    标签:
                    <span v-for="(tag, index) in article.tagNames" :key="index">
                        {{ tag }}{{ index < article.tagNames.length - 1 ? ', ' : '' }} </span>
                </p>
                <div class="article-body" v-html="sanitizedContent"></div>
            </el-card>

            <!-- 评论部分 -->
            <div class="comments-section">

                <!-- 如果已登录则显示评论表单 -->
                <template v-if="isLoggedIn">
                    <el-form :model="commentForm" label-width="80px" @submit.native.prevent="submitComment">
                        <el-form-item label="评论内容" :rules="[{ required: true, message: '请输入评论内容', trigger: 'blur' }]">
                            <el-input v-model="commentForm.content" type="textarea" rows="4" placeholder="请输入评论..." />
                        </el-form-item>
                        <el-button type="primary" @click="submitComment">提交评论</el-button>
                    </el-form>
                </template>
                <!-- 如果未登录则提示登录 -->
                <template v-else>
                    <p class="login-prompt" @click="navigateToLogin">请先登录以发表评论。</p>
                </template>

                <el-divider></el-divider>

                <el-list v-if="comments.length">
                    <el-list-item v-for="(comment, index) in comments" :key="index">
                        <el-card :body-style="{ padding: '10px' }" class="comment-item">
                            <div class="comment-header">
                                <img :src="getAvatarUrl(comment.photo)" alt="User Avatar" class="comment-avatar" />
                                <strong class="comment-username">{{ comment.username }}</strong>
                            </div>
                            <div class="comment-content">
                                <p class="comment-text">{{ comment.content }}</p>
                                <div class="comment-footer">
                                    <span class="comment-time">
                                        发布时间： {{ comment.createTime }}
                                    </span>
                                    <!-- 只有评论的作者才能看到删除按钮 -->
                                    <el-button v-if="userId === comment.userId" type="danger" size="small" circle
                                        @click="handleDeleteComment(comment.id)">
                                        <el-icon>
                                            <Delete />
                                        </el-icon>
                                    </el-button>
                                </div>
                            </div>
                        </el-card>
                    </el-list-item>
                </el-list>
                <p v-else style="color: black;">暂无评论，快来评论吧！</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getCommentListById } from '@/api/comment';
import { getArticleDetail } from '@/api/article';
import { ElMessage } from 'element-plus';
import Header from '@/components/Header.vue';
import { addComment, deleteComment } from '../api/comment';
import { Delete } from '@element-plus/icons-vue';
import DOMPurify from 'dompurify';

const defaultAvatar = '/src/assets/default.jpg';
const route = useRoute();
const router = useRouter();
const article = ref(null);
const comments = ref([]);
const commentForm = ref({
    content: '',
});

const userInfo = JSON.parse(localStorage.getItem('userInfo'));

// 检查 localStorage 中是否有 token
const isLoggedIn = computed(() => {
    return !!localStorage.getItem('token'); // 假设 token 存储在 localStorage 中
});

// 提取 userId
const userId = computed(() => {
    return userInfo ? userInfo.id : null;
});

// 获取头像 URL
const getAvatarUrl = (photo) => {
    if (photo && photo.startsWith('http')) {
        return photo;
    }
    return defaultAvatar; // 默认头像
};

// 获取文章详情
const fetchArticleDetailById = async (articleId) => {
    try {
        const response = await getArticleDetail(articleId);
        if (response.code === 200) {
            article.value = response.data;
            try {
                const parsedContent = JSON.parse(article.value.content); // 解析 JSON 内容
                article.value.content = parsedContent;
            } catch (e) {
                console.error('Failed to parse article content:', e);
                article.value.content = ''; // 或者设置默认值
            }
            fetchComments(articleId); // 获取评论
        } else {
            ElMessage.error(response.message || '获取文章详情失败');
        }
    } catch (error) {
        console.error('Failed to fetch article:', error);
    }
};

// 获取评论
const fetchComments = async (articleId) => {
    try {
        const response = await getCommentListById(articleId);
        if (response.code === 200) {
            comments.value = response.data;
        } else {
            ElMessage.error(response.message || '获取评论失败');
        }
    } catch (error) {
        console.error('Failed to fetch comments:', error);
    }
};

// 发表评论
const submitComment = async () => {
    if (!commentForm.value.content.trim()) {
        ElMessage.warning('请输入评论内容');
        return;
    }

    const articleId = route.params.id;

    const comment = {
        articleId: articleId,
        userId: userId.value,
        content: commentForm.value.content,
    };

    try {
        const response = await addComment(comment);
        if (response.code === 200) {
            ElMessage.success('评论成功');
            commentForm.value.content = ''; // 清空评论框
            fetchComments(articleId); // 刷新评论列表
        } else {
            ElMessage.error(response.message || '评论失败');
        }
    } catch (error) {
        console.error('Failed to post comment:', error);
    }
};

// 删除评论
const handleDeleteComment = async (commentId) => {
    try {
        const response = await deleteComment(commentId);
        if (response.code === 200) {
            ElMessage.success('删除成功');
            fetchComments(route.params.id); // 刷新评论列表
        } else {
            ElMessage.error(response.message || '删除失败');
        }
    } catch (error) {
        console.error('Failed to delete comment:', error);
    }
};

const navigateToLogin = () => {
    router.push('/login');
};

// 计算属性，净化 HTML 内容
const sanitizedContent = computed(() => {
    return DOMPurify.sanitize(article.value ? article.value.content : '');
});

onMounted(() => {
    const articleId = route.params.id;
    fetchArticleDetailById(articleId);
});
</script>

<style scoped>
.article-detail-container {
    padding: 30px;
    max-width: 900px;
    margin: 0 auto;
    background-color: white;
    margin-top: 100px;
}

.loading-message {
    text-align: center;
    padding: 50px;
}

.article-card {
    margin-bottom: 30px;
}

.article-title {
    font-size: 2.5rem;
    margin-bottom: 15px;
    color: #333;
}

.article-meta {
    display: flex;
    justify-content: space-between;
    font-size: 1rem;
    color: #666;
    margin-bottom: 20px;
}

.meta-item {
    display: inline-block;
}

.article-tags {
    font-size: 1rem;
    color: #333;
    margin-bottom: 10px;
    text-align: left;
}

.article-body {
    font-size: 1.1rem;
    line-height: 1.8;
    margin-bottom: 20px;
    white-space: pre-wrap;
    word-wrap: break-word;
}

.comments-section {
    margin-top: 40px;
}

.comment-item {
    margin-bottom: 15px;
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 10px;
}

.comment-header {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.comment-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
}

.comment-username {
    font-weight: bold;
}

.comment-content {
    display: flex;
    flex-direction: column;
}

.comment-text {
    margin-bottom: 10px;
}

.comment-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.comment-time {
    font-size: 0.8rem;
    color: #999;
}

.el-divider {
    margin: 20px 0;
}

.el-input {
    margin-bottom: 20px;
}

.login-prompt {
    color: black;
    cursor: pointer;
    text-decoration: underline;
}
</style>