# Lily Design System -- Nunjucks Headless -- Implementation Plan

## Goal

Implement all headless components as Nunjucks 3.x macros. Every component must be headless (zero CSS), fully accessible (WCAG 2.2 AAA), and have comprehensive tests.

## Technology

- Framework: Nunjucks 3.x macros
- Test framework: vitest + jsdom
- Test command: `pnpm test`
- Component file: macro.njk
- Component directory: components/{kebab-case}/

## Approach

1. Set up project infrastructure (package.json, vitest.config.js, test/render.js)
2. Implement components in priority order:
   a. Static wrappers (Badge, Banner, Card, Panel, Alert, etc.)
   b. Form inputs (TextInput, EmailInput, CheckboxInput, etc.)
   c. Links and views (ActionLink, PostalCodeView, etc.)
   e. Table families (Table, DataTable, CalendarTable, etc.)
   f. Navigation patterns (AccordionNav, BreadcrumbNav, etc.)
   g. List patterns (CheckList, SummaryList, TaskList, etc.)
   h. Bar patterns (TabBar, MenuBar, ToolBar, etc.)
   i. Picker patterns (ColorPicker, FiveStarRatingPicker, etc.)
   j. Form composition (Form, Field, Fieldset, ErrorSummary)
   k. Overlays and menus (Dialog, Popover, Tooltip, DropdownMenu)
   l. Layout (GrailLayout, Sidebar, FloatingPanel, ScrollArea)
   m. Interactive specialty (Combobox, Carousel, Slider, SignaturePad)
3. Create tests for each component using vitest + jsdom
4. Cross-check all components against canonical list in AGENTS.md

## Acceptance Criteria

- [ ] All 364 components from the canonical list are implemented
- [ ] Each component file follows the architecture in AGENTS.md
- [ ] Every component has a corresponding test file
- [ ] All tests pass: `pnpm test`
- [ ] Zero CSS in any component -- fully headless
- [ ] WCAG 2.2 AAA compliant (ARIA attributes, keyboard navigation)
- [ ] No hardcoded user-facing strings (internationalization-ready)
- [ ] CSS class names match css-style-sheet-template.css
