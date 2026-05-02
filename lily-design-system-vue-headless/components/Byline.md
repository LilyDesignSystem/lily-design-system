# Byline

Author attribution with optional publish and update timestamps.

## Slots

- default — author names/links (use `rel="author"` on author anchors)
- `published` — publish date/time, typically `<time datetime="...">`
- `updated` — last updated date/time, typically `<time datetime="...">`

## Usage

```vue
<Byline>
  <a href="/author/jane-smith" rel="author">Jane Smith</a>
  <template #published>
    <time datetime="2026-04-15">April 15, 2026</time>
  </template>
  <template #updated>
    <time datetime="2026-04-16">Updated April 16, 2026</time>
  </template>
</Byline>
```

## References

- HTML time element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time
