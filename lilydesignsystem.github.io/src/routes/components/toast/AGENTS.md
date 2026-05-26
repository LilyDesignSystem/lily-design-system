# Toast

## Metadata

- Component: toast
- PascalCase: Toast
- Description: a brief auto-dismissing notification message
- HTML tag: <div>
- CSS class: .toast
- Interactive: no

## Key Behaviors

- Renders a `<div>` element with a live region role for screen reader announcements
- Uses conditional role assignment: `role="status"` for normal messages, `role="alert"` for urgent ones
- Uses conditional `aria-live`: `"polite"` waits for a pause in speech, `"assertive"` interrupts immediately
- The `urgent` prop controls both the role and aria-live behavior simultaneously
- Accepts a `children` slot for flexible toast content
- Supports rest props via `...restProps` for extensibility (e.g., `id`, `class`)
- slot pattern used for the `children` prop (imported from "svelte")

## ARIA

- `role="status"` -- (default) identifies a live region with advisory information, announced at the next graceful opportunity
- `role="alert"` -- (when `urgent` is true) identifies a live region with important, time-sensitive information, announced immediately
- `aria-live="polite"` -- (default) screen reader waits for a pause before announcing the content
- `aria-live="assertive"` -- (when `urgent` is true) screen reader interrupts current speech to announce the content
- `aria-label={label}` -- optional descriptive label for the toast region

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (default: undefined) -- optional accessible label applied via `aria-label`
- `urgent`: boolean (default: false) -- when true, uses `role="alert"` and `aria-live="assertive"` instead of `role="status"` and `aria-live="polite"`
- `children`: slot (required) -- the toast message content
- `...restProps`: spread onto the `<div>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="toast"
- [ ] Has aria-label attribute
- [ ] Has role="status"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .toast in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/toast.html
- WAI-ARIA Alert Role: https://www.w3.org/TR/wai-aria-1.2/#alert
- WAI-ARIA Status Role: https://www.w3.org/TR/wai-aria-1.2/#status
- WAI-ARIA Live Regions: https://www.w3.org/TR/wai-aria-1.2/#aria-live
