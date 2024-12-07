<template>
    <el-container class="full-screen">
        <el-main>
            <el-card class="register-card">
                <h2>注册</h2>
                <el-form ref="registerForm" :model="form" :rules="rules" label-position="left" label-width="80px"
                    @submit.prevent="handleSubmit">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="form.username" placeholder="请输入用户名" />
                    </el-form-item>
                    <el-form-item label="密码" prop="password">
                        <el-input type="password" v-model="form.password" placeholder="请输入密码" />
                    </el-form-item>
                    <el-form-item label="邮箱" prop="email">
                        <el-input type="email" v-model="form.email" placeholder="请输入邮箱" />
                    </el-form-item>
                    <el-form-item label="验证码" prop="captcha">
                        <el-input v-model="form.captcha" placeholder="请输入验证码" style="width: 100%;">
                            <template #append>
                                <el-button @click="handleGetCaptcha" :disabled="isCaptchaDisabled">
                                    {{ captchaText }}
                                </el-button>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" native-type="submit" style="width: 100%;">注册</el-button>
                    </el-form-item>
                </el-form>
                <div v-if="captchaUrl" class="captcha-image">
                    <img :src="captchaUrl" alt="验证码" @click="getCaptcha" />
                </div>
            </el-card>
        </el-main>
    </el-container>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { v4 as uuidv4 } from 'uuid';
import { getCaptcha, verifyCaptcha } from '@/api/captcha';
import { registerUser } from '@/api/user';

const form = reactive({
    username: '',
    password: '',
    email: '',
    captcha: ''
});

const rules = reactive({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
    ],
    captcha: [
        { required: true, message: '请输入验证码', trigger: 'blur' },
        { min: 4, max: 4, message: '验证码为4位', trigger: 'blur' }
    ]
});

const countdown = ref(60);
const registerForm = ref(null);
const router = useRouter();
const isCaptchaDisabled = ref(false);
const captchaText = ref('获取验证码');
const captchaUrl = ref('');
const captchaKey = ref('');

onMounted(() => {
    generateCaptchaKey();
});

const generateCaptchaKey = () => {
    captchaKey.value = uuidv4();
};

const startCountdown = () => {
    const timer = setInterval(() => {
        if (countdown.value > 0) {
            countdown.value--;
            captchaText.value = `${countdown.value}s后重新获取`;
        } else {
            clearInterval(timer);
            isCaptchaDisabled.value = false;
            captchaText.value = '获取验证码';
        }
    }, 1000);
};

const handleGetCaptcha = async () => {
    try {
        isCaptchaDisabled.value = true;
        captchaText.value = '发送中...';

        const captchaData = await getCaptcha(captchaKey.value);

        captchaUrl.value = URL.createObjectURL(captchaData.data);
        countdown.value = 60;
        startCountdown();
    } catch (error) {
        console.error('验证码获取失败:', error);
        ElMessage.error('验证码获取失败，请重试');
        isCaptchaDisabled.value = false;
        captchaText.value = '获取验证码';
    }
};

const handleSubmit = async () => {
    try {
        await registerForm.value.validate(async (valid) => {
            if (valid) {
                let response = await verifyCaptcha(captchaKey.value, form.captcha);
                // 校验验证码
                if (!response) {
                    ElMessage.error('验证码错误');
                    return;
                }

                response = await registerUser(form, captchaKey.value);
                console.log(response.data);

                if (response.code === 200) {
                    ElMessage.success('注册成功！');
                    router.push('/login');
                } else {
                    if (response.data) {
                        Object.keys(response.data).forEach((field) => {
                            ElMessage.error(`${field}: ${response.data[field]}`);
                        });
                    } else {
                        ElMessage.error(response.message || '注册失败，请重试。');
                    }
                }
            } else {
                ElMessage.error('请检查输入的信息。');
            }
        });
    } catch (error) {
        console.error('注册失败:', error);
        if (error.response) {
            ElMessage.error(error.response.data.message || '注册失败，请重试。');
        } else {
            ElMessage.error('网络错误，请检查您的网络连接。');
        }
    }
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

.register-card {
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