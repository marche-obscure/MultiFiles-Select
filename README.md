# ComfyUI-MultiFileSelect

A ComfyUI custom node that lets you pick up to **5 files** (7 with the two
optional fields) from the same origin directory without typing paths by
hand, and store each one in its own numbered field.

## Installation

1. Clone this repository into your `custom_nodes` folder:

   ```
   cd ComfyUI/custom_nodes
   git clone https://github.com/marche-obscure/MultiFiles-Select.git ComfyUI-MultiFileSelect
   ```

2. Restart ComfyUI.
3. In the node search menu, look for **MultiFiles Select** (category
   `utils/file`).

No extra Python dependency is required.

## Usage

1. **Origin directory**: paste the full path of the starting directory, or
   use the gear icon to pick it with the Windows folder browser (Windows
   only). The **ComfyUI folder shortcut...** drop-down at the top fills this
   field instantly with a standard folder of your installation (root,
   models, output, input, temp, user, custom_nodes), plus
   **Models (Linker)** when an `extra_model_paths.yaml` file exists at the
   ComfyUI root.
2. Click the purple magnifier: the subdirectories that directly contain at
   least one file are listed.
3. Click a folder in the list.
4. Choose the active field with the square buttons **1 2 3 4 5** (plus
   **6** and **7** when the optional fields are added): it will receive
   the next selected file.
5. Click the pink magnifier to list the files of that folder. Filter them
   with the extension menu if needed (it is disabled automatically when
   the folder holds a single extension). `.json`, `.info`, `.md` and
   `.sha*` files are hidden.
6. Choose **Absolute** or **Relative**, then click a file: it is stored in
   the active field in that format. Each field keeps its own format even if
   you switch modes afterwards to fill another one. If the field already
   holds a value, a confirmation is asked before overwriting it (a
   **Don't ask again** box is available; a round **C** icon then appears to
   turn the confirmation back on).

### Type field

Each numbered field is preceded by a small **Type** field, filled
automatically when a file is selected: if the path contains a `models`
folder, it takes the name of the folder right after it (e.g.
`diffusion_models`). It stays empty otherwise and can be edited by hand.
It is informative only and has no output.

### Optional fields 6 and 7

The pink **+** button below the fields adds one extra field at a time:
first field 6 with an **Option 1** output, then field 7 with an
**Option 2** output. The dark red **−** button removes the last added field
with its content and output; if that output is connected, a confirmation
is asked before the link(s) are deleted. The number of added fields is
saved with the workflow.

### Export / import (.txt)

- The download icon exports `multifileselect_fields.txt`, with one line
  per filled field: `N - <Type> : <field content>`, e.g.
  `1 - diffusion_models : MyFolder\myfile.safetensors`.
- The upload icon next to it reloads a file in the same format and fills
  the fields (overwriting them without confirmation). A number missing
  from the file, or an empty value on its line, clears the matching
  field. A filled line 6 or 7 adds the matching optional field
  automatically.

## Outputs

Five outputs named `unused 1` to `unused 5` by default: the path stored in
fields 1 to 5 (the number matches the field), plus **Option 1** and **Option 2** when the
optional fields are added. These are "wildcard" outputs: they can be
connected to any input type, not only STRING. The value passed at run time
is always a string, though, so a connection can still fail at execution if
the downstream node expects a completely different kind of data (an image,
a model, ...).

To rename an output label (e.g. `unused 1` → `Models`), **double-click its
name** on the right side of the node and type the new one (**Enter** or a
click elsewhere to validate, **Esc** to cancel, empty = back to the
default name). You can also right-click the node and choose
**Rename output "..."**. This only changes what is shown on the canvas,
not the technical name used at execution; the new label is saved with the
workflow.

## Notes

- The fields remain editable by hand if you prefer typing a path.
- The trash icon to the right of each field clears it (and its Type field)
  immediately, without confirmation.
- The **?** button opens a help window describing every control.

## License

MIT License — Copyright (c) 2026 marche-obscure. See [LICENSE](LICENSE).
