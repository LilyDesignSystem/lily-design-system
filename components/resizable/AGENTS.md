# Resizable

## Metadata

- Component: resizable
- PascalCase: Resizable
- Description: a container that the user can resize by dragging
- HTML tag: <div>
- CSS class: .resizable
- Interactive: no

## Key Behaviors

- Renders a `<div>` element with `role="region"` for landmark semantics
- Sets `tabindex="0"` to make the container keyboard-focusable
- Exposes a `data-resize` attribute with the value of the `direction` prop (`"both"`, `"horizontal"`, or `"vertical"`)
- Consumer is responsible for applying CSS `resize` and `overflow` properties based on the `data-resize` attribute
- Spreads `restProps` onto the div for consumer customization

## ARIA

- `role="region"` -- identifies the container as a landmark region for assistive technologies
- `aria-label={label}` -- provides an accessible name describing the resizable area

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible label for the resizable region, applied via `aria-label`
- `direction`: `"both" | "horizontal" | "vertical"` (default: `"both"`) -- which directions the container can be resized
- `children`: slot (required) -- content to render inside the resizable container
- `...restProps`: unknown -- additional attributes spread onto the `<div>` element

## Acceptance Criteria

- [ ] Renders <div> element with class="resizable"
- [ ] Has aria-label attribute
- [ ] Has role="region"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .resizable in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/resizable.html
- WAI-ARIA Region Role: https://www.w3.org/TR/wai-aria-1.2/#region
- WAI-ARIA Authoring Practices - Window Splitter: https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
