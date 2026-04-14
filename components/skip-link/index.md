# Skip Link

SkipLink is a headless navigation link that allows keyboard users to bypass repetitive content (such as navigation menus and headers) and jump directly to the main content area. It is one of the most important accessibility features for keyboard-only users and screen reader users.

Use SkipLink as the very first focusable element on a page. When a keyboard user tabs into the page, the skip link receives focus first and provides a quick shortcut to the main content. Consumers typically style the link to be visually hidden until focused, then position it prominently on screen when activated. The component renders a simple `<a>` element with configurable href target and label text.

## Implementation Notes

- Renders an `<a>` element with the `href` pointing to the target content anchor
- Default `href` is `"#content"` and default `label` is `"Skip to content"`, both configurable
- The label text is rendered as the link's text content (not via `aria-label`)
- Consumer is responsible for styling the link (typically visually hidden until `:focus`)
- Consumer must ensure the target element exists with a matching `id` attribute
- Spreads `restProps` onto the anchor for consumer customization
- No slot import needed since this component does not use children

## Props

- `href`: string (default: `"#content"`) -- the anchor target that the link navigates to
- `label`: string (default: `"Skip to content"`) -- the visible link text
- `...restProps`: unknown -- additional attributes spread onto the `<a>` element

## Usage

Default skip link as the first element in the page, targeting a `<main id="content">` element:

```html
<SkipLink />

<!-- Later in the page -->
<main id="content">
  <h1>Page title</h1>
  ...
</main>
```

Custom skip link targeting a specific main content area with a custom label:

```html
<SkipLink href="#maincontent" label="Skip to main content" />

<!-- Later in the page -->
<main id="maincontent" tabindex="-1">
  <h1>Search results</h1>
  ...
</main>
```

## Keyboard Interactions

- Tab: Moves focus to the skip link (should be the first focusable element on the page)
- Enter: Activates the link, moving focus to the target anchor element

## ARIA

- No explicit ARIA roles or attributes are needed; the `<a>` element with an `href` is natively accessible as a link
- The link text content (`label` prop) serves as the accessible name

## When to Use

- Use on every page of your service as the very first focusable element in the DOM
- Use to allow keyboard and screen reader users to skip repetitive navigation and jump directly to the main content
- Use with a target anchor like `#maincontent` on the main content area
- Use on pages with significant repeated content before the main area (navigation bars, headers, sidebars)

## When Not to Use

- There are no situations where SkipLink should be omitted -- it is required for accessibility on every page (WCAG 2.1 Level A)
- Do not make the skip link permanently visible -- it should only appear when it receives keyboard focus

## Headless

This headless component renders a simple `<a>` element with a configurable `href` target and visible link text. It provides the semantic skip navigation link with no visual styling. The consumer is responsible for styling the link to be visually hidden until focused, then positioning it prominently on screen.


## Styles

The consumer provides all CSS styling. The component renders with a `.skip-link` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<a>` element with class `skip-link`
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Style the skip link to appear at the top of the viewport with high contrast when focused. Ensure it is large enough and clearly visible so keyboard users can easily see it.
- **Developers**: Ensure the target element (e.g., `<main id="content">`) exists and has `tabindex="-1"` so focus moves correctly. Place the SkipLink component before all other focusable page content in the DOM order.

## References

- WCAG 2.1 Bypass Blocks: https://www.w3.org/WAI/WCAG21/Understanding/bypass-blocks.html
- WAI-ARIA Authoring Practices - Skip Navigation: https://www.w3.org/WAI/ARIA/apg/practices/skip-nav/
- WebAIM Skip Navigation Links: https://webaim.org/techniques/skipnav/
