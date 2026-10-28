# GrailLayoutTopHeader

GrailLayoutTopHeader is a headless container for the top header section of a GrailLayout. It spans the full width and typically contains site branding, navigation, or a top bar.

## Props

- `className`: string (optional) -- CSS class name
- `children`: ReactNode (required) -- content to render inside the top header section
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Usage

```tsx
<GrailLayoutTopHeader>
  <header>Site Header</header>
</GrailLayoutTopHeader>
```
