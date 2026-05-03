# MockupWatch

A box area that looks like a smart watch.

See `components/mockup-watch/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `mockup-watch`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<MockupWatch Label="...">
    Content
</MockupWatch>
```
