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

// Middleware
app.use(express.json());

const allowed = (process.env.CORS_ORIGIN || "").split(",").map(s => s.trim());

app.use(cors({
    origin: allowed.length ? allowed : true,
    credentials: true,
}));

app.use("/api/services", servicesRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/services-page", servicesPageRoutes);
app.use("/api/nav", navRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/about", aboutRoutes);


// Test route
app.get("/health", (req, res) => {
    res.json({ status: "ok", backend: "express" });
});

app.get("/", (req, res) => {
    res.send("✅ WE Backend is running. Try /health");
});

// Example: gallery route (replace later with DB)
app.get("/api/gallery", (req, res) => {
    res.json([
        { id: 1, title: "Sample Gallery", imageUrl: "/uploads/sample.jpg" },
    ]);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
