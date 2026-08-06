// Load environment variables from .env file into process.env
// The `override: true` option ensures that .env values override existing env vars
import dotenv from "dotenv";
dotenv.config({ override: true });

// Import core Express and CORS middleware
import express from "express";
import cors from "cors";

// Import route handlers for animals and authentication
import animalRoutes from "./routes/animalRoutes.js";
import authRoutes from "./routes/authRoutes.js";

// Create the Express app instance
const app = express();
process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
});

// Define the port – uses PORT from .env or defaults to 5000
const PORT = process.env.PORT || 5000;

// ---------- CORS Configuration ----------
// This allows your frontend (e.g., running on port 5500) to call this API
app.use(cors({
    origin: true,              // Allows any origin (good for development)
    credentials: true,         // Allows cookies / authorization headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// ---------- Handle Preflight (OPTIONS) Requests ----------
// Browsers send an OPTIONS request before a non-simple request (e.g., POST with JSON)
// This returns a 204 (No Content) to let the browser know CORS is allowed
app.use((req, res, next) => {
    if (req.method === "OPTIONS") {
        return res.sendStatus(204);   // No body, just status
    }
    next(); // Continue to next middleware for non-OPTIONS requests
});

// ---------- Parse JSON Bodies ----------
// This middleware automatically parses incoming JSON request bodies
// and makes them available as `req.body`
app.use(express.json());

// ---------- Root Route (Health Check) ----------
// Simple endpoint to verify the server is running
app.get("/", (req, res) => {
    res.json({
        message: "Animal API is running!"
    });
});

// ---------- Mount Route Handlers ----------
// All routes starting with /animals will be handled by animalRoutes
// Example: GET /animals → animalRoutes handles it
app.use("/animals", animalRoutes);

// All routes starting with /auth will be handled by authRoutes
// Example: POST /auth/login → handled by authRoutes
app.use("/auth", authRoutes);

// ---------- Start the Server ----------
// Binding to '0.0.0.0' makes the server accessible from other devices on the network
// (useful if you're testing from a phone or another computer)
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});