"""
ComfyUI-MultiFileSelect
------------------------
Variante de ComfyUI-FileSelect permettant de choisir jusqu'a 4 fichiers
depuis un meme repertoire d'origine, chacun range dans un champ numerote
(1 a 4), en chemin absolu ou relatif selon le mode actif au moment de la
selection, avec 4 sorties STRING (file_path_1 a file_path_4).
"""

import os
import re
import sys
import asyncio
import subprocess
import traceback

from .nodes import MultiFileSelect, _join_or_empty
from .exports import write_export


def _safe_call(module, func_name):
    """Appelle module.func_name() si elle existe, sans jamais lever."""
    try:
        fn = getattr(module, func_name, None)
        return fn() if callable(fn) else ""
    except Exception:
        return ""


def _is_excluded_file(filename):
    """
    Exclut de la liste des fichiers proposes a la selection les fichiers
    annexes qui ne sont normalement pas ce que l'on cherche a selectionner
    (metadonnees, sommes de controle ou documentation) : extensions
    '.json', '.info', '.md', et toute extension commencant par '.sha'
    suivie uniquement de chiffres (ex : '.sha256', '.sha1', ...).
    """
    ext = os.path.splitext(filename)[1].lower()
    return ext in (".json", ".info", ".md") or bool(re.fullmatch(r"\.sha\d*", ext))


def _linker_models_dir(comfyui_root):
    """
    Cherche un fichier 'extra_model_paths.yaml' a la racine de
    l'installation ComfyUI (utilise notamment par l'outil externe
    Easy-Models-Linker pour centraliser les modeles ailleurs que dans
    l'installation elle-meme). S'il existe, retourne le dossier
    'models' a l'interieur du 'base_path' de la section marquee
    'is_default: true' (ou, a defaut, de la premiere section du fichier
    qui declare un 'base_path'), sous la forme '<base_path>/models'.
    Renvoie une chaine vide si le fichier est absent, illisible, ou ne
    contient aucune section utilisable (echec silencieux : ce raccourci
    est une simple commodite, pas une fonctionnalite essentielle).
    """
    if not comfyui_root:
        return ""

    yaml_path = os.path.join(comfyui_root, "extra_model_paths.yaml")
    if not os.path.isfile(yaml_path):
        return ""

    try:
        import yaml

        with open(yaml_path, "r", encoding="utf-8") as f:
            data = yaml.safe_load(f) or {}
    except Exception:
        return ""

    if not isinstance(data, dict):
        return ""

    default_base = ""
    first_base = ""
    for section in data.values():
        if not isinstance(section, dict):
            continue
        base_path = section.get("base_path")
        if not base_path:
            continue
        if not first_base:
            first_base = base_path
        if section.get("is_default") and not default_base:
            default_base = base_path

    base_path = default_base or first_base
    if not base_path:
        return ""

    return os.path.join(base_path, "models")


NODE_CLASS_MAPPINGS = {
    "MultiFileSelect": MultiFileSelect,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "MultiFileSelect": "MultiFiles Select",
}

# Le frontend (fichiers JS) se trouve dans le dossier web/js.
# ComfyUI le sert automatiquement et le charge au demarrage.
WEB_DIRECTORY = "./web/js"

# ------------------------------------------------------------------
# Routes API utilisees par le frontend pour lister les repertoires,
# les fichiers, parcourir le PC et composer les chemins de sortie.
# ------------------------------------------------------------------
try:
    from server import PromptServer
    from aiohttp import web

    routes = PromptServer.instance.routes

    @routes.get("/multifileselect/list_dirs")
    async def multifileselect_list_dirs(request):
        """
        Retourne la liste des sous-repertoires (chemins relatifs, separateur
        '/') contenus dans le repertoire d'origine fourni en parametre
        'path', en ne gardant que ceux qui contiennent directement au moins
        un fichier (un dossier qui ne contient que des sous-dossiers, sans
        fichier a lui, n'est pas remonte : il n'a rien a selectionner).
        """
        origin = request.rel_url.query.get("path", "").strip()

        if not origin:
            return web.json_response({"error": "Empty path."}, status=400)

        if not os.path.isdir(origin):
            return web.json_response(
                {"error": f"Directory not found: {origin}"}, status=400
            )

        dirs = []
        try:
            for root, subdirs, files in os.walk(origin):
                subdirs[:] = [
                    d for d in subdirs
                    if not d.startswith(".") and d not in ("__pycache__",)
                ]
                if root != origin and files:
                    rel = os.path.relpath(root, origin)
                    dirs.append(rel.replace(os.sep, "/"))
        except Exception as e:
            return web.json_response({"error": str(e)}, status=500)

        dirs.sort(key=lambda s: s.lower())
        return web.json_response({"dirs": dirs})

    @routes.get("/multifileselect/list_files")
    async def multifileselect_list_files(request):
        """
        Retourne la liste des fichiers contenus dans <origin>/<subdir>.
        subdir peut etre vide (= le repertoire d'origine lui-meme).
        """
        origin = request.rel_url.query.get("origin", "").strip()
        subdir = request.rel_url.query.get("subdir", "").strip()

        if not origin:
            return web.json_response({"error": "Empty origin directory."}, status=400)

        target = os.path.normpath(os.path.join(origin, subdir)) if subdir else origin

        origin_norm = os.path.normpath(origin)
        if os.path.commonpath([origin_norm, target]) != origin_norm:
            return web.json_response({"error": "Invalid path."}, status=400)

        if not os.path.isdir(target):
            return web.json_response(
                {"error": f"Directory not found: {target}"}, status=400
            )

        try:
            entries = os.listdir(target)
            files = sorted(
                (
                    f for f in entries
                    if os.path.isfile(os.path.join(target, f))
                    and not _is_excluded_file(f)
                ),
                key=lambda s: s.lower(),
            )
        except Exception as e:
            return web.json_response({"error": str(e)}, status=500)

        return web.json_response({"files": files})

    @routes.get("/multifileselect/browse_dir")
    async def multifileselect_browse_dir(request):
        """
        Ouvre le vrai explorateur de dossiers Windows (cote serveur) et
        retourne le chemin absolu choisi.
        """
        if sys.platform != "win32":
            return web.json_response(
                {"error": "This feature is only available on Windows."},
                status=400,
            )

        initial = request.rel_url.query.get("initial", "").strip()
        initial_line = ""
        if initial and os.path.isdir(initial):
            safe_initial = initial.replace('"', '`"')
            initial_line = f'$dialog.SelectedPath = "{safe_initial}"'

        script = f"""
Add-Type -AssemblyName System.Windows.Forms
$dialog = New-Object System.Windows.Forms.FolderBrowserDialog
$dialog.Description = "Select a directory"
$dialog.ShowNewFolderButton = $true
{initial_line}
$result = $dialog.ShowDialog()
if ($result -eq [System.Windows.Forms.DialogResult]::OK) {{
    Write-Output $dialog.SelectedPath
}}
"""

        def run_dialog():
            proc = subprocess.run(
                ["powershell", "-NoProfile", "-STA", "-Command", script],
                capture_output=True,
                text=True,
                timeout=300,
            )
            return proc.stdout.strip()

        loop = asyncio.get_event_loop()
        try:
            path = await loop.run_in_executor(None, run_dialog)
        except Exception as e:
            return web.json_response({"error": str(e)}, status=500)

        return web.json_response({"path": path or ""})

    @routes.get("/multifileselect/dir_exists")
    async def multifileselect_dir_exists(request):
        """Indique si le dossier 'path' existe (fenetre du dossier de sauvegarde)."""
        path = request.rel_url.query.get("path", "").strip()
        return web.json_response({"exists": bool(path) and os.path.isdir(path)})

    @routes.post("/multifileselect/save_export")
    async def multifileselect_save_export(request):
        """
        Ecrit un export de champs (.json) dans le dossier de sauvegarde :
        corps JSON {folder, name, content}. Ne remplace jamais un fichier
        existant (suffixe " (2)"...). Renvoie {path} ou {error}.
        """
        try:
            data = await request.json()
        except Exception:
            return web.json_response({"error": "Invalid request."}, status=400)
        try:
            path = write_export(data.get("folder", ""), data.get("name", ""), data.get("content", ""))
        except (ValueError, FileNotFoundError) as e:
            return web.json_response({"error": str(e)}, status=400)
        except OSError as e:
            return web.json_response({"error": str(e)}, status=500)
        return web.json_response({"path": path})

    @routes.get("/multifileselect/join_path")
    async def multifileselect_join_path(request):
        """
        Compose le chemin final (dossier + fichier) pour un champ, en
        reutilisant la meme logique que FileSelect.run() : chemin absolu
        (origine + sous-dossier + fichier) si mode == 'Absolu', sinon
        chemin relatif (sous-dossier + fichier). Appelee par le JS au
        moment ou l'utilisateur clique sur un fichier, pour figer
        immediatement le format (absolu/relatif) du champ concerne.
        """
        origin = request.rel_url.query.get("origin", "").strip()
        subdir = request.rel_url.query.get("dir", "").strip()
        file_name = request.rel_url.query.get("file", "").strip()
        mode = request.rel_url.query.get("mode", "Absolu").strip()

        if mode == "Absolu":
            path = _join_or_empty([origin, subdir, file_name])
        else:
            path = _join_or_empty([subdir, file_name])

        return web.json_response({"path": path})

    @routes.get("/multifileselect/quick_dirs")
    async def multifileselect_quick_dirs(request):
        """
        Retourne une liste de raccourcis vers les dossiers standards de
        l'installation ComfyUI (racine, models, output, input, temp,
        user, custom_nodes), pour remplir rapidement le 'Repertoire
        d'origine' sans avoir a le taper ou a parcourir le PC. S'appuie
        sur le module 'folder_paths' de ComfyUI (uniquement disponible
        lorsque ce noeud tourne reellement dans ComfyUI). Ajoute aussi
        'Models (Linker)' quand un fichier 'extra_model_paths.yaml' est
        present a la racine de l'installation (voir _linker_models_dir).
        """
        options = []
        try:
            import folder_paths

            custom_nodes_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
            comfyui_root = getattr(folder_paths, "base_path", "")

            candidates = [
                ("ComfyUI folder (root)", comfyui_root),
                ("models", getattr(folder_paths, "models_dir", "")),
                ("Models (Linker)", _linker_models_dir(comfyui_root)),
                ("output", _safe_call(folder_paths, "get_output_directory")),
                ("input", _safe_call(folder_paths, "get_input_directory")),
                ("temp", _safe_call(folder_paths, "get_temp_directory")),
                ("user", _safe_call(folder_paths, "get_user_directory")),
                ("custom_nodes", custom_nodes_dir),
            ]
            for label, path in candidates:
                if path and os.path.isdir(path):
                    options.append({"label": label, "path": os.path.normpath(path)})
        except Exception as e:
            return web.json_response({"error": str(e)}, status=500)

        return web.json_response({"dirs": options})

except Exception:
    print("[ComfyUI-MultiFileSelect] Could not register the API routes:")
    traceback.print_exc()

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS", "WEB_DIRECTORY"]
