import { Router } from 'express';
import { subscribe } from '../controllers/newsletterController';
import { validateRequest } from '../middleware/validation';
import { newsletterSubscriptionSchema } from '../utils/validators';

const router = Router();

// POST /api/newsletter
router.post('/', validateRequest(newsletterSubscriptionSchema), subscribe);

export default router;
