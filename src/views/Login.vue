<template>
    <el-container class="full-screen">
        <el-main>
            <el-card class="login-card">
                <h2>登录</h2>
                <el-form ref="loginForm" :model="form" :rules="rules" label-position="left" label-width="80px"
                    @submit.prevent="handleSubmit">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="form.username" placeholder="请输入用户名" required />
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="form.password" placeholder="请输入密码" required />
                    </el-form-item>
                    <el-form-item>
                        <el-row :gutter="20">
                            <el-col :span="12">
                                <el-button type="primary" native-type="submit" style="width: 100%;">登录</el-button>
                            </el-col>
                            <el-col :span="12">
                                <el-button type="primary" @click="handleRegister" style="width: 100%;">
                                    注册新账号
                                </el-button>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
            </el-card>
        </el-main>
    </el-container>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { loginUser, fetchUserInfo } from '@/api/user';
import { useUserStore } from '@/stores/user';


const form = reactive({
    username: '',
    password: '',
});

const rules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
    ]
});

const loginForm = ref(null);
const router = useRouter();
const userStore = useUserStore();

const handleSubmit = async () => {
    try {
        await loginForm.value.validate(async (valid) => {
            if (valid) {
                const response = await loginUser(form.username, form.password);
                if (response.code === 200) {
                    const token = response.data;
                    userStore.setToken(token)// 存储 token
                    await getUserInfo();
                    ElMessage.success('登录成功！');
                    router.push('/');
                } else {
                    ElMessage.error(response.message || '登录失败，请重试。');
                }
            } else {
                ElMessage.error('请检查输入的信息。');
            }
        });
    } catch (error) {
        console.error('登录失败:', error);
        if (error.response) {
            ElMessage.error(error.response.data.message || '登录失败，请重试。');
        } else {
            ElMessage.error('网络错误，请检查您的网络连接。');
        }
    }
};

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

// 处理注册按钮点击事件
const handleRegister = () => {
    router.push('/register'); // 假设注册页面的路由为 /register
};

</script>

<style scoped>
.full-screen {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-size: cover;
}

.login-card {
    width: 400px;
    padding: 30px;
    border-radius: 10px;
    margin: auto;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-color: rgba(255, 255, 255, 0.9);
}

.el-form-item {
    margin-bottom: 20px;
}

.el-form-item__label {
    text-align: left;
    font-weight: bold;
}

.captcha-image {
    margin-top: 10px;
    cursor: pointer;
}
</style>