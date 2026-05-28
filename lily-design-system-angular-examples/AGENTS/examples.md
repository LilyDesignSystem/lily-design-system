## Web app examples design principles rules

The example subprojects show what the headless components look like when paired with real CSS, real interactivity, and a working app shell. They are the inverse of the headless subprojects: every visual decision is made and every text string is supplied.

### Styling

- Examples ship a complete stylesheet. The current visual reference is the NHS UK design system applied to Lily class names, but the architecture allows other reference designs (GOV.UK, USWDS, Mozilla Protocol, Adobe Spectrum) to be added in parallel as alternative `theme-*` directories.
- Examples target the kebab-case Lily class names directly — no `nhsuk-` or other framework prefixes appear in the markup.
- CSS custom properties carry the design tokens (colour, spacing, typography, breakpoints, focus). Examples avoid Tailwind, DaisyUI, Bootstrap, or any CSS framework dependency.
- Examples may add additional class hooks or `data-*` attributes beyond the base headless class to drive variant styling, but those additions are confined to the example subproject.

### Internationalisation

- Examples still pass user-facing text as props / slots / parameters. Demo strings are concrete (English) but flow through the same prop names the headless components require, so consumers porting an example to another locale only swap the values.
- Locale-aware formatting (currency, dates, numbers) uses `Intl.*` formatters configured by the example's locale.

### Required routes

Every example subproject ships these three routes:

- `/` — home page welcoming the visitor and explaining the project. Links to the components index and to any composed page demonstrations.
- `/components` — the components index. Lists every component in the catalog (407 entries), is searchable / filterable, and links each entry to its detail page.
- `/components/{slug}` — one detail page per component. Renders one component (not a grid of many), shows a usable demo, and surfaces the canonical metadata (description, props, ARIA, keyboard, references).

Composed page demonstrations (`/dashboard`, `/contact-form`, `/page-layout`, `/timeline-and-cards`, `/dialog-flow`, `/file-upload-form`, `/navigation-and-menus`, `/rating-and-feedback`, `/search-and-filter`, `/settings-page`, `/tabbed-interface`, `/task-management`) are encouraged on top of the required routes; they exercise multiple components together to validate the system as a whole.

### Accessibility

- Skip-link is the first interactive element on every page.
- Standard landmarks (`<header>`, `<nav>`, `<main>`, `<footer>`) wrap every page.
- Focus indicators are visible and high-contrast on every focusable element.
- Keyboard-only users complete every demo flow without a mouse.
- WCAG 2.2 AAA is the target.
