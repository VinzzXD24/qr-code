const express = require('express');
const FormData = require('form-data');
const multer = require('multer');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.static('public'));
app.set('view engine', 'ejs');

const upload = multer({ storage: multer.memoryStorage() });

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/process', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).send('No image uploaded');
    
    const resultBuffer = await remini(req.file.buffer, "enhance");
    res.set('Content-Type', 'image/jpeg');
    res.send(resultBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error processing image');
  }
});

// Fungsi remini dari kode asli
async function remini(urlPath, method) {
  // [Salin persis fungsi remini dari kode asli]
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
