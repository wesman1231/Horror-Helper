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
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const directorDB = mysql.createPool({
  host: getEnv('DB_HOST'),
  user: getEnv('DB_USER'),
  password: getEnv('DB_PASSWORD'),
  database: getEnv('DB2_NAME'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
