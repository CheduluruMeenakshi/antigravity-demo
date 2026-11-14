import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/auth.js';
import { createAdvisory, getAdvisories, getAdvisory } from '../controllers/advisories.controller.js';
import rateLimit from 'express-rate-limit';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) cb(null, true);
    else cb(new Error('Only JPEG, PNG, and WebP images are allowed'));
  },
});

const advisoryRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many advisory requests, please try again later' },
});

router.use(requireAuth);
router.post('/', advisoryRateLimit, upload.single('image'), createAdvisory);
router.get('/', getAdvisories);
router.get('/:id', getAdvisory);

export default router;
