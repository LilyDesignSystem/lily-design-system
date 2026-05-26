# Headline

## Metadata

- Component: headline
- PascalCase: Headline
- Description: a page headline with heading, subtitle, and byline area
- HTML tag: <div> containing <h1>
- CSS class: .headline
- Interactive: no

## Key Behaviors

- Renders a heading element at the specified level (h1-h6)
- Subtitle (dek) appears below heading
- Byline slot for author/date attribution
- Inspired by Reuters Graphics Headline component

## ARIA

- Heading role from semantic heading element (h1-h6)

## Keyboard

- None

## Props

- `level`: 1 | 2 | 3 | 4 | 5 | 6 (default: 1) -- heading level
- `children`: slot (required) -- heading text content
- `subtitle`: slot (optional) -- subtitle/dek content below heading
- `byline`: slot (optional) -- byline area below subtitle
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with class="headline"
- [ ] Contains heading element at specified level (default h1)
- [ ] Renders subtitle slot below heading
- [ ] Renders byline slot below subtitle
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .headline in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/headline.html
