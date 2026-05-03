# BeachBall

A decorative animated beach ball element.

See `components/beach-ball/index.md` for canonical documentation.

## Parameters

- `Label`: string (required) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `beach-ball`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<BeachBall Label="...">
    Content
</BeachBall>
```
