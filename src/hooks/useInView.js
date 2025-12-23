import { useEffect, useRef, useState } from "react";

export default function useInView(options = { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // If IntersectionObserver isn’t supported, show immediately
        if (!("IntersectionObserver" in window)) {
            setInView(true);
            return;
        }

        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setInView(true);
                obs.unobserve(el); // animate once
            }
        }, options);

        obs.observe(el);
        return () => obs.disconnect();
    }, [options]);

    return { ref, inView };
}
