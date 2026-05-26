# ContentsLink

## Metadata

- Component: contents-link
- PascalCase: ContentsLink
- Description: one table of contents link
- HTML tag: <a>
- CSS class: .contents-link
- Interactive: yes

## Key Behaviors

- Uses native `<a>` element for inherent link behavior and keyboard support
- `aria-current="true"` indicates the currently active or visible section
- `href` attribute links to the target page or section anchor

## ARIA

- Implicit `link` role from `<a>` element
- `aria-current="true"` when the link corresponds to the currently visible section

## Keyboard

- Tab: Focus the link
- Enter: Follow the link

## Props

- `href`: string (required) -- the URL or anchor the link points to
- `current`: boolean (default: false) -- whether this is the currently active section
- `children`: slot (required) -- link text content
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <a> element with class="contents-link"
- [ ] Has href attribute
- [ ] Has aria-current attribute when current
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .contents-link in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/contents-link.html
