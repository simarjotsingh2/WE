import { useEffect, useMemo, useState } from "react";
import "./mission-vision.css";

// ✅ fallback (your current hardcoded data)
const FALLBACK_SERVICES = [
    {
        title: "PoSH Awareness Session & Training",
        image: "/images/what-to-do/Awareness-Session.png",
        description: [
            "We assist organizations in drafting and reviewing POSH policies in line with the POSH Act, 2013.",
            "We support the formation and smooth functioning of Internal Complaints Committees (ICCs).",
            "We act as External Members and guide ICCs through legally compliant procedures.",
            "We prepare and assist in filing the annual PoSH compliance reports.",
            "We provide guidance on handling complaints while ensuring fairness and due process.",
        ],
    },
    {
        title: "Sensitization Workshop",
        image: "/images/what-to-do/Workshop.jpg",
        description: [
            "We conduct interactive awareness sessions for employees and management.",
            "We train ICC members to clearly understand their roles and responsibilities.",
            "We promote respectful workplace communication and professional boundaries.",
            "We design customized training programs for corporates and institutions.",
            "Our sessions focus on prevention and building a healthy work culture.",
        ],
    },
    {
        title: "Workplace Policy & PoSH Audit",
        image: "/images/what-to-do/posh-audit.jpg",
        description: [
            "We provide a confidential and safe space for women to share their concerns.",
            "We offer initial legal guidance to help women understand their rights.",
            "We explain available remedies and the appropriate next steps.",
            "We support women with documentation and procedural clarity.",
            "Our approach focuses on empowerment through informed decision-making.",
        ],
    },
    {
        title: "POCSO & Gender Sensitization Awareness Session",
        image: "/images/what-to-do/POCSO.png",
        description: [
            "We assist organizations in building strong and ethical workplace policies.",
            "We conduct gender sensitization initiatives to promote respect and inclusion.",
            "We support practices that uphold dignity and equality at work.",
            "We help organizations strengthen trust and accountability among employees.",
            "Our work aims to reduce conflict and create sustainable workplace cultures.",
        ],
    },
    {
        title: "Support",
        image: "/images/what-to-do/donation-photo.jpg",
        description: [
            "We assist organizations in building strong and ethical workplace policies.",
            "We conduct gender sensitization initiatives to promote respect and inclusion.",
            "We support practices that uphold dignity and equality at work.",
            "We help organizations strengthen trust and accountability among employees.",
            "Our work aims to reduce conflict and create sustainable workplace cultures.",
        ],
    },
];

// ✅ uses your VITE_API_URL if set, otherwise localhost
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ✅ Convert backend shape → component shape safely
function normalizeItems(items, fallbackItems) {
    if (!Array.isArray(items) || items.length === 0) return fallbackItems;

    return items.map((it, idx) => {
        // accept multiple backend field names
        const title = (it?.title || `Item ${idx + 1}`).trim();
        const image = it?.image || it?.imageUrl || it?.image_url || fallbackItems[idx]?.image || "";

        // lines/description/bullets can come in many forms
        let descArr = [];

        if (Array.isArray(it?.description)) descArr = it.description;
        else if (Array.isArray(it?.lines)) descArr = it.lines;
        else if (Array.isArray(it?.bullets)) descArr = it.bullets;
        else if (typeof it?.bullets === "string") descArr = it.bullets.split("\n");
        else if (typeof it?.description === "string") descArr = it.description.split("\n");

        descArr = (descArr || []).map((s) => String(s).trim()).filter(Boolean);

        return {
            title,
            image,
            description: descArr.length ? descArr : fallbackItems[idx]?.description || [],
        };
    });
}

export default function MissionVision({ data }) {
    const [remote, setRemote] = useState(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    // ✅ Priority:
    // 1) Parent data
    // 2) Backend /api/services (Supabase)
    // 3) fallback data
    useEffect(() => {
        let ignore = false;

        async function load() {
            if (data) return;

            try {
                setErr("");
                setLoading(true);

                const res = await fetch(`${BASE_URL}/api/services`);
                if (!res.ok) throw new Error("Failed to load services");

                const items = await res.json();

                if (!ignore) setRemote({ heading: "What WE do", items });
            } catch (e) {
                if (!ignore) {
                    setErr(e?.message || "Failed to load services");
                    setRemote(null);
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        load();
        return () => {
            ignore = true;
        };
    }, [data]);

    const heading = data?.heading || remote?.heading || "What WE do";

    const services = useMemo(() => {
        const items = data?.items || remote?.items;
        return normalizeItems(items, FALLBACK_SERVICES);
    }, [data, remote]);

    return (
        <section className="we-whatwedo">
            <div className="we-wrap">
                <h2 className="we-title">{heading}</h2>

                {/* Optional: status */}
                {loading ? <p style={{ opacity: 0.8 }}>Loading...</p> : null}
                {err ? <p style={{ color: "crimson" }}>{err}</p> : null}

                {services.map((s, index) => (
                    <div key={index} className="we-row">
                        {/* IMAGE */}
                        <div className="we-media">
                            {s.image ? <img src={s.image} alt={s.title} /> : null}
                        </div>

                        {/* CONTENT */}
                        <div className="we-content">
                            <h3>{s.title}</h3>

                            <div className="we-lines">
                                {(s.description || []).map((line, i) => (
                                    <p key={i}>{line}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
