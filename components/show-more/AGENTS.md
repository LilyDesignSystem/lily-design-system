# ShowMore

## Metadata

- Component: show-more
- PascalCase: ShowMore
- Description: clamp long content behind a show more / show less toggle
- Status: beta — implemented and unit-tested in the Svelte canonical; ports to the other frameworks pending (2026-10-05)
- HTML tag: <div>
- CSS class: .show-more
- Interactive: yes

## Key Behaviors

- Content never leaves the DOM; collapse is visual via `data-expanded`
- Button toggles `expanded`, with `aria-expanded` and `aria-controls`
- `moreLabel` / `lessLabel` required, no default

## ARIA

- `aria-expanded={expanded}` -- on the button
- `aria-controls={contentId}` -- on the button, references the content `id`

## Keyboard

- Enter: toggles when the button has focus (native)
- Space: toggles when the button has focus (native)
- Tab: moves focus to / from the button

## Props

- `className`: string (default: `""`) -- CSS class name appended to the base class
- `moreLabel`: string (required) -- button text while collapsed
- `lessLabel`: string (required) -- button text while expanded
- `expanded`: boolean (default: `false`) -- bindable
- `children`: slot -- the content
- `...restProps`: unknown -- additional attributes spread onto the root

## Acceptance Criteria

- [ ] Renders <div class="show-more"> with content and button
- [ ] Button has aria-expanded and aria-controls
- [ ] Label switches between moreLabel and lessLabel
- [ ] No inline style
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .show-more in css-style-sheet-template.css
