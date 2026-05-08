import express from 'express';
import { getAllEvents, createEvent, deleteEvent } from '../controllers/eventController';
import { authMiddleware, adminMiddleware } from '../middleware/auth';

const router = express.Router();

router.get('/', getAllEvents);
router.post('/', authMiddleware, adminMiddleware, createEvent);
router.delete('/:id', authMiddleware, adminMiddleware, deleteEvent);

export default router;
