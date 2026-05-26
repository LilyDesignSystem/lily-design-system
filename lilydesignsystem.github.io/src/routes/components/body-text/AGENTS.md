# Body Text

## Metadata

- Component: body-text
- PascalCase: BodyText
- Description: a rendered text block within a content width container
- HTML tag: <div>
- CSS class: .body-text
- Interactive: no

## Key Behaviors

- Wraps body text content for consistent typography targeting
- Consumer applies typography styles via .body-text class
- Intended to be used inside ContentBlock for width constraint
- Inspired by Reuters Graphics BodyText component

## ARIA

- None -- semantic content comes from child elements (p, ul, ol, etc.)

## Keyboard

- None

## Props

- `children`: slot (required) -- text content (paragraphs, lists, etc.)
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with class="body-text"
- [ ] Renders children slot for text content
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .body-text in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/body-text.html
