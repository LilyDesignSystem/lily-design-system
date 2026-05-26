# HorizontalScroller

## Metadata

- Component: horizontal-scroller
- PascalCase: HorizontalScroller
- Description: a horizontally scrollable content container
- HTML tag: <div>
- CSS class: .horizontal-scroller
- Interactive: yes

## Key Behaviors

- Content scrolls horizontally with overflow
- Consumer styles children for horizontal layout (flexbox or grid)
- Supports mouse drag scrolling, touch swipe, and keyboard navigation
- Optional scroll snap behavior via consumer CSS
- Inspired by Reuters Graphics HorizontalScroller component

## ARIA

- `role="region"` with `aria-label`
- `aria-roledescription="carousel"` if applicable
- `tabindex="0"` for keyboard scrolling

## Keyboard

- Left/Right arrow keys scroll horizontally when focused
- Tab moves to focusable children

## Props

- `label`: string (required) -- accessible label for the scrollable region
- `children`: slot (required) -- horizontally arranged content
- `...restProps`: Any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> element with class="horizontal-scroller"
- [ ] Has role="region" with aria-label
- [ ] Has tabindex="0" for keyboard access
- [ ] Left/Right arrow keys scroll horizontally
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS -- fully headless

## References

- Documentation: index.md
- CSS class: .horizontal-scroller in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/horizontal-scroller.html
- Reuters Graphics HorizontalScroller
- WAI-ARIA carousel pattern
