# AGENTS — Filter (Nunjucks helper)

Single source of truth: [spec/index.md](./spec/index.md), which defers to the canonical
[Svelte spec](../lily-design-system-svelte-filter/spec/index.md). Read both first.

## What this package is

A headless Nunjucks filter builder: conditions and groups over typed fields, written out as JSON, SQL,
MongoDB, OData or a predicate. Ships no CSS and no English text. A macro plus a client runtime: the macro cannot render conditions.

## Files

| File | Purpose |
| ---- | ------- |
| `filter-builder.njk` | The macro. |
| `filter-builder.client.js` | The client runtime. |
| `filter-builder.test.ts` | Vitest spec, one test per Svelte §8 clause plus the macro. |
| `filter-model.ts`, `search-text.ts` (+ tests) | Pure model, copied from `shared/`. |

## Rules

- Never edit a copy of `filter-model.ts` or `search-text.ts`: edit `shared/` and run `bin/sync-shared-modules`.
- Class hooks are stable: `filter`, `filter-group`, `filter-rule`, `filter-field`, `filter-operator`, `filter-value`, `filter-choices`, `filter-output-text`, `filter-status`, and the buttons.
- Run the tests with `pnpm test`.
