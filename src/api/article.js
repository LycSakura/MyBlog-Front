import request from '../utils/axios';
/**
 * 获取文章列表
 * 
 * 该函数通过发送GET请求到'/articles'端点，根据提供的参数获取文章列表
 * 主要用于从后端获取文章数据，可以根据不同的参数获取不同的文章列表
 * 
 * @param {Object} params - 请求参数对象，包含获取文章列表所需的参数
 * @returns {Promise} 返回一个Promise对象，包含请求的结果
 */
export const getArticleList = async (params) => {
    try {
        const response = await request.get('/articles', { params });
        console.log('GetArticleList Response:', response);
        return response;
    } catch (error) {
        console.error('GetArticleList Error:', error);
        throw error;
    }
};

/**
 * 通过标签名获取文章列表
 * @param {string} tagName - 标签名称
 * @returns {Promise} 包含文章列表数据的 Promise 对象
 */
export const getArticlesByTagName = async (tagName) => {
    try {
        const response = await request.get(`/articles/tag/${tagName}`, tagName);
        console.log('GetArticlesByTag Response:', response);
        return response;
    } catch (error) {
        console.error('GetArticlesByTag Error:', error);
        throw error;
    }
};
/**
 * 通过分类名获取文章列表
 * @param {string} categoryName - 分类名
 * @returns {Promise} 包含文章列表数据的 Promise 对象
 */
export const getArticlesByCategoryName = async (categoryName) => {
    try {
        const response = await request.get(`/articles/category/${categoryName}`, categoryName);
        console.log('GetArticlesByCategory Response:', response);
        return response;
    } catch (error) {
        console.error('GetArticlesByCategory Error:', error);
        throw error;
    }
};
/**
 * 通过用户ID获取文章列表详情
 * @param {string} id - 用户ID
 * @returns {Promise} 包含文章详情数据的 Promise 对象
 */
export const getArticleListByUserId = async (id,currentPage,pageSize) => {
    try {
        const response = await request.get(`/articles/${id}`,{
            params:{
                currentPage,
                pageSize
            }
        });
        console.log('GetArticleByUserId Response:', response);
        return response;
    } catch (error) {
        console.error('GetArticleById Error:', error);
        throw error;
    }
};

/**
 * 获取文章详情
 * @param {string} id - 文章ID
 * @returns {Promise} 包含文章详情数据的 Promise 对象
 */
export const getArticleDetail = async (id) => {
    try {
        const response = await request.get(`/articles/detail/${id}`);
        console.log('GetArticleDetail Response:', response);
        return response;
    } catch (error) {
        console.error('GetArticleDetail Error:', error);
        throw error;
    }
};
/**
 * 添加文章
 * @param {Object} article - 文章对象
 * @returns {Promise} 包含添加文章结果数据的 Promise 对象
 */
export const addArticle = async (article) => {
    try {
        const response = await request.post('/articles/add', article);
        console.log('AddArticle Response:', response);
        return response;
    } catch (error) {
        console.error('AddArticle Error:', error);
        throw error;
    }
};

/**
 * 删除文章
 * @param {string} id - 文章ID
 * @returns {Promise} 包含删除文章结果数据的 Promise 对象
 */
export const deleteArticle = async (id) => {
    try {
        const response = await request.delete(`/articles/${id}`);
        console.log('DeleteArticle Response:', response);
        return response;
    } catch (error) {
        console.error('DeleteArticle Error:', error);
        throw error;
    }
};

/**
 * 更新文章
 * @param {Object} article - 文章对象
 * @returns {Promise} 包含更新文章结果数据的 Promise 对象
 */
export const updateArticle = async (article) => {
    try {
        const response = await request.put('/articles', article);
        console.log('UpdateArticle Response:', response);
        return response;
    } catch (error) {
        console.error('UpdateArticle Error:', error);
        throw error;
    }
};