// Tests du format des fichiers de champs (sans ComfyUI) :
//     node --test tests/test_help_search.mjs tests/test_fields_format.mjs
import test from "node:test";
import assert from "node:assert/strict";
import { exportFileName, buildExport, parseFieldsFile } from "../web/js/fields_format.js";

test("nom date en prefixe", () => {
    assert.equal(exportFileName(new Date(2026, 9, 7, 4, 5, 6)), "20261007-040506_multifileselect_fields.json");
});

test("export JSON relu a l'identique", () => {
    const text = buildExport([
        { field: 1, type: "diffusion_models", path: "C:\\Mod\u00e8les\\a.safetensors" },
        { field: 6, type: "loras", path: "b.safetensors" },
    ]);
    const data = JSON.parse(text);
    assert.equal(data.format, "MultiFiles Select");
    assert.equal(data.version, 1);
    const back = parseFieldsFile(text, 7);
    assert.deepEqual(back[1], { modelType: "diffusion_models", fieldValue: "C:\\Mod\u00e8les\\a.safetensors" });
    assert.deepEqual(back[6], { modelType: "loras", fieldValue: "b.safetensors" });
    assert.deepEqual(back[2], { modelType: "", fieldValue: "" });
    assert.equal(back.length, 8);
});

test("numeros hors limites ignores", () => {
    const text = JSON.stringify({ format: "MultiFiles Select", version: 1, fields: [
        { field: 0, type: "x", path: "x" }, { field: 9, type: "y", path: "y" }, { field: "2", type: "t", path: "p" },
    ] });
    const back = parseFieldsFile(text, 7);
    assert.deepEqual(back[2], { modelType: "t", fieldValue: "p" });
    assert.ok(back.every((r, i) => i === 2 || r.fieldValue === ""));
});

test("ancien format .txt toujours lu", () => {
    const back = parseFieldsFile("1 - loras : a\\b.safetensors\r\n7 - vae : c:d.safetensors\n", 7);
    assert.deepEqual(back[1], { modelType: "loras", fieldValue: "a\\b.safetensors" });
    assert.deepEqual(back[7], { modelType: "vae", fieldValue: "c:d.safetensors" });
});

test("BOM accepte", () => {
    const back = parseFieldsFile("\uFEFF" + buildExport([{ field: 3, type: "vae", path: "v" }]), 7);
    assert.equal(back[3].fieldValue, "v");
});

test("JSON invalide ou etranger refuse", () => {
    assert.throws(() => parseFieldsFile("{ pas du json", 7), /Invalid JSON/);
    assert.throws(() => parseFieldsFile('{"format": "Autre", "fields": []}', 7), /Not a MultiFiles Select/);
});
