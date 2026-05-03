# HiddenInput

A hidden input for including data in form submission <input type="hidden">.

See `components/hidden-input/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `hidden-input`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<HiddenInput>
    Content
</HiddenInput>
```
