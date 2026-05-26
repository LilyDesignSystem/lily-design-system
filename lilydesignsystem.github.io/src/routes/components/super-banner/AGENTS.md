# SuperBanner

## Metadata

- Component: super-banner
- PascalCase: SuperBanner
- Description: a super-banner communicates a high-priority state that affects an entire app, experience, process, or system
- HTML tag: <div>
- CSS class: .super-banner
- Interactive: yes

## Key Behaviors

- Uses `<div>` element with `role="alert"` for immediate screen reader announcement
- `aria-live="assertive"` interrupts current speech
- May include a dismiss button

## ARIA

- `role="alert"` -- announces the banner content immediately
- `aria-live="assertive"` -- interrupts current speech for high-priority messages
- `aria-label` -- optional description of the banner purpose

## Keyboard

- Tab: Focus the dismiss button (if dismissable)
- Enter/Space: Dismiss the banner (if dismissable)

## Props

- `label`: string (optional) -- accessible label for the super banner
- `dismissable`: boolean (default: false) -- whether the banner can be dismissed
- `ondismiss`: callback (optional) -- handler called when dismissed
- `children`: slot (required) -- banner content
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with class="super-banner"
- [ ] Has role="alert"
- [ ] Has aria-live="assertive"
- [ ] Dismiss functionality works when dismissable
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .super-banner in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/super-banner.html
