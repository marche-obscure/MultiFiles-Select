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
        title: "CE QUE FAIT CE NOEUD",
        html:
            "<p>Permet de choisir jusqu'a <b>5 fichiers</b> depuis un " +
            "meme repertoire d'origine, sans avoir a taper les chemins " +
            "a la main. Chaque fichier choisi est range dans un champ " +
            "numerote (1 a 5), en chemin absolu ou relatif selon le " +
            "mode actif au moment de la selection.</p>",
    },
    {
        title: "COMMENT L'UTILISER",
        html:
            "<ul>" +
            "<li>Le menu deroulant <b>Raccourci dossier ComfyUI...</b>, " +
            "tout en haut, remplit instantanement <b>Repertoire " +
            "d'origine</b> avec un dossier standard de l'installation " +
            "(racine, models, output, input, temp, user, custom_nodes), " +
            "plus <b>Models (Linker)</b> si un fichier " +
            "extra_model_paths.yaml existe a la racine de ComfyUI.</li>" +
            "<li>Sinon, collez le chemin complet du repertoire de " +
            "depart dans <b>Repertoire d'origine</b> (ou utilisez " +
            "l'icone " + iconBadge(GEAR_ICON, VIOLET) + " pour le " +
            "choisir via l'explorateur Windows).</li>" +
            "<li>Cliquez sur " + iconBadge(SEARCH_ICON, VIOLET) + " pour " +
            "lister les sous-repertoires (seuls ceux contenant " +
            "directement au moins un fichier sont affiches).</li>" +
            "<li>Cliquez sur un dossier de la liste : il se place dans " +
            "<b>Repertoire selectionne</b>.</li>" +
            "<li>Choisissez le champ actif (boutons carres " +
            "<b>1 2 3 4 5</b>) : c'est lui qui recevra le prochain " +
            "fichier selectionne.</li>" +
            "<li>Cliquez sur " + iconBadge(SEARCH_ICON, PINK) + " pour " +
            "lister les fichiers de ce dossier. Filtrez au besoin avec " +
            "le menu d'extension (desactive automatiquement s'il n'y a " +
            "qu'un seul type d'extension dans le dossier).</li>" +
            "<li>Choisissez <b>Absolu</b> ou <b>Relatif</b>, puis " +
            "cliquez sur un fichier : il est enregistre dans le champ " +
            "actif, dans le format choisi, et le petit champ <b>Type</b> " +
            "juste devant se remplit automatiquement si le chemin " +
            'contient un dossier "models" (il recupere alors le nom du ' +
            "dossier suivant, ex : <b>diffusion_models</b>). Ce champ " +
            "reste modifiable a la main. Si le champ principal contient deja " +
            "une valeur, une confirmation est demandee avant de " +
            "l'ecraser, avec une case <b>Ne plus demander</b> pour " +
            "desactiver cette confirmation. Tant qu'elle est " +
            "desactivee, une icone " +
            iconBadge('<b style="color:#f0c98a;font-size:10px;">C</b>', "#5a3d1a", true) +
            " apparait entre le bouton Absolu/Relatif et le bouton " +
            "d'aide (?) pour la reactiver.</li>" +
            "<li>" + iconBadge(DOWNLOAD_ICON, PINK, true) + " exporte un " +
            "fichier .txt avec une ligne par champ numerote rempli (les " +
            'champs vides sont ignores) : "N - Type : contenu du champ", ' +
            'ex : "1 - diffusion_models : ' +
            'MonDossier\\monfichier.safetensors".</li>' +
            "<li>" + iconBadge(UPLOAD_ICON, PINK, true) + ", juste a " +
            "cote, recharge un fichier .txt dans ce meme format pour " +
            "remplir les champs automatiquement : pour chaque numero " +
            "trouve, le champ <b>Type</b> et le champ principal " +
            "correspondants sont remplis avec les valeurs lues " +
            "(ecrasant leur contenu actuel, sans confirmation). Si un " +
            "numero est absent du fichier, ou si une des deux valeurs " +
            "est vide sur sa ligne, le champ concerne est simplement " +
            "vide.</li>" +
            "</ul>",
    },
    {
        title: "CHAMPS NUMEROTES 1 A 5",
        html:
            "<p>Les 5 boutons carres choisissent quel champ recevra la " +
            "prochaine selection. Un seul champ est actif a la fois.</p>" +
            "<p>Le contenu d'un champ est fige au moment ou vous " +
            "cliquez sur le fichier : si vous changez ensuite le mode " +
            "<b>Absolu</b>/<b>Relatif</b> pour remplir un autre champ, " +
            "les champs deja remplis gardent leur propre format.</p>" +
            "<p>Chaque champ numerote est precede d'un petit champ " +
            "<b>Type</b> : il se remplit automatiquement en cherchant " +
            'un segment "models" dans le chemin (origine + ' +
            "sous-repertoire) et en recuperant le nom du dossier qui le " +
            "suit (ex : <b>diffusion_models</b>). Reste vide si aucun " +
            "segment \"models\" n'est trouve, et modifiable a la main.</p>" +
            "<p>Les 5 champs restent modifiables a la main si besoin. " +
            "L'icone " + iconBadge(TRASH_ICON, "#6b2b2b") + " a droite " +
            "de chaque champ vide immediatement (sans confirmation) le " +
            "champ principal et son champ <b>Type</b>.</p>",
    },
    {
        title: "SORTIES",
        html:
            "<p><b>file_path_out_1</b> a <b>file_path_out_5</b> " +
            "&mdash; le chemin correspondant a chacun des 5 champs.</p>" +
            "<p><b>Type</b> &mdash; les 5 sorties sont de type " +
            "<b>STRING</b> (chaine de caracteres), pas un type " +
            '"texte"/multiline particulier : n\'importe quel noeud ' +
            "attendant une entree STRING peut s'y brancher.</p>" +
            "<p><b>Renommer une sortie</b> &mdash; clic droit sur le " +
            "noeud, puis <b>Renommer la sortie \"...\"</b> : change " +
            "uniquement l'etiquette affichee (ex. <b>Models</b>), pas " +
            "le nom technique utilise par ComfyUI pour l'execution. " +
            "Le nouveau nom est sauvegarde avec le workflow.</p>",
    },
];

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
    breadcrumb.textContent = "UTILS / FILE / MULTI FILE SELECT";
    breadcrumb.style.fontSize = "10px";
    breadcrumb.style.letterSpacing = "0.06em";
    breadcrumb.style.color = TITLE_COLOR;
    breadcrumb.style.fontWeight = "700";
    breadcrumb.style.marginBottom = "4px";
    const title = document.createElement("div");
    title.textContent = "Multi File Select";
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
    checkLabel.textContent = "Ne plus demander";
    checkRow.appendChild(checkbox);
    checkRow.appendChild(checkLabel);
    card.appendChild(checkRow);

    const btnRow = document.createElement("div");
    btnRow.style.display = "flex";
    btnRow.style.gap = "8px";
    btnRow.style.justifyContent = "flex-end";

    const cancelBtn = document.createElement("button");
    cancelBtn.type = "button";
    cancelBtn.textContent = "Annuler";
    cancelBtn.style.padding = "6px 12px";
    cancelBtn.style.borderRadius = "6px";
    cancelBtn.style.border = "none";
    cancelBtn.style.background = "#2a2a2a";
    cancelBtn.style.color = "#ddd";
    cancelBtn.style.fontSize = "11px";
    cancelBtn.style.cursor = "pointer";

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.textContent = "Confirmer";
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
                "Le champ " + fieldNumber + " contient deja une valeur. " +
                "La remplacer par :\n" + path + " ?";
            msg.style.whiteSpace = "pre-wrap";
            checkbox.checked = false;
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
        const msg = (data && data.error) || `Erreur HTTP ${res.status}`;
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
            ];
            const modelTypeWidgets = [
                null,
                findWidget(node, "model_type_1"),
                findWidget(node, "model_type_2"),
                findWidget(node, "model_type_3"),
                findWidget(node, "model_type_4"),
                findWidget(node, "model_type_5"),
            ];

            hideWidget(node, originWidget);
            hideWidget(node, selectedDirWidget);
            hideWidget(node, outputModeWidget);
            for (let i = 1; i <= 5; i++) {
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
            const originInput = makeTextInput("Repertoire d'origine (full path)", false);
            const originBtn = makeIconButton(VIOLET, SEARCH_ICON);
            originBtn.title = "Lister les dossiers";
            const originBrowseBtn = makeIconButton(VIOLET, GEAR_ICON);
            originBrowseBtn.title = "Parcourir le PC...";
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
            setQuickPlaceholder("Raccourci dossier ComfyUI...");

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
                    rebuildQuickOptions("Raccourci dossier ComfyUI...");
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
                status.textContent = "Repertoire choisi : " + path;
                rebuildQuickOptions("Raccourci dossier ComfyUI...");
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
            const selectedDirInput = makeTextInput("Repertoire selectionne", false);
            const selectedDirBtn = makeIconButton(PINK);
            selectedDirBtn.title = "Lister les fichiers";
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
            status.textContent = "Cliquez sur la loupe violette pour commencer.";
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
            const fieldSelectButtons = [null, null, null, null, null, null];
            for (let i = 1; i <= 5; i++) {
                const b = document.createElement("button");
                b.type = "button";
                b.textContent = String(i);
                b.title = `Champ ${i} actif`;
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
            absBtn.textContent = "Absolu";
            const relBtn = document.createElement("button");
            relBtn.type = "button";
            relBtn.textContent = "Relatif";
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
                "Reactiver la confirmation avant d'ecraser un champ deja rempli";
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
                status.textContent = "Confirmation reactivee avant d'ecraser un champ.";
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
            saveBtn.title = "Telecharger les champs remplis (.txt)";
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
                for (let i = 1; i <= 5; i++) {
                    const fieldValue = (fieldInputs[i].value || "").trim();
                    if (!fieldValue) continue;
                    const modelType = (modelTypeInputs[i].value || "").trim();
                    lines.push(`${i} - ${modelType} : ${fieldValue}`);
                }
                if (lines.length === 0) {
                    status.textContent = "Aucun champ rempli a exporter.";
                    return;
                }
                const text = lines.join("\n");
                const blob = new Blob([text], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "multifileselect_champs.txt";
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
                status.textContent = `Fichier exporte (${lines.length} champ(s)).`;
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
            uploadBtn.title = "Importer un fichier de champs (.txt)";
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
                    // Pour chaque numero 1 a 5 : cherche la ligne
                    // correspondante et coupe au premier ":" (le
                    // model_type ne doit pas en contenir). Numero absent du
                    // fichier, ou valeur vide de part et d'autre du ":" ->
                    // le(s) champ(s) concerne(s) reste(nt) simplement vide(s).
                    for (let i = 1; i <= 5; i++) {
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
                        setFieldValue(i, fieldValue);
                        setModelTypeValue(i, modelType);
                    }
                    status.textContent = `Fichier importe : ${file.name}.`;
                };
                reader.onerror = () => {
                    status.textContent = "Erreur de lecture du fichier.";
                };
                reader.readAsText(file);
            });

            const helpBtn = document.createElement("button");
            helpBtn.type = "button";
            helpBtn.textContent = "?";
            helpBtn.title = "Aide";
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
            const fieldRows = [null, null, null, null, null, null];
            const fieldInputs = [null, null, null, null, null, null];
            const fieldBadges = [null, null, null, null, null, null];
            const modelTypeInputs = [null, null, null, null, null, null];
            for (let i = 1; i <= 5; i++) {
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
                modelTypeInput.title = "Type de modele (auto, ex : diffusion_models)";

                const input = makeTextInput(`Champ ${i}`, true);
                input.style.width = "100%";
                input.style.flex = "1";

                const clearBtn = makeIconButton("#6b2b2b", TRASH_ICON);
                clearBtn.title = `Vider le champ ${i}`;

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
                    status.textContent = `Champ ${i} vide.`;
                });
            }
            container.appendChild(fieldsWrap);

            // --------------------------------------------------------
            // Champ actif (1 a 5) : determine quel champ recoit la
            // prochaine selection de fichier. Le numero en face du champ
            // (badge) suit le meme etat actif/inactif que le bouton de
            // selection correspondant : un seul actif a la fois, changer
            // de champ desactive automatiquement le precedent.
            // --------------------------------------------------------
            let activeField = 1;

            function updateFieldSelectUI() {
                for (let i = 1; i <= 5; i++) {
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

            for (let i = 1; i <= 5; i++) {
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
                status.textContent = `Enregistrement dans le champ ${activeField}...`;
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
                        status.textContent = `Champ ${fieldToFill} rempli (${mode}).`;
                    };

                    const currentFieldValue = (fieldInputs[fieldToFill].value || "").trim();
                    if (currentFieldValue && !node.properties.fileOverwriteSkipConfirm) {
                        if (!fieldOverwriteConfirmOverlay) {
                            fieldOverwriteConfirmOverlay = buildFieldOverwriteConfirmOverlay(container);
                        }
                        fieldOverwriteConfirmOverlay.show(fieldToFill, newPath, (confirmed, skip) => {
                            if (!confirmed) {
                                status.textContent = `Remplacement du champ ${fieldToFill} annule.`;
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
                    status.textContent = "Erreur : " + e.message;
                }
            }

            function clearExtensionOptions() {
                currentFiles = [];
                extSelect.innerHTML = "";
                const opt = document.createElement("option");
                opt.value = "";
                opt.textContent = "Choisir le type d'extension...";
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
                defaultOpt.textContent = "Choisir le type d'extension...";
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
                    renderList(currentFiles, "Repertoire vide", onFilePick);
                    return;
                }
                const filtered = currentFiles.filter((f) =>
                    f.toLowerCase().endsWith("." + ext)
                );
                renderList(filtered, `Aucun fichier .${ext}`, onFilePick);
            }

            extSelect.addEventListener("change", applyExtensionFilter);
            clearExtensionOptions();

            // --------------------------------------------------------
            // Actions
            // --------------------------------------------------------
            originBrowseBtn.addEventListener("click", async () => {
                status.textContent = "Ouverture de l'explorateur Windows...";
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
                        status.textContent = "Repertoire choisi : " + data.path;
                    } else {
                        status.textContent = "Selection annulee.";
                    }
                } catch (e) {
                    status.textContent = "Erreur : " + e.message;
                } finally {
                    originBrowseBtn.disabled = false;
                    originBrowseBtn.style.opacity = "1";
                }
            });

            originBtn.addEventListener("click", async () => {
                const origin = originInput.value.trim();
                if (!origin) {
                    status.textContent = "Indiquez d'abord un repertoire d'origine.";
                    return;
                }
                originWidget.value = origin;
                status.textContent = "Chargement des dossiers...";
                clearExtensionOptions();
                try {
                    const data = await apiGet(
                        "/multifileselect/list_dirs?path=" + encodeURIComponent(origin)
                    );
                    node.fileSelectMode = "dirs";
                    const dirs = data.dirs || [];
                    status.textContent =
                        dirs.length > 0
                            ? `${dirs.length} dossier(s) trouve(s).`
                            : "Aucun sous-repertoire avec fichiers.";
                    renderList(dirs, "Aucun sous-repertoire avec fichiers.", (item) => {
                        selectedDirWidget.value = item;
                        selectedDirInput.value = item;
                    });
                } catch (e) {
                    status.textContent = "Erreur : " + e.message;
                    renderList([], e.message, () => {});
                }
            });

            selectedDirBtn.addEventListener("click", async () => {
                const origin = originInput.value.trim();
                const subdir = selectedDirInput.value.trim();
                if (!origin) {
                    status.textContent = "Indiquez d'abord un repertoire d'origine.";
                    return;
                }
                originWidget.value = origin;
                selectedDirWidget.value = subdir;
                status.textContent = "Chargement des fichiers...";
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
                        files.length > 0 ? `${files.length} fichier(s) trouve(s).` : "Repertoire vide";
                    renderList(files, "Repertoire vide", onFilePick);
                } catch (e) {
                    status.textContent = "Erreur : " + e.message;
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
                if (size[1] < MIN_HEIGHT) size[1] = MIN_HEIGHT;
                return onResize ? onResize.apply(this, arguments) : undefined;
            };

            function refreshFromWidgets() {
                originInput.value = originWidget.value || "";
                selectedDirInput.value = selectedDirWidget.value || "";
                updateToggleUI(outputModeWidget.value || "Absolu");
                for (let i = 1; i <= 5; i++) {
                    fieldInputs[i].value = fieldWidgets[i].value || "";
                    modelTypeInputs[i].value = modelTypeWidgets[i].value || "";
                }
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
            node.setSize([Math.max(node.size[0], MIN_WIDTH), Math.max(node.size[1], MIN_HEIGHT)]);
            node.setDirtyCanvas(true, true);

            return r;
        };

        // ------------------------------------------------------------
        // Renommer une sortie (clic droit sur le noeud) : ne change que
        // l'etiquette affichee sur le canvas (node.outputs[i].label),
        // jamais le nom technique (file_path_out_1 a _4) utilise par
        // ComfyUI pour l'execution du workflow. Persiste avec le
        // workflow sauvegarde (les outputs sont serialises tels quels).
        // ------------------------------------------------------------
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
                        content: "Renommer la sortie \"" + current + "\"...",
                        callback: () => {
                            const value = window.prompt(
                                "Nouveau nom pour cette sortie :",
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
