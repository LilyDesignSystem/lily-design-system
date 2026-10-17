# AGENTS — Filter (Angular helper)

Single source of truth: [spec/index.md](./spec/index.md), which defers to the canonical
[Svelte spec](../lily-design-system-svelte-filter/spec/index.md). Read both first.

## What this package is

A headless Angular filter builder: conditions and groups over typed fields, written out as JSON, SQL,
MongoDB, OData or a predicate. Ships no CSS and no English text. Bind with `[(value)]`; read each edit from `(valueChange)`.

## Files

| File | Purpose |
| ---- | ------- |
| `filter.component.ts` | The component (selector `lily-filter`). |
| `filter-group-view.component.ts` | One group, recursively. |
| `filter-host.ts` | The labels type, the `FilterHost` token and small helpers. |
| `filter.component.spec.ts` | Vitest spec, one test per Svelte §8 clause. |
| `filter-model.ts`, `search-text.ts` (+ tests) | Pure model, copied from `shared/`. |
| `index.ts` | Public API. |

## Rules

- Never edit a copy of `filter-model.ts` or `search-text.ts`: edit `shared/` and run `bin/sync-shared-modules`.
- Class hooks are stable: `filter`, `filter-group`, `filter-rule`, `filter-field`, `filter-operator`, `filter-value`, `filter-choices`, `filter-output-text`, `filter-status`, and the buttons.
- Run the tests with `pnpm test`.
