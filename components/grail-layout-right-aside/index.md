# Grail Layout Right Aside

GrailLayoutRightAside is a headless container for the right aside section of a GrailLayout. It typically contains supplementary content, ads, related links, or contextual information.

## Implementation Notes

- Renders a `<div>` element for the right aside section
- Spreads `restProps` onto the div for consumer customization
- No styles applied; consumer provides all styling

## Props

- `children`: slot (required) -- content to render inside the right aside
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## When to Use

- Use inside GrailLayout as the right sidebar for supplementary content, related links, or contextual information.
- Use for quick links, help panels, or contextual widgets alongside the main content.
- Use when the page layout needs a secondary panel on the right-hand side.

## When Not to Use

- Do not use outside GrailLayout -- use Sidebar for standalone side panels.
- Do not use for primary navigation -- use GrailLayoutLeftAside instead.

## Usage

```html
<GrailLayout>
  <GrailLayoutTopHeader>...</GrailLayoutTopHeader>
  <GrailLayoutLeftAside>...</GrailLayoutLeftAside>
  <GrailLayoutCenterMain>...</GrailLayoutCenterMain>
  <GrailLayoutRightAside>
    <h2>Quick links</h2>
    <ul>
      <li><a href="/help">Help</a></li>
      <li><a href="/settings">Settings</a></li>
    </ul>
  </GrailLayoutRightAside>
  <GrailLayoutBottomFooter>...</GrailLayoutBottomFooter>
</GrailLayout>
```


## Styles

The consumer provides all CSS styling. The component renders with a `.grail-layout-right-aside` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<aside>` element with class `grail-layout-right-aside`
- Verify pass-through attributes are applied

## Composition

GrailLayoutRightAside is used as a child of GrailLayout. Place semantic `<aside>` elements inside for proper accessibility.

## References

- CSS Grid Layout: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout
