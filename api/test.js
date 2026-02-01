// api/test.js
module.exports = (req, res) => {
  res.json({ 
    message: '测试成功!',
    timestamp: new Date().toISOString(),
    path: req.url
  });
};
