import pool from "../config/database.js";

class User {

    static async findByEmail(email) {

        const [rows] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        return rows[0];
    }


    static async create({ name, email, passwordHash }) {

        const [result] = await pool.query(
            `
            INSERT INTO users (name, email, password_hash)
            VALUES (?, ?, ?)
            `,
            [
                name,
                email,
                passwordHash
            ]
        );

        return {
            id: result.insertId,
            name,
            email
        };
    }

}

export default User;