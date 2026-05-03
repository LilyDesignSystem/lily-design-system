# Coachmark

An anchored popover that spotlights and explains a single feature.

See `components/coachmark/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `coachmark`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<Coachmark Label="...">
    Content
</Coachmark>
```
