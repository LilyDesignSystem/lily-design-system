# GrailLayoutBottomFooter

GrailLayoutBottomFooter is a headless container for the bottom footer section of a GrailLayout. It spans the full width and typically contains copyright, links, or site-wide footer content.

## Props

- `className`: string (optional) -- CSS class name
- `children`: ReactNode (required) -- content to render inside the bottom footer section
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Usage

```tsx
<GrailLayoutBottomFooter>
  <footer>Site Footer</footer>
</GrailLayoutBottomFooter>
```
