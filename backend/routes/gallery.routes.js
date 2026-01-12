import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const bucket = process.env.SUPABASE_BUCKET || "gallery";

        const { data, error } = await supabase
            .from("gallery_items")
            .select("id,title,tags,path,year,subtitle,quote,created_at")
            .order("created_at", { ascending: true });

        if (error) throw error;

        const items = (data || []).map((row) => {
            const { data: pub } = supabase.storage.from(bucket).getPublicUrl(row.path);

            return {
                id: row.id,
                title: row.title,
                tags: row.tags || [],
                imageUrl: pub.publicUrl,
                year: row.year || "2025",
                subtitle: row.subtitle || "Chapter moments",
                quote: row.quote || "More memories, more strength.",
            };
        });

        res.json(items);
    } catch (err) {
        console.error("Gallery API error:", err);
        res.status(500).json({ message: "Failed to load gallery" });
    }
});

export default router;
