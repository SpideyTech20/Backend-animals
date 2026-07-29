require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const pool = require("./database");

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors());
app.use(express.json());
// Root route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "index.html"));
});


app.get("/animals", async (req, res) => {
    try {
        const { numLegs } = req.query;
        let query = "SELECT id, name, num_legs AS numLegs FROM animals";
        let params = [];

        if (numLegs !== undefined) {
            query += " WHERE num_legs = ?";
            params.push(Number(numLegs));
        }

        const [animals] = await pool.execute(query, params);
        res.json({ animals });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to retrieve animals" });
    }
});


app.get("/animals/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const [animals] = await pool.execute(
            "SELECT id, name, num_legs AS numLegs FROM animals WHERE id = ?",
            [id]
        );

        if (animals.length === 0) {
            return res.status(404).json({ message: "Animal not found" });
        }

        res.json(animals[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to retrieve animal" });
    }
});


app.post("/animals", async (req, res) => {
    try {
        const { name, numLegs } = req.body;

        if (!name || numLegs === undefined) {
            return res.status(400).json({ message: "name and numLegs are required" });
        }

        const formattedName = name.trim().toUpperCase();

        const [result] = await pool.execute(
            "INSERT INTO animals (name, num_legs) VALUES (?, ?)",
            [formattedName, Number(numLegs)]
        );

        const [newAnimal] = await pool.execute(
            "SELECT id, name, num_legs AS numLegs FROM animals WHERE id = ?",
            [result.insertId]
        );

        res.status(201).json({
            message: "Animal added",
            animal: newAnimal[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to create animal" });
    }
});


app.put("/animals/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);
        const { name, numLegs } = req.body;

        const [existing] = await pool.execute(
            "SELECT id, name, num_legs AS numLegs FROM animals WHERE id = ?",
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({ message: "Animal not found" });
        }

        let updatedName = existing[0].name;
        let updatedNumLegs = existing[0].numLegs;

        if (name !== undefined) {
            updatedName = name.trim().toUpperCase();
        }
        if (numLegs !== undefined) {
            updatedNumLegs = Number(numLegs);
        }

        await pool.execute(
            "UPDATE animals SET name = ?, num_legs = ? WHERE id = ?",
            [updatedName, updatedNumLegs, id]
        );

        const [updatedAnimal] = await pool.execute(
            "SELECT id, name, num_legs AS numLegs FROM animals WHERE id = ?",
            [id]
        );

        res.json({
            message: "Animal updated",
            animal: updatedAnimal[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to update animal" });
    }
});


app.delete("/animals/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        const [result] = await pool.execute(
            "DELETE FROM animals WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Animal not found" });
        }

        res.json({ message: "Animal deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Unable to delete animal" });
    }
});



async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("Connected to MySQL!");
    connection.release();
  } catch (err) {
    console.error("Unable to connect to MySQL:", err.message);
    process.exit(1);
  }
}

testConnection();