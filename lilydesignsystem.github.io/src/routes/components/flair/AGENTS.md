# Flair

## Metadata

- Component: flair
- PascalCase: Flair
- Description: a decorative highlight or emphasis element
- HTML tag: <span>
- CSS class: .flair
- Interactive: no

## Key Behaviors

- Renders a `<span>` element for inline display
- When no `label` is provided, sets `aria-hidden="true"` to mark it as decorative
- When `label` is provided, sets `aria-label` for screen reader announcement and removes `aria-hidden`
- Spreads `restProps` onto the `<span>` element for consumer customization

## ARIA

- `aria-hidden="true"` -- applied when no `label` is provided, marking the flair as decorative
- `aria-label` -- applied when `label` is provided, giving the flair an accessible name for screen readers

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (default: undefined) -- accessible label; omit for decorative flair, provide for meaningful flair
- `children`: slot (required) -- flair content text

## Acceptance Criteria

- [ ] Renders <span> element with class="flair"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .flair in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/flair.html
