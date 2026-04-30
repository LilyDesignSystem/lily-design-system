# Container With Fixed Width

A container with a fixed maximum width centers its children horizontally and
caps the content area at a configurable breakpoint, giving long-form text and
page layouts a comfortable reading width on wide displays.

Use it for the outermost layout wrapper around article body text, marketing
sections, or any content area that should stop expanding past a chosen
maximum width.

## Implementation Notes

- Renders a `<div>` with `class="container-with-fixed-width"`
- Applies inline style `max-width: {maxWidth}; margin-inline: auto;` so the container centers itself within its parent
- Sets `data-max-width={maxWidth}` for consumer CSS hooks
- Does not impose padding, background, or any other visual treatment

## Props

- `maxWidth`: string (default: "1200px") -- max-width CSS value
- `children`: slot -- the wrapped content
- `...restProps`: any additional HTML attributes

## Usage

Default 1200px wrapper:

```html
<ContainerWithFixedWidth>
  <Article>...</Article>
</ContainerWithFixedWidth>
```

Custom narrower wrapper for prose:

```html
<ContainerWithFixedWidth maxWidth="720px">
  <BodyText>...</BodyText>
</ContainerWithFixedWidth>
```

## Keyboard Interactions

- None -- this is a structural layout container.

## ARIA

- None — purely structural. Use a landmark element (Header, Main, Footer) inside if a landmark is required.

## When to Use

- Use as the outermost layout wrapper to constrain reading width.
- Use to center page content on wide viewports.
- Use when the content area should never exceed a chosen breakpoint.

## When Not to Use

- Do not use for full-bleed sections (use ContainerWithFluidWidth instead).
- Do not use as the only horizontal padding mechanism — combine with a fluid-width container or padding utility for edge spacing on small screens.

## Headless

The component supplies only the centering and max-width behavior via inline
styles and a class hook. All padding, background, border, and shadow styling
is the consumer's responsibility.

## Styles

Consumer CSS may target the `container-with-fixed-width` class or the
`data-max-width` attribute to add padding or other treatment:

```css
.container-with-fixed-width {
  padding-inline: 1rem;
}
```

## Testing

- Verify the component renders a `<div>` element with class `container-with-fixed-width`
- Verify the inline style includes `max-width: {maxWidth}` and `margin-inline: auto`
- Verify the `data-max-width` attribute matches the `maxWidth` prop
- Verify children content is rendered

## Advice

- **Designers**: Choose `maxWidth` based on optimal line length for the content type. 65–75 characters per line is a common reading-width target.
- **Developers**: Combine with horizontal padding (either via consumer CSS on this element or a parent fluid container) so content does not sit flush against the viewport edge on narrow screens.

## Related components

- `container` — a generic block-level content container
- `container-with-fluid-width` — a full-width content wrapper with horizontal padding

## References

- MDN max-width: https://developer.mozilla.org/en-US/docs/Web/CSS/max-width
- MDN margin-inline: https://developer.mozilla.org/en-US/docs/Web/CSS/margin-inline
