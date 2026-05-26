# Coachmark

## Metadata

- Component: coachmark
- PascalCase: Coachmark
- Description: an anchored popover that spotlights and explains a single feature
- HTML tag: <div> with role="dialog"
- CSS class: .coachmark
- Interactive: yes (dismiss button)

## Key Behaviors

- Renders a <div role="dialog"> with aria-modal="false"
- Renders title in <h2 class="coachmark-title"> and links via aria-labelledby
- Renders description (optional) in <p class="coachmark-description"> and links via aria-describedby
- Generates stable ids for title and description (useId / crypto.randomUUID / Math.random)
- Renders a dismiss button with aria-label={dismissLabel}
- Sets the hidden attribute on the container when `open` is false
- Calls `onDismiss` when the dismiss button is activated

## ARIA

- `role="dialog"` on the container
- `aria-modal="false"` (non-blocking)
- `aria-labelledby` referencing the title id
- `aria-describedby` referencing the description id, only when description is provided
- `hidden` attribute reflects `!open`
- Dismiss button has `aria-label` via `dismissLabel`

## Keyboard

- Tab / Shift+Tab: Move focus into and out of the coachmark
- Enter / Space: Activate the dismiss button when focused
- Escape: (Consumer-provided) dismiss the coachmark

## Props

- `open`: boolean (default false)
- `title`: string (REQUIRED)
- `description`: string (optional)
- `dismissLabel`: string (REQUIRED)
- `onDismiss` / `ondismiss`: callback (optional)
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with role="dialog" and class="coachmark"
- [ ] aria-modal="false" is present
- [ ] Title is rendered in <h2 class="coachmark-title"> and linked via aria-labelledby
- [ ] Description (when provided) is rendered and linked via aria-describedby
- [ ] aria-describedby is absent when description is not provided
- [ ] hidden attribute reflects !open
- [ ] Dismiss button has aria-label={dismissLabel} and fires onDismiss
- [ ] Title and description ids are stable (useId / crypto.randomUUID / Math.random)
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .coachmark in css-style-sheet-template.css
- Adobe Spectrum Coachmark: https://spectrum.adobe.com/page/coach-mark/
- WAI-ARIA Dialog: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
