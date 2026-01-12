const API = (import.meta.env.VITE_API_URL || "http://localhost:8000").replace(/\/+$/, "");

async function getJson(path, errorMsg) {
    const res = await fetch(`${API}${path}`);
    if (!res.ok) throw new Error(`${errorMsg} (${res.status})`);
    return res.json();
}

export function getHealth() {
    // ✅ backend is /health (not /api/health)
    return getJson("/health", "Health check failed");
}

export function getGallery() {
    return getJson("/api/gallery", "Failed to load gallery");
}

export function getServices() {
    return getJson("/api/services", "Failed to load services");
}

// ✅ Add these because your app is calling them (from your console)
export function getNav() {
    return getJson("/api/nav", "Failed to load nav");
}

export function getHeroHome() {
    return getJson("/api/hero/home", "Failed to load hero");
}

// ✅ Your backend works on /api/about (you tested it)
export function getAbout() {
    return getJson("/api/about", "Failed to load about");
}

// ✅ Only if you need slug based route
export function getAboutBySlug(slug) {
    return getJson(`/api/about/${encodeURIComponent(slug)}`, "Failed to load about");
}

export function getServicesPage() {
    return getJson("/api/services-page", "Failed to load services page");
}
