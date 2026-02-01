module.exports = (req, res) => {
    res.json({ 
        message: "Test successful!",
        timestamp: new Date().toISOString()
    });
};
