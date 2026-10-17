"""
Ecriture des exports de champs (.json) dans le dossier de sauvegarde
choisi par la roue crantee du noeud. Module pur (sans ComfyUI), teste par
tests/test_exports.py.
"""

import json
import os
import re

# Nom produit par le JS : date en prefixe, ex.
# "20261017-143000_multifileselect_fields.json".
EXPORT_NAME_RE = re.compile(r"^\d{8}-\d{6}_multifileselect_fields\.json$")


def free_path(folder, name):
    """Chemin libre dans folder : name, sinon "base (2).json", "base (3).json"..."""
    path = os.path.join(folder, name)
    if not os.path.exists(path):
        return path
    base, ext = os.path.splitext(name)
    n = 2
    while True:
        path = os.path.join(folder, f"{base} ({n}){ext}")
        if not os.path.exists(path):
            return path
        n += 1


def write_export(folder, name, content):
    """
    Ecrit content (texte JSON) dans folder/name et renvoie le chemin ecrit.
    N'ecrase jamais un fichier existant. Leve ValueError si le dossier est
    vide, le nom invalide ou le contenu n'est pas du JSON, et
    FileNotFoundError si le dossier n'existe pas.
    """
    folder = (folder or "").strip()
    if not folder:
        raise ValueError("No save folder.")
    if not EXPORT_NAME_RE.match(name or ""):
        raise ValueError("Invalid export file name.")
    try:
        json.loads(content)
    except (TypeError, ValueError):
        raise ValueError("The export is not valid JSON.")
    if not os.path.isdir(folder):
        raise FileNotFoundError(f"Folder not found: {folder}")
    path = free_path(folder, name)
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(content)
    return path
