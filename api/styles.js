module.exports = async (req, res) => {
  // 设置响应头
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  
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
  
  // 返回风格列表
  const styles = [
    {
      id: 'huizhou',
      name: '徽州生宣',
      description: '徽州传统生宣纸，墨色自然晕染，宣纸纹理清晰可见',
      parameters: {
        positive_prompt: '将图片转换为中国传统水墨画风格，使用徽州生宣纸质感。墨色自然晕染，宣纸纹理清晰可见。保持原图的主体、构图和内容完全不变，只改变绘画风格和纸张纹理。'
      }
    },
    {
      id: 'guizhou',
      name: '贵州皮纸',
      description: '贵州传统皮纸，粗犷纤维纹理和枯笔飞白效果',
      parameters: {
        positive_prompt: '将图片转换为中国传统水墨画风格，使用贵州皮纸质感。体现粗犷纤维纹理和枯笔飞白效果。保持原图的主体、构图和内容完全不变，只改变绘画风格和纸张纹理。'
      }
    },
    {
      id: 'tangao',
      name: '棠岙竹纸',
      description: '棠岙竹纸，细腻竹纤维和温润米黄色纸面',
      parameters: {
        positive_prompt: '将图片转换为中国传统水墨画风格，使用棠岙竹纸质感。体现细腻竹纤维和温润米黄色纸面。保持原图的主体、构图和内容完全不变，只改变绘画风格和纸张纹理。'
      }
    },
    {
      id: 'xibei',
      name: '西北毛边',
      description: '西北毛边纸，纸质松软和边缘自然毛糙感',
      parameters: {
        positive_prompt: '将图片转换为中国传统水墨画风格，使用西北毛边纸质感。体现纸质松软和边缘自然毛糙感。保持原图的主体、构图和内容完全不变，只改变绘画风格和纸张纹理。'
      }
    }
  ];
  
  res.status(200).json({
    success: true,
    count: styles.length,
    styles: styles,
    timestamp: new Date().toISOString()
  });
};
