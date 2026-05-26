# Photo Pack

## Metadata

- Component: photo-pack
- PascalCase: PhotoPack
- Description: a collection of photos displayed together as a group
- HTML tag: <div>
- CSS class: .photo-pack
- Interactive: no

## Key Behaviors

- Uses `<div>` element with `role="group"` for group semantics
- Groups multiple FeaturePhoto components together
- Consumer controls layout (grid, masonry, row) via CSS

## ARIA

- `role="group"` -- identifies the collection as a semantic group
- `aria-label` -- describes the photo collection for screen readers

## Keyboard

- None -- child FeaturePhoto components are not interactive

## Props

- `label`: string (required) -- accessible label for the photo collection
- `children`: slot (required) -- FeaturePhoto components
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with class="photo-pack"
- [ ] Has role="group" attribute
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .photo-pack in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/photo-pack.html
