# SplitView

## Metadata

- Component: split-view
- PascalCase: SplitView
- Description: a two-panel resizable layout container with a draggable divider between them
- HTML tag: <div> container with two <section> panels and a role="separator" divider
- CSS class: .split-view
- Interactive: yes (separator is focusable)

## Key Behaviors

- Renders <div class="split-view"> with aria-label, data-orientation, data-split-percent
- Renders primary content inside <section class="split-view-primary">
- Renders secondary content inside <section class="split-view-secondary">
- Renders a default <div class="split-view-divider" role="separator"> if no custom `divider` is supplied
- Default divider has aria-orientation, aria-valuenow={splitPercent}, aria-valuemin="0", aria-valuemax="100", tabindex="0"
- Consumer can replace the divider via the `divider` slot/prop

## ARIA

- Container: aria-label (required)
- Container: data-orientation, data-split-percent for consumer CSS
- Default divider: role="separator", aria-orientation, aria-valuenow, aria-valuemin, aria-valuemax, tabindex="0"

## Keyboard

- Tab: Focus to and from the divider
- Arrow keys: (Consumer-provided) move divider position
- Home / End: (Consumer-provided) snap to min / max
- Enter / Space: (Consumer-provided) toggle a collapsed panel

## Props

- `label`: string (REQUIRED)
- `orientation`: "horizontal" | "vertical" (default "horizontal")
- `primary`: slot/snippet/ReactNode (REQUIRED)
- `secondary`: slot/snippet/ReactNode (REQUIRED)
- `divider`: slot/snippet/ReactNode (optional)
- `splitPercent`: number 0-100 (default 50)
- `...restProps`: any additional HTML attributes

## Acceptance Criteria

- [ ] Renders <div> with class="split-view"
- [ ] aria-label equals the label prop
- [ ] data-orientation equals the orientation prop
- [ ] data-split-percent equals the splitPercent prop
- [ ] Primary content renders inside <section class="split-view-primary">
- [ ] Secondary content renders inside <section class="split-view-secondary">
- [ ] Default divider has role="separator" with aria-orientation, aria-valuenow/min/max, tabindex="0"
- [ ] Custom divider replaces the default when provided
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## References

- Documentation: index.md
- CSS class: .split-view in css-style-sheet-template.css
- Adobe Spectrum Split View: https://spectrum.adobe.com/page/split-view/
- WAI-ARIA Window Splitter Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/
