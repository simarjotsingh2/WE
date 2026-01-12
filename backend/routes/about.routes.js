import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

/**
 * GET /api/about/about
 * returns:
 * {
 *   title, lead, story_title, story_body,
 *   whatwedo_title, whatwedo_points: [],
 *   image_url,
 *   stats: [{ value, label }]
 * }
 */
router.get("/:slug", async (req, res) => {
    try {
        const { slug } = req.params;

        // 1) main about section
        const { data: section, error: secErr } = await supabase
            .from("about_sections")
            .select("*")
            .eq("slug", slug)
            .eq("is_active", true)
            .order("sort_order", { ascending: true })
            .limit(1)
            .maybeSingle();

        if (secErr) throw secErr;
        if (!section) return res.json(null);

        // 2) stats
        const { data: stats, error: stErr } = await supabase
            .from("about_stats")
            .select("value,label,sort_order")
            .eq("about_slug", slug)
            .eq("is_active", true)
            .order("sort_order", { ascending: true });

        if (stErr) throw stErr;

        // multiline points -> array
        const points =
            typeof section.whatwedo_points === "string"
                ? section.whatwedo_points
                    .split("\n")
                    .map((x) => x.trim())
                    .filter(Boolean)
                : [];

        res.json({
            title: section.title,
            lead: section.lead,
            story_title: section.story_title,
            story_body: section.story_body,
            whatwedo_title: section.whatwedo_title,
            whatwedo_points: points,
            image_url: section.image_url,
            stats: stats || [],
        });
    } catch (err) {
        console.error("About API error:", err);
        res.status(500).json({ error: "Failed to load about section" });
    }
});

export default router;
