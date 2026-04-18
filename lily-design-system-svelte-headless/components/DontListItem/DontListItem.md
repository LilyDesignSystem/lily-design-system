# DontListItem

A single discouraged-practice item within a "Don't" list. Renders a semantic `<li>` element representing a guideline or practice that users should avoid. Commonly used in design system documentation, style guides, and instructional content alongside `DoListItem`.

## Usage

```svelte
<script lang="ts">
    import DontListItem from './DontListItem.svelte';
</script>

<ul aria-label="Practices to avoid">
    <DontListItem>Use color alone to convey meaning</DontListItem>
    <DontListItem>Remove focus outlines without replacement</DontListItem>
    <DontListItem>Rely solely on placeholder text as labels</DontListItem>
</ul>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `Snippet` | required | The discouraged-practice content |
| `...restProps` | HTML attributes | — | Spread onto the `<li>` element |

## Data attributes

| Attribute | Value | Description |
|-----------|-------|-------------|
| `data-recommendation` | `"dont"` | Always set; use for consumer styling |

## Accessibility

- Semantic `<li>` element provides list item semantics
- Should be placed inside a `<ul>` or `<ol>` for valid HTML
- Screen readers announce list position from the parent list

## Styling

Consumer targets `[data-recommendation="dont"]` for visual differentiation (e.g. red cross, danger border).
