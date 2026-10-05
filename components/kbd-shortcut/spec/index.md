# KbdShortcut — Specification

Single source of truth for spec-driven development of the KbdShortcut component.

## Goal

A multi-key keyboard shortcut shown as a row of key caps.

## HTML Tag and CSS Class

- HTML tag: <kbd>
- CSS class: .kbd-shortcut

## Approach

1. Use the semantic <kbd> element with class="kbd-shortcut".
2. Add the ARIA attributes listed in `AGENTS.md`.
3. Implement the keyboard contract listed in `AGENTS.md`.
4. Svelte headless is canonical; other frameworks port its contract in their own idiom.
5. One test per documented behaviour; each must fail if the behaviour is broken.

## Acceptance Criteria

- [ ] Renders <kbd> with class="kbd-shortcut"
- [ ] One kbd-shortcut-key per key; separators between only
- [ ] Separators are aria-hidden
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
