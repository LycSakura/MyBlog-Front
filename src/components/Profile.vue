<template>
    <div class="profile">
        <div class="header">
            <img :src="avatar" alt="Profile Image" class="profile-image">
            <div class="text">
                <h1 class="title">{{ title }}</h1>
                <p class="subtitle">爱意随风起，风止意难平</p>
            </div>
        </div>
        <div class="stats">
            <p>文章 {{ articleCount }}</p>
            <p>分类 {{ categoryCount }}</p>
            <p>标签 {{ tagCount }}</p>
        </div>
        <div class="buttons">
            <template v-if="!isLoggedIn">
                <button class="login-button" @click="goToLogin">登 录</button>
                <button class="register-button" @click="goToRegister">注 册</button>
            </template>
            <template v-else>
                <button class="edit-profile-button" @click="openEditProfileModal">修改个人信息</button>
                <button class="logout-button" @click="logout">注 销</button>
            </template>
        </div>

        <!-- 使用 Element Plus 的 ElDialog 组件 -->
        <el-dialog v-model="isEditProfileModalOpen" title="修改个人信息" width="30%">
            <el-form :model="profileForm" label-width="80px">
                <el-form-item label="用户名">
                    <el-input v-model="profileForm.username" :disabled="isEditProfileModalOpen"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="profileForm.email" type="email" required></el-input>
                </el-form-item>
                <el-form-item label="头像">
                    <AvatarUpload v-model="profileForm.photo" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="closeEditProfileModal">取 消</el-button>
                    <el-button type="primary" @click="saveProfileChanges">保 存</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { getArticleList } from '@/api/article';
import { getCategoryList } from '@/api/category';
import { getTags } from '@/api/tag';
import { updateUser, fetchUserInfo } from '@/api/user';
import { ElMessage,ElDialog } from 'element-plus';
import AvatarUpload from '@/components/AvatarUpload.vue';
import defaultAvatarPath from '@/assets/default.jpg';

const router = useRouter();
const userStore = useUserStore();

const title = computed(() => {
    const userInfo = userStore.getUserInfo;
    return userInfo ? userInfo.username : '个人博客';
});

const defaultAvatar = ref(defaultAvatarPath);
const avatar = computed(() => {
    const userInfo = userStore.getUserInfo;
    return userInfo && userInfo.photo && userInfo.photo !== 'default.jpg'
        ? userInfo.photo
        : defaultAvatar.value;
});
// 判断是否已登录
const isLoggedIn = computed(() => {
    return userStore.getUserInfo !== null;
});
// 登录
const goToLogin = () => {
    router.push('/login');
};
// 注册
const goToRegister = () => {
    router.push('/register');
};
// 退出登录
const logout = () => {
    userStore.clear();
    router.push('/');
};

const articleCount = ref(0);
const categoryCount = ref(0);
const tagCount = ref(0);
// 获取文章、分类和标签数量
const fetchStats = async () => {
    try {
        // 获取文章数量
        const articleResponse = await getArticleList();
        articleCount.value = articleResponse.data.total;

        // 获取分类数量
        const categoryResponse = await getCategoryList();
        categoryCount.value = categoryResponse.data.length;

        // 获取标签数量
        const tagResponse = await getTags();
        tagCount.value = tagResponse.data.length;
    } catch (error) {
        console.error('Fetch Stats Error:', error);
    }
};

// 模态框状态
const isEditProfileModalOpen = ref(false);
const profileForm = ref({
    id: '',
    username: '',
    email: '',
    photo: ''
});
// 打开编辑个人资料模态框，数据回显
const openEditProfileModal = () => {
    isEditProfileModalOpen.value = true;
    const userInfo = userStore.getUserInfo;
    profileForm.value = {
        id: userInfo.id,
        username: userInfo.username,
        email: userInfo.email,
        photo: userInfo.photo
    };
};
// 关闭编辑个人资料模态框
const closeEditProfileModal = () => {
    isEditProfileModalOpen.value = false;
};
// 保存更改
const saveProfileChanges = async () => {
    // 这里可以添加保存更改的逻辑
    const response = await updateUser(profileForm.value);
    if (response.code === 200) {
        ElMessage.success('用户信息修改成功');
        getUserInfo();// 获取用户信息,更新userInfo 
    } else {
        ElMessage.error(response.message);
    }
    closeEditProfileModal();
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
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
        userStore.setUserInfo(JSON.parse(storedUserInfo));
    }
    fetchStats();
});
</script>

<style scoped>
/* 添加渐变背景 */
.profile {
    margin-top: 100px;
    width: 200px;
    height: 300px;
    background: linear-gradient(135deg, #FF5733, #87edf0);
    padding: 20px;
    border-radius: 10px;
    color: white;
}

.header {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 10px;
}

.profile-image {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-bottom: 10px;
}

.text {
    text-align: center;
}

.title {
    margin: 0;
    font-size: 1.5em;
}

.subtitle {
    margin: 0;
    margin-top: 10px;
    font-size: 0.9em;
    color: #FFC300;
}

.stats {
    margin-bottom: 10px;
    margin: 5px;
    display: flex;
    justify-content: space-between;
    text-align: center;
}

.stats p {
    margin: 0;
    font-size: 0.9em;
    color: #FFC300;
}

.buttons {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 20px;
}

.edit-profile-button,
.logout-button {
    background-color: #4caf50;
    /* 绿色 */
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.edit-profile-button:hover,
.logout-button:hover {
    background-color: #388e3c;
    /* 更深的绿色 */
}

.login-button,
.register-button {
    background-color: #FF5733;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.login-button:hover,
.register-button:hover {
    background-color: #C70039;
}
</style>