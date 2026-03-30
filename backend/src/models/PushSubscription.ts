import pool from '../database';

export interface IPushSubscription {
  id?: number;
  userId: number | string;
  endpoint: string;
  p256dh: string;
  auth: string;
  createdAt?: Date;
}

export class PushSubscription {
  static async find(): Promise<IPushSubscription[]> {
    const connection = await pool.getConnection();
    const [rows]: any = await connection.execute('SELECT * FROM push_subscriptions');
    connection.release();
    return rows;
  }

  static async findOne(userId: number, endpoint: string): Promise<IPushSubscription | null> {
    const connection = await pool.getConnection();
    const [rows]: any = await connection.execute(
      'SELECT * FROM push_subscriptions WHERE userId = ? AND endpoint = ?',
      [userId, endpoint]
    );
    connection.release();
    return rows.length > 0 ? rows[0] : null;
  }

  static async create(subscription: IPushSubscription): Promise<IPushSubscription> {
    const connection = await pool.getConnection();
    const [result]: any = await connection.execute(
      'INSERT INTO push_subscriptions (userId, endpoint, p256dh, auth) VALUES (?, ?, ?, ?)',
      [subscription.userId, subscription.endpoint, subscription.p256dh, subscription.auth]
    );
    connection.release();
    return { ...subscription, id: result.insertId };
  }

  static async delete(userId: number, endpoint: string): Promise<void> {
    const connection = await pool.getConnection();
    await connection.execute(
      'DELETE FROM push_subscriptions WHERE userId = ? AND endpoint = ?',
      [userId, endpoint]
    );
    connection.release();
  }
}

export default PushSubscription;
