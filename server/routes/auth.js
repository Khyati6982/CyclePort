import express from 'express'
import { 
  registeredUser, 
  loginUser, 
  editProfile, 
  getProfile, 
  verifyEmail, 
  resetPassword 
} from '../controllers/authController.js'
import protect from '../middleware/authMiddleware.js'
import multer from 'multer'
import path from 'path'

// Multer storage config for profile pictures
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/profile') // store in uploads/profile folder
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)

  if (extname && mimetype) {
    cb(null, true)
  } else {
    cb(new Error("Only .jpeg, .jpg, .png files are allowed"))
  }
}

const upload = multer({ storage, fileFilter })

const router = express.Router()

// Auth routes
router.post('/register', registeredUser)
router.post('/login', loginUser)
router.get('/profile', protect, getProfile)

// Profile update with picture upload
router.put('/profile', protect, upload.single('image'), editProfile)

// Password recovery flow
router.post('/verify-email', verifyEmail)
router.post('/reset-password', resetPassword)

export default router