// 使用ES Module语法（Vercel推荐）
export default function handler(request, response) {
    console.log('Health check called');
    
    response.status(200).json({
        status: 'healthy',
        service: 'Paper Art API',
        timestamp: new Date().toISOString(),
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'production',
        region: process.env.VERCEL_REGION || 'unknown',
        url: process.env.VERCEL_URL || 'unknown'
    });
}
