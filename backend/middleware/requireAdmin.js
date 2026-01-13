import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function requireAdmin(req, res, next) {
    try {
        const auth = req.headers.authorization || "";
        const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
        if (!token) return res.status(401).json({ error: "Missing token" });

        const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);
        if (userErr || !userData?.user) return res.status(401).json({ error: "Invalid token" });

        const userId = userData.user.id;

        const { data: profile, error: profErr } = await supabaseAdmin
            .from("profiles")
            .select("role")
            .eq("id", userId)
            .single();

        if (profErr || profile?.role !== "admin") {
            return res.status(403).json({ error: "Admin only" });
        }

        req.user = userData.user;
        next();
    } catch (e) {
        return res.status(500).json({ error: "Server error" });
    }
}
