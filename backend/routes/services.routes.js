import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

/**
 * GET /api/services
 * Returns: [{ id, title, image, lines }]
 */
router.get("/", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("what_we_do_items")
            .select("id,title,bullets,image_url,sort_order,is_active,created_at")
            .eq("is_active", true)
            .order("sort_order", { ascending: true })
            .order("created_at", { ascending: true });

        if (error) throw error;

        // ✅ Convert DB → frontend shape
        const items = (data || []).map((row) => ({
            id: row.id,
            title: row.title,
            image: row.image_url || "",
            lines:
                typeof row.bullets === "string"
                    ? row.bullets.split("\n").map((s) => s.trim()).filter(Boolean)
                    : [],
        }));

        // ✅ Fallback if table empty
        if (!items.length) {
            return res.json([
                {
                    id: 1,
                    title: "PoSH Awareness Session & Training",
                    image: "/images/what-to-do/Awareness-Session.png",
                    lines: [
                        "We assist organizations in drafting and reviewing POSH policies in line with the POSH Act, 2013.",
                        "We support the formation and smooth functioning of Internal Complaints Committees (ICCs).",
                        "We act as External Members and guide ICCs through legally compliant procedures.",
                    ],
                },
                {
                    id: 2,
                    title: "Sensitization Workshop",
                    image: "/images/what-to-do/Workshop.jpg",
                    lines: [
                        "We conduct interactive awareness sessions for employees and management.",
                        "We train ICC members to clearly understand their roles and legal duties.",
                        "We use practical case scenarios to build confidence and clarity.",
                        "We focus on respectful workplace culture and prevention.",
                    ],
                },
            ]);
        }

        res.json(items);
    } catch (err) {
        console.error("Services API error:", err);
        res.status(500).json({ message: "Failed to load services" });
    }
});

export default router;
