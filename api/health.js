// 使用CommonJS语法（Vercel Serverless Functions推荐）
module.exports = (req, res) => {
    // 设置响应头
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    
    // 处理预检请求
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // 只处理GET请求
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }
    
    // 返回健康状态
    res.status(200).json({
        success: true,
        status: 'healthy',
        service: '古法造纸非遗图像编辑API',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'production',
        endpoints: {
            health: '/api/health',
            styles: '/api/styles',
            imageEdit: '/api/image-edit'
        }
    });
};
