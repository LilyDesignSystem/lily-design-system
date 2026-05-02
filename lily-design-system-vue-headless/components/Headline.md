# Headline

A page or article headline composition: a heading at a configurable level (default `<h1>`), with optional subtitle (dek) and byline rendered below it.

## Props

- `level`: `1 | 2 | 3 | 4 | 5 | 6` (default `1`) — heading level

## Slots

- default — heading text
- `subtitle` — subtitle / dek content
- `byline` — byline area

## Usage

```vue
<Headline>
  Local council approves new funding
  <template #subtitle>A short dek</template>
  <template #byline><Byline>Jane Smith</Byline></template>
</Headline>
```

## References

- HTML heading elements: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements
