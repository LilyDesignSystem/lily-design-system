# AGENTS — Lily Svelte Helpers

Catalog and conventions: [index.md](./index.md).

Each sibling directory is a self-contained helper. Find the helper's
`spec/index.md` for the canonical contract before changing it. Each helper
follows the file shape in [index.md § Conventions](./index.md#conventions).

## Helpers currently in the catalog

- [`lily-design-system-svelte-theme-chooser`](./lily-design-system-svelte-theme-chooser/) — dynamic theme CSS loader.
- [`lily-design-system-svelte-locale-chooser`](./lily-design-system-svelte-locale-chooser/) — `lang` + `dir` locale chooser.
- [`lily-design-system-svelte-text-size-chooser`](./lily-design-system-svelte-text-size-chooser/) — `data-text-size` text-size chooser.
- [`lily-design-system-svelte-share-chooser`](./lily-design-system-svelte-share-chooser/) — share via the native sheet or a list of consumer-supplied destinations, plus copy-the-URL. Owns an *action*, not a preference: applies nothing, persists nothing.

## Working rules

- Treat each helper's `spec/index.md` as the single source of truth.
- Match the upstream Svelte conventions in
  [`../lily-design-system-svelte-headless/AGENTS/sveltekit.md`](../lily-design-system-svelte-headless/AGENTS/sveltekit.md)
  where they apply (runes, snippets, rest-prop spread, no `<style>`
  blocks, etc.).
- Tests use vitest + jsdom + `@testing-library/svelte`.
- No hardcoded user-facing strings; everything comes from props.
