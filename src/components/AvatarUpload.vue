<template>
    <el-upload class="avatar-uploader" :data="uploadData" :show-file-list="false" 
        :auto-upload="false" 
        :before-upload="beforeAvatarUpload" :on-change="handleFileChange">
        <img v-if="avatarUrl" :src="avatarUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
</template>

<script setup>
import { ref, defineProps, defineEmits,watch } from 'vue';
import { getOssPolicy, uploadToOss } from '@/api/oss-upload'; // 引入封装的 OSS 上传服务

const props = defineProps({
    modelValue: { type: String, default: '' },  // 默认头像 URL
});

const emit = defineEmits(['update:modelValue']);

// 双向绑定头像 URL
const avatarUrl = ref(props.modelValue);

// 设置动态的上传地址和数据
const uploadData = ref({});  // 上传的参数数据

// 上传前校验
const beforeAvatarUpload = (file) => {
    const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png';
    const isLt2M = file.size / 1024 / 1024 < 2;

    if (!isJPGorPNG) {
        ElMessage.error('上传头像图片只能是 JPG 或 PNG 格式!');
    }
    if (!isLt2M) {
        ElMessage.error('上传头像图片大小不能超过 2MB!');
    }
    return isJPGorPNG && isLt2M;
};

// 获取 OSS 签名信息并上传文件
const fetchUploadPolicy = async (file) => {
    try {
        // 获取签名信息
        const response = await getOssPolicy();
        // 解析签名信息
        const { host, accessid, policy, signature, expire, dir } = response;
        // 设置上传的参数
        const key = `${dir}${new Date().getTime()}-${Math.round(Math.random() * 1000)}_${file.name}`;
        // 设置上传的参数数据
        uploadData.value = {
            key: key,
            host: host,
            OSSAccessKeyId: accessid,
            policy: policy,
            signature: signature,
            expire: expire
        };

        // 调用封装好的 uploadToOss 方法进行上传
        const res = await uploadToOss(file, uploadData.value); // 调用你封装好的上传函数
        if (res.success) {
            avatarUrl.value = res.url;  // 更新头像 URL
            emit('update:modelValue', res.url);  // 通过 v-model 更新父组件的头像 URL
        } else {
            console.error('上传失败:', res.message);
        }
    } catch (error) {
        console.error('获取上传签名时发生错误:', error);
    }
};

// 监听文件变化并上传
const handleFileChange = (file) => {
    // 当文件选择时，触发上传流程
    fetchUploadPolicy(file.raw);;  // 获取签名信息并上传文件
};

watch(() => props.modelValue, (newValue) => {
    avatarUrl.value = newValue;
});


</script>

<style scoped>
.avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
