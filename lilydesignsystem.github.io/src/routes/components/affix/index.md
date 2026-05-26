# Affix

An affix is a wrapper that pins its content to a viewport position while
the page scrolls, using CSS `position: sticky` as the headless behavior.

Use it for sidebars, table-of-contents, action bars, or any block that
must remain visible while the user scrolls past long-form content.

## Implementation Notes

- Renders a `<div class="affix">` with inline `position: sticky` style
- Uses `top: {offsetTop}px` when `offsetTop` is provided
- Uses `bottom: {offsetBottom}px` when `offsetBottom` is provided
- Defaults to `top: 0` if neither offset is provided
- Sets `data-offset-top` and `data-offset-bottom` for consumer CSS hooks
- Purely structural — no ARIA semantics required

## Props

- `offsetTop`: number (px, optional) -- distance from top edge when affixed
- `offsetBottom`: number (px, optional) -- distance from bottom edge when affixed
- `children`: slot -- the content to pin
- `...restProps`: any additional HTML attributes

## Usage

Pin a sidebar 16 pixels from the top of the viewport:

```html
<Affix offsetTop={16}>
  <nav>...</nav>
</Affix>
```

Pin a footer action bar 0 pixels from the bottom:

```html
<Affix offsetBottom={0}>
  <div role="toolbar">...</div>
</Affix>
```

## Keyboard Interactions

- None — the affix is a passive layout wrapper.

## ARIA

- None — purely structural; consumer-supplied content carries any roles.

## When to Use

- Use to keep a navigation sidebar, action bar, or summary in view while the user scrolls.
- Use when CSS `position: sticky` semantics fit the design.

## When Not to Use

- Do not use for content that should overlay the viewport regardless of scroll — use a floating panel or float button.
- Do not use as a substitute for `position: fixed` overlays — affix relies on sticky scroll context.

## Headless

Renders a `<div>` with inline `position: sticky` style. The repaint, scroll
behavior, and any animation, shadow, or backdrop treatment are entirely
the consumer's responsibility.

## Styles

Consumer CSS targets the `affix` class. Provide a `z-index` if the affix
must stack above other content, and a backdrop or shadow on the affixed
state if a visual cue is desired.

## Testing

- Verify the component renders a `<div>` element with class `affix`
- Verify `style` includes `position: sticky`
- Verify `style` includes `top: {offsetTop}px` when `offsetTop` is set
- Verify `style` includes `bottom: {offsetBottom}px` when `offsetBottom` is set
- Verify `data-offset-top` and `data-offset-bottom` are emitted when provided
- Verify children render inside the affix container

## Advice

- **Designers**: Reserve enough viewport space so the affixed content does not obscure interactive elements. Provide a clear visual boundary when the element is sticky.
- **Developers**: Remember that `position: sticky` requires an ancestor scrolling container without `overflow: hidden`. Provide JS-based fallbacks only when sticky is insufficient.

## Related components

- `sticky-promo-banner` — a fixed-position promotional banner with a dismiss button
- `float-button` — a floating action button anchored to a viewport corner

## References

- MDN position: sticky: https://developer.mozilla.org/docs/Web/CSS/position#sticky
- Ant Design Affix: https://ant.design/components/affix
