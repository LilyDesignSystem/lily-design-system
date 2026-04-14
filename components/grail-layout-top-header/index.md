# Grail Layout Top Header

GrailLayoutTopHeader is a headless container for the top header section of a GrailLayout. It spans the full width of the layout and typically contains site branding, navigation, or a top bar.

## Implementation Notes

- Renders a `<div>` element for the top header section
- Spreads `restProps` onto the div for consumer customization
- No styles applied; consumer provides all styling

## Props

- `children`: slot (required) -- content to render inside the top header section
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## When to Use

- Use inside GrailLayout as the full-width top header area.
- Use to contain site branding, top navigation, or a banner bar.
- Use when the page layout requires a persistent header spanning the full width above the sidebar and main content.

## When Not to Use

- Do not use outside GrailLayout -- use Header for standalone page headers.
- Do not use for inline section headings -- use a semantic `<h1>`-`<h6>` element instead.

## Usage

```html
<GrailLayout>
  <GrailLayoutTopHeader>
    <Header label="Clinical Portal" />
  </GrailLayoutTopHeader>
  <GrailLayoutLeftAside>...</GrailLayoutLeftAside>
  <GrailLayoutCenterMain>...</GrailLayoutCenterMain>
  <GrailLayoutRightAside>...</GrailLayoutRightAside>
  <GrailLayoutBottomFooter>...</GrailLayoutBottomFooter>
</GrailLayout>
```


## Styles

The consumer provides all CSS styling. The component renders with a `.grail-layout-top-header` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<header>` element with class `grail-layout-top-header`
- Verify pass-through attributes are applied

## Composition

GrailLayoutTopHeader is used as a child of GrailLayout. Place semantic `<header>` or `<nav>` elements inside for proper accessibility.

## References

- CSS Grid Layout: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout
