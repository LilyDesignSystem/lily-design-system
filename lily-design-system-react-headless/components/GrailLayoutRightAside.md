# GrailLayoutRightAside

GrailLayoutRightAside is a headless container for the right aside section of a GrailLayout. It typically contains supplementary content, ads, related links, or contextual information.

## Props

- `className`: string (optional) -- CSS class name
- `children`: ReactNode (required) -- content to render inside the right aside
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Usage

```tsx
<GrailLayoutRightAside>
  <aside>Supplementary content</aside>
</GrailLayoutRightAside>
```
