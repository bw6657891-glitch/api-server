
/**
 * api/index.js - Vercel Serverless Function 入口
 * 这个文件会被 Vercel 自动部署为 /api/* 路由
 */

const app = require('../server');

// 导出为 Vercel Serverless Function
module.exports = (req, res) => {
    // 为 Vercel 环境设置响应头
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
    
    // 处理预检请求
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }
    
    // 转发请求给 Express 应用
    return app(req, res);
};