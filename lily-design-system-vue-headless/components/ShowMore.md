# ShowMore

long content behind a show more / show less toggle

## Implementation Notes

- Content in `.show-more-content` with `data-expanded`; the clamp is consumer CSS (no inline style)
- Button `.show-more-button` with `aria-expanded` and `aria-controls`; content stays in the accessibility tree

## Props

- `moreLabel`: string (required)
- `lessLabel`: string (required)
- `expanded` / `v-model:expanded`: boolean (default `false`)
- default slot: content

## Usage

```vue
<ShowMore more-label="Show more" less-label="Show less" v-model:expanded="open">...</ShowMore>
```

## Keyboard Interactions

- Enter / Space: toggle (native button)

Canonical documentation: ../../components (see the component's `components/{slug}/index.md`).
