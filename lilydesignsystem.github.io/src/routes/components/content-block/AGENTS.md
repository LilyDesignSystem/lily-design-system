# Content Block

## Metadata

- Component: content-block
- PascalCase: ContentBlock
- Description: a content width constraint container with named column widths
- HTML tag: <div>
- CSS class: .content-block
- Interactive: no

## Key Behaviors

- Constrains child content to a named column width
- Reads CSS custom properties set by ArticleLayout parent
- `data-width` attribute reflects the current width for CSS targeting
- Centers content horizontally with auto margins
- Inspired by Reuters Graphics Block component

## ARIA

- None -- presentational container

## Keyboard

- None

## Props

- `width`: "narrower" | "narrow" | "normal" | "wide" | "wider" | "widest" | "fluid" (default: "normal") -- content width
- `children`: slot (required) -- block content
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with class="content-block"
- [ ] Has data-width attribute reflecting the width prop
- [ ] Default width is "normal"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .content-block in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/content-block.html
