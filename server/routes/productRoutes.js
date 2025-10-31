import express from 'express';
import {
  getFilteredProducts,
  getProductById,
  createProduct,
  updateProduct,
  getCategories,
  getPriceRange,
  addProductReview,
  updateProductReview,
  deleteProductReview,
  getCompareSpecs,
} from '../controllers/productController.js';

import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getFilteredProducts);
router.get('/categories', getCategories);
router.get('/price-range', getPriceRange);
router.get('/:id', getProductById);
router.get('/compare/specs', getCompareSpecs);

// Protected routes
router.post('/', protect, createProduct);
router.put('/:id', protect, updateProduct);
router.post('/:id/reviews', protect, addProductReview);
router.put('/:id/reviews/:reviewId', protect, updateProductReview);
router.delete('/:id/reviews/:reviewId', protect, deleteProductReview);

export default router;