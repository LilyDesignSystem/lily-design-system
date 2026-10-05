# ToolCallOutput

A headless wrapper for the output or result returned by a tool in a tool call.

**Status:** beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows.

The output or result returned by the tool. A `<div>` that becomes a named group when `label` is given. The component draws, times and animates nothing and carries no strings of its own.

## Implementation Notes

- Root element: `<div>` with the base class `tool-call-output` first, then the consumer class
- `restProps` spread onto the root; no internal state beyond `open` on the root

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `class` | string | `""` | Appended to the base class |
| `label` | string (optional) | — | Adds `role="group"` and `aria-label`; without it neither is rendered |
| `children` | slot | — | The result |
| `...restProps` | HTML attributes | — | Spread onto the root `<div>` |

## Usage

```svelte
<ToolCallOutput>…</ToolCallOutput>
```

## Keyboard Interactions

- None. If a long `<pre>` inside scrolls, give it `tabindex="0"`

## ARIA

- `role="group"` with `aria-label` only when `label` is given

## When to Use

- The result a tool returned
- Labelled sections so input and output are distinguishable

## When Not to Use

- Use `ToolCallError` — when the tool failed
- Use `ToolCallInput` — for the arguments

## Headless

This component decides semantics only. It decides no colour, icon, spinner, layout, monospace style or motion.

## Styles

Target `.tool-call-output` (and `[data-status]` where it applies). No default styles are included.

## Testing

- Renders `<div>` with the base class `tool-call-output` and appends the consumer class
- Attribute behaviour as listed under Props and ARIA, each asserted with a test
- Children render; rest props reach the root

## Advice

Show the result as returned; summarise only if the full result is also available.

## Related components

- `tool-call`
- `tool-call-input`
- `tool-call-error`

## References

- [MDN details element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details)
- [WAI-ARIA alert role](https://www.w3.org/TR/wai-aria-1.2/#alert)

---

Lily™ and Lily Design System™ are trademarks.
