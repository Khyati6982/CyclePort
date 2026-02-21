import express from 'express';
import {
  getFilteredProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getPriceRange,
  addProductReview,
  updateProductReview,
  deleteProductReview,
  getCompareSpecs
} from '../controllers/productController.js';

import protect from '../middleware/authMiddleware.js';
import adminOnly from '../middleware/adminMiddleware.js';

// Import Cloudinary storage middleware
import { uploadProduct } from './uploadRoutes.js'; // adjust path if needed

const router = express.Router();

// Public routes
router.get('/', getFilteredProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/price-range', getPriceRange);
router.get('/compare/specs', getCompareSpecs);
router.get('/:id/', getProductById);
router.get('/:id/:slug', getProductById);

// Protected routes (admin for product management)
// Attach Cloudinary middleware here
router.post('/', protect, adminOnly, uploadProduct.single('image'), createProduct);
router.put('/:id', protect, adminOnly, uploadProduct.single('image'), updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

// Reviews (authenticated users)
router.post('/:id/reviews', protect, addProductReview);
router.put('/:id/reviews/:reviewId', protect, updateProductReview);
router.delete('/:id/reviews/:reviewId', protect, deleteProductReview);

export default router;
