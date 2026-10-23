# MiddleTruncation

A string shortened in the middle to fit its container, keeping the start and the end; the full text stays in the accessibility tree.

Full documentation: [components/middle-truncation/index.md](../../components/middle-truncation/index.md).

## Props

- `text`: string (required) -- the full text
- `ellipsis`: string (required) -- the cut marker; no default
- `strategy`: `"even" | "fixed-end" | "min-end"` (default `"even"`)
- `end`: number (optional) -- characters kept at the end for `fixed-end` and `min-end`
- Attributes (including `class`) fall through onto the root `<span>`

## Usage

```vue
<MiddleTruncation text="quarterly-report-final-version-3.pdf" ellipsis="…" strategy="min-end" :end="6" />
```

The algorithm is `middle-truncation.ts`, a copy of `shared/middle-truncation.ts`.
