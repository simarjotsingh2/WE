import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

// GET /api/services-page
router.get("/", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("services_page_items")
            .select("id,title,description,icon,tag,sort_order,is_active,created_at")
            .eq("is_active", true)
            .order("sort_order", { ascending: true })
            .order("created_at", { ascending: true });

        if (error) throw error;

        // ✅ If empty, send fallback (so UI never breaks)
        if (!data || data.length === 0) {
            return res.json([
                {
                    id: "1",
                    title: "POSH Compliance",
                    description:
                        "Interactive workshops for employees & managers—rights, responsibilities, bystander action, and safe reporting.",
                    icon: "cap",
                    tag: "Workplace Safety",
                },
                {
                    id: "2",
                    title: "External IC Membership",
                    description:
                        "Experienced external member support for compliant constitution, inquiry conduct, documentation and closure.",
                    icon: "shield",
                    tag: "Compliance",
                },
                {
                    id: "3",
                    title: "Policy Drafting & Audits",
                    description:
                        "Draft, review, and audit POSH policies and SOPs tailored to your industry and organization size.",
                    icon: "doc",
                    tag: "Policy",
                },
            ]);
        }

        res.json(
            data.map((row) => ({
                id: row.id,
                title: row.title,
                description: row.description || "",
                icon: row.icon || "",
                tag: row.tag || "",
            }))
        );
    } catch (err) {
        console.error("Services Page API error:", err);
        res.status(500).json({ message: "Failed to load services page" });
    }
});

export default router;
