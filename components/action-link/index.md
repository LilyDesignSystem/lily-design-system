# Action Link

An action link is a headless anchor component that visually emphasizes a navigation action, typically appearing as a prominent link that leads the user to a new page or triggers a significant navigation event. Inspired by the NHS England action link pattern, it renders a semantic `<a>` element with optional ARIA label override for screen readers.

Action links are useful when you want to draw attention to a key navigational step, such as "Continue to next step" or "Find a service near you", distinguishing these from standard inline text links.

## Implementation Notes

- Renders as a simple semantic `<a>` element
- Supports `aria-label` override via the `label` prop for when the visible link text is insufficient for screen readers
- Uses `slot` for children content (text, mixed content, etc.)
- Passes through all additional HTML anchor attributes via `...restProps`
- No hardcoded user-facing strings; all text comes through children and props

## Props

- `href`: string (required) -- the URL the link points to
- `label`: string (optional) -- accessible label override for screen readers via aria-label
- `children`: slot (required) -- the link content (text or mixed content)

## Usage

```html
<ActionLink href="/find-a-gp">Find a GP near you</ActionLink>

<ActionLink href="/book-appointment" label="Book a vaccination appointment at your local pharmacy">
  Book a vaccination appointment
</ActionLink>
```

## Keyboard Interactions

- Tab: Focus the link (native browser behavior)
- Enter: Activate the link (native browser behavior)

## ARIA

- Implicit `link` role from the `<a>` element
- `aria-label` -- optional override for screen reader text when the visible link text does not fully convey the action

## When to Use

- Use to signpost the start of a digital service or key navigational step, such as "Find a GP near you" or "Book an appointment".
- Use on content-heavy pages where a key action needs visual emphasis beyond a standard inline link.
- Use when the link represents a significant next step in the user's journey, not routine navigation.
- Use within text blocks or care cards to draw attention to an actionable pathway.

## When Not to Use

- Do not use within forms -- use Button for form actions and submissions.
- Do not use for general page-to-page navigation -- use a standard anchor link or BreadcrumbNav instead.
- Do not use when emphasis is not needed -- use InsetText for highlighted content without an action.
- Do not use for returning to a previous page -- use BackLink instead.

## Headless

This component provides a semantic `<a>` element with optional `aria-label` override and zero visual styling. The consumer is responsible for all CSS including colors, font weight, underline styles, hover effects, focus indicators, and any arrow or icon decoration.


## Styles

The consumer provides all CSS styling. The component renders with a `.action-link` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<a>` element with class `action-link`
- Verify aria-label` -- optional override for screen reader text when the visible link text does not fully convey the action
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Make action links visually distinct from standard inline links using size, weight, or an arrow icon to signal their importance as key navigational steps.
- **Developers**: Use the `label` prop to provide expanded screen reader text when the visible link text is ambiguous, such as providing "Find a GP near your postcode" for a link that just reads "Find a GP".

## References

- Inspired by NHS England action link pattern
- WAI-ARIA link role: https://www.w3.org/TR/wai-aria-1.2/#link
