# FlexStack

A flex layout container for vertical or horizontal stacking with consistent gap.

See `components/flex-stack/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `flex-stack`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<FlexStack>
    Content
</FlexStack>
```
