import { useEffect, useMemo, useState } from "react";
import useInView from "../hooks/useInView";
import "./about.css";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// fallback (if API fails)
const FALLBACK = {
    title: "About WE",
    lead:
        "WE — Women Empowerment at Workplace is a community-driven organization dedicated to building safer, fairer workplaces through education, policy guidance, and survivor-centered support.",
    story_title: "Our Story",
    story_body:
        "Founded by advocate Sarbjeet Kaur, WE emerged from years of working with Internal Complaints Committees (ICCs) and seeing how culture, compliance, and care must work together. We provide practical toolkits and confidential help so both organizations and individuals can act with confidence.",
    whatwedo_title: "What We Do",
    whatwedo_points: [
        "POSH Act (2013) policy design, audits, and awareness training",
        "External ICC membership & case-handling guidance",
        "Leadership programs that grow allyship and accountability",
        "Confidential support pathways for those affected",
    ],
    image_url: "/images/about/chachi.jpg",
    stats: [
        { value: "50+", label: "organizations supported" },
        { value: "2,000+", label: "professionals trained" },
        { value: "100%", label: "confidential first response" },
    ],
};

// ✅ helper: make title like "About WE" where WE is highlighted
function splitTitle(title) {
    const t = (title || "").trim();
    if (!t) return { before: "About", highlight: "WE" };

    const parts = t.split(" ");
    if (parts.length === 1) return { before: "", highlight: parts[0] };

    return {
        before: parts.slice(0, -1).join(" "),
        highlight: parts[parts.length - 1],
    };
}

export default function About() {
    const hero = useInView();
    const left = useInView();
    const right = useInView();
    const stats = useInView();

    const [remote, setRemote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    useEffect(() => {
        let ignore = false;

        async function load() {
            try {
                setErr("");
                setLoading(true);

                const res = await fetch(`${BASE_URL}/api/about/about`);
                if (!res.ok) throw new Error("Failed to load About data");
                const data = await res.json();

                if (!ignore) setRemote(data);
            } catch (e) {
                if (!ignore) {
                    setErr(e?.message || "Failed to load About data");
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
    }, []);

    const content = useMemo(() => {
        if (!remote) return FALLBACK;

        return {
            title: remote.title || FALLBACK.title,
            lead: remote.lead || FALLBACK.lead,
            story_title: remote.story_title || FALLBACK.story_title,
            story_body: remote.story_body || FALLBACK.story_body,
            whatwedo_title: remote.whatwedo_title || FALLBACK.whatwedo_title,

            // accept text[] OR string (newline)
            whatwedo_points:
                Array.isArray(remote.whatwedo_points) && remote.whatwedo_points.length
                    ? remote.whatwedo_points
                    : typeof remote.whatwedo_points === "string"
                        ? remote.whatwedo_points.split("\n").filter(Boolean)
                        : FALLBACK.whatwedo_points,

            image_url: remote.image_url || FALLBACK.image_url,

            // accept array OR fallback
            stats:
                Array.isArray(remote.stats) && remote.stats.length
                    ? remote.stats
                    : FALLBACK.stats,
        };
    }, [remote]);

    const heading = splitTitle(content.title);

    return (
        <section id="about" className="about-hero">
            <div className="about-inner">
                <h1
                    ref={hero.ref}
                    className={`about-title reveal-up ${hero.inView ? "in" : ""}`}
                >
                    {heading.before} <span>{heading.highlight}</span>
                </h1>

                <p className={`about-lead reveal-fade ${hero.inView ? "in" : ""}`}>
                    {content.lead}
                </p>

                {loading ? <p style={{ opacity: 0.7 }}>Loading…</p> : null}
                {err ? <p style={{ color: "crimson" }}>{err}</p> : null}
            </div>

            <div className="about-grid">
                <article
                    ref={left.ref}
                    className={`about-card reveal-left ${left.inView ? "in" : ""}`}
                >
                    <div className="about-rich">
                        <h2>{content.story_title}</h2>
                        <p>{content.story_body}</p>

                        <h3>{content.whatwedo_title}</h3>
                        <ul>
                            {content.whatwedo_points.map((li, i) => (
                                <li key={i}>{li}</li>
                            ))}
                        </ul>
                    </div>
                </article>

                <figure
                    ref={right.ref}
                    className={`about-photo reveal-right ${right.inView ? "in" : ""}`}
                >
                    <img src={content.image_url} alt="WE community" />
                </figure>
            </div>

            <div
                ref={stats.ref}
                className={`about-stats reveal-up ${stats.inView ? "in" : ""}`}
            >
                {content.stats.map((s, i) => (
                    <div key={i}>
                        <strong>{s.value}</strong>
                        <span>{s.label}</span>
                    </div>
                ))}
            </div>
        </section>
    );
}
