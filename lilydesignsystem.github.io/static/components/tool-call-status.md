# ToolCallStatus

A headless wrapper for the status of a tool call as a word, such as pending, running, done or error.

**Status:** beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows.

The status of a tool call as a visible word (pending, running, done, error), in the consumer's language. `status` only sets `data-status` for styling. The component draws, times and animates nothing and carries no strings of its own.

## Implementation Notes

- Root element: `<span>` with the base class `tool-call-status` first, then the consumer class
- `restProps` spread onto the root; no internal state beyond `open` on the root

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `class` | string | `""` | Appended to the base class |
| `status` | string (optional) | — | `pending`, `running`, `done` or `error`; sets `data-status` |
| `children` | slot | — | The visible status word |
| `...restProps` | HTML attributes | — | Spread onto the root `<span>` |

## Usage

```svelte
<ToolCallStatus>…</ToolCallStatus>
```

## Keyboard Interactions

- None

## ARIA

- No role: the status is plain text so it is read in order
- `data-status` is for consumer CSS only

## When to Use

- Showing state as a word next to the tool name, so it never relies on colour alone
- Driving a consumer spinner or icon via `[data-status]`

## When Not to Use

- Use `StatusTag` — a general status label outside a tool call
- Use `Loading` or `ProgressSpinner` — indeterminate activity on its own

## Headless

This component decides semantics only. It decides no colour, icon, spinner, layout, monospace style or motion.

## Styles

Target `.tool-call-status` (and `[data-status]` where it applies). No default styles are included.

## Testing

- Renders `<span>` with the base class `tool-call-status` and appends the consumer class
- Attribute behaviour as listed under Props and ARIA, each asserted with a test
- Children render; rest props reach the root

## Advice

Keep the word and `status` in step. The component supplies no strings, so the word is always localised by the consumer.

## Related components

- `tool-call`
- `tool-call-name`
- `status-tag`

## References

- [MDN details element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details)
- [WAI-ARIA alert role](https://www.w3.org/TR/wai-aria-1.2/#alert)

---

Lily™ and Lily Design System™ are trademarks.
