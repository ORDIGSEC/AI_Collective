import { Router } from 'express';
import { getEventData } from '../controllers/eventsController';

const router = Router();

// GET /api/events/:googleEventId
router.get('/:googleEventId', getEventData);

export default router;
