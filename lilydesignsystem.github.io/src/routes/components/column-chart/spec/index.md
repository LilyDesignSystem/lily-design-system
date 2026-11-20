# ColumnChart — Specification

Single source of truth for spec-driven development of the ColumnChart component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the ColumnChart component: a vertical column chart visualization for displaying data.

## HTML Tag and CSS Class

- HTML tag: `<figure>`
- CSS class: `.column-chart`

## Approach

1. Render `<figure>` as the root element with `class="column-chart"`
2. Wire ARIA attributes per the AGENTS.md ARIA section
3. Wire keyboard behaviour per the AGENTS.md Keyboard section
4. Spread `restProps` for consumer customization
5. Implement headless variants in HTML, Svelte, React, Vue, Angular, Blazor, and Nunjucks subprojects
6. Author tests for each implementation

## Acceptance Criteria

- [ ] Renders `<figure>` with class `column-chart`
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] All ARIA attributes documented in AGENTS.md are applied
- [ ] All keyboard interactions documented in AGENTS.md work as described
- [ ] Tests pass in all seven headless implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Author Metadata, Key Behaviors, ARIA, Keyboard, Props sections in AGENTS.md
- [x] Add CSS class hook to css-style-sheet-template.css
- [x] Add component to components.tsv and AGENTS/components.md

### Backlog

- [ ] Implement HTML headless component
- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Blazor headless component
- [ ] Implement Nunjucks headless macro
- [ ] Add to all `*-examples` subprojects
- [ ] Add comprehensive keyboard interaction tests
- [ ] Add screen reader announcement tests
- [ ] Cross-check against css-style-sheet-template.css

## Data table alternative (added 2026-10-05)

The graphic is wrapped in `<div class="column-chart-graphic" role="img" aria-label>`; `role="img"` is **not** on the `<figure>` any more. The optional `dataTable` (a snippet in Svelte, a prop in React, a named slot in Vue, a projected `[dataTable]` element in Angular, a `DataTable` render fragment in Blazor, `params.dataTable` in Nunjucks, a `slot="data-table"` child in Web Components) renders the accessible table in `<div class="column-chart-data-table">`, a **sibling** of the graphic and never inside it: `role="img"` makes its descendants presentational, so a table inside would be invisible to assistive technology. Without a data table the wrapper is not rendered (except Angular, noted above). **Breaking** for consumers that styled or queried `role="img"` on the figure.
