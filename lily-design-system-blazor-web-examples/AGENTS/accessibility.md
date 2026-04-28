## Accessibility design principles rules

### Standards

- WCAG 2.2 AAA compliance
- WAI-ARIA Authoring Practices patterns
- Semantic HTML elements over generic divs

### Common Patterns

- `<label for="id">` — link labels to inputs
- `aria-labelledby` / `aria-describedby` — link related elements
- `aria-invalid` + `aria-errormessage` — error state
- `role="alert"` — announce dynamic content
- `role="group"` with `aria-label` — group related controls
- Roving tabindex (`tabindex="0"` / `tabindex="-1"`) — grid navigation
- `aria-pressed` — toggle button state
- `aria-expanded` — expandable sections
- `aria-current` — current item in navigation
