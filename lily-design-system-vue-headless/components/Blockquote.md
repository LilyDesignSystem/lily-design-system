# Blockquote

A block-level quotation with optional source citation. Inspired by the [Mozilla Protocol Design System](https://protocol.mozilla.org).

## Implementation Notes

- Headless: no CSS, no styles
- Renders the native `<blockquote>` element
- Optional `cite` attribute for the source URL
- Optional visible attribution text rendered inside a `<footer class="blockquote-citation">`

## Props

- `cite`: string (optional) — URL of the source, rendered as the `cite` attribute on the blockquote
- `citationText`: string (optional) — visible attribution text rendered inside a `<footer>`
- `label`: string (optional) — aria-label override
- default slot — quote content

## Usage

```vue
<Blockquote cite="https://example.com" citation-text="— Ada Lovelace, Notes">
    The intellectual, the moral, the religious seem to me all naturally bound up
    and interlinked together in one great and harmonious whole.
</Blockquote>
```

## ARIA

- Implicit `<blockquote>` semantics
- Optional `aria-label` for an accessible name override

## When to Use

- Long quotations from external sources
- Pull quotes within editorial content

## When Not to Use

- Short inline quotations — use the `Q` element or plain text
- Captions or attributions without a quoted block — use `Caption` or `Byline`

## Headless

The component renders a native `<blockquote>` and applies the `cite` and `aria-label` attributes when provided. Consumers supply all visual styling.

## Testing

- Verify the root `blockquote` class
- Verify `cite` attribute pass-through
- Verify the citation footer renders only when `citationText` is provided
- Verify `aria-label` pass-through

## References

- [MDN - blockquote](https://developer.mozilla.org/docs/Web/HTML/Element/blockquote)
- [Mozilla Protocol Design System](https://protocol.mozilla.org)
