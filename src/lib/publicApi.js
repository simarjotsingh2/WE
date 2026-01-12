const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function getHealth() {
    const res = await fetch(`${BASE_URL}/api/health`);
    if (!res.ok) throw new Error("Health check failed");
    return res.json();
}

export async function getGallery() {
    const res = await fetch(`${BASE_URL}/api/gallery`);
    if (!res.ok) throw new Error("Failed to load gallery");
    return res.json();
}

export async function getServices() {
    const res = await fetch(`${BASE_URL}/api/services`);
    if (!res.ok) throw new Error("Failed to load services");
    return res.json();
}