# ActionLink

An action link is a headless anchor component that visually emphasizes a navigation action, typically appearing as a prominent link that leads the user to a new page or triggers a significant navigation event. Inspired by the NHS England action link pattern, it renders a semantic `<a>` element with optional ARIA label override for screen readers.

Action links are useful when you want to draw attention to a key navigational step, such as "Continue to next step" or "Find a service near you", distinguishing these from standard inline text links.

## Implementation Notes

- Renders as a simple semantic `<a>` element
- Supports `aria-label` override via the `label` prop for when the visible link text is insufficient for screen readers
- Uses Svelte 5 `Snippet` for children content (text, mixed content, etc.)
- Passes through all additional HTML anchor attributes via `...restProps`
- No hardcoded user-facing strings; all text comes through children and props

## Props

- `href`: string (required) -- the URL the link points to
- `label`: string (optional) -- accessible label override for screen readers via aria-label
- `children`: Snippet (required) -- the link content (text or mixed content)

## Usage

```svelte
<ActionLink href="/next-step">Continue to next step</ActionLink>
```

## Keyboard Interactions

- Tab: Focus the link (native browser behavior)
- Enter: Activate the link (native browser behavior)

## ARIA

- Implicit `link` role from the `<a>` element
- `aria-label` -- optional override for screen reader text when the visible link text does not fully convey the action

## References

- Inspired by NHS England action link pattern
- WAI-ARIA link role: https://www.w3.org/TR/wai-aria-1.2/#link
