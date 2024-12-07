import request from '@/utils/axios'
import axios from 'axios';
// 获取 OSS 上传签名
export const getOssPolicy = async () => {
    try {
        const response = await request.get('/oss/policy');  // 使用 axios 发起 GET 请求
        console.log('GetOssPolicy Response:', response);
        if (response && response.data) {  // 判断响应状态是否成功
            return response.data;  // 返回签名信息
        } else {
            throw new Error('获取上传签名失败');
        }
    } catch (error) {
        console.error('获取上传签名时发生错误:', error);
        throw error;
    }
};

// 上传头像到 OSS
export const uploadToOss = async (file, data) => {
    try {
        // 打印签名信息，查看是否正确
        console.log('上传签名数据:', {
            host: data.host,
            key: data.key,
            policy: data.policy,
            signature: data.signature,
            expire: data.expire,
        });
       
        // 创建 FormData 对象并添加文件
        const formData = new FormData();
        formData.append('key', data.key);  // 上传文件的目标路径，通常由签名返回
        formData.append('policy', data.policy);  // 签名策略
        formData.append('OSSAccessKeyId', data.OSSAccessKeyId);  // 访问密钥 ID
        formData.append('signature', data.signature);  // 签名
        formData.append('expire', data.expire);  // 签名过期时间
        formData.append('file', file);  // 要上传的文件

        // 使用 axios 发起 POST 请求
        const response = await axios.post(data.host, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'  // 设置请求头为表单上传
            }
        });
        console.log('Upload Response:', response);  // 打印上传响应

        // 如果没有返回内容，但上传成功，尝试使用 OSS 地址构建文件 URL
        if (response.status === 204 || response.status === 200) {
            const fileUrl = `${data.host}/${formData.get('key')}`;
            console.log('文件上传成功，文件 URL:', fileUrl);
            return {
                success: true,
                url: fileUrl
            };
        } else {
            return {
                success: false,
                message: '上传失败，没有返回内容'
            };
        }
    } catch (error) {
        console.error('上传文件时发生错误:', error);
        return {
            success: false,
            message: error.message
        };
    }
};
