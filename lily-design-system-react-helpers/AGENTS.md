# AGENTS — Lily React Helpers

Catalog and conventions: [index.md](./index.md).

Each sibling directory is a self-contained helper. Find the helper's
`spec/index.md` for the canonical contract before changing it. Each helper
follows the file shape in [index.md § Conventions](./index.md#conventions).

## Helpers currently in the catalog

- [`lily-design-system-react-theme-picker`](./lily-design-system-react-theme-picker/) — dynamic theme CSS loader.
- [`lily-design-system-react-locale-picker`](./lily-design-system-react-locale-picker/) — `lang` + `dir` locale picker.
- [`lily-design-system-react-text-size-picker`](./lily-design-system-react-text-size-picker/) — `data-text-size` text-size picker.
- [`lily-design-system-react-motion-picker`](./lily-design-system-react-motion-picker/) — `data-motion` reduced-motion picker; defaults to the OS's own `(prefers-reduced-motion: reduce)` signal rather than a fixed slug.
- [`lily-design-system-react-share-picker`](./lily-design-system-react-share-picker/) — native share sheet, or a disclosure list of destinations plus copy-the-URL.
- [`lily-design-system-react-date-time-picker`](./lily-design-system-react-date-time-picker/) — form control for a date, a time, or both: a typeable field plus an APG Date Picker Dialog.
- [`lily-design-system-react-picker-bar`](./lily-design-system-react-picker-bar/) — composes theme-picker, locale-picker, text-size-picker, and share-picker into one page-header row. Owns no preference/action/form-value of its own; depends on the four wrapped pickers as real npm packages and pre-wires the 45-theme reference list and the seven-step text-size scale.

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
