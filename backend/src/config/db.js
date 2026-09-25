import mysql from "mysql2/promise";

function requireEnv(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Environment variable ${name} is missing`);
  }

  return value;
}

if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 16) {
  console.warn(
    "[warning] JWT_SECRET is too short. Set a long random secret in .env",
  );
}

export const pool = mysql.createPool({
  host: requireEnv("DB_HOST"),
  port: Number(process.env.DB_PORT || 3306),
  user: requireEnv("DB_USER"),
  password: process.env.DB_PASSWORD || "",
  database: requireEnv("DB_NAME"),
  waitForConnections: true,
  connectionLimit: Number(process.env.DB_POOL_LIMIT || 10),
  charset: "utf8mb4",
  namedPlaceholders: true,
});

export async function testConnection() {
  const [rows] = await pool.query("SELECT 1 AS ok");
  return rows[0].ok === 1;
}