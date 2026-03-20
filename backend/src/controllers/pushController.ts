import { Response } from 'express';
import PushSubscription from '../models/PushSubscription';
import { AuthRequest } from '../middleware/auth';

export const subscribeToPushNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { subscription } = req.body || {};

    if (!subscription || !subscription.keys) {
      res.status(400).json({ message: 'Subscription data is required' });
      return;
    }

    // Check if subscription already exists
    const existingSubscription = await PushSubscription.findOne(parseInt((req.user?.id as unknown) as string) || 0, subscription.endpoint);

    if (existingSubscription) {
      res.status(200).json({ message: 'Already subscribed to push notifications' });
      return;
    }

    const pushSubscription = await PushSubscription.create({
      userId: parseInt((req.user?.id as unknown) as string) || 0,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    });

    res.status(201).json({
      message: 'Successfully subscribed to push notifications',
      subscription: pushSubscription,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error subscribing to push notifications', error });
  }
};

export const unsubscribeFromPushNotifications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { endpoint } = req.body || {};

    if (!endpoint) {
      res.status(400).json({ message: 'Endpoint is required' });
      return;
    }

    await PushSubscription.delete(parseInt((req.user?.id as unknown) as string) || 0, endpoint);

    res.json({ message: 'Successfully unsubscribed from push notifications' });
  } catch (error) {
    res.status(500).json({ message: 'Error unsubscribing from push notifications', error });
  }
};
