import request from '@/utils/axios'
/**
 * 获取验证码
 * 
 * 该函数通过发送GET请求到'/captcha/generate'端点，获取验证码图片
 * 主要用于在注册或登录页面中获取验证码图片，以帮助用户进行身份验证
 * 
 * @param {string} key - 验证码的密钥，用于标识验证码
 * @returns {Promise} 返回一个Promise对象，包含请求的结果
 */

export const getCaptcha = async (key) => {
    try {
        const response = await request.get(`/captcha/generate?key=${key}`, {
            responseType: 'blob'
        });
        console.log('GetCaptcha Response:', response);

        if (response) { // 判断是否有 response.data，忽略 status 的检查
            return { data: response }; // 返回封装的对象
        } else {
            throw new Error('验证码获取失败，请重试');
        }
    } catch (error) {
        console.error('验证码获取失败:', error);
        throw error;
    }
};
/**
 * 验证验证码
 * 
 * 该函数通过发送POST请求到'/captcha/verify'端点，验证用户输入的验证码是否正确
 * 主要用于在注册或登录页面中验证用户输入的验证码，以帮助用户进行身份验证
 * 
 * @param {string} captchaKey - 验证码的密钥，用于标识验证码
 * @param {string} captcha - 用户输入的验证码
 * @returns {Promise} 返回一个Promise对象，包含请求的结果
 */
export const verifyCaptcha = async (captchaKey, captcha) => {
    try {
        const response = await request.post('/captcha/verify', {
            captchaKey: captchaKey,
            captcha: captcha
        });
        console.log('VerifyCaptcha Response:', response);
        return response;
    } catch (error) {
        console.error('验证失败:', error);
        if (error.response) {
            ElMessage.error(error.response.data.message || '验证失败，请重试。');
        }
    }
}