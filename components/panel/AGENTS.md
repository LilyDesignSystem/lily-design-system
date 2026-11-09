# Panel

## Metadata

- Component: panel
- PascalCase: Panel
- Description: a generic content panel with optional heading
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
- HTML tag: <div>
- CSS class: .panel
- Interactive: no

## Key Behaviors

- Renders a `<div role="group">`: a page of panels as `<section>` regions would flood the landmark list
- The `label` prop is required and applied via `aria-label` to name the group
- Content is provided via the `children` slot
- Rest props are spread onto the root `<div>`
- For a panel that is a major part of the page, pass `role="region"` to make it a landmark

## ARIA

- `<div role="group" aria-label="...">` -- a named group, announced when entered, not added to the landmark list
- The `aria-label` value should be concise and descriptive of the panel's content

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name for the panel group via `aria-label`
- `children`: slot (required) -- the panel content
- `...restProps`: unknown -- additional attributes spread onto the root `<div>`

## Acceptance Criteria

- [ ] Renders <div> element with class="panel"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .panel in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/panel.html
- WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group
