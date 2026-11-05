# MiddleTruncation

A string shortened in the middle to fit its container, keeping the start and the end; the full text stays in the accessibility tree.

Full documentation: [components/middle-truncation/index.md](../../components/middle-truncation/index.md).

- Inputs: `text` (required), `ellipsis` (required, no default), `strategy` (`"even"` | `"fixed-end"` | `"min-end"`, default `"even"`), `end`, `className`.
- No rest-props spread (Angular cannot spread onto an inner element).

## Usage

```html
<lily-middle-truncation
  text="quarterly-report-final-version-3.pdf"
  ellipsis="…"
  strategy="min-end"
  [end]="6"
/>
```

Effects also run while prerendering, where there is no document, so the component measures only in the browser. A
prerendered page shows the full text, and the browser shortens it after hydration.

The algorithm is `middle-truncation.ts`, a copy of `shared/middle-truncation.ts`.
