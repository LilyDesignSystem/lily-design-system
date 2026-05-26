# ScrollArea

## Metadata

- Component: scroll-area
- PascalCase: ScrollArea
- Description: a scrollable container with custom scrollbar support
- HTML tag: <div>
- CSS class: .scroll-area
- Interactive: yes

## Key Behaviors

- Renders a `<div>` element with `role="region"` to create an accessible landmark
- Sets `tabindex="0"` to make the container focusable, enabling keyboard scrolling (arrow keys, Page Up/Down, Home/End)
- Consumer must apply CSS `overflow` and dimension properties to enable actual scrolling behavior
- Spreads `restProps` onto the div for consumer customization

## ARIA

- `role="region"` -- identifies the container as a landmark region so assistive technologies can announce it
- `aria-label={label}` -- provides an accessible name describing what content is scrollable

## Keyboard

- Tab: Moves focus to the scroll area container
- Arrow Up / Arrow Down: Scrolls content vertically (native browser behavior when focused)
- Arrow Left / Arrow Right: Scrolls content horizontally (native browser behavior when focused)
- Page Up / Page Down: Scrolls content by one page (native browser behavior when focused)
- Home / End: Scrolls to the beginning or end of content (native browser behavior when focused)

## Props

- `label`: string (required) -- accessible label for the scrollable region, applied via `aria-label`
- `children`: slot (required) -- scrollable content to render inside the container
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="scroll-area"
- [ ] Has aria-label attribute
- [ ] Has role="region"
- [ ] Keyboard navigation works correctly
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .scroll-area in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/scroll-area.html
- WAI-ARIA Region Role: https://www.w3.org/TR/wai-aria-1.2/#region
- WCAG 2.1 Reflow: https://www.w3.org/WAI/WCAG21/Understanding/reflow.html
