# RelatedContent

A complementary `<aside>` placed beside or after a piece of content, listing links to articles, guides, or service pages that the reader may want to look at next.

The component renders the aside as a labelled landmark — its required heading is wired up via `aria-labelledby` — so screen reader users can navigate into and out of it as a discrete region. The link list itself is the consumer's responsibility: pass any markup through the children slot, whether that is a plain `<ul>`, `ContentsLink` items, or a richer composition. Heading level is configurable so the aside fits the page outline (e.g. `<h2>` next to the article body, `<h3>` inside a sidebar section).

Use it for "you might also be interested in…" patterns. For in-page section navigation use `ContentsNav`, and for the page's primary side navigation use `Sidebar`.

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
