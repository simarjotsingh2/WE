import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import aboutRoutes from "./routes/about.routes.js";
import galleryRoutes from "./routes/gallery.routes.js";
import heroRoutes from "./routes/hero.routes.js";
import navRoutes from "./routes/nav.routes.js";
import servicesRoutes from "./routes/services.routes.js";
import servicesPageRoutes from "./routes/servicesPage.routes.js";

dotenv.config();

const app = express();

// ✅ Parse JSON
app.use(express.json());

// ✅ CORS (fixed)
const allowedOrigins = (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean); // <-- IMPORTANT (removes "")

app.use(
    cors({
        origin: (origin, callback) => {
            // allow requests with no origin (Postman, curl)
            if (!origin) return callback(null, true);

            // if you provided a list, allow only those
            if (allowedOrigins.length && allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            // if list not provided, allow all (not recommended for production)
            if (!allowedOrigins.length) return callback(null, true);

            return callback(new Error("CORS blocked: " + origin));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);

// ✅ Handle preflight requests
app.options("*", cors());

// Routes
app.use("/api/services", servicesRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/services-page", servicesPageRoutes);
app.use("/api/nav", navRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/about", aboutRoutes);

// Health + Root
app.get("/health", (req, res) => {
    res.json({ status: "ok", backend: "express" });
});

app.get("/", (req, res) => {
    res.send("✅ WE Backend is running. Try /health");
});

// ❌ REMOVE THIS (it conflicts with galleryRoutes)
// app.get("/api/gallery", (req, res) => {
//   res.json([{ id: 1, title: "Sample Gallery", imageUrl: "/uploads/sample.jpg" }]);
// });

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
