import express from "express";
import db from "../db.js"; // or your database connection

const router = express.Router();

// This handles GET requests to /animals
router.get("/", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM animals");
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// This handles POST requests to /animals
router.post("/", async (req, res) => {
    // ... your add animal logic
});

//  This handles PUT requests to /animals/:id
router.put("/:id", async (req, res) => {
    // ... your update logic
});

//  This handles DELETE requests to /animals/:id
router.delete("/:id", async (req, res) => {
    // ... your delete logic
});

export default router; // ← MUST export the router