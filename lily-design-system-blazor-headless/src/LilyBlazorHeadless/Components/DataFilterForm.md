# DataFilterForm

A form for filtering data by criteria.

See `components/data-filter-form/index.md` for canonical documentation.

The default submit is always prevented. Read the values through `@bind-Value`.

## Parameters

- `Label`: string (required) — accessible name of the search landmark
- `OnSubmit`, `OnReset`: EventCallback<EventArgs>; `@onsubmit` and `@onreset` reach the same parameters
- `CssClass`: string — extra CSS classes appended to `data-filter-form`
- `ChildContent`: RenderFragment — the filter controls
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<DataFilterForm Label="Filter" OnSubmit="Apply">
    ...
</DataFilterForm>
```
