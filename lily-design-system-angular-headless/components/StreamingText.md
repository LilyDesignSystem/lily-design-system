# StreamingText

A headless wrapper for text that arrives in chunks, as an AI answer streams in, announced once to screen readers when complete.

## Canonical documentation

See [components/streaming-text/index.md](../../components/streaming-text/index.md) for the full component documentation: ARIA, behaviour, props and guidance.

## Usage

```html
<lily-streaming-text label="Assistant answer" [streaming]="isStreaming">{{ answerSoFar }}</lily-streaming-text>
```

## Contract

A `<div role="status" aria-live="polite" aria-atomic="true">`; `streaming` adds `aria-busy="true"` and `data-streaming="true"` and is absent otherwise; `label` sets `aria-label`; no timing, splitting or animation.

---

Lily™ and Lily Design System™ are trademarks.

Angular has no rest-props spread; the wrapper element is `lily-streaming-text`. Class order is not preserved by Angular class binding.
