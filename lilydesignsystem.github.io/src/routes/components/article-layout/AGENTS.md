# Article Layout

## Metadata

- Component: article-layout
- PascalCase: ArticleLayout
- Description: a top-level article wrapper that sets CSS custom properties for content column widths
- HTML tag: <article>
- CSS class: .article-layout
- Interactive: no

## Key Behaviors

- Uses semantic `<article>` element
- Sets CSS custom properties for column widths (--content-width-narrower: 330px, --content-width-narrow: 510px, --content-width-normal: 660px, --content-width-wide: 930px, --content-width-wider: 1200px)
- Consumer overrides column widths by setting custom properties
- Inspired by Reuters Graphics Article component

## ARIA

- Implicit `article` role from `<article>` element
- Optional `aria-label` -- describes the article for screen readers

## Keyboard

- None -- children handle their own keyboard interactions

## Props

- `label`: string (optional) -- accessible label for the article
- `children`: slot (required) -- article content
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <article> element with class="article-layout"
- [ ] Has optional aria-label attribute
- [ ] Sets CSS custom properties for column widths
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .article-layout in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/article-layout.html
