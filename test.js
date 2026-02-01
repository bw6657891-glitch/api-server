// 测试Vercel是否能识别这个文件
module.exports = (req, res) => {
    res.json({ 
        message: "直接测试成功",
        timestamp: new Date().toISOString(),
        url: req.url,
        method: req.method
    });
};
