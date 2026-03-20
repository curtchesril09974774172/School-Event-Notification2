import { pool } from '../database';
import bcryptjs from 'bcryptjs';

export interface IUser {
  id?: number | string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'student';
  createdAt?: Date;
  updatedAt?: Date;
}

export class User {
  static async findOne(email: string): Promise<IUser | null> {
    const connection = await pool.getConnection();
    const [rows]: any = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
    connection.release();
    return rows.length > 0 ? rows[0] : null;
  }

  static async findById(id: number): Promise<IUser | null> {
    const connection = await pool.getConnection();
    const [rows]: any = await connection.execute('SELECT * FROM users WHERE id = ?', [id]);
    connection.release();
    return rows.length > 0 ? rows[0] : null;
  }

  static async create(user: IUser): Promise<IUser> {
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(user.password, salt);
    const connection = await pool.getConnection();
    const [result]: any = await connection.execute(
      'INSERT INTO users (email, password, firstName, lastName, role) VALUES (?, ?, ?, ?, ?)',
      [user.email, hashedPassword, user.firstName, user.lastName, user.role || 'student']
    );
    connection.release();
    return { ...user, id: result.insertId, password: hashedPassword };
  }

  static async comparePassword(hashedPassword: string, password: string): Promise<boolean> {
    return bcryptjs.compare(password, hashedPassword);
  }
}

export default User;
