# Draft

A wrapper marking content as a work-in-progress draft with an optional status.

See `components/draft/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `Status`: string (optional) — workflow status, written to `data-status` when non-empty
- `CssClass`: string — extra CSS classes appended to `draft`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<Draft Label="Draft article" Status="in-progress">
    <h3>Working title</h3>
    <p>Opening paragraph still needs a hook.</p>
</Draft>
```
