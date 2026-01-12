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
    .filter(Boolean);

app.use(
    cors({
        origin: (origin, cb) => {
            if (!origin) return cb(null, true);

            // ✅ allow all Vercel preview/prod domains
            if (origin.endsWith(".vercel.app")) return cb(null, true);

            // ✅ allow list from env (localhost + any custom domain you add)
            if (allowedOrigins.includes(origin)) return cb(null, true);

            return cb(new Error("CORS blocked: " + origin));
        },
        credentials: true,
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
