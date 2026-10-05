# Thinking — Specification

Single source of truth for spec-driven development of the Thinking component.

## Goal

A closed-by-default disclosure for an assistant's reasoning, with a streaming state.

## HTML Tag and CSS Class

- HTML tag: <details>
- CSS class: .thinking

## Approach

1. Use the semantic <details> element with class="thinking".
2. Add the ARIA attributes listed in `AGENTS.md`.
3. Implement the keyboard contract listed in `AGENTS.md`.
4. Svelte headless is canonical; other frameworks port its contract in their own idiom.
5. One test per documented behaviour; each must fail if the behaviour is broken.

## Acceptance Criteria

- [ ] Renders <details> with class="thinking" and a summary
- [ ] Closed by default; open is bindable
- [ ] streaming toggles data-streaming and aria-busy
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
