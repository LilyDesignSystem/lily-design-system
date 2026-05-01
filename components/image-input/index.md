# Image Input

ImageInput is a headless graphical submit button that renders a native `<input type="image">` element. It displays an image defined by the `src` attribute and submits the form when clicked. The `alt` attribute displays if the image source is missing.

Use this component when you need a graphical submit button in forms, such as custom-styled submit buttons, clickable image actions, or branded form submission controls.

## Implementation Notes

- Renders a native `<input type="image">` element for graphical form submission
- The browser automatically triggers the containing form's `submit` event when clicked
- Submits the click coordinates (x, y) as part of the form data
- The `src` prop specifies the image URL to display
- The `alt` prop provides alternative text when the image cannot be displayed and serves as the accessible name
- Supports `width` and `height` props for image dimensions
- Supports `disabled` to prevent interaction
- Spreads `restProps` onto the input for consumer customization
- No additional ARIA attributes needed beyond the native semantics of `<input type="image">`

## Props

- `src`: string (required) -- URL of the image to display
- `alt`: string (required) -- alternative text for the image; serves as accessible name
- `width`: number | undefined (default: `undefined`) -- width of the image in pixels
- `height`: number | undefined (default: `undefined`) -- height of the image in pixels
- `disabled`: boolean (default: `false`) -- whether the button is disabled
- `...restProps`: unknown -- additional attributes spread onto the `<input>` element

## Usage

```html
<ImageInput src="/icons/submit.png" alt="Submit form" />
```

```html
<ImageInput src="/icons/search.svg" alt="Search" width={24} height={24} />
```

```html
<ImageInput src="/branding/go-button.png" alt="Go" disabled={!formValid} />
```

## Keyboard Interactions

- Enter: activates the image button and submits the form
- Space: activates the image button and submits the form

Note: keyboard interactions are provided natively by the `<input type="image">` element.

## ARIA

No additional ARIA attributes are needed. The native `<input type="image">` element has an implicit `button` role and the `alt` attribute serves as its accessible name.

## When to Use

- Use as a graphical submit button inside HTML forms when you want a clickable image instead of a text button.
- Use when branding or design requires a custom image as the form submission trigger.
- Avoid when you need a standard text-based submit button; use SubmitInput instead.
- Avoid when you need a non-submit image button; use a Button with an Image child instead.

## When Not to Use

- Do not use when a plain text submit button is sufficient — use `SubmitInput` for that.
- Do not use for a non-submit image button (no form submission, just a click handler) — use `Button` with an `Image` child or use `IconButton`.
- Do not use as a generic image — use `Image` for non-interactive images.
- Do not use without meaningful `alt` text; the alt is the accessible name and is required for screen reader users.
- Do not rely on the click coordinates submitted by `<input type="image">` (`name.x`, `name.y`) for new code — modern UIs should not depend on this legacy behavior.

## Headless

This headless component renders a native `<input type="image">` element with configurable `src`, `alt`, `width`, `height`, and `disabled` props. It provides built-in form submission behavior with no additional ARIA needed. The consumer provides all visual styling including borders, shadows, hover/focus states, and sizing.

## Styles

The consumer provides all CSS styling. The component renders with a `.image-input` class for targeting. Common styling includes removing default borders, adding hover effects, and controlling dimensions.

## Testing

- Verify the component renders an `<input>` element with `type="image"`
- Verify `src` is set from the `src` prop
- Verify `alt` is set from the `alt` prop
- Verify `width` and `height` attributes are set when provided
- Verify `disabled` attribute propagates correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Ensure the image clearly communicates its submit action. Provide sufficient contrast and hover/focus indicators. Always include meaningful alt text for accessibility.
- **Developers**: Always provide a descriptive `alt` prop for screen reader users. Consider providing `width` and `height` to prevent layout shift during image loading.

## Related components

- `image` — an image element with alt text
- `button-input` — an input element of type button for form actions <input type="button">

## References

- MDN input type="image": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/image
- HTML spec input type="image": https://html.spec.whatwg.org/multipage/input.html#image-button-state-(type=image)
