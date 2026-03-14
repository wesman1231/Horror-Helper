import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export const db = mysql.createPool({
  host: getEnv('DB_HOST'),
  user: getEnv('DB_USER'),
  password: getEnv('DB_PASSWORD'),
  database: getEnv('DB_NAME'),
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Add this to your main server entry point (e.g., index.ts)
async function testConnection() {
  try {
    const connection = await db.getConnection();
    console.log('✅ Successfully connected to RDS MySQL!');
    connection.release();
  } catch (error) {
    console.error('❌ Failed to connect to RDS:', error);
  }
}

testConnection();
