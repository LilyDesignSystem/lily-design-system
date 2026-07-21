# AGENTS — Lily React Helpers

Catalog and conventions: [index.md](./index.md).

Each sibling directory is a self-contained helper. Find the helper's
`spec/index.md` for the canonical contract before changing it. Each helper
follows the file shape in [index.md § Conventions](./index.md#conventions).

## Helpers currently in the catalog

- [`lily-design-system-react-theme-chooser`](./lily-design-system-react-theme-chooser/) — dynamic theme CSS loader.
- [`lily-design-system-react-locale-chooser`](./lily-design-system-react-locale-chooser/) — `lang` + `dir` locale chooser.
- [`lily-design-system-react-text-size-chooser`](./lily-design-system-react-text-size-chooser/) — `data-text-size` text-size chooser.
- [`lily-design-system-react-share-chooser`](./lily-design-system-react-share-chooser/) — native share sheet, or a disclosure list of destinations plus copy-the-URL.

## Working rules

- Treat each helper's `spec/index.md` as the single source of truth.
- React 19 function components, TypeScript, hooks only
  (`useState`, `useEffect`, `useRef`). No class components, no legacy
  lifecycle methods.
- Tests use vitest + jsdom + `@testing-library/react`.
- Spread rest props onto the root element so consumers can pass
  arbitrary HTML attributes through.
- No hardcoded user-facing strings; everything comes from props.
- No bundled CSS, fonts, icons, or images.
