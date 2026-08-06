// models/Animal.js

import db from "../db.js"; // Assuming your database connection is in db.js

const Animal = {

    // Get all animals (optionally filter by numLegs)
    getAll: async (numLegs) => {
        let query = "SELECT * FROM animals";
        const params = [];

        if (numLegs !== undefined && numLegs !== null) {
            query += " WHERE num_legs = ?";
            params.push(numLegs);
        }

        const [rows] = await db.execute(query, params);
        return rows;
    },

    // Get a single animal by ID
    getById: async (id) => {
        const [rows] = await db.execute(
            "SELECT * FROM animals WHERE id = ?",
            [id]
        );
        return rows[0]; // Return the first row, or undefined if not found
    },

    // Create a new animal
    create: async (name, numLegs) => {
        const [result] = await db.execute(
            "INSERT INTO animals (name, num_legs) VALUES (?, ?)",
            [name, numLegs]
        );
        // Return the newly created animal with its ID
        return {
            id: result.insertId,
            name: name,
            num_legs: numLegs
        };
    },

    // Update an existing animal
    update: async (id, name, numLegs) => {
        const [result] = await db.execute(
            "UPDATE animals SET name = ?, num_legs = ? WHERE id = ?",
            [name, numLegs, id]
        );

        if (result.affectedRows === 0) {
            return null; // No animal found with that ID
        }

        // Return the updated animal
        return {
            id: id,
            name: name,
            num_legs: numLegs
        };
    },

    // Delete an animal
    delete: async (id) => {
        const [result] = await db.execute(
            "DELETE FROM animals WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return false; // No animal found
        }
        return true; // Deletion successful
    }

};

export default Animal;