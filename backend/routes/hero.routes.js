import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

// GET /api/hero/home
router.get("/:slug", async (req, res) => {
    try {
        const { slug } = req.params;

        const { data, error } = await supabase
            .from("hero_sections")
            .select(
                "slug, heading, highlight, subheading, button_text, button_link, bg_image_url, overlay_from, overlay_to, overlay_opacity_from, overlay_opacity_to, is_active, sort_order"
            )
            .eq("slug", slug)
            .eq("is_active", true)
            .order("sort_order", { ascending: true })
            .limit(1)
            .maybeSingle();

        if (error) throw error;

        res.json(data || null);
    } catch (err) {
        console.error("Hero API error:", err);
        res.status(500).json({ error: "Failed to load hero" });
    }
});

export default router;
