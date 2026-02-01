// api/health.js
module.exports = async (req, res) => {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    
    // 处理预检请求
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // 只处理GET请求
    if (req.method !== 'GET') {
        return res.status(405).json({ 
            success: false, 
            error: '只支持GET请求' 
        });
    }
    
    // 返回健康状态
    return res.status(200).json({
        success: true,
        status: "running",
        service: "阿里云图像编辑API",
        environment: process.env.NODE_ENV || "production",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        endpoints: {
            health: "/api/health",
            styles: "/api/styles",
            imageEdit: "/api/image-edit"
        }
    });
};
