# SliderButton

A button with a slider that the user needs to slide to confirm.

See `components/slider-button/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `slider-button`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<SliderButton Label="...">
    Content
</SliderButton>
```
