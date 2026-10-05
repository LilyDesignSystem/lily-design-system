# ShowMore

ShowMore holds long content and a button that toggles it between clamped and fully shown. Unlike `expander`, the content is never removed from the DOM or the accessibility tree; the clamp is a purely visual consumer CSS rule keyed on `data-expanded`, so find-in-page and screen readers still reach all of it.

**Status:** beta — implemented and unit-tested in the Svelte canonical; ports to the other frameworks pending (2026-10-05)

## Implementation Notes

- Root `<div class="show-more">` containing `<div class="show-more-content" id data-expanded>` and `<button type="button" class="show-more-button">`
- The button text is `moreLabel` when collapsed and `lessLabel` when expanded -- both required, no English default
- The button carries `aria-expanded` and `aria-controls` pointing at the content `id`
- `expanded` is bindable, default `false`
- No inline style: the clamp is consumer CSS on `[data-expanded="false"]`
- Spreads `restProps` onto the root

## Props

- `className`: string (default: `""`) -- CSS class name appended to the base class
- `moreLabel`: string (required) -- button text while collapsed
- `lessLabel`: string (required) -- button text while expanded
- `expanded`: boolean (default: `false`) -- bindable
- `children`: slot -- the content
- `...restProps`: unknown -- additional attributes spread onto the root

## Usage

```html
<ShowMore moreLabel="Show more" lessLabel="Show less" bind:expanded>
  <p>A long description...</p>
</ShowMore>
```

Consumer CSS:

```css
.show-more-content[data-expanded="false"] { max-height: 6em; overflow: hidden; }
```

## Keyboard Interactions

- Enter: toggles when the button has focus (native)
- Space: toggles when the button has focus (native)
- Tab: moves focus to / from the button

## ARIA

- `aria-expanded={expanded}` -- on the button
- `aria-controls={contentId}` -- on the button, references the content `id`

## When to Use

- Use for long descriptions, reviews or lists where a short preview is enough most of the time.
- Use when the full content must remain searchable and available to assistive technology.
- Use to shorten a page without hiding content behind a click-to-reveal region.

## When Not to Use

- Do not use to hide supplementary help -- use `details` or `expander`.
- Do not use to split a long page into sections -- use `accordion-nav` or `collapsible`.
- Do not use for paging through many items -- use `pagination-nav`.

## Headless

This headless component renders a `<div>`, a content wrapper and a native `<button>`. It decides no clamp height, fade or animation; those are consumer CSS.

## Styles

The consumer provides all CSS styling via `.show-more`, `.show-more-content` (with `[data-expanded]`) and `.show-more-button`.

## Testing

- Verify root `<div class="show-more">` and button `type="button"`
- Verify collapsed by default with `moreLabel`, `aria-expanded=false`, `data-expanded=false`
- Verify the content stays in the DOM while collapsed
- Verify click expands (lessLabel, true) and collapses again
- Verify Enter and Space toggle
- Verify `aria-controls` matches the content id
- Verify no inline style
- Verify pass-through attributes

## Advice

- **Designers**: Pair the clamp with a fade so users see content is cut off. Honour reduced motion in any transition.
- **Developers**: The clamp lives in your CSS; without it the toggle changes only `data-expanded`.

## Related components

- `expander` — removes content from the DOM when collapsed
- `details` — native disclosure of supplementary content
- `collapsible` — a native-details panel

## References

- WAI-ARIA Disclosure Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/

---

Lily™ and Lily Design System™ are trademarks.
