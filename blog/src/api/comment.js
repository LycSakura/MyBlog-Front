import request from '../utils/axios';
/**
 * 获取该文章的评论列表
 */
export const getCommentListById = async (articleId) => {
    try {
        const response = await request.get(`/comment?articleId=${articleId}`);
        console.log('GetCommentList Response:', response);
        return response;
    } catch (error) {
        console.error('GetCommentList Error:', error);
        throw error;
    }
};
/**
 * 添加评论
 */
export const addComment = async (comment) => {
    try {
        const response = await request.post('/comment', comment);
        console.log('AddComment Response:', response);
        return response;
    } catch (error) {
        console.error('AddComment Error:', error);
        throw error;
    }
};
// 删除评论
export const deleteComment = async (commentId) => {
    try {
        const response = await request.delete(`/comment/${commentId}`);
        console.log('DeleteComment Response:', response);
        return response;
    } catch (error) {
        console.error('DeleteComment Error:', error);
        throw error;
    }
};