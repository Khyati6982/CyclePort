import express from 'express'
import { registeredUser, loginUser, editProfile, getProfile, verifyEmail, resetPassword } from '../controllers/authController.js'
import protect from '../middleware/authMiddleware.js'
import multer from 'multer'

const router = express.Router()
const upload = multer()

router.post('/register', registeredUser)
router.post('/login', loginUser)
router.get('/profile', protect, getProfile)
router.put('/profile', protect, upload.none(), editProfile)

// Password recovery flow
router.post('/verify-email', verifyEmail)
router.post('/reset-password', resetPassword)

export default router