# ScrollBar

## Metadata

- Component: scroll-bar
- PascalCase: ScrollBar
- Description: a custom scrollbar element
- Status: beta — implemented and unit-tested in all seven frameworks, with the keys in all but Nunjucks (markup only; its keys are the consumer's script), and an axe-clean demo page; not yet exercised in composed flows
- HTML tag: <div>
- CSS class: .scroll-bar
- Interactive: yes

## Key Behaviors

- Renders a focusable `<div>` (`tabindex="0"`) with `role="scrollbar"` and full ARIA scrollbar attributes
- Supports `"vertical"` and `"horizontal"` orientations via `aria-orientation`
- Owns the scroll position: `value` (bindable; default 0) within `min`..`max` (default 0..100) is reflected in `aria-valuenow`, `aria-valuemin` and `aria-valuemax`
- The keys move `value` by `step` (arrows) or `pageStep` (Page Up / Page Down), or to `min` / `max` (Home / End), clamped to the range, and report it (two-way binding, `onChange` in React, a bubbling `change` event in HTML, `lily:change` in Alpine, `lily-change` in Web Components)
- The consumer scrolls its content to `value`, writes `value` back as the content scrolls, and handles drag
- `controls` names the scrolled element via `aria-controls`
- The `label` prop provides the accessible name via `aria-label`
- Consumer provides the scrollbar thumb or track content via the `children` slot
- Rest props are spread onto the `<div>` element

## ARIA

- `role="scrollbar"` -- identifies the element as a scrollbar control
- `aria-label="..."` -- provides the accessible name for the scrollbar
- `aria-orientation="vertical|horizontal"` -- indicates the scrollbar direction
- `aria-controls="..."` -- the scrolled element, when `controls` is given
- `aria-valuenow` -- the current scroll position (`value`)
- `aria-valuemin` -- the minimum scroll value (`min`)
- `aria-valuemax` -- the maximum scroll value (`max`)
- `tabindex="0"` -- the scrollbar is in the tab order so the keys reach it

## Keyboard

- Arrow Up / Arrow Left: Scroll backward (decrease value) by `step`
- Arrow Down / Arrow Right: Scroll forward (increase value) by `step`
- Page Up: Scroll backward by `pageStep`
- Page Down: Scroll forward by `pageStep`
- Home: Scroll to the beginning (minimum value)
- End: Scroll to the end (maximum value)

## Props

- `orientation`: "vertical" | "horizontal" (default: "vertical") -- the scrollbar direction, reflected in `aria-orientation`
- `value`: number (default: 0) -- the scroll position, reflected in `aria-valuenow`; bindable (React: controlled `value` + `onChange`, or uncontrolled `defaultValue`)
- `min`: number (default: 0) -- the start of the range, `aria-valuemin`
- `max`: number (default: 100) -- the end of the range, `aria-valuemax`
- `step`: number (default: 1) -- the arrow-key increment
- `pageStep`: number (default: 10) -- the Page Up / Page Down increment
- `controls`: string (optional) -- the id of the scrolled element, via `aria-controls`
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
- MDN - ARIA scrollbar role: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/scrollbar_role
