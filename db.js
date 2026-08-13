import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ override: true });
// ✅ DELETE the line below - it prints your password!
// console.log("DB_PASSWORD:", JSON.stringify(process.env.DB_PASSWORD));

const ssl = process.env.DB_SSL === "false"
    ? false
    : {
        rejectUnauthorized: false
    };

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    ssl
});

// ✅ DELETE the line below - it prints the entire pool object!
// console.log(pool);

export default pool;