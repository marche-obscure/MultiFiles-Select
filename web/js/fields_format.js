// Format des fichiers de champs (export / import). Module sans dependance a
// ComfyUI, teste par tests/test_fields_format.mjs.

export const EXPORT_FORMAT = "MultiFiles Select";
export const EXPORT_VERSION = 1;

const pad = (n) => String(n).padStart(2, "0");

/** Nom de l'export, date en prefixe : "20261017-143000_multifileselect_fields.json". */
export function exportFileName(date) {
    const d = date || new Date();
    return (
        d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) + "-" +
        pad(d.getHours()) + pad(d.getMinutes()) + pad(d.getSeconds()) +
        "_multifileselect_fields.json"
    );
}

/**
 * Texte JSON de l'export. rows = [{field, type, path}] (champs remplis
 * seulement, dans l'ordre).
 */
export function buildExport(rows) {
    return JSON.stringify({
        format: EXPORT_FORMAT,
        version: EXPORT_VERSION,
        fields: rows.map((r) => ({ field: r.field, type: r.type || "", path: r.path || "" })),
    }, null, 2) + "\n";
}

/**
 * Lit un fichier de champs : JSON (export actuel) ou ancien .txt
 * ("N - Type : chemin"). Renvoie un tableau indexe 1..maxFields de
 * {modelType, fieldValue} (chaines vides si le numero est absent).
 * Leve une Error si le JSON est illisible ou n'est pas un export du noeud.
 */
export function parseFieldsFile(text, maxFields) {
    const out = [];
    for (let i = 0; i <= maxFields; i++) out.push({ modelType: "", fieldValue: "" });
    const src = String(text || "").replace(/^﻿/, "");
    if (src.trim().startsWith("{")) {
        let data;
        try {
            data = JSON.parse(src);
        } catch (e) {
            throw new Error("Invalid JSON file.");
        }
        if (!data || data.format !== EXPORT_FORMAT || !Array.isArray(data.fields)) {
            throw new Error("Not a MultiFiles Select fields file.");
        }
        for (const f of data.fields) {
            const n = Number(f && f.field);
            if (!Number.isInteger(n) || n < 1 || n > maxFields) continue;
            out[n] = {
                modelType: String((f && f.type) || "").trim(),
                fieldValue: String((f && f.path) || "").trim(),
            };
        }
        return out;
    }
    // Ancien format .txt : une ligne par champ, coupee au premier ":".
    const lines = src.split(/\r?\n/);
    for (let i = 1; i <= maxFields; i++) {
        const re = new RegExp(`^\\s*${i}\\s*-\\s*(.*?)\\s*:\\s*(.*)$`);
        for (const line of lines) {
            const m = line.match(re);
            if (m) {
                out[i] = { modelType: (m[1] || "").trim(), fieldValue: (m[2] || "").trim() };
                break;
            }
        }
    }
    return out;
}
