# Image Cropper — Specification

Single source of truth for spec-driven development of the Image Cropper component. Consolidates the prior `plan.md` and `tasks.md`.

## Goal

Implement the Image Cropper component: a container for cropping and resizing an image to a selected region.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .image-cropper

## Approach

1. Use a semantic `<div>` element with class="image-cropper"
2. Add `role="application"` and a required `aria-label` for accessibility
3. Spread rest-props onto the root; render consumer-supplied children (image + crop overlay)
4. Implement in HTML headless (plain HTML + vanilla JS)
5. Implement in Svelte, React, Vue, Angular, Blazor, Nunjucks headless
6. Create tests for each implementation

## Acceptance Criteria

- [ ] Renders <div> with class="image-cropper"
- [ ] `role="application"` -- indicates a complex widget with custom pointer interactions, informing assistive technologies to pass keyboard events through to the application
- [ ] `aria-label` -- provides an accessible description of the image cropper purpose
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Create component directory with index.md and README.md symlink
- [x] Document props, usage, keyboard interactions, and ARIA in index.md
- [x] Add CSS class .image-cropper to css-style-sheet-template.css

### In Progress

- [ ] Implement headless components across all seven frameworks
- [ ] Implement per-framework tests and Storybook stories

### Backlog

- [ ] Add pointer-interaction integration examples in the example apps
- [ ] Add screen-reader announcement tests
- [ ] Cross-check against css-style-sheet-template.css

## Origin

Added after researching Origin UI Angular (originui-ng.com), whose "Cropper" category
was the one component not already covered by the Lily catalog. See
[AGENTS/citations.md](../../../AGENTS/citations.md).
