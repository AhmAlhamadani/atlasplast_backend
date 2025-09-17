import multer from 'multer';
import path from 'path';

// Define allowed destinations for security
const allowedDestinations = {
  'brand-logos': 'public/brands/brand-logos',
  'brand-images': 'public/brands/brand-images',
  'products': 'public/products',
  'users': 'public/users'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Get destination from query parameter or body
    const destination = req.query.destination || req.body.destination || 'brand-logos';
    
    // Validate destination for security
    if (!allowedDestinations[destination]) {
      return cb(new Error(`Invalid destination: ${destination}. Allowed: ${Object.keys(allowedDestinations).join(', ')}`));
    }
    
    cb(null, allowedDestinations[destination]);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + '-' + file.originalname.replace(/\s+/g, '-');
    cb(null, uniqueSuffix);
  }
});

// Create different upload configurations
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 10 // Max 10 files per request
  },
  fileFilter: (req, file, cb) => {
    // Allow only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

export default upload;