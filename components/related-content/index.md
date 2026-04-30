# RelatedContent

A section providing links to related or supporting information.

## Implementation Notes

- Renders an `<aside>` with a heading and a list of related links
- Heading level is configurable via `headingLevel` (default `<h2>`)
- Links are passed via the `children` slot; consumers compose them with `<a>` or `ContentsLink` etc.
- Spreads `restProps` onto the root `<aside>`

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `title` | string (required) | — | Heading text |
| `headingLevel` | 1 | 2 | 3 | 4 | 5 | 6 | 2 | Heading level |
| `children` | slot (required) | — | Related links |
| `...restProps` | HTML attributes | — | Spread onto the root `<aside>` |

## Usage

```html
<RelatedContent title="Related guidance">
  <ul>
    <li><a href="/guide-a">Guide A</a></li>
    <li><a href="/guide-b">Guide B</a></li>
  </ul>
</RelatedContent>
```

## Keyboard Interactions

- Native anchor keyboard behaviour for each link

## ARIA

- `<aside>` is a complementary landmark and is announced as such by screen readers
- `aria-labelledby` ties the aside to its heading

## When to Use

- Surfacing supporting links beside or after a piece of content (articles, service pages, guides)
- Encouraging onward navigation without competing with the primary action

## When Not to Use

- Use `ContentsNav` for in-page section navigation
- Use `Sidebar` for full sidebar navigation

## Headless

This headless component renders semantic HTML with appropriate ARIA wiring. The consumer provides all visual styling — no CSS, animations, or layout assumptions are baked in.

## Styles

The component renders with `.related-content` as the root class. No default styles are included.

## Related components

- `contents-nav` — in-page section navigation
- `sidebar` — full sidebar nav

## References

- [MDN aside element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/aside)
