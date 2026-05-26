# Splitter

## Metadata

- Component: splitter
- PascalCase: Splitter
- Description: a draggable divider for resizing adjacent panels
- HTML tag: <div>
- CSS class: .splitter
- Interactive: yes

## Key Behaviors

- Renders a `<div>` element with `role="separator"` for ARIA semantics
- Sets `tabindex="0"` to make the separator keyboard-focusable
- Includes `aria-orientation` to indicate whether the split is horizontal or vertical
- Includes `aria-valuenow`, `aria-valuemin`, and `aria-valuemax` for communicating the current split position as a percentage (default: 50, min: 0, max: 100)
- Consumer should update `aria-valuenow` dynamically as the user drags the splitter
- Consumer is responsible for implementing keyboard handlers (arrow keys to adjust position) and pointer/drag handlers
- Spreads `restProps` onto the div for consumer customization

## ARIA

- `role="separator"` -- identifies the element as a separator between two regions
- `aria-label={label}` -- provides an accessible name describing the splitter's purpose
- `aria-orientation={orientation}` -- indicates whether the separator divides content horizontally or vertically
- `aria-valuenow={50}` -- reports the current position of the splitter as a percentage
- `aria-valuemin={0}` -- the minimum allowed position value
- `aria-valuemax={100}` -- the maximum allowed position value

## Keyboard

- Tab: Moves focus to the splitter
- Arrow keys: Consumer should implement arrow key handling to adjust the split position (Left/Right for horizontal, Up/Down for vertical)
- Home: Consumer should implement to set the splitter to the minimum position
- End: Consumer should implement to set the splitter to the maximum position

## Props

- `label`: string (required) -- accessible label for the splitter, applied via `aria-label`
- `orientation`: `"horizontal" | "vertical"` (default: `"vertical"`) -- the orientation of the split direction
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="splitter"
- [ ] Has aria-label attribute
- [ ] Has role="separator"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .splitter in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/splitter.html
- WAI-ARIA Window Splitter Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
- WAI-ARIA Separator Role: https://www.w3.org/TR/wai-aria-1.2/#separator
