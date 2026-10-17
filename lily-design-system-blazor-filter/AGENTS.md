# AGENTS — Filter (Blazor helper)

Single source of truth: [spec/index.md](./spec/index.md), which defers to the canonical
[Svelte spec](../lily-design-system-svelte-filter/spec/index.md). Read both first.

## What this package is

A headless Blazor filter builder: conditions and groups over typed fields, written out as JSON, SQL,
MongoDB, OData or a predicate. Ships no CSS and no English text. Depends on the data-grid package for `SearchText`.

## Files

| File | Purpose |
| ---- | ------- |
| `FilterBuilder.razor`, `FilterBuilder.razor.cs` | The component and `FilterLabels`. |
| `FilterModel.cs` | The model, validation and the five outputs (static, pure). |
| `FilterBuilderTests.cs` | bUnit spec, one test per Svelte §8 clause. |
| `FilterModelTests.cs` | The model's tests, vector for vector from the Svelte suite. |

## Rules

- Never edit a copy of `filter-model.ts` or `search-text.ts`: edit `shared/` and run `bin/sync-shared-modules`.
- Class hooks are stable: `filter`, `filter-group`, `filter-rule`, `filter-field`, `filter-operator`, `filter-value`, `filter-choices`, `filter-output-text`, `filter-status`, and the buttons.
- Run the tests with `cd tests && dotnet test`.
