# MockupLaptop

A box area that looks like a laptop computer.

See `components/mockup-laptop/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `mockup-laptop`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<MockupLaptop Label="...">
    Content
</MockupLaptop>
```
