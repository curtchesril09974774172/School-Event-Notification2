import { Request, Response } from 'express';
import pool from '../database';

interface LoginRequestBody {
  email: string;
  password: string;
}

interface User {
  id: number;
  email: string;
}

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as LoginRequestBody;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const connection = await pool.getConnection();

    const [rows]: any = await connection.execute(
      'SELECT * FROM users WHERE email = ? AND password = ?',
      [email, password]
    );

    connection.release();

    if (rows.length > 0) {
      const user: User = {
        id: rows[0].id,
        email: rows[0].email
      };
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body as LoginRequestBody;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const connection = await pool.getConnection();

    // Check if user already exists
    const [existingUser]: any = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (existingUser.length > 0) {
      connection.release();
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Insert new user
    await connection.execute(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, password]
    );

    connection.release();
    res.json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
