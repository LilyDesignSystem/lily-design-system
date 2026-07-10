# Coachmark

A coachmark is an anchored popover that spotlights and explains a single
feature, typically used in onboarding, feature discovery, or guided tours.

Use it sparingly and at most one at a time, paired with a visual anchor on
the feature being highlighted. A coachmark teaches; it should not block the
user from continuing their task.

## Implementation Notes

- Uses a `<div>` with `role="dialog"` and `aria-modal="false"` (non-blocking)
- `title` is rendered in an `<h2 class="coachmark-title">` and linked via `aria-labelledby`
- `description`, when provided, is rendered in a `<p class="coachmark-description">` and linked via `aria-describedby`
- The dismiss button always renders and uses `dismissLabel` as `aria-label`
- The whole coachmark is hidden via the `hidden` attribute when `open` is `false`
- IDs for the title and description are generated stably via `useId`, `crypto.randomUUID`, or a Math.random helper

## Props

- `open`: boolean (default `false`) -- whether the coachmark is visible
- `title`: string (**required**) -- heading text
- `description`: string (optional) -- body text
- `dismissLabel`: string (**required**) -- accessible label for the dismiss button
- `onDismiss` / `ondismiss`: callback (optional) -- dismiss click handler
- `...restProps`: any additional HTML attributes

## Usage

```html
<Coachmark
  open={open}
  title="Try the new filter"
  description="Filter by status to find items faster."
  dismissLabel="Dismiss"
  onDismiss={handleDismiss}
/>
```

## Keyboard Interactions

- Tab / Shift+Tab: Move focus into and out of the coachmark
- Enter / Space: Activate the dismiss button when focused
- Escape: (Consumer-provided) call `onDismiss` to close the coachmark

## ARIA

- `role="dialog"` on the container
- `aria-modal="false"` (non-blocking; does not trap focus or hide background)
- `aria-labelledby` references the title id
- `aria-describedby` references the description id (only when description is provided)
- `hidden` attribute reflects `!open`

## When to Use

- Use for onboarding a single new feature
- Use for guided tours that highlight one element at a time
- Use when the dismissal is non-blocking and the user can continue working

## When Not to Use

- Do not use for blocking confirmations — use `Dialog` or `AlertDialog`
- Do not stack multiple coachmarks at once — sequence them
- Do not use for help that should be persistently available — use `ContextualHelp` or `Tooltip`

## Headless

Renders a `<div role="dialog" aria-modal="false">` with title/description ids
and an always-rendered dismiss button. Anchor positioning, fade/scale
animations, and visual treatment are entirely the consumer's responsibility.

## Styles

Consumer CSS targets the `coachmark` class. Sub-elements expose
`coachmark-title`, `coachmark-description`, and `coachmark-dismiss` classes
for selective styling. Provide a clear focus indicator on the dismiss button.

## Testing

- Verify the component renders a `<div>` with `role="dialog"` and class `coachmark`
- Verify `aria-modal="false"`
- Verify the title is rendered inside `<h2 class="coachmark-title">` and linked via `aria-labelledby`
- Verify the description, when provided, is rendered and linked via `aria-describedby`
- Verify the description and `aria-describedby` are absent when no description is provided
- Verify `hidden` is set when `open` is `false`
- Verify the dismiss button has `aria-label={dismissLabel}` and fires `onDismiss` on click

## Advice

- **Designers**: Anchor the coachmark visually to the feature; do not obscure other actions.
- **Developers**: Persist the dismissed state in user preferences so the coachmark does not reappear.

## Related components

- `popover` — a floating content box anchored to a trigger element
- `tooltip` — a small popup showing descriptive text on hover or focus
- `tour` — a tour guide, such as for sightseeing, or pathways, or demonstrations, etc.

## References

- WAI-ARIA Dialog: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
- Adobe Spectrum Coachmark: https://spectrum.adobe.com/page/coach-mark/
- WCAG 1.4.13 Content on Hover or Focus: https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus

---

Lily™ and Lily Design System™ are trademarks.
