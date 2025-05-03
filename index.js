require('dotenv').config();
const express = require('express');
const FormData = require('form-data');
const multer = require('multer');
const cors = require('cors');
const app = express();

// Setup middleware
app.use(cors());
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Configure file upload
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 } // 4MB
});

// Routes
app.get('/', (req, res) => {
  res.render('index', { resultUrl: null });
});

app.post('/process', upload.single('image'), async (req, res) => {
  try {
    // Validasi file
    if (!req.file) {
      return res.render('index', { 
        resultUrl: null,
        error: 'Silakan upload gambar terlebih dahulu!'
      });
    }

    // Validasi tipe file
    if (!['image/jpeg', 'image/png'].includes(req.file.mimetype)) {
      return res.render('index', {
        resultUrl: null,
        error: 'Hanya menerima file JPG/PNG!'
      });
    }

    // Proses HDR
    const resultBuffer = await remini(req.file.buffer, "enhance");
    
    // Konversi ke base64 untuk ditampilkan
    const resultImage = `data:image/jpeg;base64,${resultBuffer.toString('base64')}`;
    
    res.render('index', {
      resultUrl: resultImage,
      error: null
    });

  } catch (error) {
    console.error('Error:', error);
    res.render('index', {
      resultUrl: null,
      error: `Gagal memproses gambar: ${error.message}`
    });
  }
});

// Remini Function (Modified for Web)
async function remini(imageBuffer, method = "enhance") {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("model_version", 1);
    form.append("image", imageBuffer, {
      filename: "image.jpg",
      contentType: "image/jpeg"
    });

    const headers = {
      ...form.getHeaders(),
      "User-Agent": "okhttp/4.9.3",
      "Accept-Encoding": "gzip"
    };

    form.submit({
      host: "inferenceengine.vyro.ai",
      path: `/${method}`,
      protocol: "https:",
      headers
    }, (err, res) => {
      if (err) return reject(err);
      
      const data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => resolve(Buffer.concat(data)));
      res.on('error', reject);
    });
  });
}

// Server Config
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
