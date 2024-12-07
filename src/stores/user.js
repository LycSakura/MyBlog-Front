import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        token: null,
        userInfo: null,
    }),
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
        }
    },
    getters: {
        getToken: (state) => state.token,
        getUserInfo: (state) => state.userInfo,
    }
});