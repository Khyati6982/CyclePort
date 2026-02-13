import express from 'express'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

// Get logged-in user's profile
router.get('/profile', protect, (req, res) => {
  const { _id, name, email, isAdmin, profilePic } = req.user
  res.status(200).json({ 
    user: { _id, name, email, isAdmin, profilePic } 
  })
})

export default router