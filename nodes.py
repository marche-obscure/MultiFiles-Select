import os


class AnyType(str):
    """
    Type "joker" : ComfyUI compare les types des sorties/entrees avec '=='
    pour savoir si un branchement est autorise. En redefinissant '__eq__'
    pour toujours renvoyer True, ce type se compare comme egal a n'importe
    quel autre type declare (STRING, IMAGE, MODEL, ...), ce qui autorise le
    branchement d'une sortie de ce type sur une entree de n'importe quel
    type. La valeur reellement transmise a l'execution reste cependant une
    chaine de caracteres (voir 'run' plus bas).
    """

    def __eq__(self, other):
        return True

    def __ne__(self, other):
        return False


ANY_TYPE = AnyType("*")


def _join_or_empty(parts):
    parts = [p for p in parts if p]
    if not parts:
        return ""
    result = os.path.normpath(os.path.join(*parts))
    if result == ".":
        return ""
    return result


class MultiFileSelect:
    """
    Variante de FileSelect permettant de choisir jusqu'a 5 fichiers depuis
    un meme repertoire d'origine, et de les ranger chacun dans un champ
    numerote (1 a 5).

    Le contenu de chaque champ ('field_1' a 'field_5') est deja compose
    (dossier + fichier, en absolu ou en relatif) au moment de la
    selection cote interface (JS), via la route API '/multifileselect/
    join_path' qui reutilise la meme logique de composition de chemin que
    le noeud FileSelect d'origine. Le noeud se contente donc de retourner
    tel quel le contenu de chacun des 5 champs en sortie STRING : chaque
    champ garde le format (absolu/relatif) qui etait actif au moment ou
    il a ete rempli, meme si le mode est change ensuite pour les
    selections suivantes.

    Les champs restent modifiables a la main si besoin.

    Chaque champ numerote est precede d'un champ 'model_type_N' rempli
    automatiquement a chaque selection de fichier : il cherche un
    segment "models" dans le chemin origine + sous-repertoire et
    recupere le nom du dossier qui le suit immediatement (ex:
    ".../models/diffusion_models" -> "diffusion_models"). Reste vide si
    aucun segment "models" n'est trouve, et modifiable a la main.
    """

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "origin_dir": ("STRING", {"default": "", "multiline": False}),
                "selected_dir": ("STRING", {"default": "", "multiline": False}),
                # STRING plutot que menu deroulant : voir FileSelect,
                # meme raison (un COMBO se dessine par-dessus l'UI meme
                # masque).
                "output_mode": ("STRING", {"default": "Absolu"}),
                "model_type_1": ("STRING", {"default": "", "multiline": False}),
                "field_1": ("STRING", {"default": "", "multiline": False}),
                "model_type_2": ("STRING", {"default": "", "multiline": False}),
                "field_2": ("STRING", {"default": "", "multiline": False}),
                "model_type_3": ("STRING", {"default": "", "multiline": False}),
                "field_3": ("STRING", {"default": "", "multiline": False}),
                "model_type_4": ("STRING", {"default": "", "multiline": False}),
                "field_4": ("STRING", {"default": "", "multiline": False}),
                "model_type_5": ("STRING", {"default": "", "multiline": False}),
                "field_5": ("STRING", {"default": "", "multiline": False}),
                # Champs optionnels 6 et 7 ("Option 1" / "Option 2") :
                # toujours declares, mais affiches cote JS seulement
                # quand l'utilisateur les ajoute (bouton "+"). Places en
                # fin de liste pour que les workflows enregistres avant
                # leur ajout retrouvent leurs valeurs a la meme position.
                "model_type_6": ("STRING", {"default": "", "multiline": False}),
                "field_6": ("STRING", {"default": "", "multiline": False}),
                "model_type_7": ("STRING", {"default": "", "multiline": False}),
                "field_7": ("STRING", {"default": "", "multiline": False}),
            },
        }

    # Les 5 sorties utilisent le type "joker" ANY_TYPE : elles se
    # branchent donc sur n'importe quel type d'entree (STRING, IMAGE,
    # MODEL, ...), pas seulement STRING. La valeur transmise a
    # l'execution reste neanmoins toujours une chaine de caracteres (voir
    # 'run' plus bas) : le branchement peut donc quand meme echouer a
    # l'execution si le noeud en aval attend un tout autre type de
    # donnee (une image, un modele, ...) qu'une chaine.
    # Les sorties 6 et 7 ne sont presentes sur le noeud qu'une fois
    # l'option correspondante ajoutee (gere cote JS) ; l'ordre des
    # sorties ne change jamais, les liens restent donc sur le bon index.
    RETURN_TYPES = (ANY_TYPE,) * 7
    RETURN_NAMES = ("unused",) * 5 + ("Option 1", "Option 2")
    FUNCTION = "run"
    CATEGORY = "utils/file"
    DESCRIPTION = (
        "Browses an origin directory and lets you pick up to 5 files "
        "(one per numbered field, 1 to 5), each as an absolute or "
        "relative path depending on the mode active when it was "
        "selected, and returns the resulting paths (5 outputs named "
        "'unused', plus 'Option 1' and 'Option 2' when those optional "
        "fields have been added). These are wildcard outputs: they "
        "connect to any input type, but the value passed is always a "
        "string. Each output can be renamed by double-clicking its name, "
        "or by right-clicking the node ('Rename output ...' menu)."
    )

    def run(
        self,
        origin_dir,
        selected_dir,
        output_mode,
        model_type_1,
        field_1,
        model_type_2,
        field_2,
        model_type_3,
        field_3,
        model_type_4,
        field_4,
        model_type_5,
        field_5,
        model_type_6="",
        field_6="",
        model_type_7="",
        field_7="",
    ):
        return (
            (field_1 or "").strip(),
            (field_2 or "").strip(),
            (field_3 or "").strip(),
            (field_4 or "").strip(),
            (field_5 or "").strip(),
            (field_6 or "").strip(),
            (field_7 or "").strip(),
        )
