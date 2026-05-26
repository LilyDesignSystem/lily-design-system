# Blockquote

## Metadata

- Component: blockquote
- PascalCase: Blockquote
- Description: a block-level quotation with optional source citation
- HTML tag: <blockquote>
- CSS class: .blockquote
- Interactive: no

## Key Behaviors

- Uses a native `<blockquote>` element for inherent quotation semantics
- `cite` prop maps to the native `cite` attribute (URL of the source)
- `citationText` prop renders inside a `<footer class="blockquote-citation">` element
- `label` prop optionally overrides the accessible name via aria-label
- Children provide the quoted content
- No JavaScript behavior; the component is passive

## ARIA

- Implicit `blockquote` semantics from the `<blockquote>` element
- `aria-label` optional override
- `cite` attribute references source URL (HTML semantic, not surfaced to most AT)

## Keyboard

- None (passive element)

## Props

- `cite`: string (optional) -- URL of the source
- `citationText`: string (optional) -- visible attribution text
- `label`: string (optional) -- aria-label override
- `children`: slot -- quoted content
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <blockquote> element with class="blockquote"
- [ ] Native cite attribute equals cite prop when provided
- [ ] <footer class="blockquote-citation"> renders only when citationText provided
- [ ] aria-label rendered when label is provided
- [ ] Children content rendered inside the blockquote
- [ ] All user-facing strings come through props (i18n-ready)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .blockquote in css-style-sheet-template.css
- MDN <blockquote>: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/blockquote
- Mozilla Protocol Design System: https://protocol.mozilla.org/
