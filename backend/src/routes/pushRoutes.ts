import { Router } from 'express';
import { subscribeToPushNotifications, unsubscribeFromPushNotifications } from '../controllers/pushController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/subscribe', authMiddleware, subscribeToPushNotifications);
router.post('/unsubscribe', authMiddleware, unsubscribeFromPushNotifications);

export default router;
