require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./database");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Home
app.get("/", (req, res) => {
    res.json({
        message: "Animal API is running!",
        endpoints: {
            getAll: "GET /animals",
            getOne: "GET /animals/:id",
            create: "POST /animals",
            update: "PUT /animals/:id",
            delete: "DELETE /animals/:id"
        }
    });
});

// GET all animals
app.get("/animals", async (req, res) => {
    try {
        const { numLegs } = req.query;

        let sql = "SELECT id, name, num_legs AS numLegs FROM animals";
        const params = [];

        if (numLegs !== undefined) {
            sql += " WHERE num_legs = ?";
            params.push(Number(numLegs));
        }

        const [animals] = await pool.execute(sql, params);

        res.json({ animals });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message,
            code: error.code,
            sql: error.sql
        });
    }
});

// GET animal by id
app.get("/animals/:id", async (req, res) => {
    try {

        const [animals] = await pool.execute(
            "SELECT id,name,num_legs AS numLegs FROM animals WHERE id=?",
            [req.params.id]
        );

        if (animals.length === 0) {
            return res.status(404).json({
                message: "Animal not found"
            });
        }

        res.json(animals[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message,
            code: error.code,
            sql: error.sql
        });

    }
});

// POST
app.post("/animals", async (req, res) => {

    try {

        const { name, numLegs } = req.body;

        if (!name || numLegs === undefined) {
            return res.status(400).json({
                message: "name and numLegs are required"
            });
        }

        const [result] = await pool.execute(
            "INSERT INTO animals(name,num_legs) VALUES(?,?)",
            [name.trim().toUpperCase(), Number(numLegs)]
        );

        const [animal] = await pool.execute(
            "SELECT id,name,num_legs AS numLegs FROM animals WHERE id=?",
            [result.insertId]
        );

        res.status(201).json({
            message: "Animal added",
            animal: animal[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message,
            code: error.code,
            sql: error.sql
        });

    }

});

// PUT
app.put("/animals/:id", async (req, res) => {

    try {

        const id = req.params.id;
        const { name, numLegs } = req.body;

        const [rows] = await pool.execute(
            "SELECT * FROM animals WHERE id=?",
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                message: "Animal not found"
            });
        }

        const updatedName = name ? name.trim().toUpperCase() : rows[0].name;
        const updatedLegs =
            numLegs !== undefined ? Number(numLegs) : rows[0].num_legs;

        await pool.execute(
            "UPDATE animals SET name=?,num_legs=? WHERE id=?",
            [updatedName, updatedLegs, id]
        );

        const [updated] = await pool.execute(
            "SELECT id,name,num_legs AS numLegs FROM animals WHERE id=?",
            [id]
        );

        res.json({
            message: "Animal updated",
            animal: updated[0]
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message,
            code: error.code,
            sql: error.sql
        });

    }

});

// DELETE
app.delete("/animals/:id", async (req, res) => {

    try {

        const [result] = await pool.execute(
            "DELETE FROM animals WHERE id=?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Animal not found"
            });
        }

        res.json({
            message: "Animal deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: error.message,
            code: error.code,
            sql: error.sql
        });

    }

});

// Start server
async function startServer() {

    try {

        const connection = await pool.getConnection();

        console.log("✅ Connected to MySQL!");

        connection.release();

        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });

    } catch (error) {

        console.error(error);

        process.exit(1);

    }

}

startServer();