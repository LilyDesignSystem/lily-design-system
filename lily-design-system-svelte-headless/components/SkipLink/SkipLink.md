# SkipLink

SkipLink is a headless navigation link that allows keyboard users to bypass repetitive content (such as navigation menus and headers) and jump directly to the main content area. It is one of the most important accessibility features for keyboard-only users and screen reader users.

Use SkipLink as the very first focusable element on a page. When a keyboard user tabs into the page, the skip link receives focus first and provides a quick shortcut to the main content. Consumers typically style the link to be visually hidden until focused, then position it prominently on screen when activated. The component renders a simple `<a>` element with configurable href target and label text.

## Implementation Notes

- Renders an `<a>` element with the `href` pointing to the target content anchor
- Default `href` is `"#content"` and default `label` is `"Skip to content"`, both configurable
- The label text is rendered as the link's text content (not via `aria-label`)
- Consumer is responsible for styling the link (typically visually hidden until `:focus`)
- Consumer must ensure the target element exists with a matching `id` attribute
- Spreads `restProps` onto the anchor for consumer customization
- Uses Svelte 5 `$props()` with TypeScript typing
- No Snippet import needed since this component does not use children

## Props

- `href`: string (default: `"#content"`) -- the anchor target that the link navigates to
- `label`: string (default: `"Skip to content"`) -- the visible link text
- `...restProps`: unknown -- additional attributes spread onto the `<a>` element

## Usage

```svelte
<SkipLink />
```

```svelte
<SkipLink href="#main" label="Skip to main content" />
```

## Keyboard Interactions

- Tab: Moves focus to the skip link (should be the first focusable element on the page)
- Enter: Activates the link, moving focus to the target anchor element

## ARIA

- No explicit ARIA roles or attributes are needed; the `<a>` element with an `href` is natively accessible as a link
- The link text content (`label` prop) serves as the accessible name

## References

- WCAG 2.1 Bypass Blocks: https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html
- WAI-ARIA Authoring Practices - Skip Navigation: https://www.w3.org/WAI/ARIA/apg/practices/skip-nav/
- WebAIM Skip Navigation Links: https://webaim.org/techniques/skipnav/
