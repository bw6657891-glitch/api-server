// api/health.js

module.exports = async (req, res) => {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    
    // 处理预检请求
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // 只允许GET请求
    if (req.method !== 'GET') {
        return res.status(405).json({ 
            success: false, 
            error: '只支持GET请求' 
        });
    }
    
    return res.status(200).json({
        status: "运行中",
        service: "阿里云图像编辑API",
        environment: process.env.NODE_ENV || "vercel",
        timestamp: new Date().toISOString(),
        endpoints: {
            health: "/api/health",
            imageEdit: "/api/image-edit"
        }
    });
};
