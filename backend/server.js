import cors from "cors";
import dotenv from "dotenv";
import express from "express";

import aboutRoutes from "./routes/about.routes.js";
import adminRouter from "./routes/admin.js";
import adminUploadRouter from "./routes/adminUpload.js";
import galleryRoutes from "./routes/gallery.routes.js";
import heroRoutes from "./routes/hero.routes.js";
import navRoutes from "./routes/nav.routes.js";
import servicesRoutes from "./routes/services.routes.js";
import servicesPageRoutes from "./routes/servicesPage.routes.js";

dotenv.config();

const app = express();

// ✅ Parse JSON
app.use(express.json());

// ✅ CORS
const allowedOrigins = (process.env.CORS_ORIGIN || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

const corsOptions = {
    origin: (origin, cb) => {
        if (!origin) return cb(null, true); // Postman/curl

        // ✅ allow any vercel deployment
        if (origin.endsWith(".vercel.app")) return cb(null, true);

        // ✅ allow from env list
        if (allowedOrigins.includes(origin)) return cb(null, true);

        return cb(null, false); // deny without crashing
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// ✅ IMPORTANT: use regex instead of "*"
app.options(/.*/, cors(corsOptions));

// Routes
app.use("/api/services", servicesRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/services-page", servicesPageRoutes);
app.use("/api/nav", navRoutes);
app.use("/api/hero", heroRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/admin", adminRouter);
app.use("/api/admin", adminUploadRouter);

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
