# ShowMore — Specification

Single source of truth for spec-driven development of the ShowMore component.

## Goal

Clamp long content behind a show more / show less toggle.

## HTML Tag and CSS Class

- HTML tag: <div>
- CSS class: .show-more

## Approach

1. Use the semantic <div> element with class="show-more".
2. Add the ARIA attributes listed in `AGENTS.md`.
3. Implement the keyboard contract listed in `AGENTS.md`.
4. Svelte headless is canonical; other frameworks port its contract in their own idiom.
5. One test per documented behaviour; each must fail if the behaviour is broken.

## Acceptance Criteria

- [ ] Renders <div class="show-more"> with content and button
- [ ] Button has aria-expanded and aria-controls
- [ ] Label switches between moreLabel and lessLabel
- [ ] No inline style
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
