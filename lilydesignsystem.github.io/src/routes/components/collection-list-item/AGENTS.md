# CollectionListItem

## Metadata

- Component: collection-list-item
- PascalCase: CollectionListItem
- Description: one item in a collection list with optional image, heading, meta, and description
- HTML tag: <li>
- CSS class: .collection-list-item
- Interactive: no (heading link is interactive when href is provided)

## Key Behaviors

- Renders a `<li>` with class `collection-list-item`
- `heading` prop is REQUIRED and rendered as an `<h3>`
- When `href` is provided, heading text is wrapped in an `<a>`; otherwise plain text
- Optional `imageUrl` + `imageAlt` render an `<img class="collection-list-item-image">`
- Optional `meta` renders `<p class="collection-list-item-meta">`
- Optional `description` renders `<p class="collection-list-item-description">`
- Optional `children` render after the description
- Optional `label` sets `aria-label`

## ARIA

- Implicit `listitem` role from the `<li>` element
- `aria-label` is rendered only when `label` is provided
- Image `alt` provides the image's accessible text

## Keyboard

- Tab: moves focus to the heading link (when href is provided) or to descendants
- All key handling is delegated to the contained interactive elements

## Props

- `heading`: string (REQUIRED) -- item heading text
- `meta`: string (optional) -- meta line
- `description`: string (optional) -- body description
- `imageUrl`: string (optional) -- thumbnail image src
- `imageAlt`: string (optional) -- thumbnail image alt
- `href`: string (optional) -- wraps heading in <a>
- `label`: string (optional) -- aria-label override
- `children`: slot -- additional content
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <li> element with class="collection-list-item"
- [ ] heading text appears inside an <h3> element
- [ ] heading is wrapped in <a> when href is provided
- [ ] heading is plain text when href is omitted
- [ ] image renders only when imageUrl is provided
- [ ] meta paragraph renders only when meta is provided
- [ ] description paragraph renders only when description is provided
- [ ] children render after the description when supplied
- [ ] aria-label is rendered only when label is provided
- [ ] Additional HTML attributes pass through to the root element
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .collection-list-item in css-style-sheet-template.css
- US Web Design System Collection: https://designsystem.digital.gov/components/collection/
- WAI-ARIA listitem role: https://www.w3.org/TR/wai-aria-1.2/#listitem
