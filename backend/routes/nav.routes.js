import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("nav_items")
            .select("id,label,href,sort_order,is_active,created_at")
            .eq("is_active", true)
            .order("sort_order", { ascending: true })
            .order("created_at", { ascending: true });

        if (error) throw error;

        // fallback (in case DB empty)
        if (!data || data.length === 0) {
            return res.json([
                { id: "home", label: "Home", href: "/" },
                { id: "about", label: "About WE", href: "/about" },
                { id: "services", label: "Services", href: "/services" },
                { id: "gallery", label: "Gallery", href: "/gallery" },
            ]);
        }

        res.json(
            data.map((row) => ({
                id: row.id,
                label: row.label,
                href: row.href,
            }))
        );
    } catch (err) {
        console.error("Nav API error:", err);
        res.status(500).json({ message: "Failed to load nav" });
    }
});

export default router;
