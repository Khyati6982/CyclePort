import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for product images
const productStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'cycleport/products', // Cloudinary folder
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});
const uploadProduct = multer({ storage: productStorage });

// Storage for profile avatars
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'cycleport/profile', // Cloudinary folder
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});
const uploadProfile = multer({ storage: profileStorage });

// Product image upload route
router.post('/product', protect, uploadProduct.single('image'), (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ message: 'No product image uploaded.' });
  }
  res.status(200).json({ imagePath: req.file.path }); // Cloudinary CDN URL
});

// Profile avatar upload route
router.post('/profile', protect, uploadProfile.single('image'), (req, res) => {
  if (!req.file || !req.file.path) {
    return res.status(400).json({ message: 'No profile image uploaded.' });
  }
  res.status(200).json({ imagePath: req.file.path }); // Cloudinary CDN URL
});

export default router;