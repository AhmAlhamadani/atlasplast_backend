import express from 'express';
import upload from '../middleware/multerConfig.js';

const router = express.Router();

// Single file upload
const uploadSingleImage = (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const destination = req.query.destination || req.body.destination || 'brand-logos';
  const url = `${req.protocol}://${req.get('host')}/${destination}/${req.file.filename}`;
  
  res.json({ 
    success: true,
    url,
    filename: req.file.filename,
    destination,
    size: req.file.size
  });
};

// Multiple files upload
const uploadMultipleImages = (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'No files uploaded' });
  }

  const destination = req.query.destination || req.body.destination || 'brand-logos';
  const files = req.files.map(file => ({
    filename: file.filename,
    url: `${req.protocol}://${req.get('host')}/${destination}/${file.filename}`,
    size: file.size,
    originalName: file.originalname
  }));

  res.json({ 
    success: true,
    files,
    destination,
    count: files.length
  });
};

// Routes
router.post('/upload', upload.single('image'), uploadSingleImage);
router.post('/upload-multiple', upload.array('images', 10), uploadMultipleImages);

export default router;