# ScrollBar

## Metadata

- Component: scroll-bar
- PascalCase: ScrollBar
- Description: a custom scrollbar element
- HTML tag: <div>
- CSS class: .scroll-bar
- Interactive: yes

## Key Behaviors

- Renders a `<div>` with `role="scrollbar"` and full ARIA scrollbar attributes
- Supports `"vertical"` and `"horizontal"` orientations via `aria-orientation`
- Includes `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` for position tracking
- Initial values are set to 0/0/100; consumer should update these dynamically
- The `label` prop provides the accessible name via `aria-label`
- Consumer provides the scrollbar thumb or track content via the `children` slot
- Rest props are spread onto the `<div>` element

## ARIA

- `role="scrollbar"` -- identifies the element as a scrollbar control
- `aria-label="..."` -- provides the accessible name for the scrollbar
- `aria-orientation="vertical|horizontal"` -- indicates the scrollbar direction
- `aria-valuenow="0"` -- the current scroll position (consumer should update dynamically)
- `aria-valuemin="0"` -- the minimum scroll value
- `aria-valuemax="100"` -- the maximum scroll value

## Keyboard

- Arrow Up / Arrow Left: Scroll backward (decrease value) by a small increment
- Arrow Down / Arrow Right: Scroll forward (increase value) by a small increment
- Page Up: Scroll backward by a large increment
- Page Down: Scroll forward by a large increment
- Home: Scroll to the beginning (minimum value)
- End: Scroll to the end (maximum value)

## Props

- `orientation`: "vertical" | "horizontal" (default: "vertical") -- the scrollbar direction, reflected in `aria-orientation`
- `label`: string (required) -- accessible name for the scrollbar via `aria-label`
- `children`: slot (required) -- scrollbar content, typically the draggable thumb element
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="scroll-bar"
- [ ] Has aria-label attribute
- [ ] Has role="scrollbar"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .scroll-bar in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/scroll-bar.html
- WAI-ARIA scrollbar role: https://www.w3.org/TR/wai-aria-1.2/#scrollbar
- WAI-ARIA Practices - ScrollBar: https://www.w3.org/WAI/ARIA/apg/patterns/scrollbar/
