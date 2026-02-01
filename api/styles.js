// api/styles.js
module.exports = async (req, res) => {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    
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
    
    // 返回风格列表
    const styles = [
        {
            name: "徽州生宣",
            description: "徽州传统生宣纸，墨色自然晕染，宣纸纹理清晰",
            model: "qwen-image-edit-max"
        },
        {
            name: "贵州皮纸",
            description: "贵州传统皮纸，粗犷纤维纹理和枯笔飞白效果",
            model: "qwen-image-edit-max"
        },
        {
            name: "棠岙竹纸",
            description: "棠岙竹纸，细腻竹纤维和温润米黄色纸面",
            model: "qwen-image-edit-max"
        },
        {
            name: "西北毛边",
            description: "西北毛边纸，纸质松软和边缘自然毛糙感",
            model: "qwen-image-edit-max"
        }
    ];
    
    return res.status(200).json({
        success: true,
        styles: styles,
        count: styles.length,
        timestamp: new Date().toISOString()
    });
};
