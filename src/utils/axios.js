import axios from 'axios'
import router from '@/router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const API_BASE_URL = import.meta.env.VITE_API_URL; // 从环境变量中加载

const instance = axios.create({
    baseURL: `${API_BASE_URL}/api`, // 后端接口基础路径，统一添加 /api 前缀
    timeout: 10000, // 请求超时时间
    headers: {
        'Content-Type': 'application/json'
    }
});

// 请求拦截器
instance.interceptors.request.use(
    config => {
        // 在发送请求之前做些什么

        // 获取当前的路径
        const currentPath = window.location.pathname;
        // 在请求头中添加当前路径
        config.headers['X-Requested-Path'] = currentPath;
        console.log('当前路径：', currentPath);
        // 添加token
        const token = localStorage.getItem('token'); // 获取存储在 localStorage 中的token 
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        // 对请求错误做些什么
        return Promise.reject(error);
    }
);

// 响应拦截器
instance.interceptors.response.use(
    response => {
        // 对响应数据做些什么
        return response.data;
    },
    error => {
        // 对响应错误做些什么
        if (error.response) {
            // 请求已发出，但服务器响应的状态码不在 2xx 范围内
            console.error('Error:', error.response.data);
            console.error('Status:', error.response.status);
            console.error('Headers:', error.response.headers);

            // 检查是否是 401 Unauthorized
            if (error.response.status === 401) {
                ElMessage.error('请先登录');
                const userStore = useUserStore();
                // 清除token和userinfo
                userStore.clear();
                // 重定向到登录页面
                router.push('/login');
            }

        } else {
            // 发生了一些问题，导致请求未发送出
            // console.error('Error:', error.message);
            ElMessage.error('Error:', error.message);
        }
        return Promise.reject(error);
    }
);

export default instance;