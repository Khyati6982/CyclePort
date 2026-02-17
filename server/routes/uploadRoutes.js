import express from 'express'
import multer from 'multer'
import path from 'path'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

// Common file filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpg|jpeg|png|webp/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)

  if (extname && mimetype) {
    cb(null, true)
  } else {
    cb(new Error('Only .jpg, .jpeg, .png, .webp files are allowed'))
  }
}

// Multer storage for product images
const productStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/products')
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})
const uploadProduct = multer({ storage: productStorage, fileFilter })

// Multer storage for profile avatars
const profileStorage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/profile')
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})
const uploadProfile = multer({ storage: profileStorage, fileFilter })

// Product image upload
router.post('/product', protect, uploadProduct.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No product image uploaded.' })
  }
  const imagePath = `/uploads/products/${req.file.filename}`
  res.status(200).json({ imagePath })
})

// Profile avatar upload
router.post('/profile', protect, uploadProfile.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No profile image uploaded.' })
  }
  const imagePath = `/uploads/profile/${req.file.filename}`
  res.status(200).json({ imagePath })
})

export default router