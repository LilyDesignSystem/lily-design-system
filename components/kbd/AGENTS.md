# Kbd

## Metadata

- Component: kbd
- PascalCase: Kbd
- Description: show keyboard shortcuts and key combinations in a styled inline element
- Status: beta — implemented and unit-tested in all seven frameworks with an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <kbd>
- CSS class: .kbd
- Interactive: no

## Key Behaviors

- Renders a native `<kbd>` HTML element for semantic keyboard input markup
- Accepts `className` for CSS class targeting
- Spreads `restProps` onto the `<kbd>` element for consumer customization
- Children slot renders the key label text

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `className`: string (default: `""`) -- CSS class name for the element
- `label`: string (optional) -- spoken form, for a glyph such as ⌘: hidden text, with the visible key `aria-hidden`
- `children`: slot (required) -- the key label text content
- `...restProps`: unknown -- additional attributes spread onto the `<kbd>` element

## ARIA

- Native `<kbd>` element conveys keyboard input semantically
- Screen readers may announce the content as a keyboard shortcut depending on the user agent
- `label` gives the spoken form when the visible text is ambiguous (e.g. a single key glyph): hidden text in a `screen-reader-span`, with the visible key `aria-hidden` in a `.kbd-text`

## Acceptance Criteria

- [ ] Renders <kbd> element with class="kbd"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .kbd in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/kbd.html
- MDN kbd element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/kbd
