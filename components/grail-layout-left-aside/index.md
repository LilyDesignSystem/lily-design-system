# Grail Layout Left Aside

GrailLayoutLeftAside is a headless container for the left aside section of a GrailLayout. It typically contains navigation menus, filters, or supplementary content.

## Implementation Notes

- Renders a `<div>` element for the left aside section
- Spreads `restProps` onto the div for consumer customization
- No styles applied; consumer provides all styling

## Props

- `children`: slot (required) -- content to render inside the left aside
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## When to Use

- Use inside GrailLayout as the left sidebar for navigation or supplementary content.
- Use to contain a TreeNav, AccordionNav, or other navigation components.
- Use when the page layout needs a persistent left-hand panel for wayfinding.

## When Not to Use

- Do not use outside GrailLayout -- use Sidebar for standalone side panels.
- Do not use for right-hand supplementary content -- use GrailLayoutRightAside instead.

## Usage

```html
<GrailLayout>
  <GrailLayoutTopHeader>...</GrailLayoutTopHeader>
  <GrailLayoutLeftAside>
    <TreeNav label="Sections">
      <TreeList>
        <TreeListItem><TreeLink href="/patients">Patients</TreeLink></TreeListItem>
        <TreeListItem><TreeLink href="/appointments">Appointments</TreeLink></TreeListItem>
      </TreeList>
    </TreeNav>
  </GrailLayoutLeftAside>
  <GrailLayoutCenterMain>...</GrailLayoutCenterMain>
  <GrailLayoutRightAside>...</GrailLayoutRightAside>
  <GrailLayoutBottomFooter>...</GrailLayoutBottomFooter>
</GrailLayout>
```


## Styles

The consumer provides all CSS styling. The component renders with a `.grail-layout-left-aside` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<aside>` element with class `grail-layout-left-aside`
- Verify pass-through attributes are applied

## Composition

GrailLayoutLeftAside is used as a child of GrailLayout. Place semantic `<nav>` or `<aside>` elements inside for proper accessibility.

## References

- CSS Grid Layout: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout
