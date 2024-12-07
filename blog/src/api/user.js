import request from '@/utils/axios';
/**
 * 登录
 * @param {string} username 用户名
 * @param {string} password 密码
 * @returns {Promise<Object>} 登录结果
 */
export const loginUser = async (username, password) => {
    try {
        const response = await request.post('/user/login', {
            username,
            password,
        });
        console.log('LoginUser ', response);
        return response;
    } catch (error) {
        console.error('登录失败:', error);
        if (error.response) {
            throw new Error(error.response.data.message || '登录失败，请重试。');
        } else {
            throw new Error('网络错误，请检查您的网络连接。');
        }
    }
};

/**
 * 注册
 * @param {Object} formData 表单数据
 * @param {string} formData.username 用户名
 * @param {string} formData.password 密码
 * @param {string} formData.email 邮箱
 * @returns {Promise<Object>} 注册结果
 */
export const registerUser = async (formData) => {
    try {
        const response = await request.post('/user/register', {
            username: formData.username,
            password: formData.password,
            email: formData.email,
        });
        console.log("RegisterUser ", response);
        return response;
    } catch (error) {
        console.error('注册失败:', error);
        if (error.response) {
            console.error(error.response.data.message || '注册失败，请重试。');
        } else {
            console.error('网络错误，请检查您的网络连接。');
        }
    }
};
/**
 * 获取用户信息
 * @returns {Promise<Object>} 用户信息
 */
export const fetchUserInfo = async () => {
    try {
        const response = await request.get('/user/userInfo');
        console.log('FetchUserInfo Response:', response);
        return response;
    } catch (error) {
        console.error('获取用户信息失败:', error);
        throw error;
    }
};
/**
 * 获取用户列表 
 * @returns {Promise<Object>} 用户列表
 */
export const fetchUserList = async (currentPage, pageSize) => {
    try {
        const response = await request.get('/user/userList', {
            currentPage,
            pageSize
        });
        console.log('FetchUserList Response:', response);
        return response;
    } catch (error) {
        console.error('获取用户列表失败:', error);
        throw error;
    }
};
/**
 * 更新用户信息
 * @param {Object} userInfo 用户信息
 * @returns {Promise<Object>} 更新结果
 */
export const updateUser = async (userInfo) => {
    try {
        const response = await request.put('/user', userInfo);
        console.log('UpdateUserInfo Response:', response);
        return response;
    } catch (error) {
        console.error('更新用户信息失败:', error);
        throw error;
    }
};
/**
 * 删除用户
 * @param {string} id 用户ID
 * @returns {Promise<Object>} 删除结果
 */
export const deleteUser = async (id) => {
    try {
        const response = await request.delete(`/user/${id}`);
        console.log('DeleteUser Response:', response);
        return response;
    } catch (error) {
        console.error('删除用户失败:', error);
        throw error;
    }
};