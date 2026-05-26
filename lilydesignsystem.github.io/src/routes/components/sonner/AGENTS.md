# Sonner

## Metadata

- Component: sonner
- PascalCase: Sonner
- Description: a toast notification manager
- HTML tag: <div>
- CSS class: .sonner
- Interactive: no

## Key Behaviors

- Renders a `<div>` with `role="region"` to define a named landmark for the notification area
- Uses `aria-live="polite"` so new notifications are announced after the screen reader finishes current output
- Consumer provides individual toast notification elements as children
- Consumer manages toast lifecycle (appearance, auto-dismiss, manual dismiss)
- Accepts `...restProps` for forwarding additional attributes to the container
- No internal state -- purely a structural wrapper

## ARIA

- `role="region"` -- defines the notification area as a named landmark section
- `aria-label={label}` -- provides an accessible name identifying the notification area
- `aria-live="polite"` -- ensures new content is announced after the screen reader finishes its current output

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name identifying the notification area, applied via `aria-label`
- `children`: slot (required) -- the toast notification content

## Acceptance Criteria

- [ ] Renders <div> element with class="sonner"
- [ ] Has aria-label attribute
- [ ] Has role="region"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .sonner in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/sonner.html
- WAI-ARIA Live Regions: https://www.w3.org/TR/wai-aria-1.2/#aria-live
- WAI-ARIA region role: https://www.w3.org/TR/wai-aria-1.2/#region
