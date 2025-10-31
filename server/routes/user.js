import express from 'express'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

// Get logged-in user's profile
router.get('/profile', protect, (req, res) => {
  res.status(200).json({ user: req.user })
})

export default router