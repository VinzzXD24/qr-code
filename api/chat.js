import fetch from 'node-fetch';

export default async (req, res) => {
    try {
        const { prompt } = req.body;
        
        // Validasi input
        if (!prompt || prompt.trim().length === 0) {
            return res.status(400).json({
                error: 'Prompt tidak boleh kosong',
                example: "Kirim request seperti: { prompt: 'Apa itu KilatPedia?' }"
            });
        }

        // Log request
        console.log('Mengirim request ke API dengan prompt:', prompt);
        
        const apiResponse = await fetch(`https://www.velyn.biz.id/api/ai/deepseek-r1?prompt=${encodeURIComponent(prompt)}`, {
            headers: {
                'Accept': '*/*',
                'User-Agent': 'KilatPedia-Chat/1.0 (+https://github.com/username/repo)',
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });

        // Handle timeout
        if (!apiResponse.ok) {
            const errorText = await apiResponse.text();
            console.error('Error response dari API:', errorText);
            return res.status(502).json({
                error: 'Bad Gateway',
                details: `API merespon dengan status ${apiResponse.status}`,
                response: errorText.slice(0, 200) // Ambil 200 karakter pertama
            });
        }

        const data = await apiResponse.json();
        
        // Validasi response format
        if (!data?.data) {
            console.error('Format response tidak valid:', data);
            return res.status(502).json({
                error: 'Format response tidak valid dari server',
                originalResponse: data
            });
        }

        // Success
        res.status(200).json({
            response: data.data,
            meta: {
                creator: data.creator || 'Unknown',
                timestamp: new Date().toISOString()
            }
        });
        
    } catch (error) {
        console.error('Error utama:', error);
        res.status(500).json({ 
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            solution: [
                'Coba lagi beberapa saat',
                'Pastikan koneksi internet stabil',
                'Hubungi admin jika error terus terjadi'
            ]
        });
    }
};
