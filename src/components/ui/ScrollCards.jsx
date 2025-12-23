"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

/**
 * One sticky, full-screen card driven by a per-card scroll window.
 * Matches the 21st.dev feel: subtle scale, rotate, y-shift, fade-in.
 */
function Card({ title, description, color, textColor, src, range, progress }) {
    // Parallax transforms (tuned to the demo’s vibe)
    const scale = useTransform(progress, range, [0.94, 1.06]);
    const rotate = useTransform(progress, range, [-3, 0]);
    const y = useTransform(progress, range, [90, -90]);
    const opacity = useTransform(progress, range, [0.65, 1]);

    return (
        <div className="relative h-[175vh] md:h-[210vh]">
            <motion.div
                style={{ scale, rotate, y, opacity }}
                className="h-screen sticky top-0 flex items-center justify-center px-4 md:px-0"
            >
                <div
                    className="relative mx-auto flex h-[300px] w-[700px] md:h-[420px] md:w-[640px]
                     flex-col items-center justify-center shadow-md
                     px-10 py-12 md:px-12 pr-3 pl-3 pt-3 pb-4 overflow-hidden"
                    style={{ backgroundColor: color }}
                >
                    {/* BG image */}
                    <img
                        src={src}
                        alt={title}
                        className="absolute inset-0 h-full w-full object-cover -z-10"
                        loading="lazy"
                    />

                    {/* Text */}
                    <span className="font-bold relative text-5xl md:text-7xl mt-5">
                        <span
                            className="relative z-10 font-tiemposHeadline font-black tracking-tight"
                            style={{ color: textColor }}
                        >
                            {title}
                        </span>
                    </span>

                    <div
                        className="font-manrope text-lg md:text-2xl font-medium text-center mb-0 z-10 mt-2 lowercase tracking-wide"
                        style={{ lineHeight: 1.4, color: textColor }}
                    >
                        {description}
                    </div>

                    {/* very subtle overlay for readability (0 keeps it clean) */}
                    <div className="pointer-events-none absolute inset-0 z-0 bg-black/0" />
                </div>
            </motion.div>
        </div>
    );
}

function CardsParallax({ items }) {
    const ref = useRef(null);

    // Overall section progress
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end end"],
    });

    // Tight per-card windows so each card animates near center of viewport
    const ranges = items.map((_, i) => {
        const n = items.length;
        const start = i / n;
        const end = (i + 1) / n;
        const pad = 0.12; // adjust for snappier/slower transitions
        return [Math.max(0, start + pad), Math.min(1, end - pad)];
        // e.g., card 0 animates ~[0.12, 0.88/n], card 1 ~[1/n+pad, 2/n-pad], etc.
    });

    return (
        <section ref={ref} className="relative">
            {items.map((item, i) => (
                <Card
                    key={`scroll-card-${i}`}
                    {...item}
                    range={ranges[i]}
                    progress={scrollYProgress}
                />
            ))}
        </section>
    );
}

export { CardsParallax };
