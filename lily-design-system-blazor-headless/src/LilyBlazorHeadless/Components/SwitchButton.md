# SwitchButton

A toggle switch for turning a setting on or off.

See `components/switch-button/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `switch-button`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<SwitchButton Label="...">
    Content
</SwitchButton>
```
