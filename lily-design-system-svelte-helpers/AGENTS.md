# AGENTS — Lily Svelte Helpers

Catalog and conventions: [index.md](./index.md).

Each sibling directory is a self-contained helper. Find the helper's
`spec.md` for the canonical contract before changing it. Each helper
follows the file shape in [index.md § Conventions](./index.md#conventions).

## Helpers currently in the catalog

- [`lily-design-system-svelte-theme-picker`](./lily-design-system-svelte-theme-picker/) — dynamic theme CSS loader.
- [`lily-design-system-svelte-locale-picker`](./lily-design-system-svelte-locale-picker/) — `lang` + `dir` locale picker.

## Working rules

- Treat each helper's `spec.md` as the single source of truth.
- Match the upstream Svelte conventions in
  [`../lily-design-system-svelte-headless/AGENTS/sveltekit.md`](../lily-design-system-svelte-headless/AGENTS/sveltekit.md)
  where they apply (runes, snippets, rest-prop spread, no `<style>`
  blocks, etc.).
- Tests use vitest + jsdom + `@testing-library/svelte`.
- No hardcoded user-facing strings; everything comes from props.
