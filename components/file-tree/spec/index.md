# FileTree — Specification

Single source of truth for spec-driven development of the FileTree component.

## Goal

A hierarchical tree of folders and files with expandable folders.

## HTML Tag and CSS Class

- HTML tag: <ul>
- CSS class: .file-tree

## Approach

1. Use the semantic <ul> element with class="file-tree".
2. Add the ARIA attributes listed in `AGENTS.md`.
3. Implement the keyboard contract listed in `AGENTS.md`.
4. Svelte headless is canonical; other frameworks port its contract in their own idiom.
5. One test per documented behaviour; each must fail if the behaviour is broken.

## Acceptance Criteria

- [ ] Renders <ul role="tree" class="file-tree"> with aria-label
- [ ] Exactly one visible item has tabindex=0
- [ ] Keyboard: ArrowDown/Up/Right/Left, Home, End, *, typeahead, Enter/Space
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless
- [ ] Tests pass in all implementations

## Implementation Status

### Done

- [x] Component directory with index.md, AGENTS.md, spec/index.md
- [x] Svelte headless implementation, tests and story (canonical)

### Backlog

- [ ] Ports to the other headless frameworks
- [ ] Registry, CSS template and example-app demos
