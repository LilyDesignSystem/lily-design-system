# Card

A card groups related content and actions into a self-contained semantic container, making it easy to browse and compare items. Cards are commonly used for product listings, user profiles, article previews, media galleries, and dashboard widgets. They present a digestible summary of information that can include headings, text, and interactive elements.

The component renders as an `<article>` element for standalone content grouping. It supports a configurable heading level (h2-h6) for proper document outline, and the heading can optionally be wrapped in a link when an `href` is provided. An optional `aria-label` enables the article to be identified as a named landmark.

## Implementation Notes

- Uses `<article>` for semantic standalone content grouping
- Heading level is configurable (2-6) for proper document outline structure
- When `href` is provided, the heading text wraps in an `<a>` element for navigation
- Optional `aria-label` for named landmark identification
- Content is provided through the Svelte 5 `children` Snippet
- Passes through all additional HTML attributes via `...restProps`

## Props

- `heading`: string (optional) -- heading text for the card
- `headingLevel`: 2 | 3 | 4 | 5 | 6 (default: 3) -- HTML heading level
- `href`: string (optional) -- makes the heading a link
- `label`: string (optional) -- `aria-label` for the article
- `children`: Snippet (required) -- card body content
- `...restProps`: Any additional HTML attributes passed to the `<article>` element

## Usage

```svelte
<Card><h3>Title</h3><p>Content</p></Card>
<Card heading="Product" href="/products/1"><p>Description</p></Card>
```

## Keyboard Interactions

- Tab: Focus the heading link when `href` is provided
- Enter: Activate the heading link (browser default)

## ARIA

- Implicit `article` role from the `<article>` element
- Optional `aria-label` -- identifies the card as a named landmark for screen readers
