# ToolCallName

A headless wrapper for the name of the tool in a tool call, shown in the summary.

**Status:** beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows.

The tool's name inside the summary, for example `search_web`. A plain `<span>`; the consumer supplies the text. The component draws, times and animates nothing and carries no strings of its own.

## Implementation Notes

- Root element: `<span>` with the base class `tool-call-name` first, then the consumer class
- `restProps` spread onto the root; no internal state beyond `open` on the root

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `class` | string | `""` | Appended to the base class |
| `children` | slot | — | The tool name |
| `...restProps` | HTML attributes | — | Spread onto the root `<span>` |

## Usage

```svelte
<ToolCallName>…</ToolCallName>
```

## Keyboard Interactions

- None

## ARIA

- No ARIA attributes; the text is the name

## When to Use

- The first item in a `ToolCall` summary
- Showing a machine name in a monospace style via consumer CSS

## When Not to Use

- Use `ToolCallStatus` — for the state word
- Use `Kbd` — for keyboard keys rather than tool names

## Headless

This component decides semantics only. It decides no colour, icon, spinner, layout, monospace style or motion.

## Styles

Target `.tool-call-name` (and `[data-status]` where it applies). No default styles are included.

## Testing

- Renders `<span>` with the base class `tool-call-name` and appends the consumer class
- Attribute behaviour as listed under Props and ARIA, each asserted with a test
- Children render; rest props reach the root

## Advice

Do not translate or alter the tool name: show what the system calls it.

## Related components

- `tool-call`
- `tool-call-status`

## References

- [MDN details element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details)
- [WAI-ARIA alert role](https://www.w3.org/TR/wai-aria-1.2/#alert)

---

Lily™ and Lily Design System™ are trademarks.
