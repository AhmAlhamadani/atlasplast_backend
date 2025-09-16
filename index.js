import express from 'express';
import uploadRoutes from './routes/upload.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static images
app.use('/brand-logos', express.static(path.join(__dirname, 'public/brands/brand-logos')));

// Routes
app.use('/api', uploadRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});