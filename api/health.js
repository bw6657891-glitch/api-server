// api/health.js - 使用CommonJS语法
module.exports = (req, res) => {
  console.log('健康检查被调用');
  
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  res.status(200).json({
    status: 'healthy',
    service: '古法造纸非遗图像编辑API',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    endpoints: [
      '/api/health',
      '/api/styles', 
      '/api/image-edit'
    ]
  });
};
