import mongoose from 'mongoose';

// Define the origin schema for multilingual support
const originSchema = new mongoose.Schema({
  en: {
    type: String,
    required: [true, 'English origin is required'],
    trim: true
  },
  ar: {
    type: String,
    required: [true, 'Arabic origin is required'],
    trim: true
  }
});

// Define the description schema for multilingual support
const descriptionSchema = new mongoose.Schema({
  en: {
    type: String,
    required: [true, 'English description is required'],
    trim: true
  },
  ar: {
    type: String,
    required: [true, 'Arabic description is required'],
    trim: true
  }
});

// Define the products schema for multilingual arrays
const productsSchema = new mongoose.Schema({
  en: [{
    type: String,
    trim: true
  }],
  ar: [{
    type: String,
    trim: true
  }]
});

// Define the brand advantages schema for multilingual arrays
const brandAdvantagesSchema = new mongoose.Schema({
  en: [{
    type: String,
    trim: true
  }],
  ar: [{
    type: String,
    trim: true
  }]
});

// Main Brand schema
const brandSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: [true, 'Brand slug is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens']
  },
  name: {
    type: String,
    required: [true, 'Brand name is required'],
    trim: true,
    unique: true
  },
  logo: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
      },
      message: 'Logo must be a valid image URL'
    }
  },
  website: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Website must be a valid URL'
    }
  },
  established: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^\d{4}$/.test(v);
      },
      message: 'Established year must be a 4-digit year'
    }
  },
  origin: {
    type: originSchema,
    required: [true, 'Origin information is required']
  },
  description: {
    type: descriptionSchema,
    required: [true, 'Description is required']
  },
  products: {
    type: productsSchema,
    required: [true, 'Products information is required']
  },
  brandAdvantages: {
    type: brandAdvantagesSchema,
    required: [true, 'Brand advantages are required']
  },
  mainImage: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
      },
      message: 'Main image must be a valid image URL'
    }
  },
  galleryImages: [{
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
      },
      message: 'Gallery images must be valid image URLs'
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
brandSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create indexes for better performance
brandSchema.index({ slug: 1 });
brandSchema.index({ name: 1 });
brandSchema.index({ isActive: 1 });

// Create the model
const Brand = mongoose.model('Brand', brandSchema);

export default Brand;
