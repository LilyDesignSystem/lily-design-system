# ToolCallError

A headless wrapper for the error shown when a tool call fails.

**Status:** beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows.

The error shown when a tool call fails. A `<div role="alert">` so the message is announced when it appears. The component draws, times and animates nothing and carries no strings of its own.

## Implementation Notes

- Root element: `<div>` with the base class `tool-call-error` first, then the consumer class
- `restProps` spread onto the root; no internal state beyond `open` on the root

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `class` | string | `""` | Appended to the base class |
| `children` | slot | — | The error message |
| `...restProps` | HTML attributes | — | Spread onto the root `<div>` |

## Usage

```svelte
<ToolCallError>…</ToolCallError>
```

## Keyboard Interactions

- None

## ARIA

- `role="alert"` announces the error when it is added

## When to Use

- The failure message of a tool call
- Surfacing an error that must be heard immediately

## When Not to Use

- Use `ToolCallOutput` — for a normal result
- Use `ErrorMessage` — a validation message tied to a form field
- Use `ErrorSummary` — a page-level summary of form errors

## Headless

This component decides semantics only. It decides no colour, icon, spinner, layout, monospace style or motion.

## Styles

Target `.tool-call-error` (and `[data-status]` where it applies). No default styles are included.

## Testing

- Renders `<div>` with the base class `tool-call-error` and appends the consumer class
- Attribute behaviour as listed under Props and ARIA, each asserted with a test
- Children render; rest props reach the root

## Advice

An alert inside a closed `<details>` is not announced. Open the `ToolCall` when status becomes `error`, or also show the error text in the summary.

## Related components

- `tool-call`
- `tool-call-output`
- `error-message`

## References

- [MDN details element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details)
- [WAI-ARIA alert role](https://www.w3.org/TR/wai-aria-1.2/#alert)

---

Lily™ and Lily Design System™ are trademarks.
