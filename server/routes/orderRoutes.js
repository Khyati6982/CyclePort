import express from 'express';
import {
  createOrder,
  getUserOrders,
  getAllOrders,
} from '../controllers/orderController.js';
import protect from '../middleware/authMiddleware.js';
import adminOnly from '../middleware/adminMiddleware.js';

const router = express.Router();

// Create order (Stripe/manual)
router.post('/', protect, createOrder);

// Get user orders
router.get('/orders/user', protect, getUserOrders);

// Get all orders (admin only)
router.get('/admin', protect, adminOnly, getAllOrders);

// Fallback: get all orders (for testing)
router.get('/', protect, getAllOrders);

export default router;