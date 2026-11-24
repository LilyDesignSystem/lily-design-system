---
name: lily-design-system-solid-helpers-skill
description: Explains Lily Design System's Solid 2.0 helper packages — the eleven *-picker helpers (theme, locale, text-size, motion, time-zone, share, search, link, menu, settings, date-time), picker-bar, the color picker, the Markdown and Org editors, filter, the grid-like data-grid, kanban-board, calendar and gantt-chart, and locale-translations — their npm names, props, render-prop icons, server rendering and the label packs. Use when someone asks which Solid helper package they need, how to install or wire one up in Solid, how its controlled and uncontrolled props work, or how to localise the grid-like helpers' labels.
license: MIT OR Apache-2.0 OR GPL-2.0-only OR GPL-3.0-only OR BSD-3-Clause OR OGL-UK-3.0 OR CC-BY-SA-4.0
---

# Lily Design System™ — Solid helpers

Twenty-one helper packages for Solid 2.0, each its own npm package, `@lilydesignsystem/solid-<package>`, built on
`@lilydesignsystem/solid-headless`. Where a headless component is a pure part, a helper owns one whole interaction.

```bash
pnpm add @lilydesignsystem/solid-theme-picker
```

Peer dependencies: `solid-js` and `@solidjs/web` `^2.0.0`. Like the headless library, each package has a `solid` export
condition (the JSX source, for a Solid app's own compiler) and a compiled `dist/index.js`.

| Package                                                                                  | What it owns                                                                                     |
| ---------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `theme-picker`, `locale-picker`, `text-size-picker`, `motion-picker`, `time-zone-picker` | A preference: an icon button opening a listbox; applies to the document; optional `localStorage` |
| `share-picker`, `link-picker`                                                            | A disclosure of real links (and, for share, copy and the native share sheet)                     |
| `search-picker`, `menu-picker`, `settings-picker`                                        | A disclosure panel: a search form, or whatever content the app gives                             |
| `date-time-picker`                                                                       | A form value: a typeable field plus an APG date-picker dialog                                    |
| `picker-bar`                                                                             | The page-header row of link, search, theme, locale, time-zone, text-size and share pickers       |
| `color-picker`                                                                           | A colour: recent colours, a palette, and entry by hex, CSS name, HSL, HSB, RGB or CMYK           |
| `markdown-editor`, `org-editor`                                                          | A textarea with a toolbar that writes Markdown or Org                                            |
| `filter`                                                                                 | A rule-and-group builder that outputs JSON, SQL, MongoDB, OData or a predicate                   |
| `data-grid`, `kanban-board`, `calendar`, `gantt-chart`                                   | The grid-like helpers: keyboard grids with editing, search, export and virtualisation            |
| `locale-translations`                                                                    | The 64 label packs and the CLDR time-zone name packs, with `labelsFor` and `zoneNamesFrom`       |

## Conventions

- **`class`, not `className`**, and rest props spread onto the root.
- **Every user-facing string is a prop.** No English defaults: `label`s are required, and the grid-like helpers take a
  `labels` object. Load a locale's pack rather than writing one:

  ```tsx
  import { labelsFor } from "@lilydesignsystem/solid-locale-translations";
  import cy from "@lilydesignsystem/solid-locale-translations/cy-001";
  <DataGrid
    label="Patients"
    columns={columns}
    rows={rows()}
    labels={labelsFor("data-grid", cy)}
  />;
  ```

  63 of the 64 packs are unreviewed machine drafts; have a native speaker check the screen-reader wording.

- **Controlled or uncontrolled.** Pass `value` (from a signal) with `onChange` to own the value; omit `value` and use
  `defaultValue` to let the helper hold it. A picker's `open` works the same way, with `onOpenChange`.
- **`children` is a render prop that replaces the icon**, not the options: `{(args) => <MyIcon open={args.open} />}`.
- **Server rendering**: a helper renders on the server and touches the DOM only in effects; preference pickers read
  `localStorage` and `matchMedia` after mount.
- **Applying is idempotent**: a preference already applied writes nothing and calls no callback, so writing the value
  back from `onChange` does not loop.
- **Forms**: a field bound to a value also binds its default, so a form reset does not clear it.

## When NOT this skill

- For the headless components themselves, use `lily-design-system-solid-headless-skill`.
- For the map of the Solid layers and the example app, use `lily-design-system-solid-skill`.
- Full contracts: `spec/helpers/index.md` and each package's `spec/index.md`.
