# Call To Action

A call to action (CTA) is a component designed to prompt users to take a specific action, such as navigating to a page or triggering an operation. CTAs are typically the most prominent interactive element on a page, driving user engagement toward key goals like "Sign Up", "Learn More", or "Buy Now".

This component renders as an `<a>` element when an `href` is provided (for navigation CTAs) or as a `<button>` when no href is given (for action CTAs). This dual-mode approach ensures correct semantic HTML is used for each use case, benefiting both accessibility and SEO.

## Implementation Notes

- Renders as `<a>` when `href` is provided, `<button type="button">` otherwise
- Dual-mode: link for navigation CTAs, button for action CTAs
- `disabled` only applies in button mode (links cannot be disabled natively)
- Optional `aria-label` for screen reader text override when visible text is insufficient
- Content is provided through child elements
- All user-facing text comes through props and children for internationalization

## Props

- `href`: string (optional) -- if provided, renders as a link
- `label`: string (optional) -- `aria-label` override for screen readers
- `disabled`: boolean (default: false) -- disables the button (button mode only)
- `onclick`: (event: MouseEvent) => void (optional) -- click handler (button mode)
- `children`: slot (required) -- the CTA content
- `...restProps`: Any additional HTML attributes passed to the element

## Usage

Navigation CTA linking to a sign-up page:

```html
<CallToAction href="/signup">Sign Up Now</CallToAction>
```

Action CTA triggering a workflow:

```html
<CallToAction onclick={handleAction}>Get Started</CallToAction>
```

Hero section with a primary CTA:

```html
<Hero>
  <h1>Build accessible apps faster</h1>
  <p>Lily Design System provides headless, WCAG AAA-compliant components for every framework.</p>
  <CallToAction href="/docs/getting-started">Get Started Free</CallToAction>
</Hero>
```

CTA with a screen reader label override:

```html
<CallToAction href="/pricing" label="View pricing plans for Lily Design System">
  View Pricing
</CallToAction>
```

## Keyboard Interactions

- Tab: Focus the element
- Enter: Activate the link or button
- Space: Activate the button (button mode only; links do not respond to Space)

## ARIA

- Implicit `link` role when rendered as `<a>`
- Implicit `button` role when rendered as `<button>`
- Optional `aria-label` -- provides screen reader text when visible text alone is insufficient

## When to Use

- Use to prominently encourage users to take a specific action, such as signing up, starting a service, or downloading an app.
- Use for the most prominent interactive element on a page that drives user engagement toward a key goal.
- Use when you need dual-mode behavior: an `<a>` for navigation CTAs or a `<button>` for action CTAs.
- Use in hero sections, landing pages, or marketing banners to direct the user to the primary conversion goal.

## When Not to Use

- Do not use for routine navigation -- use ActionLink instead.
- Do not use for form submission -- use Button with `type="submit"` instead.
- Do not use for secondary or low-priority actions -- use Button instead.
- Do not use more than one primary CTA per section to avoid diluting focus.

## Headless

This component provides either a semantic `<a>` or `<button>` element (based on the `href` prop), optional `aria-label`, and disabled state management, all with zero visual styling. The consumer is responsible for all CSS including prominent sizing, bold colors, padding, border-radius, hover/focus effects, and any arrow or icon decoration.


## Styles

The consumer provides all CSS styling. The component renders with a `.call-to-action` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<div>` element with class `call-to-action`
- Verify Optional `aria-label` -- provides screen reader text when visible text alone is insufficient
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Limit to one primary CTA per page or section to avoid diluting focus. Use size, color, and whitespace to make it the most visually prominent element.
- **Developers**: The component automatically renders as `<a>` when `href` is provided and `<button>` otherwise. The `disabled` prop only applies in button mode since links cannot be natively disabled.
