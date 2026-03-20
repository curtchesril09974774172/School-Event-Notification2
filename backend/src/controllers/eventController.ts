import { Response } from 'express';
import Event from '../models/Event';
import { AuthRequest } from '../middleware/auth';
import PushSubscription from '../models/PushSubscription';
import webpush from 'web-push';

export const createEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, date, location } = req.body || {};

    const event = await Event.create({
      title,
      description,
      date: new Date(date),
      location,
      createdBy: parseInt((req.user?.id as unknown) as string) || 0,
    });

    // Send push notifications to all students
    try {
      const subscriptions = await PushSubscription.find();
      const notificationPayload = {
        title: `New Event: ${title}`,
        body: description,
        icon: '/icon.png',
        badge: '/badge.png',
      };

      subscriptions.forEach(async (sub: any) => {
        try {
          const subscription = {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          };
          await webpush.sendNotification(subscription, JSON.stringify(notificationPayload));
        } catch (error: any) {
          console.error('Error sending push notification:', error);
        }
      });
    } catch (error: any) {
      console.error('Error sending push notifications:', error);
    }

    res.status(201).json({
      message: 'Event created successfully',
      event,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error });
  }
};

export const getEvents = async (req: any, res: Response): Promise<void> => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error });
  }
};

export const getEventById = async (req: any, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(parseInt(req.params?.id));

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching event', error });
  }
};

export const updateEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(parseInt(req.params?.id));

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    if (event.createdBy !== req.user?.id) {
      res.status(403).json({ message: 'Unauthorized to update this event' });
      return;
    }

    const { title, description, date, location } = req.body || {};
    const updateData: any = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (date) updateData.date = new Date(date);
    if (location) updateData.location = location;

    await Event.update(parseInt(req.params?.id), updateData);

    res.json({
      message: 'Event updated successfully',
      event: { ...event, ...updateData },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error });
  }
};

export const deleteEvent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(parseInt(req.params?.id));

    if (!event) {
      res.status(404).json({ message: 'Event not found' });
      return;
    }

    if (event.createdBy !== parseInt((req.user?.id as unknown) as string)) {
      res.status(403).json({ message: 'Unauthorized to delete this event' });
      return;
    }

    await Event.delete(parseInt(req.params?.id));

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error });
  }
};
