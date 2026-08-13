import "dotenv/config";
import express from "express";
import cors from "cors";

import animalRoutes from "./routes/animalRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

const PORT = process.env.PORT || 5000;


// =====================================================
// MIDDLEWARE
// =====================================================

// Enable CORS
app.use(cors());

// Allow JSON request bodies
app.use(express.json());


// =====================================================
// HOME ROUTE
// =====================================================

app.get("/", (req, res) => {
    res.json({
        message: "Animal API is running!",
        endpoints: {
            animals: "/animals",
            register: "/auth/register",
            login: "/auth/login"
        }
    });
});


// =====================================================
// ANIMAL ROUTES
// =====================================================

app.use("/animals", animalRoutes);


// =====================================================
// AUTHENTICATION ROUTES
// =====================================================

app.use("/auth", authRoutes);


// =====================================================
// 404 ROUTE
// =====================================================

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});


// =====================================================
// START SERVER
// =====================================================

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


// =====================================================
// SERVER ERROR HANDLER
// =====================================================

server.on("error", (error) => {
    console.log("Server error:", error);

    if (error.code === "EADDRINUSE") {
        console.log(`Port ${PORT} is already in use.`);
    }

    process.exit(1);
});