const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function adminFetch(path, options = {}) {
    const token = localStorage.getItem("sb_token");
    const isFormData = options.body instanceof FormData;

    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            ...(isFormData ? {} : { "Content-Type": "application/json" }),
            ...(options.headers || {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Admin API error");
    return data;
}
