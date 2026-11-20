# Sparkline

## Metadata

- Component: sparkline
- PascalCase: Sparkline
- Description: a small inline chart showing a data trend
- Status: stable — exercised in composed page flows under e2e and axe, beyond the per-component checks
- HTML tag: <span>
- CSS class: .sparkline
- Interactive: no

## Key Behaviors

- Renders a `<div>` with `role="img"` to semantically represent a graphical image
- Consumer provides all chart rendering (SVG, canvas, etc.) via the `children` slot
- Accepts `...restProps` for forwarding additional attributes to the container
- No internal state or effects -- purely a structural wrapper

## ARIA

- `role="img"` -- identifies the container as a graphical image to assistive technologies
- `aria-label={label}` -- provides an accessible name describing what the sparkline represents

## Keyboard

- No keyboard interactions — this is a passive element

## Props

- `label`: string (required) -- accessible name describing the sparkline data, applied via `aria-label`
- `children`: slot (required) -- the visualization content to render inside the container
- `pointCount`: number (optional) -- how many readings the consumer's graphic shows
- `minimumPoints`: number (optional) -- fewer readings than this are not a trend: the graphic is not shown, the root drops `role="img"` and `aria-label`, gains `data-insufficient`, and shows only `insufficientLabel` as text in `.sparkline-insufficient` (spec/lessons/zoblocks)
- `insufficientLabel`: string -- why there is no line, in the consumer's words ("Not enough readings for a trend"); required with `minimumPoints` (a development warning says so)
- Breaks: where readings are not comparable (a new method, assay or unit), the consumer draws one `<path>` per comparable run so the line never joins across the break; the component draws nothing, so it has no `breaks` prop. The Nunjucks macro, which draws the line from `values`, takes `breaks` (indexes where a new run starts) and splits it there

## Acceptance Criteria

- [ ] Renders <span> element with class="sparkline"
- [ ] Has aria-label attribute
- [ ] Has role="img"
- [ ] WCAG 2.2 AAA compliant
- [ ] Zero CSS — fully headless

## Known limitations

None known.

## References

- Documentation: index.md
- CSS class: .sparkline in css-style-sheet-template.css
- HTML headless: lily-design-system-html-headless/components/sparkline.html
- WAI-ARIA img role: https://www.w3.org/TR/wai-aria-1.2/#img
