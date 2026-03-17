# Lily Design System — HTML Headless — Implementation Plan

## Goal

Implement all headless components using Plain HTML + vanilla JavaScript. Every component must be headless (zero CSS), fully accessible (WCAG 2.2 AAA), and have comprehensive tests.

## Technology

- Framework: Plain HTML + vanilla JavaScript
- Test framework: WebDriverIO
- Test command: `pnpm exec wdio run wdio.conf.js`
- Component file extension: .html
- Component directory: components/

## Approach

1. Set up project infrastructure (package.json, config, test setup)
2. Implement components in priority order:
   a. Static wrappers (badge, banner, card, panel, alert, etc.)
   b. Form inputs (text-input, email-input, checkbox-input, etc.)
   c. Links and views (action-link, postal-code-view, etc.)
   d. Vital sign views and inputs (16 pairs)
   e. Table families (table, data-table, calendar-table, etc.)
   f. Navigation patterns (accordion-nav, breadcrumb-nav, etc.)
   g. List patterns (check-list, summary-list, task-list, etc.)
   h. Bar patterns (tab-bar, menu-bar, tool-bar, etc.)
   i. Picker patterns (color-picker, five-star-rating-picker, etc.)
   j. Form composition (form, field, fieldset, error-summary)
   k. Overlays and menus (dialog, popover, tooltip, dropdown-menu)
   l. Layout (grail-layout, sidebar, floating-panel, scroll-area)
   m. Interactive specialty (combobox, carousel, slider, signature-pad)
3. Create tests for each component
4. Cross-check all components against canonical list in AGENTS.md

## Acceptance Criteria

- [x] All 332 components from the canonical list are implemented
- [x] Each component file follows the architecture in AGENTS.md
- [ ] Every component has a corresponding test file
- [ ] All tests pass: `pnpm exec wdio run wdio.conf.js`
- [x] Zero CSS in any component — fully headless
- [x] WCAG 2.2 AAA compliant (ARIA attributes, keyboard navigation)
- [x] No hardcoded user-facing strings (internationalization-ready)
- [ ] CSS class names match css-style-sheet-template.css
