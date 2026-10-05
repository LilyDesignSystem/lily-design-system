# Mark

## Metadata

- Component: mark
- PascalCase: Mark
- Description: an inline highlight marking text as relevant or referenced, such as a search match, using the native mark element
- Status: beta — implemented and unit-tested in all eight headless libraries; not yet exercised in composed flows
- HTML tag: <mark>
- CSS class: .mark
- Interactive: no

## Key Behaviors

- Renders the native `<mark>` element with the base class `mark` first, then the consumer class
- Spreads `restProps` onto the root; no state, behaviour, ARIA or strings

## ARIA

- None added; native `<mark>` semantics
- Consumers may pass `aria-label` / `aria-roledescription` through rest props for a spoken cue

## Keyboard

- None

## Props

- `class`: string (default: `""`) -- appended to the base class
- `children`: slot -- the highlighted text
- `...restProps`: HTML attributes -- spread onto the root `<mark>`

## Acceptance Criteria

- [ ] Renders <mark> with class="mark"
- [ ] Consumer class appended; rest props spread
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: `.mark` in css-style-sheet-template.css
- [MDN mark element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/mark)
