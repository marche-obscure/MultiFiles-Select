"""Tests de l'ecriture des exports (sans ComfyUI) :
    python -m unittest discover -s tests
"""

import importlib.util
import json
import os
import tempfile
import unittest

_HERE = os.path.dirname(os.path.abspath(__file__))
_spec = importlib.util.spec_from_file_location("exports", os.path.join(_HERE, "..", "exports.py"))
exports = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(exports)

NAME = "20261017-143000_multifileselect_fields.json"
CONTENT = json.dumps({"format": "MultiFiles Select", "version": 1, "fields": []})


class WriteExportTest(unittest.TestCase):
    def test_ecrit_le_fichier(self):
        with tempfile.TemporaryDirectory() as d:
            path = exports.write_export(d, NAME, CONTENT)
            self.assertEqual(path, os.path.join(d, NAME))
            with open(path, encoding="utf-8") as f:
                self.assertEqual(f.read(), CONTENT)

    def test_n_ecrase_jamais(self):
        with tempfile.TemporaryDirectory() as d:
            exports.write_export(d, NAME, CONTENT)
            second = exports.write_export(d, NAME, CONTENT)
            third = exports.write_export(d, NAME, CONTENT)
            self.assertTrue(second.endswith("_multifileselect_fields (2).json"))
            self.assertTrue(third.endswith("_multifileselect_fields (3).json"))

    def test_accents_conserves(self):
        with tempfile.TemporaryDirectory() as d:
            text = json.dumps({"fields": [{"path": "Modèles\\é.safetensors"}]}, ensure_ascii=False)
            path = exports.write_export(d, NAME, text)
            with open(path, encoding="utf-8") as f:
                self.assertIn("Modèles", f.read())

    def test_dossier_absent(self):
        with tempfile.TemporaryDirectory() as d:
            with self.assertRaises(FileNotFoundError):
                exports.write_export(os.path.join(d, "absent"), NAME, CONTENT)

    def test_dossier_vide(self):
        with self.assertRaises(ValueError):
            exports.write_export("  ", NAME, CONTENT)

    def test_nom_invalide(self):
        with tempfile.TemporaryDirectory() as d:
            for bad in ["..\\x.json", "fields.json", "20261017-143000_multifileselect_fields.txt", ""]:
                with self.assertRaises(ValueError):
                    exports.write_export(d, bad, CONTENT)

    def test_contenu_non_json(self):
        with tempfile.TemporaryDirectory() as d:
            with self.assertRaises(ValueError):
                exports.write_export(d, NAME, "1 - loras : a.safetensors")


if __name__ == "__main__":
    unittest.main()
