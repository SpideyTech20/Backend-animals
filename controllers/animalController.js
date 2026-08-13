// controllers/animalController.js

import Animal from "../models/Animal.js";

// ==================================================
// GET ALL ANIMALS
// ==================================================

export const getAnimals = async (req, res) => {
    try {

        const animals = await Animal.getAll(req.query.numLegs);

        res.json(animals);

    } catch (error) {

        console.error("GET ANIMALS ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


// ==================================================
// GET ANIMAL BY ID
// ==================================================

export const getAnimalById = async (req, res) => {
    try {

        const animal = await Animal.getById(req.params.id);

        if (!animal) {
            return res.status(404).json({
                message: "Animal not found"
            });
        }

        res.json(animal);

    } catch (error) {

        console.error("GET ANIMAL ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


// ==================================================
// POST - CREATE ANIMAL
// ==================================================

export const createAnimal = async (req, res) => {
    try {

        // IMPORTANT:
        // Frontend sends num_legs
        const { name, num_legs } = req.body;

        console.log("POST BODY:", req.body);

        // Validate data
        if (!name || num_legs === undefined) {
            return res.status(400).json({
                message: "Name and number of legs are required."
            });
        }

        const animal = await Animal.create(
            name,
            num_legs
        );

        res.status(201).json({
            message: "Animal added successfully",
            animal
        });

    } catch (error) {

        console.error("CREATE ANIMAL ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


// ==================================================
// PUT - UPDATE ANIMAL
// ==================================================

export const updateAnimal = async (req, res) => {
    try {

        // IMPORTANT:
        // Frontend sends num_legs
        const { name, num_legs } = req.body;

        console.log("PUT BODY:", req.body);

        // Validate data
        if (!name || num_legs === undefined) {
            return res.status(400).json({
                message: "Name and number of legs are required."
            });
        }

        const animal = await Animal.update(
            req.params.id,
            name,
            num_legs
        );

        res.json({
            message: "Animal updated successfully",
            animal
        });

    } catch (error) {

        console.error("UPDATE ANIMAL ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
};


// ==================================================
// DELETE - DELETE ANIMAL
// ==================================================

export const deleteAnimal = async (req, res) => {
    try {

        await Animal.delete(req.params.id);

        res.json({
            message: "Animal deleted successfully"
        });

    } catch (error) {

        console.error("DELETE ANIMAL ERROR:", error);

        res.status(500).json({
            message: error.message
        });
    }
};