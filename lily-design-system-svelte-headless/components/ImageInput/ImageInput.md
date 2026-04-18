# ImageInput

An image input is a UI/UX component that provides a graphical form submission button using the native HTML `<input type="image">` element. It displays a clickable image that, when activated, submits the containing form along with the click coordinates. This is a graphical alternative to `<input type="submit">`.

Image inputs are commonly used for custom-styled submit buttons, graphical form controls, or image-based actions within forms. They provide semantic submit behavior with the visual flexibility of displaying any image.

## Implementation Notes

- Renders a single `<input type="image">` element for native graphical form submission
- The `src` attribute specifies the image URL to display
- The `alt` attribute provides an accessible name for screen readers
- Optional `width` and `height` props control image dimensions
- Supports rest props via `...restProps` for extensibility (e.g., `id`, `name`, `formaction`)
- No ARIA attributes needed beyond the native semantics of `<input type="image">`
- When used within a form, clicking this input triggers form submission with click coordinates

## Props

- `src`: string (required) -- URL of the image to display
- `alt`: string (required) -- alternative text for the image (accessible name)
- `width`: number | undefined (default: undefined) -- image width in pixels
- `height`: number | undefined (default: undefined) -- image height in pixels
- `disabled`: boolean (default: false) -- whether the button is disabled
- `...restProps`: spread onto the `<input>` element

## Usage

```svelte
<ImageInput src="/submit.png" alt="Submit form" />
```

```svelte
<ImageInput src="/icons/go.png" alt="Go" width={32} height={32} />
```

```svelte
<ImageInput src="/submit.png" alt="Submit" disabled={!formValid} />
```

## Keyboard Interactions

- Enter: activates the image button
- Space: activates the image button

Note: keyboard interactions are provided natively by the `<input type="image">` element.

## ARIA

No additional ARIA attributes are needed. The native `<input type="image">` element has an implicit `button` role and the `alt` attribute serves as its accessible name.

## References

- MDN input type="image": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/image
