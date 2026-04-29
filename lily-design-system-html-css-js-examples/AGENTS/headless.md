## Headless design principles rules

All components are unstyled and focus on semantic HTML, ARIA accessibility, and keyboard interaction.

- Semantic HTML structure
- Semantic HTML elements preferred over divs
- ARIA attributes for accessibility
- Data attributes for behavior and state
- Consumers provide all CSS
- Consumers provide all user-facing text via parameters (i18n-ready)
- No CSS classes beyond the base class name + consumer CssClass
- No visual styling, stylesheets, inline styles, colors, sizes, spacing, visual treatment
