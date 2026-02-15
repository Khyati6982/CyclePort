import express from 'express';
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  deleteOrder,
  restockOrder,
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

// Future enhancement: Admin dashboard delete/restock
// Currently handled by schema middleware for Atlas deletions
router.delete('/:id', protect, adminOnly, deleteOrder);
router.put('/restock/:id', protect, adminOnly, restockOrder);

export default router;