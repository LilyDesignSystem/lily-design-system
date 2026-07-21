# Examples — ShareChooser

| File | Shows |
| ---- | ----- |
| [basic.tsx](./basic.tsx) | Consumer-supplied destinations, the built-in copy item, and the announced copy outcome. |
| [custom-glyph.tsx](./custom-glyph.tsx) | Replacing the ↪ glyph with the `children` render prop, which receives `{ open, url }`. |

Every user-facing string is a prop, including `copyLabel` — the copy item
renders only when you name it, because a default would be hardcoded
English.
