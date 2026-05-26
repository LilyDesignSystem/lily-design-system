# FlexStack

## Metadata

- Component: flex-stack
- PascalCase: FlexStack
- Description: a flex layout container for vertical or horizontal stacking with consistent gap
- HTML tag: <div>
- CSS class: .flex-stack
- Interactive: no

## Key Behaviors

- Inline style `display: flex; flex-direction: {direction}; gap: {gap};`
- Optional `align-items` and `justify-content` applied when provided
- `data-direction` attribute mirrors the direction prop for consumer CSS hooks
- No width, sizing, or visual treatment is applied

## ARIA

- None — purely structural

## Keyboard

- None — focusable children manage their own keyboard behavior

## Props

- `direction`: "row" | "column" (default: "column") -- flex direction
- `gap`: string (default: "1rem") -- gap CSS value
- `align`: string (optional) -- align-items value
- `justify`: string (optional) -- justify-content value
- `children`: slot -- laid-out content
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with class="flex-stack"
- [ ] Inline style sets display: flex
- [ ] Inline style sets flex-direction to direction prop
- [ ] Inline style sets gap to gap prop
- [ ] align-items applied when align prop provided
- [ ] justify-content applied when justify prop provided
- [ ] data-direction attribute matches direction prop
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .flex-stack in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/flex-stack.html
- MDN flexbox: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout
