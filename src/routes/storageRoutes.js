import { Router } from 'express';
import multer from 'multer';
import {
  deleteDesignImage,
  getAllDesignImages,
  getDesignImageSignedUrl,
  uploadDesignImage
} from '../controllers/storageController.js';
import { protect } from '../middleware/auth.js';
import config from '../config/env.js';

const router = Router();

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg'
]);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.maxFileSize
  },
  fileFilter: (req, file, cb) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      return cb(new Error('Only JPG, JPEG, PNG, and WEBP images are allowed'));
    }

    return cb(null, true);
  }
});

router.use(protect);

// POST /api/storage/upload - Upload design image for authenticated user
router.post('/upload', upload.single('file'), uploadDesignImage);

// GET /api/storage/images - List all uploaded design images for authenticated user
router.get('/images', getAllDesignImages);

// DELETE /api/storage/object - Delete user design image by key
router.delete('/object', deleteDesignImage);

// GET /api/storage/signed-url?key=... - Create one-hour signed view URL
router.get('/signed-url', getDesignImageSignedUrl);

export default router;
