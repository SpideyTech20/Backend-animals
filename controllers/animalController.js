// controllers/animalController.js

import Animal from "../models/Animal.js";

export const getAnimals = async (req, res) => {
    try {
        const animals = await Animal.getAll(req.query.numLegs);
        res.json(animals);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

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
        res.status(500).json({
            message: error.message
        });
    }
};

export const createAnimal = async (req, res) => {
    try {
        const { name, numLegs } = req.body;

        const animal = await Animal.create(name, numLegs);

        res.status(201).json({
            message: "Animal added",
            animal
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const updateAnimal = async (req, res) => {
    try {
        const { name, numLegs } = req.body;

        const animal = await Animal.update(
            req.params.id,
            name,
            numLegs
        );

        res.json({
            message: "Animal updated",
            animal
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

export const deleteAnimal = async (req, res) => {
    try {
        await Animal.delete(req.params.id);

        res.json({
            message: "Animal deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};