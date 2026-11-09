# DescriptionListItem

## Metadata

- Component: description-list-item
- PascalCase: DescriptionListItem
- Description: one key-value pair in a description list using dt and dd elements
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <div>
- CSS class: .description-list-item
- Interactive: no

## Key Behaviors

- Renders a `<div>` around the consumer's `<dt>` (term) and `<dd>` (description) so each item is a single styling unit while preserving native list semantics
- Per HTML5, wrapping `<dt>`/`<dd>` pairs in a `<div>` inside `<dl>` is valid
- The consumer supplies the `<dt>` and `<dd>` as children; the component builds neither and takes no `label` (a `<div>` is generic, and ARIA does not allow naming one)
- Spreads `restProps` onto the root `<div>`

## ARIA

- `<dt>` and `<dd>` retain their native term/description semantics inside the wrapper

## Keyboard

- No keyboard interactions

## Props

- `children`: slot (required) (default: —) — The `<dt>` and `<dd>` elements
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
