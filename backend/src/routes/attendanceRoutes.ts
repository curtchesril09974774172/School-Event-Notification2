import express, { Response } from 'express';
import multer from 'multer';
import path from 'path';
import { authMiddleware, adminMiddleware, AuthRequest } from '../middleware/auth';
import pool from '../database';

const router = express.Router();

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../../frontend/assets/uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Submit attendance (student)
router.post('/', authMiddleware, upload.single('attendanceImage'), async (req: AuthRequest, res: Response) => {
  try {
    const { eventId, studentName, section, yearLevel } = req.body;
    const studentId = req.user?.id ? parseInt(req.user.id, 10) : NaN;

    if (!eventId || Number.isNaN(studentId) || !studentName || !section || !yearLevel) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Attendance image is required' });
    }

    const connection = await pool.getConnection();

    const [existing]: any = await connection.execute(
      'SELECT id FROM attendance WHERE event_id = ? AND student_id = ?',
      [eventId, studentId]
    );

    if (existing.length > 0) {
      connection.release();
      return res.status(400).json({ message: 'Already attended this event' });
    }

    await connection.execute(
      'INSERT INTO attendance (event_id, student_id, student_name, section, year_level, image_path) VALUES (?, ?, ?, ?, ?, ?)',
      [eventId, studentId, studentName, section, yearLevel, req.file.filename]
    );

    connection.release();
    res.json({ success: true, message: 'Attendance recorded successfully' });
  } catch (error) {
    console.error('Attendance submission error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get attendance for an event (admin)
router.get('/:eventId', authMiddleware, adminMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { eventId } = req.params;

    const connection = await pool.getConnection();

    const [rows] = await connection.execute(`
      SELECT a.*, u.email, u.firstName, u.lastName
      FROM attendance a
      JOIN users u ON a.student_id = u.id
      WHERE a.event_id = ?
      ORDER BY a.timestamp DESC
    `, [eventId]);

    connection.release();
    res.json(rows);
  } catch (error) {
    console.error('Get attendance error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;