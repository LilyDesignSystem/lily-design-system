# Code

## Metadata

- Component: code
- PascalCase: Code
- Description: an inline code span for displaying short code snippets within surrounding text
- HTML tag: <code>
- CSS class: .code
- Interactive: no

## Key Behaviors

- Uses native `<code>` element for semantic inline code
- Content is provided through child elements
- No interactive behavior -- purely presentational

## ARIA

- No additional ARIA attributes needed -- the `<code>` element provides semantic meaning natively

## Keyboard

- None -- code spans are informational, not interactive

## Props

- `children`: slot (required) -- the code text content
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <code> element with class="code"
- [ ] Child content is rendered correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .code in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/code.html
- MDN `<code>` element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/code
