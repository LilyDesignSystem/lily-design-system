# DescriptionList

## Metadata

- Component: description-list
- PascalCase: DescriptionList
- Description: a definition list displaying information in key-value format <dl>
- HTML tag: <dl>
- CSS class: .description-list
- Interactive: no

## Key Behaviors

- Renders a native `<dl>` element with `DescriptionListItem` children
- Each child wraps a `<dt>` term and one or more `<dd>` descriptions
- Spreads `restProps` onto the root `<dl>`

## ARIA

- Native `<dl>` semantics describe a list of associated terms and descriptions
- Screen readers announce the term/description relationship

## Keyboard

- No keyboard interactions — this is a passive content list

## Props

- `children`: slot (required) (default: —) — `DescriptionListItem` children
- `...restProps`: HTML attributes (default: —) — Spread onto the root `<dl>`

## Acceptance Criteria

- [ ] Renders <dl> element with class="description-list"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.description-list` in css-style-sheet-template.css
- [MDN dl element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dl)
