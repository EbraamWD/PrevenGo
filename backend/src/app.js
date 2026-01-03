import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import quoteRoutes from "./routes/quotes.js";
import dotenv from 'dotenv';
dotenv.config();
const app = express();
console.log('ora controllo gli allowed origins ', process.env.ALLOWED_ORIGINS);
// CORS configuration - supports multiple origins
const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:5001'];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
        "Content-Type", 
        "Authorization", 
        "X-Requested-With",
        "Accept",
        "Origin"
    ],
    exposedHeaders: ["Content-Disposition"],
    preflightContinue: false,
    optionsSuccessStatus: 200
};

// 1. CORS su tutto
app.use(cors(corsOptions));

// 2. Logging
app.use((req, res, next) => {
    console.log(req.method, req.path, "Origin:", req.headers.origin);
    next();
});

// 3. Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 4. Routes
app.use("/api/auth", authRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/company", quoteRoutes);
app.use("/api/history", quoteRoutes); // Aggiungi altre rotte qui
// 5. Error handler
app.use((err, req, res, next) => {
    console.error("SERVER ERROR:", err);
    res.status(err.status || 500).json({
        msg: err.message || "Server error",
        error: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
});

// 6. 404
app.use((req, res) => {
    res.status(404).json({ msg: "Route not found" });
});

export default app;
