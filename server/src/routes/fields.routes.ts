import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getFields, createField, deleteField } from '../controllers/fields.controller.js';

const router = Router();
router.use(requireAuth);
router.get('/', getFields);
router.post('/', createField);
router.delete('/:id', deleteField);

export default router;
