import express from 'express'
import protect from '../middleware/authMiddleware.js'
import adminOnly from '../middleware/adminMiddleware.js'
import { getAllUsers, toggleUserStatus } from '../controllers/authController.js'

const router = express.Router()

// Admin: Get all users
router.get('/users', protect, adminOnly, getAllUsers)

// Admin: Toggle user status (activate/deactivate)
router.put('/user/:id/status', protect, adminOnly, toggleUserStatus)

export default router