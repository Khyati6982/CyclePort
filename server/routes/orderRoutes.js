import express from 'express';
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  deleteOrder,
} from '../controllers/orderController.js';
import protect from '../middleware/authMiddleware.js';
import adminOnly from '../middleware/adminMiddleware.js';

const router = express.Router();

// Create order (Stripe/manual)
router.post('/', protect, createOrder);

// Get user orders
router.get('/user', protect, getUserOrders);

// Get all orders (admin only)
router.get('/admin', protect, adminOnly, getAllOrders);

// Delete order (admin only, restores stock)
router.delete('/:id', protect, adminOnly, deleteOrder);

export default router;