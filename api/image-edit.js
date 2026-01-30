/**
 * Vercel Serverless Function for AI Image Edit
 * 部署路径：/api/image-edit
 */

const axios = require('axios');

// 阿里云配置
const API_KEY = "sk-d924a601f99a41c5982cf444df447664";
const BASE_URL = "https://dashscope.aliyuncs.com/api/v1";

// 风格配置
const STYLE_CONFIGS = {
    "徽州生宣": {
        model: "qwen-image-edit-max",
        positive_prompt: "将图片转换为中国传统水墨画风格，使用徽州生宣纸质感。墨色自然晕染，宣纸纹理清晰可见。保持原图的主体、构图和内容完全不变，只改变绘画风格和纸张纹理。",
        negative_prompt: "低质量，模糊，变形，不自然，现代风格，西方绘画，油画，水彩画，彩色照片，3D渲染"
    },
    "贵州皮纸": {
        model: "qwen-image-edit-max",
        positive_prompt: "将图片转换为中国传统水墨画风格，使用贵州皮纸质感。体现粗犷纤维纹理和枯笔飞白效果。保持原图的主体、构图和内容完全不变，只改变绘画风格和纸张纹理。",
        negative_prompt: "低质量，模糊，变形，不自然，现代风格，西方绘画，油画，水彩画，彩色照片，3D渲染，光滑表面"
    },
    "棠岙竹纸": {
        model: "qwen-image-edit-max",
        positive_prompt: "将图片转换为中国传统水墨画风格，使用棠岙竹纸质感。体现细腻竹纤维和温润米黄色纸面。保持原图的主体、构图和内容完全不变，只改变绘画风格和纸张纹理。",
        negative_prompt: "低质量，模糊，变形，不自然，现代风格，西方绘画，油画，水彩画，彩色照片，3D渲染，粗糙纹理"
    },
    "西北毛边": {
        model: "qwen-image-edit-max",
        positive_prompt: "将图片转换为中国传统水墨画风格，使用西北毛边纸质感。体现纸质松软和边缘自然毛糙感。保持原图的主体、构图和内容完全不变，只改变绘画风格和纸张纹理。",
        negative_prompt: "低质量，模糊，变形，不自然，现代风格，西方绘画，油画，水彩画，彩色照片，3D渲染，整齐边缘"
    }
};

// 提取base64
function extractBase64(dataUrl) {
    if (!dataUrl) return null;
    if (dataUrl.startsWith("data:image/")) {
        return dataUrl;
    }
    return `data:image/jpeg;base64,${dataUrl}`;
}

// Vercel serverless函数入口
module.exports = async (req, res) => {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );
    
    // 处理预检请求
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // 只处理POST请求
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: '只支持POST请求'
        });
    }
    
    console.log('收到图像编辑请求');
    
    try {
        const { style_name, image_base64 } = req.body;
        
        // 验证参数
        if (!style_name || !STYLE_CONFIGS[style_name]) {
            return res.status(400).json({
                success: false,
                error: '无效的风格选择'
            });
        }
        
        if (!image_base64) {
            return res.status(400).json({
                success: false,
                error: '请上传图片'
            });
        }
        
        const styleConfig = STYLE_CONFIGS[style_name];
        const imageData = extractBase64(image_base64);
        
        console.log(`处理风格: ${style_name}, 模型: ${styleConfig.model}`);
        
        // 构建请求体
        const requestBody = {
            model: styleConfig.model,
            input: {
                messages: [
                    {
                        role: "user",
                        content: [
                            {
                                image: imageData
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
                watermark: false
            }
        };
        
        // 调用阿里云API
        const response = await axios.post(
            `${BASE_URL}/services/aigc/multimodal-generation/generation`,
            requestBody,
            {
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json"
                },
                timeout: 60000
            }
        );
        
        console.log('阿里云API响应状态:', response.status);
        
        // 解析返回的图片URL
        const content = response.data?.output?.choices?.[0]?.message?.content;
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
        
        console.log('生成成功，图片URL:', imageUrl);
        
        // 返回结果
        res.status(200).json({
            success: true,
            imageUrl: imageUrl,
            model: styleConfig.model,
            request_id: response.data.request_id
        });
        
    } catch (error) {
        console.error('处理失败:', error.message);
        
        // 返回错误信息
        let errorMsg = '图像处理失败';
        
        if (error.response?.data) {
            console.error('API错误详情:', error.response.data);
            errorMsg = error.response.data.message || errorMsg;
            
            if (error.response.data.code === 'InvalidApiKey') {
                errorMsg = 'API Key无效';
            }
        }
        
        res.status(500).json({
            success: false,
            error: errorMsg,
            details: error.response?.data || error.message
        });
    }
};
