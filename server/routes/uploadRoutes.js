import express from 'express'
import multer from 'multer'
import path from 'path'
import protect from '../middleware/authMiddleware.js'

const router = express.Router()

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/')
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
    cb(new Error('Only image files are allowed'))
  }
}

const upload = multer({ storage, fileFilter })

router.post('/', /* protect, */ upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file uploaded.' })
  }
  res.status(200).json({ imagePath: `/uploads/${req.file.filename}` })
})

export default router