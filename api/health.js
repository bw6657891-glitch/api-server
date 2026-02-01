module.exports = async (req, res) => {
  // 设置响应头
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // 处理OPTIONS预检请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // 只响应GET请求
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  
  // 返回健康状态信息
  res.status(200).json({
    status: 'healthy',
    service: '古法造纸非遗图像编辑API',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'production',
    endpoints: [
      { path: '/api/health', method: 'GET', description: '健康检查' },
      { path: '/api/styles', method: 'GET', description: '获取可用风格' },
      { path: '/api/image-edit', method: 'POST', description: '图像风格转换' }
    ]
  });
};
