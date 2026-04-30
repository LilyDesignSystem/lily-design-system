# DescriptionListItem

## Metadata

- Component: description-list-item
- PascalCase: DescriptionListItem
- Description: one key-value pair in a description list using dt and dd elements
- HTML tag: <div>
- CSS class: .description-list-item
- Interactive: no

## Key Behaviors

- Renders a `<div>` wrapping a `<dt>` (term) and a `<dd>` (description) so each item is a single styling unit while preserving native list semantics
- Per HTML5, wrapping `<dt>`/`<dd>` pairs in a `<div>` inside `<dl>` is valid
- Term and description text come through props or slots
- Spreads `restProps` onto the root `<div>`

## ARIA

- `<dt>` and `<dd>` retain their native term/description semantics inside the wrapper

## Keyboard

- No keyboard interactions

## Props

- `term`: string (required) (default: —) — Term shown in the `<dt>`
- `description`: string (default: —) — Description shown in the `<dd>` (when no children slot)
- `children`: slot (default: —) — Custom description content (overrides `description`)
- `...restProps`: HTML attributes (default: —) — Spread onto the root `<div>`

## Acceptance Criteria

- [ ] Renders <div> element with class="description-list-item"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.description-list-item` in css-style-sheet-template.css
- [MDN dt element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dt)
- [MDN dd element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dd)
