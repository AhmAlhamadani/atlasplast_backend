import express from 'express';
import uploadRoutes from './routes/upload.js';
import brandRoutes from './routes/brands.js';
import connectDB from './config/database.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static images for different destinations
app.use('/brand-logos', express.static(path.join(__dirname, 'public/brands/brand-logos')));
app.use('/brand-images', express.static(path.join(__dirname, 'public/brands/brand-images')));


// Routes
app.use('/api', uploadRoutes);
app.use('/api/brands', brandRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});