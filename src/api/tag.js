import request from '../utils/axios';

/**
 * 从后端获取标签数据
 * @param {Object} [params] - 请求参数
 * @returns {Promise} 包含标签数据的 Promise 对象
 */
export const getTags = async (params = {}) => {
    try {
        const response = await request.get('/tags', { params });
        console.log('GetTags Response:', response);
        return response;
    } catch (error) {
        console.error('GetTags Error:', error);
        throw new Error(`请求失败: ${error.message} - URL: /tags - Params: ${JSON.stringify(params)}`);
    }
};