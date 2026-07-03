# BarcodeImage — Specification

Single source of truth for spec-driven development of the BarcodeImage component.

## Goal

Implement the BarcodeImage component: a visual machine-readable symbolic code image, such as for a scanner.

## HTML Tag and CSS Class

- HTML tag: <img>
- CSS class: .barcode-image

## Approach

1. Use semantic <img> element with class="barcode-image"
2. Require `src` and `alt` props
3. Support optional `loading` prop
4. Spread rest props onto the <img>
5. Implement in HTML headless (plain HTML)
6. Implement in Svelte, React, Vue, Angular, Blazor, Nunjucks headless
7. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <img> with class="barcode-image"
- [ ] src and alt applied from props
- [ ] Optional loading attribute applied
- [ ] Rest props pass through
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Add row to components.tsv
- [x] Add CSS class .barcode-image to css-style-sheet-template.css
- [x] Create component directory with index.md, README.md symlink, AGENTS.md, CLAUDE.md, spec/index.md

### Backlog

- [ ] Implement HTML headless component
- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Angular headless component
- [ ] Implement Blazor headless component
- [ ] Implement Nunjucks headless component
- [ ] Add demos in all 7 example apps
