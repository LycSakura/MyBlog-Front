import request from '../utils/axios'
/**
 * 获取分类列表
 * 
 * 该函数通过发送GET请求到'/categories'端点，获取分类列表数据
 * 主要用于从后端获取分类数据，用于展示分类列表等
 * 
 * @param {Object} params - 请求参数对象，包含获取分类列表所需的参数
 * @returns {Promise} 返回一个Promise对象，包含请求的结果
 */
export const getCategoryList = async (params = {}) => {
    try {
        const response = await request.get('/category', { params });
        console.log('GetCategoryList Response:', response);
        return response;
    } catch (error) {
        console.error('GetCategoryList Error:', error);
        throw new Error(`请求失败: ${error.message} - URL: /category - Params: ${JSON.stringify(params)}`);
    }
}