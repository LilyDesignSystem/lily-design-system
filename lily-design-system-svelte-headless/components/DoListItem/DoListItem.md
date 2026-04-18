# DoListItem

A single recommended-practice item within a "Do" list. Renders a semantic `<li>` element representing a guideline or best practice that users should follow. Commonly used in design system documentation, style guides, and instructional content alongside `DontListItem`.

## Usage

```svelte
<script lang="ts">
    import DoListItem from './DoListItem.svelte';
</script>

<ul aria-label="Recommended practices">
    <DoListItem>Use descriptive alt text for images</DoListItem>
    <DoListItem>Provide visible focus indicators</DoListItem>
    <DoListItem>Use sufficient color contrast</DoListItem>
</ul>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `Snippet` | required | The recommendation content |
| `...restProps` | HTML attributes | — | Spread onto the `<li>` element |

## Data attributes

| Attribute | Value | Description |
|-----------|-------|-------------|
| `data-recommendation` | `"do"` | Always set; use for consumer styling |

## Accessibility

- Semantic `<li>` element provides list item semantics
- Should be placed inside a `<ul>` or `<ol>` for valid HTML
- Screen readers announce list position from the parent list

## Styling

Consumer targets `[data-recommendation="do"]` for visual differentiation (e.g. green checkmark, success border).
