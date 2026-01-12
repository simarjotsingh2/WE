// src/pages/Gallery.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import "../components/Gallery.css";
import GalleryModal from "../components/GalleryModal";

// ✅ fallback items (your current hardcoded data)
const FALLBACK_GALLERY_ITEMS = [
    { id: "1", title: "Awareness Session", imageUrl: "/images/gallery/we-1.png", tags: ["Workshop"] },
    { id: "2", title: "Another session", imageUrl: "/images/gallery/we-2.png", tags: ["Training"] },
    { id: "3", title: "Awareness Session", imageUrl: "/images/gallery/we-2.png", tags: ["Training"] },
    { id: "4", title: "Community Outreach", imageUrl: "/images/gallery/we-3.png", tags: ["Community"] },
    { id: "5", title: "Community Outreach", imageUrl: "/images/gallery/community-2.jpg", tags: ["Community"] },
];

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ✅ Normalize backend items into frontend shape (KEEP meta fields!)
function normalizeGallery(items, fallback) {
    if (!Array.isArray(items) || items.length === 0) return fallback;

    return items.map((it, idx) => ({
        id: String(it?.id ?? idx + 1),
        title: (it?.title || "Untitled").trim(),
        imageUrl: it?.imageUrl || it?.image || fallback?.[idx]?.imageUrl || "",
        tags: Array.isArray(it?.tags)
            ? it.tags
            : typeof it?.tags === "string"
                ? it.tags.split(",").map((t) => t.trim()).filter(Boolean)
                : [],

        // ✅ IMPORTANT: keep these from API
        year: it?.year ?? "",
        subtitle: it?.subtitle ?? "",
        quote: it?.quote ?? "",
    }));
}

export default function Gallery() {
    const [active, setActive] = useState(null);
    const [open, setOpen] = useState(false);

    const [remoteItems, setRemoteItems] = useState(null);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    const cardsRef = useRef([]);
    cardsRef.current = [];

    const addCardRef = (el) => {
        if (el && !cardsRef.current.includes(el)) cardsRef.current.push(el);
    };

    // ✅ Fetch gallery from backend
    useEffect(() => {
        let ignore = false;

        async function load() {
            try {
                setErr("");
                setLoading(true);

                const res = await fetch(`${BASE_URL}/api/gallery`);
                if (!res.ok) throw new Error("Failed to load gallery");

                const data = await res.json();
                if (!ignore) setRemoteItems(data);
            } catch (e) {
                if (!ignore) {
                    setErr(e?.message || "Failed to load gallery");
                    setRemoteItems(null);
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

    // ✅ Use remote if available, else fallback
    const galleryItems = useMemo(() => {
        return normalizeGallery(remoteItems, FALLBACK_GALLERY_ITEMS);
    }, [remoteItems]);

    // ✅ Helper: pick meta for a chapter from ANY row that has it
    const pickMetaForKey = (items, key) => {
        // Prefer an item that has any meta filled
        const found = items.find((x) => {
            const k = (x?.title || "").trim().toLowerCase();
            return k === key && (x.year || x.subtitle || x.quote);
        });
        if (found) return found;

        // fallback: any item in chapter
        return items.find((x) => (x?.title || "").trim().toLowerCase() === key) || null;
    };

    // ✅ Build chapters from items
    const chapters = useMemo(() => {
        const map = new Map();

        for (const item of galleryItems) {
            const title = (item.title || "Untitled Chapter").trim();
            const key = title.toLowerCase();

            if (!map.has(key)) {
                const meta = pickMetaForKey(galleryItems, key);

                map.set(key, {
                    id: `chapter-${key.replace(/\s+/g, "-")}`,
                    year: meta?.year || "2025",
                    title,
                    subtitle: meta?.subtitle || "Chapter moments",
                    quote: meta?.quote || "More memories, more strength.",
                    cover: item.imageUrl, // cover stays first image
                    images: [],
                });
            }

            const ch = map.get(key);
            if (item.imageUrl) ch.images.push(item.imageUrl);
        }

        return Array.from(map.values());
    }, [galleryItems]);

    // ✅ Intersection animation
    useEffect(() => {
        const els = cardsRef.current;
        if (!els.length) return;

        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) e.target.classList.add("is-in");
                });
            },
            { threshold: 0.15 }
        );

        els.forEach((el) => io.observe(el));
        return () => io.disconnect();
    }, [chapters.length]);

    const openChapter = (chapter) => {
        setActive(chapter);
        setOpen(true);
    };

    const close = () => setOpen(false);

    return (
        <main className="g-wrap">
            <header className="g-hero">
                <div className="g-heroInner">
                    <div className="g-badge">CINEMATIC GALLERY</div>
                    <h1 className="g-title">Our Story, in Chapters</h1>
                    <p className="g-lead">
                        Scroll through our moments — tap any chapter to open the full memory.
                    </p>

                    {loading ? (
                        <p className="g-lead" style={{ opacity: 0.7 }}>
                            Loading gallery…
                        </p>
                    ) : null}
                    {err ? (
                        <p className="g-lead" style={{ color: "crimson" }}>
                            {err}
                        </p>
                    ) : null}
                </div>
                <div className="g-glow" aria-hidden="true" />
            </header>

            <section className="g-timeline">
                {chapters.map((c, i) => (
                    <article
                        key={c.id}
                        ref={addCardRef}
                        className={`g-card ${i % 2 === 0 ? "is-left" : "is-right"}`}
                    >
                        <div className="g-line" />

                        <div className="g-cardInner">
                            <button
                                className="g-coverBtn"
                                onClick={() => openChapter(c)}
                                aria-label={`Open ${c.title}`}
                            >
                                <img className="g-cover" src={c.cover} alt={c.title} loading="lazy" />
                                <div className="g-coverOverlay" />
                                <div className="g-coverHint">Open Chapter →</div>
                            </button>

                            <div className="g-meta">
                                <div className="g-year">{c.year}</div>
                                <h2 className="g-chTitle">{c.title}</h2>
                                <p className="g-sub">{c.subtitle}</p>

                                <div className="g-quote">
                                    <span>“{c.quote}”</span>
                                </div>

                                <div className="g-actions">
                                    <button className="g-primary" onClick={() => openChapter(c)}>
                                        View Moments
                                    </button>
                                    <span className="g-mini">{c.images.length} photos</span>
                                </div>
                            </div>
                        </div>
                    </article>
                ))}
            </section>

            <footer className="g-footer">
                <div className="g-footerInner">
                    <div className="g-footerTitle">More chapters coming…</div>
                    <div className="g-footerSub">Because our story is still being written.</div>
                </div>
            </footer>

            <GalleryModal open={open} chapter={active} onClose={close} />
        </main>
    );
}
