import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

async function fetchAboutBySlug(slug) {
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
    if (!section) return null;

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

    return {
        title: section.title,
        lead: section.lead,
        story_title: section.story_title,
        story_body: section.story_body,
        whatwedo_title: section.whatwedo_title,
        whatwedo_points: points,
        image_url: section.image_url,
        stats: stats || [],
    };
}

/**
 * GET /api/about
 * Uses DEFAULT_ABOUT_SLUG or "about"
 */
router.get("/", async (req, res) => {
    try {
        const slug = process.env.DEFAULT_ABOUT_SLUG || "about";
        const payload = await fetchAboutBySlug(slug);
        return res.json(payload);
    } catch (err) {
        console.error("About API error:", err);
        return res.status(500).json({ error: "Failed to load about section" });
    }
});

/**
 * GET /api/about/:slug
 */
router.get("/:slug", async (req, res) => {
    try {
        const { slug } = req.params;
        const payload = await fetchAboutBySlug(slug);
        return res.json(payload);
    } catch (err) {
        console.error("About API error:", err);
        return res.status(500).json({ error: "Failed to load about section" });
    }
});

export default router;
