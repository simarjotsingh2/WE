import { useEffect, useMemo, useState } from "react";
import { adminFetch } from "../lib/adminApi";
import "./admin.css";

const TABLES = [
    "about_sections",
    "about_stats",
    "gallery_items",
    "hero_sections",
    "nav_items",
    "services_page_items",
    "what_we_do_items",
];

function isAutoColumn(col) {
    const n = col.column_name;
    return (
        n === "id" ||
        n === "created_at" ||
        (col.column_default || "").includes("gen_random_uuid") ||
        (col.column_default || "").includes("now()")
    );
}

function looksLikeLongText(col) {
    // you can add more conditions if needed
    return col.data_type === "text";
}

function safeString(v) {
    if (v === null || v === undefined) return "";
    if (typeof v === "object") return JSON.stringify(v);
    return String(v);
}

/** Detect fields that should allow media upload */
function isMediaColumn(name) {
    const n = name.toLowerCase();
    return (
        n.includes("image") ||
        n.includes("video") ||
        n.includes("thumbnail") ||
        n.includes("banner") ||
        n.includes("bg_") ||
        n.endsWith("_url") ||
        n.endsWith("_path")
    );
}

function acceptForColumn(name) {
    const n = name.toLowerCase();
    if (n.includes("video")) return "video/*";
    // allow both for generic url fields
    return "image/*,video/*";
}

function isVideoUrl(url) {
    return /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(url || "");
}

function isImageUrl(url) {
    return /\.(png|jpe?g|webp|gif|svg)(\?|#|$)/i.test(url || "");
}

export default function AdminDashboard() {
    const [table, setTable] = useState(TABLES[0]);
    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");

    const [query, setQuery] = useState("");

    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({});

    // upload state
    const [uploadingField, setUploadingField] = useState(""); // column name being uploaded
    const [uploadPct, setUploadPct] = useState(0); // (optional visual, we set 0/100)

    const editableColumns = useMemo(
        () => columns.filter((c) => !isAutoColumn(c)),
        [columns]
    );

    const filteredRows = useMemo(() => {
        if (!query.trim()) return rows;
        const q = query.toLowerCase();
        return rows.filter((r) =>
            columns.some((c) => safeString(r[c.column_name]).toLowerCase().includes(q))
        );
    }, [rows, columns, query]);

    async function load() {
        setErr("");
        setLoading(true);
        try {
            const schema = await adminFetch(`/api/admin/schema/${table}`);
            setColumns(schema.columns);

            const data = await adminFetch(`/api/admin/${table}`);
            setRows(data);
        } catch (e) {
            setErr(e.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, [table]);

    function openAdd() {
        setEditing(null);
        const empty = {};
        editableColumns.forEach((c) => (empty[c.column_name] = ""));
        setForm(empty);
        setFormOpen(true);
    }

    function openEdit(row) {
        setEditing(row);
        const copy = {};
        editableColumns.forEach((c) => {
            const v = row[c.column_name];
            copy[c.column_name] = v === null || v === undefined ? "" : safeString(v);
        });
        setForm(copy);
        setFormOpen(true);
    }

    function setField(name, value) {
        setForm((prev) => ({ ...prev, [name]: value }));
    }

    function parseValue(col, value) {
        if (value === "") return null;

        const t = col.data_type;

        if (
            t.includes("int") ||
            t.includes("numeric") ||
            t.includes("double") ||
            t.includes("real")
        ) {
            const num = Number(value);
            return Number.isNaN(num) ? null : num;
        }

        if (t === "boolean") {
            // support true/false strings
            return value === true || value === "true";
        }

        if (t === "json" || t === "jsonb") {
            try {
                return JSON.parse(value);
            } catch {
                return null;
            }
        }

        return value;
    }

    async function save() {
        setErr("");
        try {
            const payload = {};
            editableColumns.forEach((col) => {
                payload[col.column_name] = parseValue(col, form[col.column_name]);
            });

            if (editing?.id) {
                await adminFetch(`/api/admin/${table}/${editing.id}`, {
                    method: "PATCH",
                    body: JSON.stringify(payload),
                });
            } else {
                await adminFetch(`/api/admin/${table}`, {
                    method: "POST",
                    body: JSON.stringify(payload),
                });
            }

            setFormOpen(false);
            await load();
        } catch (e) {
            setErr(e.message);
        }
    }

    async function removeRow(row) {
        if (!confirm("Delete this row?")) return;
        try {
            await adminFetch(`/api/admin/${table}/${row.id}`, { method: "DELETE" });
            await load();
        } catch (e) {
            setErr(e.message);
        }
    }

    /** Upload media -> backend -> get publicUrl -> save into field */
    async function uploadToStorage(file, folder) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("folder", folder);

        const res = await adminFetch("/api/admin/upload", {
            method: "POST",
            body: fd,
        });

        return res.publicUrl; // returned by backend
    }

    /** Render a preview for url in a field */
    function renderMediaPreview(url) {
        if (!url || typeof url !== "string") return null;

        // Supabase public urls often don't end with extension; still show if image/video.
        const isHttp = url.startsWith("http");

        if (isHttp && (isVideoUrl(url) || url.includes("video"))) {
            return (
                <video
                    src={url}
                    controls
                    style={{
                        width: 260,
                        maxWidth: "100%",
                        borderRadius: 12,
                        border: "1px solid #e5e7eb",
                    }}
                />
            );
        }

        if (isHttp && (isImageUrl(url) || url.includes("image") || url.includes("we-media"))) {
            return (
                <img
                    src={url}
                    alt="preview"
                    style={{
                        width: 180,
                        height: 110,
                        objectFit: "cover",
                        borderRadius: 12,
                        border: "1px solid #e5e7eb",
                    }}
                />
            );
        }

        // local path preview (only if your app serves it)
        if (!isHttp && url.startsWith("/images/")) {
            return (
                <img
                    src={url}
                    alt="preview"
                    style={{
                        width: 180,
                        height: 110,
                        objectFit: "cover",
                        borderRadius: 12,
                        border: "1px solid #e5e7eb",
                    }}
                />
            );
        }

        return null;
    }

    return (
        <div className="adminShell">
            {/* Sidebar */}
            <aside className="adminSidebar">
                <div className="adminBrand">
                    <div className="dot" />
                    <h2>WE Admin Panel</h2>
                </div>

                <div className="adminNavTitle">Tables</div>

                {TABLES.map((t) => (
                    <button
                        key={t}
                        className={`adminNavBtn ${t === table ? "active" : ""}`}
                        onClick={() => {
                            setTable(t);
                            setQuery("");
                        }}
                    >
                        <span>{t}</span>
                        <span className="pill">{t === table ? "OPEN" : ""}</span>
                    </button>
                ))}

                <button
                    className="adminLogout"
                    onClick={() => {
                        localStorage.removeItem("sb_token");
                        window.location.href = "/admin-login";
                    }}
                >
                    Logout
                </button>
            </aside>

            {/* Main */}
            <main className="adminMain">
                <div className="adminTopbar">
                    <div className="adminTitleWrap">
                        <h1>{table}</h1>
                        <p>Manage rows — add, edit, delete (connected to Supabase)</p>
                    </div>

                    <div className="adminActions">
                        <input
                            className="adminSearch"
                            placeholder="Search in this table…"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <button className="btnPrimary" onClick={openAdd}>
                            + Add
                        </button>
                    </div>
                </div>

                {err && <p style={{ color: "#ef4444", marginTop: 6 }}>{err}</p>}

                <div className="adminCard">
                    <div className="tableWrap">
                        {loading ? (
                            <div style={{ padding: 16 }}>Loading…</div>
                        ) : (
                            <table className="adminTable">
                                <thead>
                                    <tr>
                                        {columns.map((c) => (
                                            <th key={c.column_name}>{c.column_name}</th>
                                        ))}
                                        <th>actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRows.map((r) => (
                                        <tr key={r.id}>
                                            {columns.map((c) => {
                                                const raw = r[c.column_name];
                                                const text = safeString(raw);
                                                const isLong = text.length > 120;

                                                return (
                                                    <td key={c.column_name}>
                                                        <div
                                                            className={isLong ? "cellClamp" : ""}
                                                            title={text}
                                                        >
                                                            {text || (
                                                                <span className="cellSmall">—</span>
                                                            )}
                                                        </div>
                                                    </td>
                                                );
                                            })}

                                            <td style={{ whiteSpace: "nowrap" }}>
                                                <button
                                                    className="btnGhost btnSmall"
                                                    onClick={() => openEdit(r)}
                                                    style={{ marginRight: 8 }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="btnDanger btnSmall"
                                                    onClick={() => removeRow(r)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                    {!filteredRows.length && (
                                        <tr>
                                            <td colSpan={columns.length + 1} style={{ padding: 16 }}>
                                                No results.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Modal */}
                {formOpen && (
                    <div className="modalOverlay" onClick={() => setFormOpen(false)}>
                        <div className="modalCard" onClick={(e) => e.stopPropagation()}>
                            <div className="modalHeader">
                                <h3>{editing ? "Edit Row" : "Add Row"}</h3>
                                <button
                                    className="btnGhost btnSmall"
                                    onClick={() => setFormOpen(false)}
                                >
                                    Close
                                </button>
                            </div>

                            <div className="modalBody">
                                <div className="formGrid">
                                    {editableColumns.map((col) => {
                                        const colName = col.column_name;
                                        const val = form[colName] ?? "";
                                        const media = isMediaColumn(colName);

                                        return (
                                            <div className="formField" key={colName}>
                                                <label>
                                                    {colName}{" "}
                                                    <span style={{ opacity: 0.6 }}>
                                                        ({col.data_type})
                                                    </span>
                                                </label>

                                                {/* ✅ Media uploader UI */}
                                                {media ? (
                                                    <div style={{ display: "grid", gap: 8 }}>
                                                        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                                                            <input
                                                                type="file"
                                                                accept={acceptForColumn(colName)}
                                                                disabled={!!uploadingField && uploadingField !== colName}
                                                                onChange={async (e) => {
                                                                    const file = e.target.files?.[0];
                                                                    if (!file) return;

                                                                    try {
                                                                        setErr("");
                                                                        setUploadingField(colName);
                                                                        setUploadPct(0);

                                                                        // folder = table name (organized)
                                                                        const url = await uploadToStorage(file, table);
                                                                        setUploadPct(100);
                                                                        setField(colName, url);
                                                                    } catch (err) {
                                                                        setErr(err.message);
                                                                    } finally {
                                                                        setUploadingField("");
                                                                        // reset input so same file can re-upload
                                                                        e.target.value = "";
                                                                    }
                                                                }}
                                                            />

                                                            {uploadingField === colName && (
                                                                <span className="cellSmall">
                                                                    Uploading… {uploadPct}%
                                                                </span>
                                                            )}
                                                        </div>

                                                        {/* Preview */}
                                                        {renderMediaPreview(val)}

                                                        {/* Also allow manual URL */}
                                                        <input
                                                            value={val}
                                                            onChange={(e) => setField(colName, e.target.value)}
                                                            placeholder="(or paste a URL)"
                                                        />
                                                    </div>
                                                ) : looksLikeLongText(col) ? (
                                                    <textarea
                                                        value={val}
                                                        onChange={(e) => setField(colName, e.target.value)}
                                                    />
                                                ) : (
                                                    <input
                                                        value={val}
                                                        onChange={(e) => setField(colName, e.target.value)}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="modalFooter">
                                <button className="btnGhost" onClick={() => setFormOpen(false)}>
                                    Cancel
                                </button>
                                <button className="btnPrimary" onClick={save}>
                                    {editing ? "Save Changes" : "Create Row"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
