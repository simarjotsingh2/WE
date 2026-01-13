import { createClient } from "@supabase/supabase-js";
import express from "express";
import multer from "multer";
import path from "path";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BUCKET = "we-media";

function safeExt(mime, originalName) {
    const ext = path.extname(originalName || "").toLowerCase();
    if (ext) return ext;

    if (mime === "image/png") return ".png";
    if (mime === "image/jpeg") return ".jpg";
    if (mime === "image/webp") return ".webp";
    if (mime === "image/gif") return ".gif";
    if (mime === "video/mp4") return ".mp4";
    if (mime === "video/webm") return ".webm";
    return "";
}

router.post("/upload", requireAdmin, upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const { mimetype, originalname, buffer } = req.file;
        const folder = (req.body.folder || "uploads").replace(/[^a-zA-Z0-9/_-]/g, "");
        const ext = safeExt(mimetype, originalname);

        const fileName = `${Date.now()}-${Math.random().toString(16).slice(2)}${ext}`;
        const objectPath = `${folder}/${fileName}`;

        const { error: upErr } = await supabaseAdmin.storage
            .from(BUCKET)
            .upload(objectPath, buffer, {
                contentType: mimetype,
                upsert: true,
            });

        if (upErr) return res.status(400).json({ error: upErr.message });

        // Public URL (bucket must be public)
        const { data } = supabaseAdmin.storage.from(BUCKET).getPublicUrl(objectPath);

        return res.json({
            bucket: BUCKET,
            path: objectPath,
            publicUrl: data.publicUrl,
            mime: mimetype,
        });
    } catch (e) {
        return res.status(500).json({ error: e.message || "Upload failed" });
    }
});

export default router;
