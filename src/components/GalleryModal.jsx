// src/components/GalleryModal.jsx
import { useEffect, useMemo, useState } from "react";
import "./Gallery.css";

export default function GalleryModal({ open, chapter, onClose }) {
    const images = useMemo(() => chapter?.images || [], [chapter]);
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        if (open) setIdx(0);
    }, [open, chapter?.id]);

    useEffect(() => {
        if (!open) return;

        const onKey = (e) => {
            if (e.key === "Escape") onClose?.();
            if (e.key === "ArrowRight") setIdx((v) => Math.min(v + 1, images.length - 1));
            if (e.key === "ArrowLeft") setIdx((v) => Math.max(v - 1, 0));
        };

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, images.length, onClose]);

    if (!open || !chapter) return null;

    const canPrev = idx > 0;
    const canNext = idx < images.length - 1;

    const stop = (e) => e.stopPropagation();

    return (
        <div className="gm-backdrop" onClick={onClose} role="dialog" aria-modal="true">
            <div className="gm-modal" onClick={stop}>
                <div className="gm-head">
                    <div>
                        <div className="gm-kicker">{chapter.year} • {chapter.title}</div>
                        <div className="gm-sub">{chapter.subtitle}</div>
                    </div>
                    <button className="gm-close" onClick={onClose} aria-label="Close">✕</button>
                </div>

                <div className="gm-body">
                    <button
                        className="gm-nav"
                        onClick={() => setIdx((v) => Math.max(v - 1, 0))}
                        disabled={!canPrev}
                        aria-label="Previous"
                        title="Previous"
                    >
                        ‹
                    </button>

                    <div className="gm-stage">
                        <img
                            className="gm-img"
                            src={images[idx]}
                            alt={`${chapter.title} ${idx + 1}`}
                            loading="eager"
                            draggable="false"
                        />
                        <div className="gm-counter">{idx + 1} / {images.length}</div>
                    </div>

                    <button
                        className="gm-nav"
                        onClick={() => setIdx((v) => Math.min(v + 1, images.length - 1))}
                        disabled={!canNext}
                        aria-label="Next"
                        title="Next"
                    >
                        ›
                    </button>
                </div>

                <div className="gm-strip">
                    {images.map((src, i) => (
                        <button
                            key={src}
                            className={`gm-thumb ${i === idx ? "is-active" : ""}`}
                            onClick={() => setIdx(i)}
                            aria-label={`Open image ${i + 1}`}
                        >
                            <img src={src} alt="" loading="lazy" draggable="false" />
                        </button>
                    ))}
                </div>

                <div className="gm-quote">“{chapter.quote}”</div>
            </div>
        </div>
    );
}
