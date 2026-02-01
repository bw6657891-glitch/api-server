// api/image-edit.js
module.exports = async (req, res) => {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    
    // 处理预检请求
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // 处理GET请求 - 返回API信息
    if (req.method === 'GET') {
        return res.status(200).json({
            success: true,
            endpoint: "图像编辑API",
            method: "POST",
            description: "上传图片进行古法造纸风格转换",
            availableStyles: ["徽州生宣", "贵州皮纸", "棠岙竹纸", "西北毛边"]
        });
    }
    
    // 处理POST请求 - 简化版先测试
    if (req.method === 'POST') {
        try {
            console.log("收到图像编辑请求");
            
            // 模拟处理延迟
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            return res.status(200).json({
                success: true,
                message: "API测试成功",
                requestReceived: true,
                timestamp: new Date().toISOString(),
                note: "这是简化版测试，完整的图像处理功能需要配置阿里云API密钥"
            });
            
        } catch (error) {
            console.error("处理失败:", error);
            return res.status(500).json({
                success: false,
                error: error.message || "处理失败"
            });
        }
    }
    
    // 其他方法
    return res.status(405).json({ 
        success: false, 
        error: '只支持GET和POST请求' 
    });
};
