# AGENTS — Filter (Vue 3 helper)

Single source of truth: [spec/index.md](./spec/index.md), which defers to the canonical
[Svelte spec](../lily-design-system-svelte-filter/spec/index.md). Read both first.

## What this package is

A headless Vue 3 filter builder: conditions and groups over typed fields, written out as JSON, SQL,
MongoDB, OData or a predicate. Ships no CSS and no English text. Use `v-model` for the filter and the `change` event to be told of each edit.

## Files

| File | Purpose |
| ---- | ------- |
| `Filter.vue` | The component. |
| `FilterGroupView.vue` | One group, recursively; reads the context from `filter-context.ts`. |
| `filter-context.ts` | Labels type, the shared context and small helpers. |
| `Filter.test.ts` | Vitest spec, one test per Svelte §8 clause. |
| `filter-model.ts`, `search-text.ts` (+ tests) | Pure model, copied from `shared/`. |
| `index.ts` | Barrel re-export. |

## Rules

- Never edit a copy of `filter-model.ts` or `search-text.ts`: edit `shared/` and run `bin/sync-shared-modules`.
- Class hooks are stable: `filter`, `filter-group`, `filter-rule`, `filter-field`, `filter-operator`, `filter-value`, `filter-choices`, `filter-output-text`, `filter-status`, and the buttons.
- Run the tests with `pnpm test`.
