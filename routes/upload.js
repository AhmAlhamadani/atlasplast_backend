import express from 'express';
import uploadController from '../controllers/uploadController.js';
import upload from '../middleware/multerConfig.js';

const router = express.Router();

router.post('/upload', upload.single('image'), uploadController.uploadImage);

export default router;