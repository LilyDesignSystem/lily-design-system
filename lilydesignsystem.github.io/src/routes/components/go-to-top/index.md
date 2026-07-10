# GoToTop

A link that returns users to the top of a long page. Typically rendered as a fixed or sticky element near the bottom-right of the viewport on long-scrolling pages.

## Implementation Notes

- Renders an `<a>` linking to an in-page anchor (default `#top`)
- Native anchor behaviour means the link works with no JavaScript and respects `prefers-reduced-motion` automatically
- Consumers may add smooth-scroll JavaScript on top without breaking the keyboard / no-JS fallback
- Visible text is required so screen readers announce a meaningful destination; consumers may override with `aria-label` for icon-only variants

## Props

| Prop           | Type              | Default | Description                                          |
| -------------- | ----------------- | ------- | ---------------------------------------------------- |
| `href`         | `string`          | `#top`  | Anchor target on the current page                    |
| `label`        | `string`          | —       | Visible link text. Required.                         |
| `...restProps` | HTML attributes   | —       | Spread onto the root `<a>` element                   |

## Usage

```html
<GoToTop label="Back to top" href="#top" />
```

## Keyboard Interactions

- Tab: moves focus onto the link
- Enter: activates the link, scrolling focus to the target

## ARIA

- Native anchor accessibility — the visible text plus the destination provide the accessible name
- Consumers may override the accessible name with `aria-label` when the visible text is decorative

## When to Use

- Long content pages where users need a quick way to return to the page top
- Article and guidance pages where the header is far above the fold

## When Not to Use

- Pages that fit within a single viewport — a back-to-top control adds visual noise without value
- Use `BackLink` to navigate back to a parent or previous page (different intent)
- Use `GoToPreviousSection` / `GoToNextSection` for adjacent-section navigation

## Headless

This headless component renders semantic HTML (`<a href="#…">`) with no styling. Consumers position and style the link (often as a fixed/sticky button-like control), and may layer smooth-scroll behaviour with JavaScript.

## Styles

The component renders with `.go-to-top` as the root class. No default styles are included — consumers handle positioning, appearance, and any animation.

## Related components

- `back-link` — navigate to a parent or previous page
- `go-to-previous-section` / `go-to-next-section` — adjacent-section navigation within a page
- `skip-link` — keyboard-only "skip to main content" link

## References

- [MDN anchor element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/a)
- [WAI-ARIA Authoring Practices: landmarks](https://www.w3.org/WAI/ARIA/apg/patterns/landmarks/)

---

Lily™ and Lily Design System™ are trademarks.
