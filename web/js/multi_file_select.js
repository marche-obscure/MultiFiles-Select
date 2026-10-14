import { app } from "../../scripts/app.js";

const NODE_NAME = "MultiFileSelect";

const TITLE_COLOR = "#3eaca5";
const BODY_COLOR = "#097267";
const VIOLET = "#6a5fd3";
const PINK = "#d35fa8";
const ORANGE = "#e0793c";
const GREEN = "#43a047";
const INACTIVE_BG = "#2a2a2a";
const INACTIVE_FG = "#888";

// 5 champs de base + 2 champs optionnels ajoutes a la demande (bouton
// "+"), un par un, chacun avec sa propre sortie ("Option 1", "Option 2").
const BASE_FIELDS = 5;
const MAX_FIELDS = 7;
const OPTION_OUTPUT_NAMES = ["Option 1", "Option 2"];
// Hauteur ajoutee au noeud par option : une ligne de champ (~26px) plus
// une ligne de sortie sur le canvas (~20px).
const OPTION_ROW_HEIGHT = 46;

const SEARCH_ICON =
    '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="white" ' +
    'stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' +
    '<circle cx="11" cy="11" r="7"></circle>' +
    '<line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>';

const GEAR_ICON =
    '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="white" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<circle cx="12" cy="12" r="3"></circle>' +
    '<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path>' +
    "</svg>";

const TRASH_ICON =
    '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="white" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<polyline points="3 6 5 6 21 6"></polyline>' +
    '<path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>' +
    '<path d="M10 11v6"></path><path d="M14 11v6"></path>' +
    '<path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path></svg>';

const DOWNLOAD_ICON =
    '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="white" ' +
    'stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M12 3v12"></path>' +
    '<path d="M7 10l5 5 5-5"></path>' +
    '<path d="M5 21h14"></path></svg>';

const UPLOAD_ICON =
    '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="white" ' +
    'stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M12 21V9"></path>' +
    '<path d="M7 14l5-5 5 5"></path>' +
    '<path d="M5 3h14"></path></svg>';

/**
 * Petit badge rond ou carre arrondi (comme les vrais boutons icone) a
 * inserer directement dans le texte d'aide, pour montrer l'icone reelle
 * plutot que d'ecrire son nom ("icone de televersement", etc.).
 */
function iconBadge(icon, bg, round) {
    return (
        '<span style="display:inline-flex;align-items:center;justify-content:center;' +
        "width:18px;height:18px;border-radius:" + (round ? "50%" : "4px") + ";" +
        "background:" + bg + ";vertical-align:middle;margin:0 2px;flex:0 0 auto;\">" +
        icon +
        "</span>"
    );
}

const HELP_SECTIONS = [
    {
        title: "WHAT THIS NODE DOES",
        html:
            "<p>Lets you pick up to <b>5 files</b> (7 with the two " +
            "optional fields) from the same origin directory, without " +
            "typing paths by hand. Each chosen file is stored in a " +
            "numbered field, as an absolute or relative path depending " +
            "on the mode active when it was selected.</p>",
    },
    {
        title: "HOW TO USE IT",
        html:
            "<ul>" +
            "<li>The <b>ComfyUI folder shortcut...</b> drop-down, at the " +
            "top, instantly fills <b>Origin directory</b> with a standard " +
            "folder of your installation (root, models, output, input, " +
            "temp, user, custom_nodes), plus <b>Models (Linker)</b> when " +
            "an extra_model_paths.yaml file exists at the ComfyUI " +
            "root.</li>" +
            "<li>Otherwise, paste the full path of the starting " +
            "directory into <b>Origin directory</b> (or use " +
            iconBadge(GEAR_ICON, VIOLET) + " to pick it with the Windows " +
            "folder browser).</li>" +
            "<li>Click " + iconBadge(SEARCH_ICON, VIOLET) + " to list the " +
            "subdirectories (only those directly containing at least " +
            "one file are shown).</li>" +
            "<li>Click a folder in the list: it goes into <b>Selected " +
            "directory</b>.</li>" +
            "<li>Choose the active field (square buttons <b>1 2 3 4 " +
            "5</b>, plus <b>6</b> and <b>7</b> when the optional fields " +
            "are added): it receives the next selected file.</li>" +
            "<li>Click " + iconBadge(SEARCH_ICON, PINK) + " to list the " +
            "files of that folder. Filter them with the extension menu " +
            "if needed (disabled automatically when the folder holds a " +
            "single extension).</li>" +
            "<li>Choose <b>Absolute</b> or <b>Relative</b>, then click a " +
            "file: it is stored in the active field in that format, and " +
            "the small <b>Type</b> field in front of it fills in " +
            'automatically when the path contains a "models" folder (it ' +
            "takes the name of the next folder, e.g. " +
            "<b>diffusion_models</b>). That field stays editable by " +
            "hand. If the main field already holds a value, a " +
            "confirmation is asked before overwriting it, with a " +
            "<b>Don't ask again</b> box to turn it off. While it is " +
            "off, a " +
            iconBadge('<b style="color:#f0c98a;font-size:10px;">C</b>', "#5a3d1a", true) +
            " icon appears between the Absolute/Relative switch and " +
            "the help button (?) to turn it back on.</li>" +
            "<li>" + iconBadge(DOWNLOAD_ICON, PINK, true) + " exports a " +
            ".txt file with one line per filled numbered field (empty " +
            'fields are skipped): "N - Type : field content", e.g. ' +
            '"1 - diffusion_models : MyFolder\\myfile.safetensors".</li>' +
            "<li>" + iconBadge(UPLOAD_ICON, PINK, true) + ", right next " +
            "to it, reloads a .txt file in the same format to fill the " +
            "fields automatically: for each number found, the matching " +
            "<b>Type</b> and main fields are filled with the values read " +
            "(overwriting their content, without confirmation). If a " +
            "number is missing from the file, or one of the two values " +
            "is empty on its line, that field is simply cleared. A " +
            "filled line 6 or 7 automatically adds the matching " +
            "optional field if it is missing.</li>" +
            "</ul>",
    },
    {
        title: "NUMBERED FIELDS 1 TO 5",
        html:
            "<p>The square buttons choose which field receives the next " +
            "selection. Only one field is active at a time.</p>" +
            "<p>A field's content is fixed when you click the file: if " +
            "you then switch between <b>Absolute</b> and " +
            "<b>Relative</b> to fill another field, the fields already " +
            "filled keep their own format.</p>" +
            "<p>Each numbered field is preceded by a small <b>Type</b> " +
            'field: it fills in automatically by looking for a "models" ' +
            "segment in the path (origin + subdirectory) and taking the " +
            "name of the folder that follows it (e.g. " +
            "<b>diffusion_models</b>). It stays empty when no " +
            '"models" segment is found, and can be edited by hand.</p>' +
            "<p>The fields remain editable by hand if needed. " +
            iconBadge(TRASH_ICON, "#6b2b2b") + " to the right of each " +
            "field clears it immediately (without confirmation), along " +
            "with its <b>Type</b> field.</p>",
    },
    {
        title: "OPTIONAL FIELDS 6 AND 7",
        html:
            "<p>" + iconBadge('<b style="color:#fff;font-size:12px;">+</b>', PINK, true) +
            ", below the fields, adds one extra field at a time: first " +
            "field <b>6</b> with the <b>Option 1</b> output, then on the " +
            "next click field <b>7</b> with the <b>Option 2</b> output. " +
            "The button disappears once both are added.</p>" +
            "<p>" + iconBadge('<b style="color:#fff;font-size:12px;">&minus;</b>', "#6b2b2b", true) +
            " removes the last added field, with its content and its " +
            "output. If that output is connected to another node, a " +
            "confirmation is asked before deleting the link(s).</p>",
    },
    {
        title: "OUTPUTS",
        html:
            "<p><b>unused 1</b> to <b>unused 5</b> &mdash; the path " +
            "stored in fields 1 to 5 (the number matches the field).</p>" +
            "<p><b>Option 1</b> / <b>Option 2</b> &mdash; present only " +
            "when optional fields 6 / 7 have been added.</p>" +
            "<p><b>Type</b> &mdash; the outputs are \"wildcard\" " +
            "outputs: they connect to any input type, but the value " +
            "passed is always a string.</p>" +
            "<p><b>Rename an output</b> &mdash; double-click its name on " +
            "the right side of the node: an input box opens " +
            "(<b>Enter</b> or a click elsewhere to validate, <b>Esc</b> " +
            "to cancel, empty = default name, <b>unused N</b> or " +
            "<b>Option N</b>). Also available by right-clicking the " +
            "node, then <b>Rename output \"...\"</b>. Either way, only " +
            "the displayed label changes (e.g. <b>Models</b>), not the " +
            "technical name ComfyUI uses at execution. The new name is " +
            "saved with the workflow.</p>",
    },
];

/**
 * Zone (coordonnees locales au noeud) de l'etiquette de la sortie i :
 * de 45% de la largeur du noeud jusqu'a son bord droit, sur la hauteur
 * d'une ligne de slot centree sur le point de connexion.
 */
function outputLabelRect(node, i) {
    const slotH = (window.LiteGraph && window.LiteGraph.NODE_SLOT_HEIGHT) || 20;
    const dot = node.getConnectionPos(false, i);
    const x = node.size[0] * 0.45;
    return {
        x: x,
        y: dot[1] - node.pos[1] - slotH / 2,
        w: node.size[0] - x,
        h: slotH,
    };
}

/** Index de la sortie dont l'etiquette est sous pos (local), sinon -1. */
function hitOutputLabel(node, pos) {
    if (!node.outputs || (node.flags && node.flags.collapsed)) return -1;
    for (let i = 0; i < node.outputs.length; i++) {
        const r = outputLabelRect(node, i);
        if (pos[0] >= r.x && pos[0] <= r.x + r.w &&
            pos[1] >= r.y && pos[1] <= r.y + r.h) {
            return i;
        }
    }
    return -1;
}

let activeOutputEditor = null;

/**
 * Ouvre un champ de saisie par-dessus l'etiquette de la sortie i.
 * Entree / clic ailleurs : valide (vide = retour au nom par defaut).
 * Echap : annule. Ne modifie que node.outputs[i].label.
 */
function openOutputLabelEditor(node, i) {
    if (activeOutputEditor) activeOutputEditor.close(true);
    const out = node.outputs[i];
    const ds = app.canvas.ds;
    const scale = ds.scale || 1;
    const canvasRect = app.canvas.canvas.getBoundingClientRect();
    const r = outputLabelRect(node, i);

    const input = document.createElement("input");
    input.type = "text";
    input.value = out.label || out.name;
    input.placeholder = out.name;
    Object.assign(input.style, {
        position: "fixed",
        left: canvasRect.left + (node.pos[0] + r.x + ds.offset[0]) * scale + "px",
        top: canvasRect.top + (node.pos[1] + r.y + ds.offset[1]) * scale + "px",
        width: r.w * scale + "px",
        height: r.h * scale + "px",
        zIndex: "10000",
        background: "#1f1f1f",
        color: "#e6e6e6",
        border: Math.max(1, 2 * scale) + "px solid " + PINK,
        borderRadius: "3px",
        padding: "0 " + 6 * scale + "px",
        font: 12 * scale + "px sans-serif",
        textAlign: "right",
        outline: "none",
        boxSizing: "border-box",
    });
    document.body.appendChild(input);

    let closed = false;
    const editor = { node: node };
    // Capture au niveau window : les raccourcis du canvas (Ctrl+Z,
    // Suppr, ...) ne doivent pas partir pendant la saisie.
    const onKey = (e) => {
        if (e.target !== input) return;
        e.stopImmediatePropagation();
        if (e.key === "Enter") {
            e.preventDefault();
            editor.close(true);
        } else if (e.key === "Escape") {
            e.preventDefault();
            editor.close(false);
        }
    };
    const onBlur = () => editor.close(true);
    editor.close = (save) => {
        if (closed) return;
        closed = true;
        window.removeEventListener("keydown", onKey, true);
        input.removeEventListener("blur", onBlur);
        if (save) {
            out.label = input.value.trim() || undefined;
            node.setDirtyCanvas(true, true);
        }
        input.remove();
        if (activeOutputEditor === editor) activeOutputEditor = null;
    };
    window.addEventListener("keydown", onKey, true);
    activeOutputEditor = editor;

    // Focus differe : le double-clic en cours de propagation rendrait
    // sinon le focus au canvas, fermant le champ aussitot ouvert.
    setTimeout(() => {
        if (closed) return;
        input.focus();
        input.select();
        input.addEventListener("blur", onBlur);
    }, 0);
}

/**
 * Positionne une carte flottante ("fixed") contre le bord droit du noeud
 * (repere par son conteneur DOM), ou contre son bord gauche si la place
 * manque a droite, avec une marge fixe : elle ne touche jamais le noeud
 * et ne se superpose jamais dessus.
 */
function positionCardNextToNode(card, container, maxWidth) {
    const rect = container.getBoundingClientRect();
    const margin = 14;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const width = Math.min(maxWidth, vw - margin * 2);

    let left = rect.right + margin;
    if (left + width + margin > vw) {
        left = rect.left - margin - width;
    }
    left = Math.max(margin, Math.min(left, vw - width - margin));

    let top = rect.top;
    const height = Math.min(card.offsetHeight || 320, vh - margin * 2);
    top = Math.max(margin, Math.min(top, vh - height - margin));

    card.style.left = left + "px";
    card.style.top = top + "px";
}

function buildHelpOverlay(container) {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "transparent";
    overlay.style.zIndex = "10000";
    overlay.style.display = "none";
    overlay.style.fontFamily = "sans-serif";

    const card = document.createElement("div");
    card.style.position = "fixed";
    card.style.background = "#181818";
    card.style.color = "#e6e6e6";
    card.style.width = "min(560px, 92vw)";
    card.style.maxHeight = "80vh";
    card.style.overflowY = "auto";
    card.style.borderRadius = "10px";
    card.style.padding = "20px 22px";
    card.style.boxShadow = "0 10px 40px rgba(0,0,0,0.5)";
    card.style.border = "1px solid #2a2a2a";

    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.alignItems = "center";
    header.style.justifyContent = "space-between";
    header.style.marginBottom = "12px";

    const titleWrap = document.createElement("div");
    const breadcrumb = document.createElement("div");
    breadcrumb.textContent = "UTILS / FILE / MULTIFILES SELECT";
    breadcrumb.style.fontSize = "10px";
    breadcrumb.style.letterSpacing = "0.06em";
    breadcrumb.style.color = TITLE_COLOR;
    breadcrumb.style.fontWeight = "700";
    breadcrumb.style.marginBottom = "4px";
    const title = document.createElement("div");
    title.textContent = "MultiFiles Select";
    title.style.fontSize = "20px";
    title.style.fontWeight = "700";
    titleWrap.appendChild(breadcrumb);
    titleWrap.appendChild(title);

    const closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.textContent = "✕";
    closeBtn.style.background = "transparent";
    closeBtn.style.border = "none";
    closeBtn.style.color = "#aaa";
    closeBtn.style.fontSize = "16px";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.lineHeight = "1";
    closeBtn.style.padding = "4px";

    header.appendChild(titleWrap);
    header.appendChild(closeBtn);
    card.appendChild(header);

    HELP_SECTIONS.forEach((section) => {
        const h = document.createElement("div");
        h.textContent = section.title;
        h.style.fontSize = "11px";
        h.style.fontWeight = "700";
        h.style.letterSpacing = "0.05em";
        h.style.color = "#7fd8cf";
        h.style.marginTop = "16px";
        h.style.marginBottom = "6px";
        card.appendChild(h);

        const body = document.createElement("div");
        body.innerHTML = section.html;
        body.style.fontSize = "13px";
        body.style.lineHeight = "1.5";
        body.style.color = "#d8d8d8";
        body.querySelectorAll("ul").forEach((ul) => {
            ul.style.margin = "0";
            ul.style.paddingLeft = "18px";
        });
        body.querySelectorAll("li").forEach((li) => {
            li.style.marginBottom = "4px";
        });
        body.querySelectorAll("p").forEach((p) => {
            p.style.margin = "0 0 6px 0";
        });
        card.appendChild(body);
    });

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    const close = () => {
        overlay.style.display = "none";
    };
    closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) close();
    });

    overlay.__reposition = () => positionCardNextToNode(card, container, 560);
    return overlay;
}

/**
 * Petite fenetre de confirmation utilisee quand un clic sur un fichier va
 * remplacer une valeur deja presente dans un des 5 champs numerotes.
 * Construite une seule fois (lazy) puis reutilisee, avec un message et un
 * callback differents a chaque appel de show().
 */
function buildFieldOverwriteConfirmOverlay(container) {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "transparent";
    overlay.style.zIndex = "10001";
    overlay.style.display = "none";
    overlay.style.fontFamily = "sans-serif";

    const card = document.createElement("div");
    card.style.position = "fixed";
    card.style.background = "#181818";
    card.style.color = "#e6e6e6";
    card.style.width = "min(300px, 90vw)";
    card.style.borderRadius = "10px";
    card.style.padding = "16px 18px";
    card.style.boxShadow = "0 10px 40px rgba(0,0,0,0.5)";
    card.style.border = "1px solid #2a2a2a";

    const msg = document.createElement("div");
    msg.style.fontSize = "12px";
    msg.style.lineHeight = "1.5";
    msg.style.marginBottom = "12px";
    card.appendChild(msg);

    const checkRow = document.createElement("label");
    checkRow.style.display = "flex";
    checkRow.style.alignItems = "center";
    checkRow.style.gap = "6px";
    checkRow.style.fontSize = "11px";
    checkRow.style.color = "#aaa";
    checkRow.style.cursor = "pointer";
    checkRow.style.marginBottom = "14px";
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    const checkLabel = document.createElement("span");
    checkLabel.textContent = "Don't ask again";
    checkRow.appendChild(checkbox);
    checkRow.appendChild(checkLabel);
    card.appendChild(checkRow);

    const btnRow = document.createElement("div");
    btnRow.style.display = "flex";
    btnRow.style.gap = "8px";
    btnRow.style.justifyContent = "flex-end";

    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.textContent = "Cancel";
    cancelBtn.style.padding = "6px 12px";
    cancelBtn.style.borderRadius = "6px";
    cancelBtn.style.border = "none";
    cancelBtn.style.background = "#2a2a2a";
    cancelBtn.style.color = "#ddd";
    cancelBtn.style.fontSize = "11px";
    cancelBtn.style.cursor = "pointer";

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.textContent = "Confirm";
    confirmBtn.style.padding = "6px 12px";
    confirmBtn.style.borderRadius = "6px";
    confirmBtn.style.border = "none";
    confirmBtn.style.background = "#e0793c";
    confirmBtn.style.color = "#fff";
    confirmBtn.style.fontWeight = "700";
    confirmBtn.style.fontSize = "11px";
    confirmBtn.style.cursor = "pointer";

    btnRow.appendChild(cancelBtn);
    btnRow.appendChild(confirmBtn);
    card.appendChild(btnRow);

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    let currentOnResult = null;

    function close() {
        overlay.style.display = "none";
        currentOnResult = null;
    }

    cancelBtn.addEventListener("click", () => {
        const cb = currentOnResult;
        close();
        if (cb) cb(false, false);
    });
    confirmBtn.addEventListener("click", () => {
        const skip = checkbox.checked;
        const cb = currentOnResult;
        close();
        if (cb) cb(true, skip);
    });
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            const cb = currentOnResult;
            close();
            if (cb) cb(false, false);
        }
    });

    return {
        show(fieldNumber, path, onResult) {
            msg.textContent =
                "Field " + fieldNumber + " already holds a value. " +
                "Replace it with:\n" + path + " ?";
            msg.style.whiteSpace = "pre-wrap";
            checkbox.checked = false;
            currentOnResult = onResult;
            overlay.style.display = "block";
            positionCardNextToNode(card, container, 320);
        },
    };
}

/**
 * Fenetre de confirmation simple (message + Annuler/Confirmer), meme
 * famille visuelle que celle d'ecrasement de champ. Utilisee avant de
 * retirer une option dont la sortie est connectee.
 */
function buildSimpleConfirmOverlay(container) {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "transparent";
    overlay.style.zIndex = "10001";
    overlay.style.display = "none";
    overlay.style.fontFamily = "sans-serif";

    const card = document.createElement("div");
    card.style.position = "fixed";
    card.style.background = "#181818";
    card.style.color = "#e6e6e6";
    card.style.width = "min(300px, 90vw)";
    card.style.borderRadius = "10px";
    card.style.padding = "16px 18px";
    card.style.boxShadow = "0 10px 40px rgba(0,0,0,0.5)";
    card.style.border = "1px solid #2a2a2a";

    const msg = document.createElement("div");
    msg.style.fontSize = "12px";
    msg.style.lineHeight = "1.5";
    msg.style.marginBottom = "14px";
    msg.style.whiteSpace = "pre-wrap";
    card.appendChild(msg);

    const btnRow = document.createElement("div");
    btnRow.style.display = "flex";
    btnRow.style.gap = "8px";
    btnRow.style.justifyContent = "flex-end";

    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.textContent = "Cancel";
    cancelBtn.style.padding = "6px 12px";
    cancelBtn.style.borderRadius = "6px";
    cancelBtn.style.border = "none";
    cancelBtn.style.background = "#2a2a2a";
    cancelBtn.style.color = "#ddd";
    cancelBtn.style.fontSize = "11px";
    cancelBtn.style.cursor = "pointer";

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.textContent = "Confirm";
    confirmBtn.style.padding = "6px 12px";
    confirmBtn.style.borderRadius = "6px";
    confirmBtn.style.border = "none";
    confirmBtn.style.background = "#e0793c";
    confirmBtn.style.color = "#fff";
    confirmBtn.style.fontWeight = "700";
    confirmBtn.style.fontSize = "11px";
    confirmBtn.style.cursor = "pointer";

    btnRow.appendChild(cancelBtn);
    btnRow.appendChild(confirmBtn);
    card.appendChild(btnRow);
    overlay.appendChild(card);
    document.body.appendChild(overlay);

    let currentOnResult = null;
    function finish(result) {
        const cb = currentOnResult;
        overlay.style.display = "none";
        currentOnResult = null;
        if (cb) cb(result);
    }
    cancelBtn.addEventListener("click", () => finish(false));
    confirmBtn.addEventListener("click", () => finish(true));
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) finish(false);
    });

    return {
        show(message, onResult) {
            msg.textContent = message;
            currentOnResult = onResult;
            overlay.style.display = "block";
            positionCardNextToNode(card, container, 320);
        },
    };
}

function findWidget(node, name) {
    return node.widgets.find((w) => w.name === name);
}

/**
 * Cache un widget standard du canvas LiteGraph (tout en le laissant dans
 * node.widgets) afin qu'il continue d'etre serialise et envoye au serveur
 * Python lors de l'execution, sans etre dessine sur le noeud.
 */
function hideWidget(node, widget) {
    if (!widget || widget.__multifileselect_hidden) return;
    widget.__multifileselect_hidden = true;
    widget.origType = widget.type;
    widget.origComputeSize = widget.computeSize;
    widget.computeSize = () => [0, -4];
    // "converted-widget" est le type sentinelle reconnu en interne par
    // ComfyUI/LiteGraph pour exclure vraiment un widget du dessin ET du
    // hit-testing des connexions (voir notes FileSelect).
    widget.type = "converted-widget";
    widget.draw = () => {};
    widget.onDrawBackground = () => {};
}

/**
 * Cherche un segment de chemin nomme "models" (insensible a la casse)
 * dans le chemin d'origine + sous-repertoire, et renvoie le nom du
 * dossier qui le suit immediatement (ex: pour un chemin
 * ".../ComfyUI/models/diffusion_models", renvoie "diffusion_models").
 * Si "models" n'apparait pas dans le chemin (ou si c'est le dernier
 * segment, rien apres), reprend simplement le nom du dernier dossier du
 * chemin (ex: pour ".../User/Input", renvoie "Input"). Renvoie une
 * chaine vide seulement si le chemin lui-meme est vide.
 */
function extractModelTypeFromPath(origin, subdir) {
    const combined = [origin, subdir].filter(Boolean).join("/");
    const parts = combined.split(/[\\/]+/).filter(Boolean);
    if (parts.length === 0) return "";
    const idx = parts.findIndex((p) => p.toLowerCase() === "models");
    if (idx !== -1 && idx + 1 < parts.length) return parts[idx + 1];
    return parts[parts.length - 1];
}

async function apiGet(url) {
    const res = await fetch(url);
    let data = null;
    try {
        data = await res.json();
    } catch (e) {
        data = null;
    }
    if (!res.ok) {
        const msg = (data && data.error) || `HTTP error ${res.status}`;
        throw new Error(msg);
    }
    return data;
}

function makeIconButton(color, icon) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.innerHTML = icon || SEARCH_ICON;
    btn.style.flex = "0 0 auto";
    btn.style.width = "22px";
    btn.style.height = "22px";
    btn.style.display = "flex";
    btn.style.alignItems = "center";
    btn.style.justifyContent = "center";
    btn.style.background = color;
    btn.style.border = "none";
    btn.style.borderRadius = "4px";
    btn.style.cursor = "pointer";
    btn.style.padding = "0";
    return btn;
}

function makeTextInput(placeholder, readOnly) {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = placeholder || "";
    input.readOnly = !!readOnly;
    input.style.flex = "1";
    input.style.minWidth = "0";
    input.style.background = "#111";
    input.style.color = "#ddd";
    input.style.border = "1px solid #0c3833";
    input.style.borderRadius = "10px";
    input.style.padding = "4px 8px";
    input.style.fontSize = "11px";
    input.style.boxSizing = "border-box";
    input.style.outline = "none";
    if (readOnly) {
        input.style.color = "#9fd6cf";
        input.style.cursor = "default";
    }
    return input;
}

app.registerExtension({
    name: "ComfyUI.MultiFileSelect",
    async beforeRegisterNodeDef(nodeType, nodeData, app) {
        if (nodeData.name !== NODE_NAME) return;

        const onNodeCreated = nodeType.prototype.onNodeCreated;
        nodeType.prototype.onNodeCreated = function () {
            const r = onNodeCreated ? onNodeCreated.apply(this, arguments) : undefined;
            const node = this;

            node.color = TITLE_COLOR;
            node.bgcolor = BODY_COLOR;

            // Persiste avec le workflow sauvegarde : une fois coche,
            // "Ne plus demander" reste actif meme apres rechargement.
            if (!node.properties) node.properties = {};
            if (node.properties.fileOverwriteSkipConfirm === undefined) {
                node.properties.fileOverwriteSkipConfirm = false;
            }
            // Nombre de champs optionnels ajoutes (0 a 2), persiste avec
            // le workflow.
            if (node.properties.extraFields === undefined) {
                node.properties.extraFields = 0;
            }

            const originWidget = findWidget(node, "origin_dir");
            const selectedDirWidget = findWidget(node, "selected_dir");
            const outputModeWidget = findWidget(node, "output_mode");
            const fieldWidgets = [
                null,
                findWidget(node, "field_1"),
                findWidget(node, "field_2"),
                findWidget(node, "field_3"),
                findWidget(node, "field_4"),
                findWidget(node, "field_5"),
                findWidget(node, "field_6"),
                findWidget(node, "field_7"),
            ];
            const modelTypeWidgets = [
                null,
                findWidget(node, "model_type_1"),
                findWidget(node, "model_type_2"),
                findWidget(node, "model_type_3"),
                findWidget(node, "model_type_4"),
                findWidget(node, "model_type_5"),
                findWidget(node, "model_type_6"),
                findWidget(node, "model_type_7"),
            ];

            hideWidget(node, originWidget);
            hideWidget(node, selectedDirWidget);
            hideWidget(node, outputModeWidget);
            for (let i = 1; i <= MAX_FIELDS; i++) {
                hideWidget(node, fieldWidgets[i]);
                hideWidget(node, modelTypeWidgets[i]);
            }

            node.fileSelectMode = "dirs";

            // --------------------------------------------------------
            // Conteneur principal
            // --------------------------------------------------------
            const container = document.createElement("div");
            container.style.display = "flex";
            container.style.flexDirection = "column";
            container.style.gap = "4px";
            container.style.width = "100%";
            container.style.height = "100%";
            container.style.boxSizing = "border-box";
            container.style.padding = "2px 2px 4px 2px";
            container.style.overflow = "hidden";
            container.style.fontFamily = "sans-serif";

            // Ligne 1 : raccourcis vers les dossiers standards de ComfyUI
            // (models, output, input, temp, user, custom_nodes, racine)
            // pour remplir "Repertoire d'origine" en un clic. Placee
            // au-dessus du champ qu'elle remplit. Se remplit de facon
            // asynchrone au chargement du noeud ; si la route n'est pas
            // disponible (hors ComfyUI, ou module folder_paths absent),
            // le menu reste desactive sans erreur visible.
            const quickRow = document.createElement("div");
            quickRow.style.position = "relative";
            quickRow.style.flex = "0 0 auto";
            const quickSelect = document.createElement("select");
            quickSelect.style.width = "100%";
            quickSelect.style.boxSizing = "border-box";
            quickSelect.style.background = "#0b0b0b";
            quickSelect.style.color = "#ddd";
            quickSelect.style.border = "1px solid #0c3833";
            quickSelect.style.borderRadius = "4px";
            quickSelect.style.padding = "4px 24px 4px 8px";
            quickSelect.style.fontSize = "10px";
            quickSelect.style.appearance = "none";
            quickSelect.style.webkitAppearance = "none";
            quickSelect.style.cursor = "pointer";
            quickSelect.disabled = true;
            const quickArrow = document.createElement("span");
            quickArrow.textContent = "▾";
            quickArrow.style.position = "absolute";
            quickArrow.style.right = "8px";
            quickArrow.style.top = "50%";
            quickArrow.style.transform = "translateY(-50%)";
            quickArrow.style.color = "#ddd";
            quickArrow.style.pointerEvents = "none";
            quickRow.appendChild(quickSelect);
            quickRow.appendChild(quickArrow);
            container.appendChild(quickRow);

            // Ligne 2 : repertoire d'origine (sous le menu de raccourcis)
            const originRow = document.createElement("div");
            originRow.style.display = "flex";
            originRow.style.gap = "4px";
            originRow.style.alignItems = "center";
            const originInput = makeTextInput("Origin directory (full path)", false);
            const originBtn = makeIconButton(VIOLET, SEARCH_ICON);
            originBtn.title = "List folders";
            const originBrowseBtn = makeIconButton(VIOLET, GEAR_ICON);
            originBrowseBtn.title = "Browse...";
            originRow.appendChild(originInput);
            originRow.appendChild(originBrowseBtn);
            originRow.appendChild(originBtn);
            container.appendChild(originRow);

            function setQuickPlaceholder(text) {
                quickSelect.innerHTML = "";
                const opt = document.createElement("option");
                opt.value = "";
                opt.textContent = text;
                quickSelect.appendChild(opt);
                quickSelect.value = "";
            }
            setQuickPlaceholder("ComfyUI folder shortcut...");

            let quickDirsCache = [];

            function rebuildQuickOptions(placeholderText) {
                setQuickPlaceholder(placeholderText);
                quickDirsCache.forEach((d) => {
                    const opt = document.createElement("option");
                    opt.value = d.path;
                    opt.textContent = d.label;
                    quickSelect.appendChild(opt);
                });
            }

            apiGet("/multifileselect/quick_dirs")
                .then((data) => {
                    const dirs = (data && data.dirs) || [];
                    if (dirs.length === 0) return;
                    quickDirsCache = dirs;
                    rebuildQuickOptions("ComfyUI folder shortcut...");
                    quickSelect.disabled = false;
                })
                .catch(() => {
                    // Hors ComfyUI (ou folder_paths indisponible) : le
                    // menu reste simplement desactive, sans avertir
                    // l'utilisateur pour une fonctionnalite de confort.
                });

            function applyQuickDir(path) {
                originInput.value = path;
                originWidget.value = path;
                status.textContent = "Directory chosen: " + path;
                rebuildQuickOptions("ComfyUI folder shortcut...");
            }

            quickSelect.addEventListener("change", () => {
                const path = quickSelect.value;
                if (!path) return;
                applyQuickDir(path);
            });

            // Ligne 2 : repertoire selectionne
            const selectedDirRow = document.createElement("div");
            selectedDirRow.style.display = "flex";
            selectedDirRow.style.gap = "4px";
            selectedDirRow.style.alignItems = "center";
            const selectedDirInput = makeTextInput("Selected directory", false);
            const selectedDirBtn = makeIconButton(PINK);
            selectedDirBtn.title = "List files";
            selectedDirRow.appendChild(selectedDirInput);
            selectedDirRow.appendChild(selectedDirBtn);
            container.appendChild(selectedDirRow);

            // Filtre par extension. Desactive automatiquement s'il n'y a
            // 0 ou 1 seul type d'extension dans le dossier (rien a
            // filtrer). La liste des extensions ne change jamais suite a
            // une selection : elle reste celle du dernier dossier de
            // fichiers charge. Placee au-dessus de la fenetre resultat
            // (deplace suite a un retour explicite).
            const extRow = document.createElement("div");
            extRow.style.position = "relative";
            extRow.style.flex = "0 0 auto";
            const extSelect = document.createElement("select");
            extSelect.style.width = "100%";
            extSelect.style.boxSizing = "border-box";
            extSelect.style.background = "#0b0b0b";
            extSelect.style.color = "#ddd";
            extSelect.style.border = "1px solid #0c3833";
            extSelect.style.borderRadius = "4px";
            extSelect.style.padding = "5px 24px 5px 8px";
            extSelect.style.fontSize = "11px";
            extSelect.style.appearance = "none";
            extSelect.style.webkitAppearance = "none";
            extSelect.style.cursor = "pointer";
            const extArrow = document.createElement("span");
            extArrow.textContent = "▾";
            extArrow.style.position = "absolute";
            extArrow.style.right = "8px";
            extArrow.style.top = "50%";
            extArrow.style.transform = "translateY(-50%)";
            extArrow.style.color = "#ddd";
            extArrow.style.pointerEvents = "none";
            extRow.appendChild(extSelect);
            extRow.appendChild(extArrow);
            container.appendChild(extRow);

            // Ligne de statut (sous le selecteur d'extension, deplace
            // suite a un retour explicite)
            const status = document.createElement("div");
            status.style.fontSize = "10px";
            status.style.color = "#bfe9e3";
            status.style.padding = "0 2px";
            status.style.minHeight = "13px";
            status.textContent = "Click the purple magnifier to start.";
            container.appendChild(status);

            // Fenetre de liste
            const listBox = document.createElement("div");
            listBox.style.flex = "1";
            listBox.style.minHeight = "50px";
            listBox.style.overflowY = "auto";
            listBox.style.border = "1px solid #0c3833";
            listBox.style.borderRadius = "8px";
            listBox.style.background = "#07211d";
            listBox.style.fontSize = "11px";
            listBox.style.color = "#ddd";
            listBox.style.boxSizing = "border-box";
            container.appendChild(listBox);

            // --------------------------------------------------------
            // Boutons carres 1-5 : choix du champ actif
            // --------------------------------------------------------
            const fieldSelectRow = document.createElement("div");
            fieldSelectRow.style.display = "flex";
            fieldSelectRow.style.gap = "6px";
            fieldSelectRow.style.flex = "0 0 auto";
            const fieldSelectButtons = new Array(MAX_FIELDS + 1).fill(null);
            for (let i = 1; i <= MAX_FIELDS; i++) {
                const b = document.createElement("button");
                b.type = "button";
                b.textContent = String(i);
                b.title = i > BASE_FIELDS
                    ? `Field ${i} active (${OPTION_OUTPUT_NAMES[i - BASE_FIELDS - 1]})`
                    : `Field ${i} active`;
                b.style.flex = "1";
                b.style.padding = "5px 0";
                b.style.borderRadius = "8px";
                b.style.border = "none";
                b.style.fontWeight = "700";
                b.style.fontSize = "12px";
                b.style.cursor = "pointer";
                fieldSelectRow.appendChild(b);
                fieldSelectButtons[i] = b;
            }
            container.appendChild(fieldSelectRow);

            // --------------------------------------------------------
            // Interrupteur Absolu/Relatif (pilule en un seul bloc, les
            // deux moities se touchent sans espace visible) + aide
            // --------------------------------------------------------
            const toggleRow = document.createElement("div");
            toggleRow.style.display = "flex";
            toggleRow.style.gap = "6px";

            const toggleGroup = document.createElement("div");
            toggleGroup.style.display = "flex";
            toggleGroup.style.flex = "1";
            toggleGroup.style.borderRadius = "999px";
            toggleGroup.style.overflow = "hidden";

            const absBtn = document.createElement("button");
            absBtn.type = "button";
            absBtn.textContent = "Absolute";
            const relBtn = document.createElement("button");
            relBtn.type = "button";
            relBtn.textContent = "Relative";
            [absBtn, relBtn].forEach((b) => {
                b.style.flex = "1";
                b.style.padding = "7px 0";
                b.style.borderRadius = "0";
                b.style.border = "none";
                b.style.fontWeight = "700";
                b.style.fontSize = "11px";
                b.style.cursor = "pointer";
            });
            toggleGroup.appendChild(absBtn);
            toggleGroup.appendChild(relBtn);
            toggleRow.appendChild(toggleGroup);

            // Icone "C" : n'apparait que si "Ne plus demander" est actif
            // sur le menu de raccourcis, pour reactiver la confirmation.
            const fieldOverwriteCancelBtn = document.createElement("button");
            fieldOverwriteCancelBtn.type = "button";
            fieldOverwriteCancelBtn.textContent = "C";
            fieldOverwriteCancelBtn.title =
                "Turn the confirmation back on before overwriting a filled field";
            fieldOverwriteCancelBtn.style.flex = "0 0 auto";
            fieldOverwriteCancelBtn.style.width = "26px";
            fieldOverwriteCancelBtn.style.height = "26px";
            fieldOverwriteCancelBtn.style.borderRadius = "50%";
            fieldOverwriteCancelBtn.style.border = "none";
            fieldOverwriteCancelBtn.style.background = "#5a3d1a";
            fieldOverwriteCancelBtn.style.color = "#f0c98a";
            fieldOverwriteCancelBtn.style.fontWeight = "700";
            fieldOverwriteCancelBtn.style.fontSize = "13px";
            fieldOverwriteCancelBtn.style.cursor = "pointer";
            fieldOverwriteCancelBtn.style.alignItems = "center";
            fieldOverwriteCancelBtn.style.justifyContent = "center";
            fieldOverwriteCancelBtn.style.display = "none";
            toggleRow.appendChild(fieldOverwriteCancelBtn);

            function updateFieldOverwriteCancelBtn() {
                fieldOverwriteCancelBtn.style.display = node.properties.fileOverwriteSkipConfirm
                    ? "flex"
                    : "none";
            }
            updateFieldOverwriteCancelBtn();

            fieldOverwriteCancelBtn.addEventListener("click", () => {
                node.properties.fileOverwriteSkipConfirm = false;
                updateFieldOverwriteCancelBtn();
                status.textContent = "Confirmation turned back on before overwriting a field.";
            });

            // Bouton "telechargement" : exporte dans un fichier .txt une
            // ligne par champ numerote rempli, au format "N - <model_type> :
            // <field_N>" (champs vides ignores). Place juste a gauche du
            // bouton d'aide "?". S'appuie sur fieldInputs/modelTypeInputs,
            // remplis plus bas dans cette meme fonction : sans risque, le
            // gestionnaire de clic ne s'execute qu'apres coup (l'utilisateur
            // doit d'abord cliquer), quand ces tableaux sont deja remplis.
            const saveBtn = document.createElement("button");
            saveBtn.type = "button";
            saveBtn.innerHTML = DOWNLOAD_ICON;
            saveBtn.title = "Download the filled fields (.txt)";
            saveBtn.style.flex = "0 0 auto";
            saveBtn.style.width = "26px";
            saveBtn.style.height = "26px";
            saveBtn.style.borderRadius = "50%";
            saveBtn.style.border = "none";
            saveBtn.style.background = PINK;
            saveBtn.style.color = "#fff";
            saveBtn.style.fontWeight = "700";
            saveBtn.style.fontSize = "13px";
            saveBtn.style.cursor = "pointer";
            saveBtn.style.display = "flex";
            saveBtn.style.alignItems = "center";
            saveBtn.style.justifyContent = "center";
            toggleRow.appendChild(saveBtn);

            saveBtn.addEventListener("click", () => {
                const lines = [];
                for (let i = 1; i <= fieldCount(); i++) {
                    const fieldValue = (fieldInputs[i].value || "").trim();
                    if (!fieldValue) continue;
                    const modelType = (modelTypeInputs[i].value || "").trim();
                    lines.push(`${i} - ${modelType} : ${fieldValue}`);
                }
                if (lines.length === 0) {
                    status.textContent = "No filled field to export.";
                    return;
                }
                const text = lines.join("\n");
                const blob = new Blob([text], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "multifileselect_fields.txt";
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
                status.textContent = `File exported (${lines.length} field(s)).`;
            });

            // Bouton "televersement" : recharge un fichier .txt au meme
            // format que l'export ("N - <model_type> : <field_N>", une
            // ligne par numero) pour remplir automatiquement les champs
            // Type et principal correspondants. S'appuie sur setFieldValue/
            // setModelTypeValue, definies plus bas dans cette meme fonction
            // (meme raisonnement de securite que pour saveBtn ci-dessus :
            // le gestionnaire de clic/changement ne s'execute qu'apres
            // interaction de l'utilisateur, une fois ces fonctions definies).
            const uploadInput = document.createElement("input");
            uploadInput.type = "file";
            uploadInput.accept = ".txt,text/plain";
            uploadInput.style.display = "none";
            toggleRow.appendChild(uploadInput);

            const uploadBtn = document.createElement("button");
            uploadBtn.type = "button";
            uploadBtn.innerHTML = UPLOAD_ICON;
            uploadBtn.title = "Import a fields file (.txt)";
            uploadBtn.style.flex = "0 0 auto";
            uploadBtn.style.width = "26px";
            uploadBtn.style.height = "26px";
            uploadBtn.style.borderRadius = "50%";
            uploadBtn.style.border = "none";
            uploadBtn.style.background = PINK;
            uploadBtn.style.color = "#fff";
            uploadBtn.style.fontWeight = "700";
            uploadBtn.style.fontSize = "13px";
            uploadBtn.style.cursor = "pointer";
            uploadBtn.style.display = "flex";
            uploadBtn.style.alignItems = "center";
            uploadBtn.style.justifyContent = "center";
            toggleRow.appendChild(uploadBtn);

            uploadBtn.addEventListener("click", () => uploadInput.click());

            uploadInput.addEventListener("change", () => {
                const file = uploadInput.files && uploadInput.files[0];
                // Reinitialise tout de suite pour pouvoir reselectionner le
                // meme fichier une seconde fois (sinon "change" ne se
                // redeclenche pas).
                uploadInput.value = "";
                if (!file) return;

                const reader = new FileReader();
                reader.onload = () => {
                    const text = String(reader.result || "");
                    const lines = text.split(/\r?\n/);
                    // Format attendu par ligne : "N - <model_type> :
                    // <field_N>" (celui produit par l'export ci-dessus).
                    // Une ligne 6 ou 7 non vide ajoute automatiquement
                    // l'option correspondante si elle manque.
                    // Pour chaque numero 1 a 7 : cherche la ligne
                    // correspondante et coupe au premier ":" (le
                    // model_type ne doit pas en contenir). Numero absent du
                    // fichier, ou valeur vide de part et d'autre du ":" ->
                    // le(s) champ(s) concerne(s) reste(nt) simplement vide(s).
                    const parsed = new Array(MAX_FIELDS + 1).fill(null);
                    for (let i = 1; i <= MAX_FIELDS; i++) {
                        const re = new RegExp(`^\\s*${i}\\s*-\\s*(.*?)\\s*:\\s*(.*)$`);
                        let modelType = "";
                        let fieldValue = "";
                        for (const line of lines) {
                            const m = line.match(re);
                            if (m) {
                                modelType = (m[1] || "").trim();
                                fieldValue = (m[2] || "").trim();
                                break;
                            }
                        }
                        parsed[i] = { modelType, fieldValue };
                    }
                    for (let i = MAX_FIELDS; i > BASE_FIELDS; i--) {
                        if (parsed[i].fieldValue || parsed[i].modelType) {
                            while (fieldCount() < i) addOption();
                            break;
                        }
                    }
                    for (let i = 1; i <= fieldCount(); i++) {
                        setFieldValue(i, parsed[i].fieldValue);
                        setModelTypeValue(i, parsed[i].modelType);
                    }
                    status.textContent = `File imported: ${file.name}.`;
                };
                reader.onerror = () => {
                    status.textContent = "Error reading the file.";
                };
                reader.readAsText(file);
            });

            const helpBtn = document.createElement("button");
            helpBtn.type = "button";
            helpBtn.textContent = "?";
            helpBtn.title = "Help";
            helpBtn.style.flex = "0 0 auto";
            helpBtn.style.width = "26px";
            helpBtn.style.height = "26px";
            helpBtn.style.borderRadius = "50%";
            helpBtn.style.border = "none";
            helpBtn.style.background = "#0c3833";
            helpBtn.style.color = "#bfe9e3";
            helpBtn.style.fontWeight = "700";
            helpBtn.style.fontSize = "13px";
            helpBtn.style.cursor = "pointer";
            helpBtn.style.display = "flex";
            helpBtn.style.alignItems = "center";
            helpBtn.style.justifyContent = "center";
            toggleRow.appendChild(helpBtn);

            container.appendChild(toggleRow);

            let helpOverlay = null;
            helpBtn.addEventListener("click", () => {
                if (!helpOverlay) helpOverlay = buildHelpOverlay(container);
                helpOverlay.style.display = "block";
                if (helpOverlay.__reposition) helpOverlay.__reposition();
            });

            function updateToggleUI(mode) {
                if (mode === "Relatif") {
                    relBtn.style.background = GREEN;
                    relBtn.style.color = "#fff";
                    absBtn.style.background = INACTIVE_BG;
                    absBtn.style.color = INACTIVE_FG;
                } else {
                    absBtn.style.background = ORANGE;
                    absBtn.style.color = "#fff";
                    relBtn.style.background = INACTIVE_BG;
                    relBtn.style.color = INACTIVE_FG;
                }
            }

            function setOutputMode(mode) {
                outputModeWidget.value = mode;
                updateToggleUI(mode);
                node.setDirtyCanvas(true, true);
            }

            absBtn.addEventListener("click", () => setOutputMode("Absolu"));
            relBtn.addEventListener("click", () => setOutputMode("Relatif"));

            // --------------------------------------------------------
            // Les 5 champs numerotes (affichage du resultat)
            // --------------------------------------------------------
            const fieldsWrap = document.createElement("div");
            fieldsWrap.style.display = "flex";
            fieldsWrap.style.flexDirection = "column";
            fieldsWrap.style.gap = "4px";
            fieldsWrap.style.flex = "0 0 auto";
            const fieldRows = new Array(MAX_FIELDS + 1).fill(null);
            const fieldInputs = new Array(MAX_FIELDS + 1).fill(null);
            const fieldBadges = new Array(MAX_FIELDS + 1).fill(null);
            const modelTypeInputs = new Array(MAX_FIELDS + 1).fill(null);
            for (let i = 1; i <= MAX_FIELDS; i++) {
                const row = document.createElement("div");
                row.style.display = "flex";
                row.style.gap = "4px";
                row.style.alignItems = "center";
                row.style.border = "1px solid transparent";
                row.style.borderRadius = "10px";
                row.style.padding = "1px";
                row.style.boxSizing = "border-box";

                const badge = document.createElement("div");
                badge.textContent = String(i);
                badge.style.flex = "0 0 auto";
                badge.style.width = "18px";
                badge.style.height = "18px";
                badge.style.borderRadius = "5px";
                badge.style.background = INACTIVE_BG;
                badge.style.color = INACTIVE_FG;
                badge.style.fontSize = "10px";
                badge.style.fontWeight = "700";
                badge.style.display = "flex";
                badge.style.alignItems = "center";
                badge.style.justifyContent = "center";

                // Champ "type de modele" (precede le champ principal) :
                // rempli automatiquement a chaque selection de fichier
                // en cherchant un segment "models" dans le chemin, mais
                // reste modifiable a la main. Largeur fixe et reduite
                // pour laisser toute la place au champ principal.
                const modelTypeInput = makeTextInput("Type", false);
                modelTypeInput.style.flex = "0 0 72px";
                modelTypeInput.style.width = "72px";
                modelTypeInput.title = "Model type (auto, e.g. diffusion_models)";

                const input = makeTextInput(
                    i > BASE_FIELDS
                        ? `Field ${i} (${OPTION_OUTPUT_NAMES[i - BASE_FIELDS - 1]})`
                        : `Field ${i}`,
                    true
                );
                input.style.width = "100%";
                input.style.flex = "1";

                const clearBtn = makeIconButton("#6b2b2b", TRASH_ICON);
                clearBtn.title = `Clear field ${i}`;

                row.appendChild(badge);
                row.appendChild(modelTypeInput);
                row.appendChild(input);
                row.appendChild(clearBtn);
                fieldsWrap.appendChild(row);
                fieldRows[i] = row;
                fieldInputs[i] = input;
                fieldBadges[i] = badge;
                modelTypeInputs[i] = modelTypeInput;

                input.addEventListener("input", () => {
                    fieldWidgets[i].value = input.value;
                });

                modelTypeInput.addEventListener("input", () => {
                    modelTypeWidgets[i].value = modelTypeInput.value;
                });

                clearBtn.addEventListener("click", () => {
                    setFieldValue(i, "");
                    setModelTypeValue(i, "");
                    status.textContent = `Field ${i} cleared.`;
                });
            }
            container.appendChild(fieldsWrap);

            // --------------------------------------------------------
            // Champs optionnels : "+" ajoute le champ suivant (6 puis 7)
            // et sa sortie, "-" retire le dernier ajoute (confirmation si
            // sa sortie est connectee).
            // --------------------------------------------------------
            const optionRow = document.createElement("div");
            optionRow.style.display = "flex";
            optionRow.style.gap = "6px";
            optionRow.style.flex = "0 0 auto";

            function makeRoundTextButton(text, bg) {
                const b = document.createElement("button");
                b.type = "button";
                b.textContent = text;
                b.style.flex = "0 0 auto";
                b.style.width = "22px";
                b.style.height = "22px";
                b.style.borderRadius = "50%";
                b.style.border = "none";
                b.style.background = bg;
                b.style.color = "#fff";
                b.style.fontWeight = "700";
                b.style.fontSize = "14px";
                b.style.lineHeight = "1";
                b.style.cursor = "pointer";
                b.style.padding = "0";
                b.style.alignItems = "center";
                b.style.justifyContent = "center";
                return b;
            }
            const addOptionBtn = makeRoundTextButton("+", PINK);
            const removeOptionBtn = makeRoundTextButton("\u2212", "#6b2b2b");
            optionRow.appendChild(addOptionBtn);
            optionRow.appendChild(removeOptionBtn);
            container.appendChild(optionRow);

            let removeConfirmOverlay = null;

            function fieldCount() {
                return BASE_FIELDS + (node.properties.extraFields || 0);
            }

            function minHeight() {
                return MIN_HEIGHT + OPTION_ROW_HEIGHT * (node.properties.extraFields || 0);
            }

            // Aligne node.outputs sur le nombre de champs affiches :
            // retire les sorties en trop (et leurs liens), ajoute celles
            // qui manquent avec leur nom "Option N".
            function syncOptionOutputs() {
                if (!node.outputs) return;
                const want = fieldCount();
                while (node.outputs.length > want) {
                    const idx = node.outputs.length - 1;
                    node.disconnectOutput(idx);
                    node.removeOutput(idx);
                }
                while (node.outputs.length < want) {
                    const idx = node.outputs.length;
                    node.addOutput(OPTION_OUTPUT_NAMES[idx - BASE_FIELDS], "*");
                }
            }

            function updateOptionUI() {
                const count = fieldCount();
                for (let i = BASE_FIELDS + 1; i <= MAX_FIELDS; i++) {
                    const shown = i <= count;
                    fieldRows[i].style.display = shown ? "flex" : "none";
                    fieldSelectButtons[i].style.display = shown ? "" : "none";
                }
                if (activeField > count) setActiveField(count);
                if (count < MAX_FIELDS) {
                    addOptionBtn.style.display = "flex";
                    addOptionBtn.title = `Add field ${count + 1} ("${OPTION_OUTPUT_NAMES[count - BASE_FIELDS]}" output)`;
                } else {
                    addOptionBtn.style.display = "none";
                }
                if (count > BASE_FIELDS) {
                    removeOptionBtn.style.display = "flex";
                    removeOptionBtn.title = `Remove field ${count} ("${OPTION_OUTPUT_NAMES[count - BASE_FIELDS - 1]}" output)`;
                } else {
                    removeOptionBtn.style.display = "none";
                }
            }

            function addOption() {
                if (fieldCount() >= MAX_FIELDS) return;
                node.properties.extraFields = (node.properties.extraFields || 0) + 1;
                syncOptionOutputs();
                updateOptionUI();
                node.setSize([node.size[0], node.size[1] + OPTION_ROW_HEIGHT]);
                node.setDirtyCanvas(true, true);
            }

            function removeOption() {
                const i = fieldCount();
                if (i <= BASE_FIELDS) return;
                setFieldValue(i, "");
                setModelTypeValue(i, "");
                node.properties.extraFields -= 1;
                syncOptionOutputs();
                updateOptionUI();
                node.setSize([node.size[0], Math.max(minHeight(), node.size[1] - OPTION_ROW_HEIGHT)]);
                node.setDirtyCanvas(true, true);
            }

            addOptionBtn.addEventListener("click", () => {
                addOption();
                status.textContent = `Field ${fieldCount()} added.`;
            });

            removeOptionBtn.addEventListener("click", () => {
                const i = fieldCount();
                if (i <= BASE_FIELDS) return;
                const out = node.outputs && node.outputs[i - 1];
                const links = (out && out.links) ? out.links.length : 0;
                const done = () => {
                    removeOption();
                    status.textContent = `Field ${i} removed.`;
                };
                if (!links) {
                    done();
                    return;
                }
                if (!removeConfirmOverlay) {
                    removeConfirmOverlay = buildSimpleConfirmOverlay(container);
                }
                const label = out.label || out.name;
                removeConfirmOverlay.show(
                    `The "${label}" output is connected (${links} link(s)).\n` +
                    `Removing field ${i} will delete the link(s) and clear the field. Continue?`,
                    (confirmed) => {
                        if (confirmed) done();
                        else status.textContent = `Removal of field ${i} cancelled.`;
                    }
                );
            });

            // --------------------------------------------------------
            // Champ actif (1 a 5) : determine quel champ recoit la
            // prochaine selection de fichier. Le numero en face du champ
            // (badge) suit le meme etat actif/inactif que le bouton de
            // selection correspondant : un seul actif a la fois, changer
            // de champ desactive automatiquement le precedent.
            // --------------------------------------------------------
            let activeField = 1;

            function updateFieldSelectUI() {
                for (let i = 1; i <= MAX_FIELDS; i++) {
                    const isActive = i === activeField;
                    fieldSelectButtons[i].style.background = isActive ? PINK : INACTIVE_BG;
                    fieldSelectButtons[i].style.color = isActive ? "#fff" : INACTIVE_FG;
                    fieldBadges[i].style.background = isActive ? PINK : INACTIVE_BG;
                    fieldBadges[i].style.color = isActive ? "#fff" : INACTIVE_FG;
                    fieldRows[i].style.borderColor = isActive ? PINK : "transparent";
                }
            }

            function setActiveField(i) {
                activeField = i;
                updateFieldSelectUI();
            }

            for (let i = 1; i <= MAX_FIELDS; i++) {
                fieldSelectButtons[i].addEventListener("click", () => setActiveField(i));
            }
            updateFieldSelectUI();

            function setFieldValue(i, value) {
                fieldWidgets[i].value = value;
                fieldInputs[i].value = value;
            }

            function setModelTypeValue(i, value) {
                modelTypeWidgets[i].value = value;
                modelTypeInputs[i].value = value;
            }

            // --------------------------------------------------------
            // Rendu de la liste des dossiers/fichiers
            // --------------------------------------------------------
            function renderList(items, emptyMessage, onPick) {
                listBox.innerHTML = "";
                if (!items || items.length === 0) {
                    const empty = document.createElement("div");
                    empty.style.padding = "6px";
                    empty.style.color = "#7fb8b0";
                    empty.style.fontStyle = "italic";
                    empty.textContent = emptyMessage;
                    listBox.appendChild(empty);
                    return;
                }
                items.forEach((item) => {
                    const row = document.createElement("div");
                    row.textContent = item;
                    row.style.padding = "3px 8px";
                    row.style.cursor = "pointer";
                    row.style.whiteSpace = "nowrap";
                    row.style.overflow = "hidden";
                    row.style.textOverflow = "ellipsis";
                    row.addEventListener("mouseenter", () => {
                        if (!row.__active) row.style.background = "#0c3833";
                    });
                    row.addEventListener("mouseleave", () => {
                        if (!row.__active) row.style.background = "transparent";
                    });
                    row.addEventListener("click", () => {
                        [...listBox.children].forEach((c) => {
                            c.__active = false;
                            c.style.background = "transparent";
                        });
                        row.__active = true;
                        row.style.background = "#145048";
                        onPick(item, row);
                    });
                    listBox.appendChild(row);
                });
            }

            // --------------------------------------------------------
            // Filtre par extension
            // --------------------------------------------------------
            let currentFiles = [];
            let fieldOverwriteConfirmOverlay = null;

            async function onFilePick(item) {
                const origin = originInput.value.trim();
                const subdir = selectedDirInput.value.trim();
                const mode = outputModeWidget.value || "Absolu";
                status.textContent = `Saving into field ${activeField}...`;
                try {
                    const url =
                        "/multifileselect/join_path?origin=" +
                        encodeURIComponent(origin) +
                        "&dir=" +
                        encodeURIComponent(subdir) +
                        "&file=" +
                        encodeURIComponent(item) +
                        "&mode=" +
                        encodeURIComponent(mode);
                    const data = await apiGet(url);
                    const newPath = data.path || "";
                    const fieldToFill = activeField;
                    const detectedModelType = extractModelTypeFromPath(origin, subdir);

                    const apply = () => {
                        setFieldValue(fieldToFill, newPath);
                        setModelTypeValue(fieldToFill, detectedModelType);
                        status.textContent = `Field ${fieldToFill} filled (${mode === "Relatif" ? "Relative" : "Absolute"}).`;
                    };

                    const currentFieldValue = (fieldInputs[fieldToFill].value || "").trim();
                    if (currentFieldValue && !node.properties.fileOverwriteSkipConfirm) {
                        if (!fieldOverwriteConfirmOverlay) {
                            fieldOverwriteConfirmOverlay = buildFieldOverwriteConfirmOverlay(container);
                        }
                        fieldOverwriteConfirmOverlay.show(fieldToFill, newPath, (confirmed, skip) => {
                            if (!confirmed) {
                                status.textContent = `Replacement of field ${fieldToFill} cancelled.`;
                                return;
                            }
                            if (skip) {
                                node.properties.fileOverwriteSkipConfirm = true;
                                updateFieldOverwriteCancelBtn();
                            }
                            apply();
                        });
                    } else {
                        apply();
                    }
                } catch (e) {
                    status.textContent = "Error: " + e.message;
                }
            }

            function clearExtensionOptions() {
                currentFiles = [];
                extSelect.innerHTML = "";
                const opt = document.createElement("option");
                opt.value = "";
                opt.textContent = "Choose the extension type...";
                extSelect.appendChild(opt);
                extSelect.value = "";
                extSelect.disabled = true;
            }

            function populateExtensionOptions(files) {
                const exts = new Set();
                files.forEach((f) => {
                    const idx = f.lastIndexOf(".");
                    if (idx > 0 && idx < f.length - 1) {
                        exts.add(f.slice(idx + 1).toLowerCase());
                    }
                });
                const sorted = [...exts].sort();
                extSelect.innerHTML = "";
                const defaultOpt = document.createElement("option");
                defaultOpt.value = "";
                defaultOpt.textContent = "Choose the extension type...";
                extSelect.appendChild(defaultOpt);
                sorted.forEach((ext) => {
                    const opt = document.createElement("option");
                    opt.value = ext;
                    opt.textContent = "." + ext;
                    extSelect.appendChild(opt);
                });
                extSelect.value = "";
                // Rien a filtrer si le dossier ne contient qu'un seul
                // type d'extension (ou aucune extension detectee).
                extSelect.disabled = sorted.length <= 1;
            }

            function applyExtensionFilter() {
                const ext = extSelect.value;
                if (!ext) {
                    renderList(currentFiles, "Empty directory", onFilePick);
                    return;
                }
                const filtered = currentFiles.filter((f) =>
                    f.toLowerCase().endsWith("." + ext)
                );
                renderList(filtered, `No .${ext} file`, onFilePick);
            }

            extSelect.addEventListener("change", applyExtensionFilter);
            clearExtensionOptions();

            // --------------------------------------------------------
            // Actions
            // --------------------------------------------------------
            originBrowseBtn.addEventListener("click", async () => {
                status.textContent = "Opening the Windows folder browser...";
                originBrowseBtn.disabled = true;
                originBrowseBtn.style.opacity = "0.5";
                try {
                    const initial = originInput.value.trim();
                    const url =
                        "/multifileselect/browse_dir" +
                        (initial ? "?initial=" + encodeURIComponent(initial) : "");
                    const data = await apiGet(url);
                    if (data.path) {
                        originInput.value = data.path;
                        originWidget.value = data.path;
                        status.textContent = "Directory chosen: " + data.path;
                    } else {
                        status.textContent = "Selection cancelled.";
                    }
                } catch (e) {
                    status.textContent = "Error: " + e.message;
                } finally {
                    originBrowseBtn.disabled = false;
                    originBrowseBtn.style.opacity = "1";
                }
            });

            originBtn.addEventListener("click", async () => {
                const origin = originInput.value.trim();
                if (!origin) {
                    status.textContent = "Enter an origin directory first.";
                    return;
                }
                originWidget.value = origin;
                status.textContent = "Loading folders...";
                clearExtensionOptions();
                try {
                    const data = await apiGet(
                        "/multifileselect/list_dirs?path=" + encodeURIComponent(origin)
                    );
                    node.fileSelectMode = "dirs";
                    const dirs = data.dirs || [];
                    status.textContent =
                        dirs.length > 0
                            ? `${dirs.length} folder(s) found.`
                            : "No subdirectory with files.";
                    renderList(dirs, "No subdirectory with files.", (item) => {
                        selectedDirWidget.value = item;
                        selectedDirInput.value = item;
                    });
                } catch (e) {
                    status.textContent = "Error: " + e.message;
                    renderList([], e.message, () => {});
                }
            });

            selectedDirBtn.addEventListener("click", async () => {
                const origin = originInput.value.trim();
                const subdir = selectedDirInput.value.trim();
                if (!origin) {
                    status.textContent = "Enter an origin directory first.";
                    return;
                }
                originWidget.value = origin;
                selectedDirWidget.value = subdir;
                status.textContent = "Loading files...";
                try {
                    const url =
                        "/multifileselect/list_files?origin=" +
                        encodeURIComponent(origin) +
                        "&subdir=" +
                        encodeURIComponent(subdir);
                    const data = await apiGet(url);
                    node.fileSelectMode = "files";
                    const files = data.files || [];
                    currentFiles = files;
                    populateExtensionOptions(files);
                    status.textContent =
                        files.length > 0 ? `${files.length} file(s) found.` : "Empty directory";
                    renderList(files, "Empty directory", onFilePick);
                } catch (e) {
                    status.textContent = "Error: " + e.message;
                    clearExtensionOptions();
                    renderList([], e.message, () => {});
                }
            });

            originInput.addEventListener("input", () => {
                originWidget.value = originInput.value;
            });
            selectedDirInput.addEventListener("input", () => {
                selectedDirWidget.value = selectedDirInput.value;
            });

            // --------------------------------------------------------
            // Widget DOM englobant + taille du noeud
            // --------------------------------------------------------
            const MIN_WIDTH = 340;
            const MIN_HEIGHT = 460;

            node.addDOMWidget("multifileselect_ui", "multifileselect", container, {
                serialize: false,
                hideOnZoom: false,
            });

            const onResize = node.onResize;
            node.onResize = function (size) {
                if (size[0] < MIN_WIDTH) size[0] = MIN_WIDTH;
                if (size[1] < minHeight()) size[1] = minHeight();
                return onResize ? onResize.apply(this, arguments) : undefined;
            };

            function refreshFromWidgets() {
                originInput.value = originWidget.value || "";
                selectedDirInput.value = selectedDirWidget.value || "";
                updateToggleUI(outputModeWidget.value || "Absolu");
                for (let i = 1; i <= MAX_FIELDS; i++) {
                    fieldInputs[i].value = fieldWidgets[i].value || "";
                    modelTypeInputs[i].value = modelTypeWidgets[i].value || "";
                }
                // Options ajoutees : relues depuis node.properties (rempli
                // par configure() apres onNodeCreated), puis sorties
                // realignees (un workflow d'avant les options n'en a pas).
                const extra = Number(node.properties.extraFields) || 0;
                node.properties.extraFields = Math.min(Math.max(extra, 0), MAX_FIELDS - BASE_FIELDS);
                syncOptionOutputs();
                updateOptionUI();
                updateFieldSelectUI();
                // Le "C" (Ne plus demander) est calcule une premiere fois
                // a la creation du widget, avant que node.properties ne
                // soit rempli par les valeurs sauvegardees du workflow
                // (configure() s'execute apres onNodeCreated). Sans ce
                // rafraichissement ici, un workflow sauvegarde avec "Ne
                // plus demander" actif rechargeait avec la confirmation
                // reellement desactivee (proprete lue correctement par
                // onFilePick) mais le bouton C invisible, donnant
                // l'impression a tort que la confirmation etait cassee.
                updateFieldOverwriteCancelBtn();
            }

            const onConfigure = node.onConfigure;
            node.onConfigure = function () {
                const ret = onConfigure ? onConfigure.apply(this, arguments) : undefined;
                refreshFromWidgets();
                return ret;
            };

            refreshFromWidgets();
            node.setSize([Math.max(node.size[0], MIN_WIDTH), Math.max(node.size[1], minHeight())]);
            node.setDirtyCanvas(true, true);

            return r;
        };

        // ------------------------------------------------------------
        // Renommer une sortie (clic droit sur le noeud) : ne change que
        // l'etiquette affichee sur le canvas (node.outputs[i].label),
        // jamais le nom technique ("unused N") utilise par
        // ComfyUI pour l'execution du workflow. Persiste avec le
        // workflow sauvegarde (les outputs sont serialises tels quels).
        // ------------------------------------------------------------
        // Meme renommage, directement par double-clic sur le nom d'une
        // sortie (comme sur le noeud Switch Pixaroma) : un <input>
        // temporaire est pose par-dessus l'etiquette sur le canvas.
        const onDblClick = nodeType.prototype.onDblClick;
        nodeType.prototype.onDblClick = function (e, pos) {
            const r = onDblClick ? onDblClick.apply(this, arguments) : undefined;
            const i = hitOutputLabel(this, pos);
            if (i >= 0) openOutputLabelEditor(this, i);
            return r;
        };

        const onRemoved = nodeType.prototype.onRemoved;
        nodeType.prototype.onRemoved = function () {
            if (activeOutputEditor && activeOutputEditor.node === this) {
                activeOutputEditor.close(false);
            }
            return onRemoved ? onRemoved.apply(this, arguments) : undefined;
        };

        const onExtraMenuOptions = nodeType.prototype.getExtraMenuOptions;
        nodeType.prototype.getExtraMenuOptions = function (canvas, options) {
            const r = onExtraMenuOptions
                ? onExtraMenuOptions.apply(this, arguments)
                : undefined;
            const node = this;
            if (node.outputs && node.outputs.length) {
                options.push(null);
                node.outputs.forEach((out, i) => {
                    const current = out.label || out.name;
                    options.push({
                        content: "Rename output \"" + current + "\"...",
                        callback: () => {
                            const value = window.prompt(
                                "New name for this output:",
                                current
                            );
                            if (value === null) return;
                            const trimmed = value.trim();
                            out.label = trimmed || undefined;
                            node.setDirtyCanvas(true, true);
                        },
                    });
                });
            }
            return r;
        };
    },
});
