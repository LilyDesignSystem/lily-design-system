# StreamingText

A headless wrapper for text that arrives in chunks, as an AI answer streams in, announced once to screen readers when complete. It is a polite, atomic status region that goes busy while text is still arriving.

**Status:** beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows.

The component renders a `<div role="status" aria-live="polite" aria-atomic="true">`. While `streaming` is true it is marked busy (`aria-busy="true"`, `data-streaming="true"`), so assistive technology waits rather than announcing every chunk. When `streaming` becomes false the finished text is announced once. The component never splits, times, reveals or animates the text: the consumer appends chunks to the children and owns any caret or reduced-motion CSS. Sources, citations, actions and follow-ups are deliberately out of scope.

## Implementation Notes

- Renders `<div class="streaming-text {class}" role="status" aria-live="polite" aria-atomic="true">` containing the children
- `streaming` adds `aria-busy="true"` and `data-streaming="true"`; both are absent otherwise (never `"false"`)
- `label` (optional) becomes `aria-label`
- `restProps` spread onto the root; no internal state, timers or drawing

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `class` | string | `""` | Appended to the base class |
| `label` | string (optional) | — | Accessible name of the status region |
| `streaming` | boolean | `false` | True while chunks are still arriving |
| `children` | slot | — | The text so far |
| `...restProps` | HTML attributes | — | Spread onto the root `<div>` |

## Usage

```svelte
<StreamingText label="Assistant answer" streaming={isStreaming}>
  {answerSoFar}
</StreamingText>
```

## Keyboard Interactions

- None. The region is not focusable and has no controls.

## ARIA

- `role="status"` with `aria-live="polite"` and `aria-atomic="true"`: the whole text is announced once, politely
- `aria-busy="true"` while streaming asks assistive technology to hold announcements until the stream ends

## When to Use

- An AI or assistant answer that arrives in chunks and should be announced once when complete
- Any text that grows over time (a long transcription, a progressively built summary) where per-chunk announcements would be noise
- When you want consumer CSS to show a caret or loading cue through `[data-streaming]`

## When Not to Use

- Use `Thinking` — a collapsible block for the agent's reasoning trace rather than the answer
- Use `ChatMessage` — a complete message in a conversation list
- Use `Loading` or `ProgressSpinner` — indeterminate activity with no text to announce
- Use `Notification` or `Toast` — a short alert that must interrupt rather than a growing body of text

## Headless

This component decides semantics only: the live region, its politeness and the busy state. It decides no timing, word splitting, animation, caret or visual style.

## Styles

Target `.streaming-text` and `.streaming-text[data-streaming]`. A caret is consumer CSS; if you add one with a pseudo-element, keep it decorative and respect `prefers-reduced-motion`. No default styles are included.

## Testing

- Renders a `<div>` with class `streaming-text`
- Is a `status` region with `aria-live="polite"` and `aria-atomic="true"`
- Not busy by default; busy and `data-streaming` while `streaming`; cleared when it becomes false
- `label` sets `aria-label` and is omitted when absent
- Children render; rest props reach the root

## Advice

Append chunks to the existing text rather than replacing the element, and flip `streaming` to false exactly once, after the last chunk, so the finished answer is announced a single time. Screen-reader support for `aria-busy` varies, so test with your target readers. Keep any typing animation in CSS and turn it off under `prefers-reduced-motion`.

## Related components

- `thinking`
- `chat-message`
- `loading`
- `progress-spinner`

## References

- [WAI-ARIA status role](https://www.w3.org/TR/wai-aria-1.2/#status)
- [MDN aria-busy](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-busy)
- [MDN aria-live](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-live)

---

Lily™ and Lily Design System™ are trademarks.
