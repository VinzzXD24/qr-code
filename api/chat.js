const fetch = require('node-fetch');

module.exports = async (req, res) => {
    try {
        const { prompt } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const apiResponse = await fetch(`https://www.velyn.biz.id/api/ai/deepseek-r1?prompt=${encodeURIComponent(prompt)}`, {
            headers: {
                'Accept': '*/*',
                'User-Agent': 'KilatPedia-Chat/1.0'
            }
        });

        if (!apiResponse.ok) {
            throw new Error(`API Error: ${apiResponse.status}`);
        }

        const data = await apiResponse.json();
        
        res.status(200).json({
            response: data.data || data.message,
            status: data.status
        });
        
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ 
            error: error.message || 'Internal server error',
            recommendation: 'Silakan coba beberapa saat lagi'
        });
    }
};
