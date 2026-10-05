# Thinking

## Metadata

- Component: thinking
- PascalCase: Thinking
- Description: a closed-by-default disclosure for an assistant's reasoning, with a streaming state
- Status: beta — implemented and unit-tested in the Svelte canonical; ports to the other frameworks pending (2026-10-05)
- HTML tag: <details>
- CSS class: .thinking
- Interactive: yes

## Key Behaviors

- Native `<details>` / `<summary>`, closed by default
- `streaming` adds `data-streaming` and `aria-busy`
- `label` is the required summary text

## ARIA

- Native `details`/`summary` disclosure semantics
- `aria-busy="true"` on the root only while `streaming`

## Keyboard

- Enter: toggles when the summary has focus (native)
- Space: toggles when the summary has focus (native)
- Tab: moves focus to / from the summary

## Props

- `className`: string (default: `""`) -- CSS class name appended to the base class
- `label`: string (required) -- summary text
- `open`: boolean (default: `false`) -- bindable
- `streaming`: boolean (default: `false`) -- content is still arriving
- `children`: slot -- the reasoning content
- `...restProps`: unknown -- additional attributes spread onto the `<details>`

## Acceptance Criteria

- [ ] Renders <details> with class="thinking" and a summary
- [ ] Closed by default; open is bindable
- [ ] streaming toggles data-streaming and aria-busy
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .thinking in css-style-sheet-template.css
