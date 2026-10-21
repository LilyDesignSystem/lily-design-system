# Thinking

Thinking is a headless disclosure for showing an AI assistant's reasoning or progress trace. It is a native `<details>` that is closed by default; while the trace is still arriving, `streaming` marks the root with `data-streaming` and `aria-busy` so consumer CSS and assistive technology know it is incomplete.

**Status:** beta — implemented and unit-tested in the Svelte canonical; ports to the other frameworks pending (2026-10-05)

## Implementation Notes

- Renders `<details class="thinking">` with `<summary class="thinking-summary">{label}</summary>` and `<div class="thinking-content">`
- Closed by default; `open` is bindable
- `streaming` true adds `data-streaming="true"` and `aria-busy="true"`; false omits both attributes
- Spreads `restProps` onto the `<details>`

## Props

- `className`: string (default: `""`) -- CSS class name appended to the base class
- `label`: string (required) -- summary text
- `open`: boolean (default: `false`) -- bindable
- `streaming`: boolean (default: `false`) -- content is still arriving
- `children`: slot -- the reasoning content
- `...restProps`: unknown -- additional attributes spread onto the `<details>`

## Usage

```html
<Thinking label="Thinking" streaming={isStreaming} bind:open>
  <p>Considering the options...</p>
</Thinking>
```

## Keyboard Interactions

- Enter: toggles when the summary has focus (native)
- Space: toggles when the summary has focus (native)
- Tab: moves focus to / from the summary

## ARIA

- Native `details`/`summary` disclosure semantics
- `aria-busy="true"` on the root only while `streaming`

## When to Use

- Use to reveal an assistant's reasoning without crowding the answer.
- Use when the trace may still be arriving and should be flagged as busy.
- Use when the reasoning is optional reading for most users.

## When Not to Use

- Do not use for general supplementary help -- use `details`.
- Do not use for a custom-controlled toggle -- use `expander`.
- Do not use for the answer itself -- keep the answer visible.

## Headless

This headless component renders native `<details>` and `<summary>`. It decides no marker, animation or streaming indicator; those are consumer CSS keyed on `[open]` and `[data-streaming]`.

## Styles

The consumer provides all CSS styling via `.thinking`, `.thinking-summary`, `.thinking-content` and `[data-streaming]`.

## Testing

- Verify root `<details class="thinking">` with `summary.thinking-summary`
- Verify closed by default and `open` opens it
- Verify children render in `.thinking-content`
- Verify clicking the summary toggles
- Verify `streaming` sets and clears `data-streaming` / `aria-busy`
- Verify pass-through attributes

## Advice

- **Designers**: Show a subtle in-progress cue while `data-streaming` is set; respect reduced motion.
- **Developers**: Set `streaming` false when the stream ends so `aria-busy` is cleared.

## Related components

- `details` — a general native disclosure
- `collapsible` — a native-details panel with a summary prop
- `expander` — a button-driven disclosure
- `loading` — a busy indicator

## References

- MDN details element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/details
- WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/

---

Lily™ and Lily Design System™ are trademarks.
