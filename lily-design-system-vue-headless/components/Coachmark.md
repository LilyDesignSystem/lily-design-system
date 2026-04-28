# Coachmark

An anchored popover that spotlights and explains a single feature.

## Implementation Notes

- Headless: no CSS
- `role="dialog"` with `aria-modal="false"` (non-modal)
- Title and description ids are generated for ARIA wiring (`aria-labelledby` / `aria-describedby`)
- The native `hidden` attribute toggles visibility based on `open`

## Props

- `open`: boolean (default `false`)
- `title`: string (**required**) — heading text
- `description`: string (optional) — body text
- `dismissLabel`: string (**required**) — accessible label for the dismiss button

## Events

- `dismiss(event: MouseEvent)`

## Usage

```vue
<Coachmark
    :open="showCoach"
    title="New feature"
    description="Try out the new layout."
    dismiss-label="Dismiss"
    @dismiss="showCoach = false"
/>
```

## ARIA

- `role="dialog"`, `aria-modal="false"`
- `aria-labelledby` is always set
- `aria-describedby` is only set when `description` is provided

## When to Use

- For one-off feature spotlights / onboarding tips

## When Not to Use

- For modal interactions — use `Dialog` or `AlertDialog`
- For per-element help — use `ContextualHelp`

## Headless

Renders semantic HTML and ARIA. Consumers supply CSS to anchor and style the popover.

## Testing

- Verify the root `coachmark` class and `role="dialog"`
- Verify `aria-modal="false"`
- Verify `aria-labelledby` points to the rendered title
- Verify `aria-describedby` is only present with a description
- Verify `dismiss` event fires when the dismiss button is clicked

## References

- [Adobe Spectrum — Coachmark](https://spectrum.adobe.com/page/coach-mark/)
- [WAI-ARIA Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
