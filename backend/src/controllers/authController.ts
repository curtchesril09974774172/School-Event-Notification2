import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../database';

interface LoginRequestBody {
  email: string;
  password: string;
}

interface RegisterRequestBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: string;
}

interface User {
  id: number;
  email: string;
  role: string;
}

const login = async (req: Request, res: Response): Promise<void> => {
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
      const role = rows[0].role || (rows[0].email === 'admin@school.com' ? 'admin' : 'student');
      const user: User = {
        id: rows[0].id,
        email: rows[0].email,
        role
      };

      // Generate proper JWT token
      const token = jwt.sign(user, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });

      res.json({ success: true, user, token });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName, role } = req.body as RegisterRequestBody;

    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    const connection = await pool.getConnection();

    // Check if user already exists
    const [existing]: any = await connection.execute(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing.length > 0) {
      connection.release();
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    // Insert new user
    const userRole = role || 'student';
    await connection.execute(
      'INSERT INTO users (email, password, firstName, lastName, role) VALUES (?, ?, ?, ?, ?)',
      [email, password, firstName, lastName, userRole]
    );

    connection.release();
    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export { login, register };