import { defineStore } from 'pinia';
import request from '@/utils/axios';

export const useUserStore = defineStore('user', {
    state: () => {
        const token = localStorage.getItem('token') || null;
        const userInfo = JSON.parse(localStorage.getItem('userInfo')) || null;
        console.log('Initializing user store with token:', token);
        console.log('Initializing user store with userInfo:', userInfo);
        return { token, userInfo };
    },
    actions: {
        setToken(token) {
            this.token = token;
            localStorage.setItem('token', token);
        },
        setUserInfo(userInfo) {
            this.userInfo = userInfo;
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
        },
        clear() {
            this.token = null;
            this.userInfo = null;
            localStorage.removeItem('token');
            localStorage.removeItem('userInfo');
        },
        async fetchUserInfo() {
            try {
                if (!this.token) return; // 如果没有 token，直接返回

                // 尝试从后端获取用户信息
                const response = await request.get("/user/userInfo")
                this.setUserInfo(response.data);
            } catch (error) {
                console.error('Failed to load user info:', error);
                // 如果获取用户信息失败，考虑清除 token 和 userInfo
                this.clear();
            }
        }
    },
    getters: {
        getToken: (state) => state.token,
        getUserInfo: (state) => state.userInfo,
    }
});