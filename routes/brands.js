import express from 'express';
import Brand from '../models/Brand.js';

const router = express.Router();

// GET all brands (with optional filtering)
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      isActive = true,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { isActive: isActive === 'true' };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
        { 'origin.en': { $regex: search, $options: 'i' } },
        { 'origin.ar': { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const brands = await Brand.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await Brand.countDocuments(query);

    res.json({
      success: true,
      data: brands,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total: total,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET single brand by slug or ID
router.get('/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    
    // Try to find by slug first, then by ID
    let brand = await Brand.findOne({ slug: identifier, isActive: true });
    
    if (!brand) {
      brand = await Brand.findById(identifier);
    }
    
    if (!brand) {
      return res.status(404).json({
        success: false,
        error: 'Brand not found'
      });
    }
    
    res.json({
      success: true,
      data: brand
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST create new brand
router.post('/', async (req, res) => {
  try {
    const brand = await Brand.create(req.body);
    
    res.status(201).json({
      success: true,
      data: brand
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      res.status(400).json({
        success: false,
        error: `${field} already exists`
      });
    } else if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    } else {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
});

// PUT update brand
router.put('/:id', async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!brand) {
      return res.status(404).json({
        success: false,
        error: 'Brand not found'
      });
    }
    
    res.json({
      success: true,
      data: brand
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      res.status(400).json({
        success: false,
        error: `${field} already exists`
      });
    } else if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    } else {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
});

// PATCH partial update brand
router.patch('/:id', async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!brand) {
      return res.status(404).json({
        success: false,
        error: 'Brand not found'
      });
    }
    
    res.json({
      success: true,
      data: brand
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      res.status(400).json({
        success: false,
        error: `${field} already exists`
      });
    } else if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    } else {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
});

// DELETE brand (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!brand) {
      return res.status(404).json({
        success: false,
        error: 'Brand not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Brand deleted successfully',
      data: brand
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// HARD DELETE brand (permanent deletion)
// router.delete('/:id/hard', async (req, res) => {
//   try {
//     const brand = await Brand.findByIdAndDelete(req.params.id);
    
//     if (!brand) {
//       return res.status(404).json({
//         success: false,
//         error: 'Brand not found'
//       });
//     }
    
//     res.json({
//       success: true,
//       message: 'Brand permanently deleted'
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// });

export default router;
