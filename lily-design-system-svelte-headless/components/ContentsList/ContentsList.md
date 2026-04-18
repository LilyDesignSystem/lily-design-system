# ContentsList

An ordered list for a table of contents. Renders a semantic `<ol>` element containing ContentsListItem children. Designed to be placed inside a ContentsNav component.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| children | Snippet | required | ContentsListItem components or `<li>` elements |
| ...restProps | HTML attributes | — | Spread onto the `<ol>` |

## Usage

```svelte
<ContentsNav label="On this page">
  <ContentsList>
    <ContentsListItem><a href="#introduction">Introduction</a></ContentsListItem>
    <ContentsListItem><a href="#usage">Usage</a></ContentsListItem>
    <ContentsListItem><a href="#examples">Examples</a></ContentsListItem>
  </ContentsList>
</ContentsNav>
```

## Accessibility

- `<ol>` provides implicit list role conveying sequential section order
- Should be placed inside a ContentsNav for navigation landmark semantics

## References

- [MDN ol element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/ol)
