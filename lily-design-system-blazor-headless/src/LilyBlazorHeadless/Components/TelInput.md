# TelInput

An input for entering a telephone number <input type="tel">.

See `components/tel-input/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `tel-input`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<TelInput Label="...">
    Content
</TelInput>
```
