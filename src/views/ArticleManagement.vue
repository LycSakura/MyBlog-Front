<template>
    <div style="padding: 20px; background: #fff; color: #333;">
        <div class="header">
            <!-- 新增按钮 -->
            <el-button type="primary" @click="handleAdd">新增文章</el-button>

            <h2 style="margin: auto;">文章管理</h2>
        </div>

        <!-- 文章管理表格 -->
        <el-table :data="articles" style="width: 100%; margin-top: 20px;">
            <el-table-column label="标题" prop="title"></el-table-column>
            <el-table-column label="内容" prop="content">
                <template #default="scope">
                    <div class="content-cell" v-html="scope.row.content"></div>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createdAt"></el-table-column>
            <el-table-column label="操作" width="150">
                <template #default="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页组件 -->
        <el-pagination :current-page="currentPage" :page-size="pageSize" :total="total"
            layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10, 20, 30, 40]"
            @size-change="handleSizeChange" @current-change="handleCurrentChange"
            style="margin-top: 20px; text-align: center;" />

        <!-- 新增/编辑文章的模态框 -->
        <el-dialog v-model="showAddDialog" :title="isEditing ? '编辑文章' : '新增文章'" width="30%" @closed="resetForm">
            <el-form :model="currentArticle" label-width="80px">
                <el-form-item label="标题">
                    <el-input v-model="currentArticle.title" placeholder="请输入标题" class="form-input"></el-input>
                </el-form-item>
                <el-form-item label="分类名称">
                    <el-input v-model="currentArticle.categoryNames" placeholder="请输入分类名称，多个分类用逗号分隔" class="form-input"
                        :disabled="isEditing"></el-input>
                </el-form-item>
                <el-form-item label="标签名称">
                    <el-input v-model="currentArticle.tagNames" placeholder="请输入标签名称，多个标签用逗号分隔" class="form-input"
                        :disabled="isEditing"></el-input>
                </el-form-item>
                <el-form-item label="内容">
                    <div class="quill-container">
                        <quill-editor :content="currentArticle.content" contentType="html" class="quill-editor"
                            ref="quillEditorRef" />
                    </div>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="showAddDialog = false">取消</el-button>
                    <el-button type="primary" @click="isEditing ? saveEdit() : addArticles()">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import { getArticleListByUserId, addArticle, deleteArticle, updateArticle, getArticleDetail } from '@/api/article';
import { ElMessage, ElMessageBox, ElPagination } from 'element-plus';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

// 从 localStorage 获取用户信息
const getUserInfoFromLocalStorage = () => {
    const userInfoStr = localStorage.getItem('userInfo');
    return userInfoStr ? JSON.parse(userInfoStr) : null;
};
// 获取用户ID
const userInfo = getUserInfoFromLocalStorage();
const userId = computed(() => {
    return userInfo ? userInfo.id : 0;
});

// 文章列表数据
const articles = ref([]);
// 分页相关参数
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);
// 绑定到富文本编辑器
const quillEditorRef = ref(null);
// 每页大小更改事件
const handleSizeChange = (newPageSize) => {
    pageSize.value = newPageSize;
    getArticleList();
};
// 当前页码更改事件
const handleCurrentChange = (newPage) => {
    currentPage.value = newPage;
    getArticleList();
};
// 获取文章列表
const getArticleList = async () => {
    const res = await getArticleListByUserId(userId.value, currentPage.value, pageSize.value);
    articles.value = res.data.records.map(article => ({
        ...article,
        createdAt: new Date(article.createTime).toLocaleString(),
        content: parseContent(article.content) // 解析 content 字段
    }));
    total.value = res.data.total;
};

// 解析 content 字段
const parseContent = (content) => {
    try {
        return JSON.parse(content);
    } catch (error) {
        console.error('解析 content 失败:', error);
        return content; // 如果解析失败，返回原始内容
    }
};

// 编辑按钮点击事件
const currentArticle = ref({
    id: null,
    title: '',
    content: '',
    categoryNames: '',
    tagNames: ''
});
const isEditing = ref(false);
const showAddDialog = ref(false);
// 编辑按钮点击事件
const handleEdit = async (index, row) => {
    try {
        const response = await getArticleDetail(row.id);
        if (response.code === 200) {
            currentArticle.value = {
                ...response.data,
                categoryNames: response.data.categoryNames.join(','),
                tagNames: response.data.tagNames.join(',')
            };
            isEditing.value = true;
            showAddDialog.value = true;
            nextTick(() => {
                if (quillEditorRef.value) {
                    quillEditorRef.value.setContents(parseContent(currentArticle.value.content)); // 解析 content 字段
                }
            });
        } else {
            ElMessage.error(response.message || '获取文章详情失败');
        }
    } catch (error) {
        ElMessage.error('获取文章详情失败');
        console.error(error);
    }
};
// 新增按钮点击事件
const handleAdd = () => {
    currentArticle.value = {
        id: null,
        title: '',
        content: '',
        categoryNames: '',
        tagNames: ''
    };
    isEditing.value = false;
    showAddDialog.value = true;
    nextTick(() => {
        if (quillEditorRef.value) {
            quillEditorRef.value.setContents([{ insert: '' }]);
        }
    });
};

// 保存编辑的文章
const saveEdit = async () => {
    try {
        if (quillEditorRef.value) {
            currentArticle.value.content = JSON.stringify(quillEditorRef.value.getContents());
        }
        const response = await updateArticle(currentArticle.value);
        if (response.code === 200) {
            ElMessage.success('文章修改成功');
            getArticleList();
            showAddDialog.value = false;
            resetForm();
        } else {
            ElMessage.error(response.message || '文章编辑失败');
        }
    } catch (error) {
        ElMessage.error('文章编辑失败');
        console.error(error);
    }
};

// 删除按钮点击事件
const handleDelete = async (index, row) => {
    ElMessageBox.confirm(
        '此操作将永久删除该文章, 是否继续?',
        '提示',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }
    ).then(async () => {
        try {
            // 调用 API 删除文章
            const response = await deleteArticle(row.id); // 假设 deleteArticle 是删除文章的 API 方法
            if (response.code === 200) {
                ElMessage.success('文章删除成功');
                // 从 articles 数组中移除对应的文章
                articles.value.splice(index, 1);
            } else {
                ElMessage.error(response.message || '文章删除失败');
            }
        } catch (error) {
            ElMessage.error('文章删除失败');
            console.error(error);
        }
    }).catch(() => {
        ElMessage.info('已取消删除');
    });
};

// 新增文章
const addArticles = async () => {
    try {
        if (quillEditorRef.value) {
            currentArticle.value.content = quillEditorRef.value.getContents(); // 直接获取 JSON 对象
        }
        const article = {
            userId: userId.value,
            title: currentArticle.value.title,
            content: JSON.stringify(currentArticle.value.content), // 在发送请求前字符串化
            categoryNames: currentArticle.value.categoryNames.split(',').map(name => name.trim()),
            tagNames: currentArticle.value.tagNames.split(',').map(name => name.trim())
        };
        const response = await addArticle(article);
        if (response.code === 200) {
            ElMessage.success('文章新增成功');
            articles.value = [];
            getArticleList();
        } else {
            ElMessage.error(response.message || '文章新增失败');
        }
        showAddDialog.value = false;
        resetForm();
    } catch (error) {
        ElMessage.error('文章新增失败');
        console.error(error);
    }
};

// 重置表单
const resetForm = () => {
    currentArticle.value = {
        id: null,
        title: '',
        content: '', // 清空内容，自动同步到 Quill 编辑器
        categoryNames: '',
        tagNames: ''
    };

    nextTick(() => {
        if (quillEditorRef.value) {
            quillEditorRef.value.setContents([{ insert: '' }]);
        } else {
            console.warn('Quill editor instance is not ready.');
        }
    });
};

// 页面加载时获取文章列表
onMounted(() => {
    getArticleList();
});
</script>
<style scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

/* 样式设置，根据需要调整 */
.content-cell {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
    /* 根据需要调整宽度 */
}

.el-form-item {
    margin-bottom: 20px;
    /* 统一外边距 */
}

.form-input {
    width: 100%;
    /* 确保输入框宽度一致 */
}

.quill-container {
    width: 100%;
    /* 确保富文本编辑器容器宽度一致 */
}

.quill-editor {
    min-height: 200px;
    padding: 10px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    width: 100%;
    /* 确保富文本编辑器宽度一致 */
}
</style>