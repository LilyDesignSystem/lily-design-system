# ToolCallInput

A headless wrapper for the input or arguments passed to a tool in a tool call.

**Status:** beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows.

The input or arguments passed to the tool. A `<div>` that becomes a named group when `label` is given; the consumer puts a `<pre>` or formatted arguments inside. The component draws, times and animates nothing and carries no strings of its own.

## Implementation Notes

- Root element: `<div>` with the base class `tool-call-input` first, then the consumer class
- `restProps` spread onto the root; no internal state beyond `open` on the root

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `class` | string | `""` | Appended to the base class |
| `label` | string (optional) | — | Adds `role="group"` and `aria-label`; without it neither is rendered |
| `children` | slot | — | The arguments |
| `...restProps` | HTML attributes | — | Spread onto the root `<div>` |

## Usage

```svelte
<ToolCallInput>…</ToolCallInput>
```

## Keyboard Interactions

- None. If a long `<pre>` inside scrolls, give it `tabindex="0"` so keyboard users can scroll it

## ARIA

- `role="group"` with `aria-label` only when `label` is given

## When to Use

- The arguments a tool was called with
- Labelled sections so a screen-reader user can tell input from output

## When Not to Use

- Use `ToolCallOutput` — for the result
- Use `Code` or `CodeBlock` — general code samples outside a tool call

## Headless

This component decides semantics only. It decides no colour, icon, spinner, layout, monospace style or motion.

## Styles

Target `.tool-call-input` (and `[data-status]` where it applies). No default styles are included.

## Testing

- Renders `<div>` with the base class `tool-call-input` and appends the consumer class
- Attribute behaviour as listed under Props and ARIA, each asserted with a test
- Children render; rest props reach the root

## Advice

Pass `label` ("Input" in your language) whenever input and output both appear, so the two groups are distinguishable.

## Related components

- `tool-call`
- `tool-call-output`
- `code-block`

## References

- [MDN details element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details)
- [WAI-ARIA alert role](https://www.w3.org/TR/wai-aria-1.2/#alert)

---

Lily™ and Lily Design System™ are trademarks.
