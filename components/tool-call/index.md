# ToolCall

A headless wrapper for a collapsible record of one tool invocation by an AI agent, with a name, a status word, and its input, output or error.

**Status:** beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows.

The root of a tool-call record: a native `<details>` closed by default. Put `ToolCallName` and `ToolCallStatus` in the summary and `ToolCallInput`, `ToolCallOutput` or `ToolCallError` in the body. The component draws, times and animates nothing and carries no strings of its own.

## Implementation Notes

- Root element: `<details>` with the base class `tool-call` first, then the consumer class
- `restProps` spread onto the root; no internal state beyond `open` on the root

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `class` | string | `""` | Appended to the base class |
| `status` | string (optional) | — | `pending`, `running`, `done` or `error`; sets `data-status`, and `aria-busy="true"` only while running |
| `open` | boolean | `false` | Whether expanded (bindable / `v-model` / `@bind-Open` / `open` attribute) |
| `summary` | slot | — | Summary content: name and status words |
| `children` | slot | — | The body |
| `...restProps` | HTML attributes | — | Spread onto the root `<details>` |

## Usage

```svelte
<ToolCall status="running" bind:open>
  {#snippet summary()}
    <ToolCallName>search_web</ToolCallName>
    <ToolCallStatus status="running">Running</ToolCallStatus>
  {/snippet}
  <ToolCallInput label="Input"><pre>{"query": "weather"}</pre></ToolCallInput>
</ToolCall>
```

## Keyboard Interactions

- Enter / Space on the native `<summary>` toggles

## ARIA

- Native `<details>`/`<summary>` semantics; no ARIA role is added
- `aria-busy="true"` only while `status="running"`
- `data-status` is for consumer CSS; the visible status word (in `ToolCallStatus`) carries the meaning, never colour alone

## When to Use

- One tool invocation by an AI agent or workflow, with its status, input and result
- A transcript where tool details must not bury the conversation (collapsed by default)
- When status must read as a word, not only a colour or spinner

## When Not to Use

- Use `Thinking` — an agent's reasoning trace rather than a tool invocation
- Use `Expander` or `Collapsible` — generic disclosure with no tool semantics
- Use `ChatMessage` — a complete message in a conversation list
- Use `ErrorMessage` — a validation message tied to a form field

## Headless

This component decides semantics only. It decides no colour, icon, spinner, layout, monospace style or motion.

## Styles

Target `.tool-call` (and `[data-status]` where it applies). No default styles are included.

## Testing

- Renders `<details>` with the base class `tool-call` and appends the consumer class
- Attribute behaviour as listed under Props and ARIA, each asserted with a test
- Children render; rest props reach the root

## Advice

The component never opens, times or animates itself. Open it yourself on error so `ToolCallError` (a `role="alert"`) is reachable, and keep any spinner in CSS keyed on `[data-status="running"]`, switched off under `prefers-reduced-motion`.

## Related components

- `tool-call-name`
- `tool-call-status`
- `tool-call-input`
- `tool-call-output`
- `tool-call-error`
- `thinking`
- `expander`
- `streaming-text`

## References

- [MDN details element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details)
- [WAI-ARIA alert role](https://www.w3.org/TR/wai-aria-1.2/#alert)

---

Lily™ and Lily Design System™ are trademarks.
