# ContentsListItem

A contents list item is a single entry within a table of contents or navigation
list. It renders as a semantic list item (`<li>`) that typically contains a link
to a section of a page or document.

Contents list items are used as children of ordered lists (`<ol>`) within a
table of contents component. They support nesting for hierarchical document
structures where sections contain subsections. The consumer provides the content
(usually an anchor link with descriptive text) through the children snippet, and
can add `aria-current` attributes to indicate the currently active section.

## Implementation Notes

- Renders as a semantic `<li>` element for use in contents/navigation lists
- All content is provided through the children snippet (typically links)
- Supports nesting by placing a `<ul>` inside a ContentsListItem
- Should be placed inside a `<ul>` or `<ol>` parent element for valid HTML
- Spreads `...restProps` onto the `<li>` element for consumer customization

## Props

- `children`: Snippet (required) -- list item content, typically a link or nested list
- `...restProps`: Any additional HTML attributes spread onto the `<li>`

## Usage

```svelte
<ContentsListItem><a href="#section-1">Introduction</a></ContentsListItem>
<ContentsListItem><a href="#section-2">Methods</a></ContentsListItem>
<ContentsListItem>
  <a href="#section-3">Results</a>
  <ul>
    <ContentsListItem><a href="#section-3a">Data</a></ContentsListItem>
    <ContentsListItem><a href="#section-3b">Analysis</a></ContentsListItem>
  </ul>
</ContentsListItem>
```

## Keyboard Interactions

- None directly -- keyboard interaction is handled by contained links or the parent list

## ARIA

- Semantic `<li>` provides implicit `listitem` role
- Supports `aria-current="page"` or `aria-current="true"` on the `<li>` for indicating the current page in a navigation context
