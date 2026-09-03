# AGENTS — Lily Svelte Helpers

Catalog and conventions: [index.md](./index.md).

Each sibling directory is a self-contained helper. Find the helper's
`spec/index.md` for the canonical contract before changing it. Each helper
follows the file shape in [index.md § Conventions](./index.md#conventions).

## Helpers currently in the catalog

- [`lily-design-system-svelte-theme-picker`](./lily-design-system-svelte-theme-picker/) — dynamic theme CSS loader.
- [`lily-design-system-svelte-locale-picker`](./lily-design-system-svelte-locale-picker/) — `lang` + `dir` locale picker.
- [`lily-design-system-svelte-text-size-picker`](./lily-design-system-svelte-text-size-picker/) — `data-text-size` text-size picker.
- [`lily-design-system-svelte-motion-picker`](./lily-design-system-svelte-motion-picker/) — `data-motion` reduced-motion picker; defaults to the OS's own `(prefers-reduced-motion: reduce)` signal rather than a fixed slug.
- [`lily-design-system-svelte-share-picker`](./lily-design-system-svelte-share-picker/) — share via the native sheet or a list of consumer-supplied destinations, plus copy-the-URL. Owns an _action_, not a preference: applies nothing, persists nothing.
- [`lily-design-system-svelte-date-time-picker`](./lily-design-system-svelte-date-time-picker/) — date / time / datetime field with an APG date-picker dialog. Owns a _form value_: applies nothing to the document and persists nothing, because a date in a form is data rather than a preference. The first helper that is a form control, so it has a text field alongside its icon button.

## Working rules

- Treat each helper's `spec/index.md` as the single source of truth.
- Match the upstream Svelte conventions in
  [`../lily-design-system-svelte-headless/AGENTS/sveltekit.md`](../lily-design-system-svelte-headless/AGENTS/sveltekit.md)
  where they apply (runes, snippets, rest-prop spread, no `<style>`
  blocks, etc.).
- Tests use vitest + jsdom + `@testing-library/svelte`.
- No hardcoded user-facing strings; everything comes from props.
