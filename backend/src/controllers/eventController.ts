import { Request, Response } from 'express';
import pool from '../database';

interface EventRequestBody {
  title: string;
  date: string;
  description: string;
}

interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
}

export const getAllEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const connection = await pool.getConnection();

    const [rows]: any = await connection.execute(
      'SELECT * FROM events ORDER BY date DESC'
    );

    connection.release();

    res.json(rows);
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, date, description } = req.body as EventRequestBody;

    if (!title || !date || !description) {
      res.status(400).json({ message: 'Title, date, and description are required' });
      return;
    }

    const connection = await pool.getConnection();

    const [result]: any = await connection.execute(
      'INSERT INTO events (title, date, description) VALUES (?, ?, ?)',
      [title, date, description]
    );

    connection.release();

    const newEvent: Event = {
      id: result.insertId,
      title,
      date,
      description
    };

    res.json({ success: true, event: newEvent });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: 'Event ID is required' });
      return;
    }

    const connection = await pool.getConnection();

    await connection.execute(
      'DELETE FROM events WHERE id = ?',
      [id]
    );

    connection.release();

    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
