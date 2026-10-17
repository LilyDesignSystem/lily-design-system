# AGENTS — Filter (Web Components helper)

Single source of truth: [spec/index.md](./spec/index.md), which defers to the canonical
[Svelte spec](../lily-design-system-svelte-filter/spec/index.md). Read both first.

## What this package is

A headless Web Components filter builder: conditions and groups over typed fields, written out as JSON, SQL,
MongoDB, OData or a predicate. Ships no CSS and no English text. Registers `<lily-filter-builder>` on import; set `fields`, `labels`, `value` as properties.

## Files

| File | Purpose |
| ---- | ------- |
| `filter-builder.ts` | The custom element class (not registered). |
| `filter-builder.test.ts` | Vitest spec, one test per Svelte §8 clause. |
| `filter-model.ts`, `search-text.ts` (+ tests) | Pure model, copied from `shared/`. |
| `index.ts` | Barrel re-export; registers the element. |

## Rules

- Never edit a copy of `filter-model.ts` or `search-text.ts`: edit `shared/` and run `bin/sync-shared-modules`.
- Class hooks are stable: `filter`, `filter-group`, `filter-rule`, `filter-field`, `filter-operator`, `filter-value`, `filter-choices`, `filter-output-text`, `filter-status`, and the buttons.
- Run the tests with `pnpm test`.
