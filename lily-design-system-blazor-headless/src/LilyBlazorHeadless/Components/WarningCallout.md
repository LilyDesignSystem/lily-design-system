# WarningCallout

A callout box highlighting a warning message.

See `components/warning-callout/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `warning-callout`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<WarningCallout>
    Content
</WarningCallout>
```
