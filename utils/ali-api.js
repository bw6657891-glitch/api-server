/**
 * utils/ali-api.js - 阿里云API工具函数
 * 处理阿里云DashScope图像生成API调用
 */

const axios = require("axios");

// 从环境变量获取API密钥（Vercel环境变量）
const API_KEY = process.env.ALIYUN_API_KEY || "sk-d924a601f99a41c5982cf444df447664";
const BASE_URL = "https://dashscope.aliyuncs.com/api/v1";

// 风格配置 - 古法造纸非遗艺术风格
const STYLE_CONFIGS = {
    "徽州生宣": {
        model: "qwen-image-edit-max",
        positive_prompt: "将图片转换为中国传统水墨画风格，使用徽州生宣纸质感。墨色自然晕染，宣纸纹理清晰可见。保持原图的主体、构图和内容完全不变，只改变绘画风格和纸张纹理。体现中国传统水墨画的意境和韵味。",
        negative_prompt: "低质量，模糊，变形，不自然，现代风格，西方绘画，油画，水彩画，彩色照片，3D渲染，卡通，动漫，数字艺术"
    },
    "贵州皮纸": {
        model: "qwen-image-edit-max",
        positive_prompt: "将图片转换为中国传统水墨画风格，使用贵州皮纸质感。体现粗犷纤维纹理和枯笔飞白效果。保持原图的主体、构图和内容完全不变，只改变绘画风格和纸张纹理。呈现古朴自然的艺术效果。",
        negative_prompt: "低质量，模糊，变形，不自然，现代风格，西方绘画，油画，水彩画，彩色照片，3D渲染，光滑表面，塑料感"
    },
    "棠岙竹纸": {
        model: "qwen-image-edit-max",
        positive_prompt: "将图片转换为中国传统水墨画风格，使用棠岙竹纸质感。体现细腻竹纤维和温润米黄色纸面。保持原图的主体、构图和内容完全不变，只改变绘画风格和纸张纹理。展现竹纸的雅致美感。",
        negative_prompt: "低质量，模糊，变形，不自然，现代风格，西方绘画，油画，水彩画，彩色照片，3D渲染，粗糙纹理，生硬边缘"
    },
    "西北毛边": {
        model: "qwen-image-edit-max",
        positive_prompt: "将图片转换为中国传统水墨画风格，使用西北毛边纸质感。体现纸质松软和边缘自然毛糙感。保持原图的主体、构图和内容完全不变，只改变绘画风格和纸张纹理。表达质朴自然的艺术风格。",
        negative_prompt: "低质量，模糊，变形，不自然，现代风格，西方绘画，油画，水彩画，彩色照片，3D渲染，整齐边缘，精致"
    }
};

/**
 * 验证风格名称是否有效
 * @param {string} styleName - 风格名称
 * @returns {boolean} - 是否有效
 */
function isValidStyle(styleName) {
    return STYLE_CONFIGS.hasOwnProperty(styleName);
}

/**
 * 获取风格配置
 * @param {string} styleName - 风格名称
 * @returns {object} - 风格配置对象
 */
function getStyleConfig(styleName) {
    if (!isValidStyle(styleName)) {
        throw new Error(`无效的风格名称: ${styleName}`);
    }
    return STYLE_CONFIGS[styleName];
}

/**
 * 处理base64图片数据
 * @param {string} imageBase64 - base64图片数据
 * @returns {string} - 处理后的base64数据
 */
function processImageBase64(imageBase64) {
    if (!imageBase64) {
        throw new Error("图片数据为空");
    }
    
    // 如果base64数据已经包含data:image/前缀，直接返回
    if (imageBase64.startsWith("data:image/")) {
        return imageBase64;
    }
    
    // 否则添加默认的jpeg前缀
    return `data:image/jpeg;base64,${imageBase64}`;
}

/**
 * 调用阿里云图像编辑API
 * @param {string} styleName - 风格名称
 * @param {string} imageBase64 - base64图片数据
 * @returns {Promise<object>} - API响应结果
 */
async function callAliyunImageEditAPI(styleName, imageBase64) {
    try {
        const styleConfig = getStyleConfig(styleName);
        const processedImageData = processImageBase64(imageBase64);
        
        console.log(`调用阿里云API - 风格: ${styleName}, 模型: ${styleConfig.model}`);
        
        // 构建请求体
        const requestBody = {
            model: styleConfig.model,
            input: {
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                image: processedImageData
                            },
                            {
                                text: styleConfig.positive_prompt
                            }
                        ]
                    }
                ]
            },
            parameters: {
                n: 1,
                negative_prompt: styleConfig.negative_prompt,
                size: "1024*1024",
                prompt_extend: true,
                watermark: false,
                seed: Math.floor(Math.random() * 1000000) // 随机种子，增加多样性
            }
        };
        
        // 调用阿里云API
        const response = await axios.post(
            `${BASE_URL}/services/aigc/multimodal-generation/generation`,
            requestBody,
            {
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                    "X-DashScope-Async": "enable" // 启用异步处理（如果需要）
                },
                timeout: 60000, // 60秒超时
                maxBodyLength: 50 * 1024 * 1024, // 支持最大50MB的图片
                maxContentLength: 50 * 1024 * 1024
            }
        );
        
        // 检查响应状态
        if (response.status !== 200) {
            throw new Error(`阿里云API请求失败: ${response.status} ${response.statusText}`);
        }
        
        // 解析响应数据
        const data = response.data;
        
        // 检查API调用是否成功
        if (data.code && data.code !== 200) {
            throw new Error(`阿里云API错误: ${data.message || '未知错误'}`);
        }
        
        // 提取生成的图片URL
        const content = data?.output?.choices?.[0]?.message?.content;
        let imageUrl = null;
        
        if (Array.isArray(content)) {
            for (const item of content) {
                if (item.image) {
                    imageUrl = typeof item.image === 'string' ? item.image : item.image.url;
                    break;
                }
            }
        }
        
        if (!imageUrl) {
            throw new Error('未找到生成的图片URL');
        }
        
        console.log(`阿里云API调用成功 - 请求ID: ${data.request_id}, 图片URL: ${imageUrl.substring(0, 50)}...`);
        
        return {
            success: true,
            imageUrl: imageUrl,
            model: styleConfig.model,
            request_id: data.request_id,
            usage: data.usage
        };
        
    } catch (error) {
        console.error("阿里云API调用失败:", error.message);
        
        // 处理不同类型的错误
        let errorMessage = "图像处理失败";
        let errorCode = "UNKNOWN_ERROR";
        let errorDetails = {};
        
        if (error.response) {
            // API返回了错误响应
            const apiError = error.response.data;
            errorMessage = apiError.message || errorMessage;
            errorCode = apiError.code || errorCode;
            errorDetails = apiError;
            
            console.error("API错误详情:", JSON.stringify(apiError, null, 2));
            
            // 特定错误处理
            if (apiError.code === 'InvalidApiKey') {
                errorMessage = "API密钥无效或已过期";
            } else if (apiError.code === 'QuotaExhausted') {
                errorMessage = "API调用额度已用完";
            } else if (apiError.code === 'ModelNotFound') {
                errorMessage = "指定的模型不存在";
            } else if (apiError.code === 'ImageSizeExceeded') {
                errorMessage = "图片尺寸过大，请缩小图片后重试";
            }
        } else if (error.request) {
            // 请求已发送但没有收到响应
            errorMessage = "无法连接到阿里云API服务，请检查网络连接";
            errorCode = "NETWORK_ERROR";
        } else if (error.message.includes('timeout')) {
            // 请求超时
            errorMessage = "请求超时，请稍后重试";
            errorCode = "TIMEOUT_ERROR";
        }
        
        throw {
            success: false,
            error: errorMessage,
            code: errorCode,
            details: errorDetails,
            originalError: error.message
        };
    }
}

/**
 * 获取可用的风格列表
 * @returns {Array} - 风格列表
 */
function getAvailableStyles() {
    return Object.keys(STYLE_CONFIGS).map(styleName => ({
        name: styleName,
        model: STYLE_CONFIGS[styleName].model,
        description: STYLE_CONFIGS[styleName].positive_prompt.substring(0, 100) + "..."
    }));
}

/**
 * 验证API密钥是否有效
 * @returns {Promise<boolean>} - 是否有效
 */
async function validateApiKey() {
    try {
        // 使用一个简单的API调用来验证密钥
        const response = await axios.get(
            `${BASE_URL}/services/aigc/text2image/models`,
            {
                headers: {
                    "Authorization": `Bearer ${API_KEY}`
                },
                timeout: 10000
            }
        );
        
        return response.status === 200;
    } catch (error) {
        console.error("API密钥验证失败:", error.message);
        return false;
    }
}

module.exports = {
    isValidStyle,
    getStyleConfig,
    processImageBase64,
    callAliyunImageEditAPI,
    getAvailableStyles,
    validateApiKey,
    STYLE_CONFIGS
};
