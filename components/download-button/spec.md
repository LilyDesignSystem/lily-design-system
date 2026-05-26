# DownloadButton — Specification

Single source of truth for spec-driven development of the DownloadButton component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the DownloadButton component: a download link styled as a button, with optional file size and format metadata.

## HTML Tag and CSS Class

- HTML tag: <a>
- CSS class: .download-button

## Approach

1. Use semantic <a> element with class="download-button"
2. Require href and label props (TS types non-optional)
3. Set aria-label from label prop for accessible name including download intent
4. Pass fileSize and fileFormat as data-file-size and data-file-format attributes
5. Pass download prop through to native download attribute (boolean or string)
6. Default children to label when omitted
7. Implement in HTML headless (plain HTML, no JavaScript needed)
8. Implement in Svelte headless (Svelte 5 + runes)
9. Implement in React headless (React 19 + TypeScript)
10. Implement in Vue headless (Vue 3 + TypeScript)
11. Implement in Nunjucks headless (macro)
12. Create tests for each implementation including download attribute behavior

## Acceptance Criteria

- [ ] Renders <a> with class="download-button"
- [ ] href and aria-label present from required props
- [ ] data-file-size and data-file-format rendered when provided
- [ ] download rendered correctly for boolean true and string filename
- [ ] All user-facing strings come through props or params (i18n-ready)
- [ ] Headless: zero CSS classes beyond the base class plus consumer extras
- [ ] WCAG 2.2 AAA compliant
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, ARIA, and download attribute behavior in index.md

### In Progress

- [ ] Cross-check implementations against the canonical spec

### Backlog

- [ ] Add canonical entry to components.tsv and AGENTS/components.md
- [ ] Implement HTML headless component
- [ ] Implement Svelte headless component
- [ ] Implement React headless component
- [ ] Implement Vue headless component
- [ ] Implement Nunjucks headless component
- [ ] Implement Blazor headless component
- [ ] Add CSS class .download-button to css-style-sheet-template.css
- [ ] Add tests verifying download attribute rendering for boolean and string values
- [ ] Add comprehensive accessibility tests
- [ ] Add integration tests with parent/child components
