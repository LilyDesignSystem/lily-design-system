# Lily Design System — Implementation Plan

## Goal

Maintain the canonical component list, design tokens, and CSS style sheet template for the Lily Design System. Coordinate across 5 headless component library subprojects and 5 example application subprojects.

## Approach

1. Maintain canonical component list (288 components) in AGENTS.md
2. Maintain CSS style sheet template for component class names
3. Provide tools for listing, testing, and verifying components
4. Ensure all subprojects stay in sync with the canonical list
5. Document design principles, accessibility standards, and patterns

## Acceptance Criteria

- [ ] All 288 components documented in canonical list
- [ ] CSS style sheet template covers all component class names
- [ ] Tools (list-components, test-components, test-implementations) work correctly
- [ ] All subprojects reference the same canonical component list
- [ ] Component naming patterns documented and consistent
- [ ] Suffix-to-HTML-element mapping documented and accurate
- [ ] Composition patterns documented (Form, Navigation, Table, Grail Layout, VitalSign)
