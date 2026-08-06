// db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 4000,  // ✅ 4000 is TiDB's port (NOT your API port)
    waitForConnections: true,
    connectionLimit: 10,
    ssl: {}  // ✅ Required for TiDB Serverless
});

export default pool;