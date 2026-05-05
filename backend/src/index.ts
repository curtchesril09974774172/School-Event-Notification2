import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import authRoutes from './routes/authRoutes';
import eventRoutes from './routes/eventRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import pool from './database';

const app: Express = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ensure database schema matches expected structure
(async () => {
  try {
    const connection = await pool.getConnection();

    try {
      await connection.execute('SELECT role FROM users LIMIT 1');
    } catch (innerError) {
      await connection.execute(
        "ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'student'"
      );
    }

    try {
      await connection.execute('SELECT firstName FROM users LIMIT 1');
    } catch (innerError) {
      await connection.execute(
        "ALTER TABLE users ADD COLUMN firstName VARCHAR(50) NOT NULL DEFAULT ''"
      );
    }

    try {
      await connection.execute('SELECT lastName FROM users LIMIT 1');
    } catch (innerError) {
      await connection.execute(
        "ALTER TABLE users ADD COLUMN lastName VARCHAR(50) NOT NULL DEFAULT ''"
      );
    }

    try {
      await connection.execute('SELECT 1 FROM attendance LIMIT 1');
    } catch (innerError) {
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS attendance (
          id INT PRIMARY KEY AUTO_INCREMENT,
          event_id INT NOT NULL,
          student_id INT NOT NULL,
          student_name VARCHAR(100) NOT NULL,
          section VARCHAR(50) NOT NULL,
          year_level VARCHAR(20) NOT NULL,
          image_path VARCHAR(255) NOT NULL,
          timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
          FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
          UNIQUE KEY unique_attendance (event_id, student_id)
        )
      `);
    }

    connection.release();
  } catch (error) {
    console.error('Database schema fix failed:', error);
  }
})();

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, '../../frontend')));
app.use('/uploads', express.static(path.join(__dirname, '../../frontend/uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/attendance', attendanceRoutes);

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'Server is running' });
});

// Serve login.html for root path
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../../frontend/login.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
