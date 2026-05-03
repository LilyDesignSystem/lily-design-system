# StepListItem

One step in a step list with status of waiting, in progress, finished, or error.

See `components/step-list-item/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `step-list-item`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<StepListItem>
    Content
</StepListItem>
```
