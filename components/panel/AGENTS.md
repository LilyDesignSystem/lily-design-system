# Panel

## Metadata

- Component: panel
- PascalCase: Panel
- Description: a generic content panel with optional heading
- HTML tag: <div>
- CSS class: .panel
- Interactive: no

## Key Behaviors

- Renders a `<section>` HTML element, which creates a landmark region when labelled
- The `label` prop is required and applied via `aria-label` to name the region
- Content is provided via the `children` slot
- Rest props are spread onto the `<section>` element
- A `<section>` with `aria-label` becomes a navigable region in screen reader landmark lists

## ARIA

- `<section aria-label="...">` -- creates a named region landmark, allowing assistive technology to list and navigate to this section
- The `aria-label` value should be concise and descriptive of the panel's content

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name for the panel region via `aria-label`
- `children`: slot (required) -- the panel content
- `...restProps`: unknown -- additional attributes spread onto the `<section>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="panel"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .panel in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/panel.html
- WAI-ARIA region role: https://www.w3.org/TR/wai-aria-1.2/#region
- HTML section element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/section
- WAI Landmarks: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/
