// routes/animalRoutes.js

import express from "express";
import authenticateToken from "../middleware/authenticateToken.js";
import { 
  getAnimals, 
  getAnimalById, 
  createAnimal, 
  updateAnimal, 
  deleteAnimal 
} from "../controllers/animalController.js";

const router = express.Router();

// Public routes
router.get("/", getAnimals);
router.get("/:id", getAnimalById);

// Protected routes
router.post("/", authenticateToken, createAnimal);
router.put("/:id", authenticateToken, updateAnimal);
router.delete("/:id", authenticateToken, deleteAnimal);

export default router;