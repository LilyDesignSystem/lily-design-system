# Mark

A headless wrapper for an inline highlight marking text as relevant or referenced, such as a search match, using the native mark element.

**Status:** beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows.

The component renders the native `<mark>` element, which means "highlighted for reference or relevance" — a search match, a term the surrounding text refers to, or text flagged in a document. It adds no ARIA, draws nothing and carries no strings.

## Implementation Notes

- Renders `<mark class="mark {class}">` containing the children
- `restProps` spread onto the `<mark>`; no state, no behaviour

## Props

| Prop | Type | Default | Description |
| ---- | ---- | ------- | ----------- |
| `class` | string | `""` | Appended to the base class |
| `children` | slot | — | The highlighted text |
| `...restProps` | HTML attributes | — | Spread onto the root `<mark>` |

## Usage

```svelte
<p>Found 3 results for <Mark>accessible</Mark> components.</p>
```

## Keyboard Interactions

- None. The element is not focusable.

## ARIA

- No ARIA is added; the native `<mark>` carries its own semantics
- Screen-reader support for `<mark>` varies, and many do not announce it; pass `aria-label` or `aria-roledescription` through the rest props if you want a spoken cue (the string is yours, so it stays localisable)

## When to Use

- Highlighting the term a user searched for inside a result
- Marking text a sentence refers to, so readers can find it again
- Flagging a passage in a document for reference or review

## When Not to Use

- Use `Code` — inline code rather than highlighted prose
- Use `Kbd` — keyboard keys
- Use `Badge` or `StatusTag` — a standalone label rather than text inside a sentence
- Use `InsetText` — a block-level callout rather than an inline highlight
- Use `Diff` — showing what changed between two texts

## Headless

This component decides semantics only: the element and the class hook. It decides no colour, background, contrast or animation.

## Styles

Target `.mark`. The browser default is a yellow background with black text; the 45 reference themes restyle it from tokens. No default styles are included in the component.

## Testing

- Renders a `<mark>` with class `mark` and appends the consumer class
- Children render; rest props reach the root

## Advice

Do not rely on the highlight alone to convey meaning (WCAG 1.4.1): the highlighted words should make sense to someone who cannot see the colour, and keep the text-to-background contrast at or above the target level. Highlight the matched term, not the whole result.

## Related components

- `code`
- `kbd`
- `badge`
- `inset-text`
- `diff`

## References

- [MDN mark element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/mark)
- [WCAG 1.4.1 Use of Color](https://www.w3.org/WAI/WCAG22/Understanding/use-of-color.html)

---

Lily™ and Lily Design System™ are trademarks.
