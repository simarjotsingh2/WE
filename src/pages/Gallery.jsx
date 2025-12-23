// src/pages/Gallery.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import "../components/Gallery.css"; // reuse same CSS file
import GalleryModal from "../components/GalleryModal";
import Navbar from "../components/Navbar";
import { galleryChapters } from "../data/galleryData";

export default function Gallery() {
    const [active, setActive] = useState(null);
    const [open, setOpen] = useState(false);

    const cardsRef = useRef([]);
    cardsRef.current = [];

    const chapters = useMemo(() => galleryChapters, []);

    const addCardRef = (el) => {
        if (el && !cardsRef.current.includes(el)) cardsRef.current.push(el);
    };

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
        <>
        <Navbar />
        
        <main className="g-wrap">
            <header className="g-hero">
                <div className="g-heroInner">
                    <div className="g-badge">CINEMATIC GALLERY</div>
                    <h1 className="g-title">Our Story, in Chapters</h1>
                    <p className="g-lead">
                        Scroll through our moments — tap any chapter to open the full memory.
                    </p>
                </div>
                <div className="g-glow" aria-hidden="true" />
            </header>

            <section className="g-timeline" aria-label="Gallery timeline">
                {chapters.map((c, i) => (
                    <article
                        key={c.id}
                        ref={addCardRef}
                        className={`g-card ${i % 2 === 0 ? "is-left" : "is-right"}`}
                    >
                        <div className="g-line" aria-hidden="true" />

                        <div className="g-cardInner">
                            <button className="g-coverBtn" onClick={() => openChapter(c)} aria-label={`Open ${c.title}`}>
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
        </>
    );
}
