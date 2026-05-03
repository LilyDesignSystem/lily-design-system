# MockupWindow

A box area that looks like a desktop window.

See `components/mockup-window/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `mockup-window`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<MockupWindow Label="...">
    Content
</MockupWindow>
```
