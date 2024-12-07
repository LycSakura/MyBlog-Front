<template>
    <div style="padding: 20px; background: #fff; color: #333;">
        <div class="header">
            <h2 style="margin: auto;">用户管理</h2>
        </div>

        <!-- 用户管理表格 -->
        <el-table :data="userList" style="width: 100%; margin-top: 20px;">
            <el-table-column label="头像" width="100">
                <template #default="scope">
                    <el-avatar :src="getAvatarUrl(scope.row.photo)" shape="square"></el-avatar>
                </template>
            </el-table-column>
            <el-table-column label="用户名" prop="username"></el-table-column>
            <el-table-column label="邮箱" prop="email"></el-table-column>
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

        <!-- 编辑用户对话框 -->
        <el-dialog title="编辑用户" v-model="editDialogVisible" width="30%">
            <el-form :model="editingUser" label-width="80px">
                <el-form-item label="用户名">
                    <el-input v-model="editingUser.username" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="editingUser.email"></el-input>
                </el-form-item>
                <el-form-item label="头像">
                    <AvatarUpload v-model="editingUser.photo" /> <!-- 使用封装的头像上传组件 -->
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="submitEditForm">确 定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { fetchUserList, updateUser, deleteUser, fetchUserInfo } from '@/api/user';
import AvatarUpload from '@/components/AvatarUpload.vue';  // 引入封装的上传组件
import { ElMessage, ElMessageBox } from 'element-plus';
import { useUserStore } from '@/stores/user';


const userStore = useUserStore();
const userList = ref([]);
const defaultAvatar = '/src/assets/default.jpg';
// 分页相关参数
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 获取用户列表
const getUserList = async () => {
    const res = await fetchUserList(currentPage.value, pageSize.value);
    userList.value = res.data.records.map(user => ({
        ...user,
        createdAt: new Date(user.createTime).toLocaleString(),
    }));
    total.value = res.data.total;
};

// 获取头像 URL
const getAvatarUrl = (photo) => {
    if (photo && photo.startsWith('http')) {
        return photo;
    }
    return defaultAvatar; // 默认头像
};

// 编辑用户对话框显示状态
const editDialogVisible = ref(false);
const editingUser = ref({});

// 编辑按钮点击事件
const handleEdit = (index, row) => {
    editingUser.value = { ...row };
    editDialogVisible.value = true;
};

// 提交编辑表单
const submitEditForm = async () => {
    try {
        const res = await updateUser(editingUser.value);
        if (res.code === 200) {
            getUserInfo(); // 获取用户信息,更新userInfo
            getUserList(); // 重新加载用户列表
            ElMessage.success('用户信息修改成功');
            editDialogVisible.value = false;
        } else {
            ElMessage.error(res.message);
        }
    } catch (error) {
        console.error('编辑用户时发生错误:', error);
    }
};

// 删除按钮点击事件
const handleDelete = async (index, row) => {
    try {
        if (row.roleId === 1) {
            ElMessage.error('超级管理员不允许删除');
            return;
        }
        // 显示确认对话框
        ElMessageBox.confirm(
            '此操作将永久删除该用户, 是否继续?',
            '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }
        ).then(async () => {
            const res = await deleteUser(row.id);
            if (res.code === 200) {
                getUserList();
                ElMessage.success('用户删除成功');
            } else {
                ElMessage.error(`删除用户失败: ${res.message}`);
            }
        }).catch(() => {
            ElMessage.info('已取消删除');
        });
    } catch (error) {
        console.error('删除用户时发生错误:', error);
    }
};

// 每页大小更改事件
const handleSizeChange = (newPageSize) => {
    pageSize.value = newPageSize;
    getUserList();
};

// 当前页码更改事件
const handleCurrentChange = (newPage) => {
    currentPage.value = newPage;
    getUserList();
};
// 获取用户信息
const getUserInfo = async () => {
    try {
        const response = await fetchUserInfo();
        if (response.code === 200) {
            const userInfo = response.data;
            userStore.setUserInfo(userInfo); // 存储用户信息
        } else {
            ElMessage.error(response.message || '获取用户信息失败，请重试。');
        }
    } catch (error) {
        console.error('获取用户信息失败:', error);
        if (error.response) {
            ElMessage.error(error.response.data.message || '获取用户信息失败，请重试。');
        } else {
            ElMessage.error('网络错误，请检查您的网络连接。');
        }
    }
};

onMounted(() => {
    getUserList();
});
</script>

<style scoped>
/* 样式部分 */
</style>