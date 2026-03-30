import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // WAMP default password is empty
  database: 'school_events_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
