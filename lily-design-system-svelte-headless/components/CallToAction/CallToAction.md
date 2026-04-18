# CallToAction

A call to action (CTA) is a component designed to prompt users to take a specific action, such as navigating to a page or triggering an operation. CTAs are typically the most prominent interactive element on a page, driving user engagement toward key goals like "Sign Up", "Learn More", or "Buy Now".

This component renders as an `<a>` element when an `href` is provided (for navigation CTAs) or as a `<button>` when no href is given (for action CTAs). This dual-mode approach ensures correct semantic HTML is used for each use case, benefiting both accessibility and SEO.

## Implementation Notes

- Renders as `<a>` when `href` is provided, `<button type="button">` otherwise
- Dual-mode: link for navigation CTAs, button for action CTAs
- `disabled` only applies in button mode (links cannot be disabled natively)
- Optional `aria-label` for screen reader text override when visible text is insufficient
- Content is provided through the Svelte 5 `children` Snippet
- All user-facing text comes through props and children for internationalization

## Props

- `href`: string (optional) -- if provided, renders as a link
- `label`: string (optional) -- `aria-label` override for screen readers
- `disabled`: boolean (default: false) -- disables the button (button mode only)
- `onclick`: (event: MouseEvent) => void (optional) -- click handler (button mode)
- `children`: Snippet (required) -- the CTA content
- `...restProps`: Any additional HTML attributes passed to the element

## Usage

```svelte
<CallToAction href="/signup">Sign Up Now</CallToAction>
<CallToAction onclick={handleAction}>Get Started</CallToAction>
```

## Keyboard Interactions

- Tab: Focus the element
- Enter: Activate the link or button
- Space: Activate the button (button mode only; links do not respond to Space)

## ARIA

- Implicit `link` role when rendered as `<a>`
- Implicit `button` role when rendered as `<button>`
- Optional `aria-label` -- provides screen reader text when visible text alone is insufficient
