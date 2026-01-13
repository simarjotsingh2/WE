import { createClient } from "@supabase/supabase-js";
import express from "express";
import multer from "multer";
import path from "path";
import { requireAdmin } from "../middleware/requireAdmin.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });
const BUCKET = "we-media"; // ⚠️ change this to your real bucket name

const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// whitelist tables (only these can be managed)
const ADMIN_TABLES = [
    "about_sections",
    "about_stats",
    "gallery_items",
    "hero_sections",
    "nav_items",
    "services_page_items",
    "what_we_do_items",
];

function assertAllowedTable(table) {
    if (!ADMIN_TABLES.includes(table)) {
        const err = new Error("Table not allowed");
        err.status = 400;
        throw err;
    }
}

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

// ✅ Upload file to Supabase Storage
router.post("/upload", requireAdmin, upload.single("file"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const { mimetype, originalname, buffer } = req.file;

        // folder can be table name (keeps uploads organized)
        const folder = String(req.body.folder || "uploads").replace(/[^a-zA-Z0-9/_-]/g, "");

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


// schema (columns)
router.get("/schema/:table", requireAdmin, async (req, res) => {
    try {
        const table = req.params.table;
        assertAllowedTable(table);

        const { data, error } = await supabaseAdmin.rpc("get_table_columns", { p_table: table });
        if (error) return res.status(400).json({ error: error.message });

        res.json({ table, columns: data });
    } catch (e) {
        res.status(e.status || 500).json({ error: e.message });
    }
});

// list rows
router.get("/:table", requireAdmin, async (req, res) => {
    try {
        const table = req.params.table;
        assertAllowedTable(table);

        const { data, error } = await supabaseAdmin.from(table).select("*").order("id", { ascending: false });
        if (error) return res.status(400).json({ error: error.message });

        res.json(data);
    } catch (e) {
        res.status(e.status || 500).json({ error: e.message });
    }
});

// insert
router.post("/:table", requireAdmin, async (req, res) => {
    try {
        const table = req.params.table;
        assertAllowedTable(table);

        const payload = req.body;
        const { data, error } = await supabaseAdmin.from(table).insert(payload).select("*").single();
        if (error) return res.status(400).json({ error: error.message });

        res.json(data);
    } catch (e) {
        res.status(e.status || 500).json({ error: e.message });
    }
});

// update by id
router.patch("/:table/:id", requireAdmin, async (req, res) => {
    try {
        const table = req.params.table;
        assertAllowedTable(table);

        const id = req.params.id;
        const payload = req.body;

        const { data, error } = await supabaseAdmin.from(table).update(payload).eq("id", id).select("*").single();
        if (error) return res.status(400).json({ error: error.message });

        res.json(data);
    } catch (e) {
        res.status(e.status || 500).json({ error: e.message });
    }
});

// delete
router.delete("/:table/:id", requireAdmin, async (req, res) => {
    try {
        const table = req.params.table;
        assertAllowedTable(table);

        const id = req.params.id;
        const { error } = await supabaseAdmin.from(table).delete().eq("id", id);
        if (error) return res.status(400).json({ error: error.message });

        res.json({ success: true });
    } catch (e) {
        res.status(e.status || 500).json({ error: e.message });
    }
});

export default router;
