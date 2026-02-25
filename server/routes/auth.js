import express from 'express';
import { 
  registeredUser, 
  loginUser, 
  editProfile, 
  getProfile, 
  verifyEmail, 
  resetPassword 
} from '../controllers/authController.js';
import protect from '../middleware/authMiddleware.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage for profile avatars
const profileStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'cycleport/profile',
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

const upload = multer({ storage: profileStorage });

const router = express.Router();

// Auth routes
router.post('/register', registeredUser);
router.post('/login', loginUser);
router.get('/profile', protect, getProfile);

// Profile update with Cloudinary upload
router.put('/profile', protect, upload.single('avatar'), editProfile);

// Password recovery flow
router.post('/verify-email', verifyEmail);
router.post('/reset-password', resetPassword);

export default router;