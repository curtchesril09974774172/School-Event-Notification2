import { pool } from '../database';

export interface IEvent {
  id?: number;
  title: string;
  description: string;
  date: Date;
  location: string;
  createdBy: number | string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Event {
  static async find(): Promise<IEvent[]> {
    const connection = await pool.getConnection();
    const [rows]: any = await connection.execute('SELECT * FROM events ORDER BY date ASC');
    connection.release();
    return rows;
  }

  static async findById(id: number): Promise<IEvent | null> {
    const connection = await pool.getConnection();
    const [rows]: any = await connection.execute('SELECT * FROM events WHERE id = ?', [id]);
    connection.release();
    return rows.length > 0 ? rows[0] : null;
  }

  static async create(event: IEvent): Promise<IEvent> {
    const connection = await pool.getConnection();
    const [result]: any = await connection.execute(
      'INSERT INTO events (title, description, date, location, createdBy) VALUES (?, ?, ?, ?, ?)',
      [event.title, event.description, event.date, event.location, event.createdBy]
    );
    connection.release();
    return { ...event, id: result.insertId };
  }

  static async update(id: number, event: Partial<IEvent>): Promise<void> {
    const connection = await pool.getConnection();
    const updates = Object.keys(event)
      .map(key => `${key} = ?`)
      .join(', ');
    const values = [...Object.values(event), id];
    await connection.execute(`UPDATE events SET ${updates} WHERE id = ?`, values);
    connection.release();
  }

  static async delete(id: number): Promise<void> {
    const connection = await pool.getConnection();
    await connection.execute('DELETE FROM events WHERE id = ?', [id]);
    connection.release();
  }
}

export default Event;
