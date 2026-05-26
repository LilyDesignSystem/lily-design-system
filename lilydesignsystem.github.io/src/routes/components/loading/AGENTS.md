# Loading

## Metadata

- Component: loading
- PascalCase: Loading
- Description: a loading indicator, such as text, or image, or animation
- HTML tag: <div>
- CSS class: .loading
- Interactive: no

## Key Behaviors

- Uses `<div>` element with `role="status"` for screen reader announcements
- `aria-live="polite"` announces loading state changes without interrupting
- `aria-label` provides a text description of the loading state

## ARIA

- `role="status"` -- creates an ARIA live region for loading announcements
- `aria-live="polite"` -- announces changes without interrupting current speech
- `aria-label` -- describes the loading state

## Keyboard

- None -- loading indicators are informational, not interactive

## Props

- `label`: string (default: "Loading") -- accessible label for the loading state
- `children`: slot (optional) -- loading indicator content
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with class="loading"
- [ ] Has role="status"
- [ ] Has aria-live="polite"
- [ ] Has aria-label attribute
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .loading in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/loading.html
