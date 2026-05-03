# CallToAction

A prominent prompt encouraging user action.

See `components/call-to-action/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `call-to-action`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<CallToAction>
    Content
</CallToAction>
```
