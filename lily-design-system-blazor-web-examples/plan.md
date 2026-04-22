# Lily Design System — Blazor Web Examples — Implementation Plan

## Goal

Create styled example pages demonstrating component usage with Blazor Web App .NET 10 with simple styling. Examples use NHS UK design system CSS for visual styling on top of headless components.

## Technology

- Framework: Blazor Web App .NET 10 with simple styling
- Test framework: bUnit
- Test command: `dotnet test`
- Component directory: Components/Pages/

## Approach

1. Set up project infrastructure and NHS UK CSS integration
2. Create example pages demonstrating component families:
   a. Form page (text-input, email-input, select, checkbox, radio, etc.)
   b. Navigation page (breadcrumb, pagination, accordion, tree)
   c. Table page (data-table, calendar-table)
   d. Dialog and overlay page (dialog, popover, tooltip, toast)
   e. Layout page (grail-layout, sidebar, card)
   f. Medical/vital signs page
   g. Rating and picker page
   h. Additional showcase pages as needed
3. Import headless components from the corresponding headless library
4. Apply NHS UK CSS classes for styling
5. Create tests for each example page

## Acceptance Criteria

- [x] Example pages demonstrate all major component families
- [x] NHS UK CSS styling applied correctly
- [x] Headless components imported from the headless library
- [ ] All pages are accessible (WCAG 2.2 AAA)
- [ ] All tests pass: `dotnet test`
- [ ] Responsive layout works on mobile and desktop
- [x] /components route lists all 364 components
- [x] /components/{slug} route demonstrates each component with live demo
