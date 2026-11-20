# OneTimePasswordInput — Specification

Single source of truth for spec-driven development of the OneTimePasswordInput component.

## Goal

A single one-time-password input with a numeric keypad, SMS autofill, and a fixed length.

## HTML Tag and CSS Class

- HTML tag: <input>
- CSS class: .one-time-password-input

## Approach

1. Use the semantic <input> element with class="one-time-password-input".
2. Add the ARIA attributes listed in `AGENTS.md`.
3. Implement the keyboard contract listed in `AGENTS.md`.
4. Svelte headless is canonical; other frameworks port its contract in their own idiom.
5. One test per documented behaviour; each must fail if the behaviour is broken.

## Acceptance Criteria

- [ ] Renders `<input>` with class="one-time-password-input"
- [ ] Has aria-label, autocomplete="one-time-code", inputmode, maxlength, data-length
- [ ] Typing is limited to `length` characters
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
