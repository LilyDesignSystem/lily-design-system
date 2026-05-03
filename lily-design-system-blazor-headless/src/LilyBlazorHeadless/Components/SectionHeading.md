# SectionHeading

A styled heading introducing a major content section, with optional eyebrow and subtitle.

See `components/section-heading/index.md` for canonical documentation.

## Parameters

- `Label`: string (optional) — accessible label set on `aria-label`
- `CssClass`: string — extra CSS classes appended to `section-heading`
- `ChildContent`: RenderFragment — component content
- `AdditionalAttributes`: catches unmatched HTML attributes

## Usage

```razor
<SectionHeading>
    Content
</SectionHeading>
```
