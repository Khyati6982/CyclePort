import express from 'express'
import multer from 'multer'
import path from 'path'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

// Multer storage config
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/products') // store in uploads/products folder
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  },
})

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

const upload = multer({ storage, fileFilter })

// Protected route for image upload
router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded.' })
  }

  // Build relative path instead of BASE_URL
  const imagePath = `/uploads/products/${req.file.filename}`

  res.status(200).json({ imagePath })
})

export default router