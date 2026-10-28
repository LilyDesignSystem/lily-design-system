# GrailLayoutCenterMain

GrailLayoutCenterMain is a headless container for the center main content section of a GrailLayout. It holds the primary page content and is flanked by the left and right sidebars.

## Props

- `className`: string (optional) -- CSS class name
- `children`: ReactNode (required) -- content to render inside the center main content section
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Usage

```tsx
<GrailLayoutCenterMain>
  <main>Primary content</main>
</GrailLayoutCenterMain>
```
