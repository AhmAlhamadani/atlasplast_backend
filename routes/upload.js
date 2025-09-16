import express from 'express';
import upload from '../middleware/multerConfig.js';

const router = express.Router();

const uploadImage = (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const url = `${req.protocol}://${req.get('host')}/brand-logos/${req.file.filename}`;
  res.json({ url });
};

router.post('/upload', upload.single('image'), uploadImage);

export default router;