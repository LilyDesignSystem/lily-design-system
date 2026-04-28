# Coachmark

An anchored popover that spotlights and explains a single feature. Inspired by Adobe Spectrum's CoachMark.

## Implementation Notes

- Renders a `<div>` with `role="dialog"` and `aria-modal="false"` (non-modal)
- Stable IDs are generated with React's `useId()` and used for `aria-labelledby` and `aria-describedby`
- `aria-describedby` is only set when `description` is provided
- The `hidden` attribute reflects `!open`
- All user-facing strings are consumer-supplied (i18n-ready)

## Props

- `open`: boolean (default: `false`) — whether the coachmark is visible
- `title`: string (**required**) — heading text
- `description`: string (optional) — body text
- `dismissLabel`: string (**required**) — accessible label for the dismiss button
- `onDismiss`: (event: React.MouseEvent) => void (optional) — dismiss click handler
- `...restProps`: any additional HTML attributes passed to the root `<div>`

## Usage

```tsx
<Coachmark
  open={showCoachmark}
  title="Try this new feature"
  description="Click the menu to access advanced options."
  dismissLabel="Dismiss tip"
  onDismiss={() => setShowCoachmark(false)}
/>
```

## ARIA

- `role="dialog"` with `aria-modal="false"`
- `aria-labelledby` linked to the rendered title heading
- `aria-describedby` linked to the description (when present)

## References

- [Adobe Spectrum CoachMark](https://spectrum.adobe.com/page/coach-mark/)
- [WAI-ARIA Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
