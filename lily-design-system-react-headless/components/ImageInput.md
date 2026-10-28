# ImageInput

An image input is a UI/UX component that provides a graphical submit button using the native HTML `<input type="image">` element. It renders a clickable image that, when activated within a form, triggers the form's submit event. The component requires `src` and `alt` attributes for proper rendering and accessibility, and supports optional `width` and `height` for controlling dimensions.

Image inputs are commonly used when a visual submit button is preferred over a text-based one, such as custom-designed form buttons, graphical "Buy Now" buttons, or branded submission controls.

## Implementation Notes

- Renders a single `<input type="image">` element for graphical form submission
- The `src` attribute specifies the image URL and the `alt` attribute provides accessible text
- Optional `width` and `height` attributes control the rendered image dimensions
- Supports rest props via `...restProps` for extensibility (e.g., `id`, `name`, `formAction`)
- No ARIA attributes needed beyond the native semantics of `<input type="image">`
- When used within a form, clicking this input triggers form submission along with the click coordinates

## Props

- `src`: string (required) -- URL of the image to display
- `alt`: string (required) -- alternative text describing the image button
- `width`: number (optional) -- width of the image in pixels
- `height`: number (optional) -- height of the image in pixels
- `disabled`: boolean (default: false) -- whether the button is disabled
- `...restProps`: spread onto the `<input>` element

## Usage

```tsx
<ImageInput
  src="/submit.png"
  alt="Submit"
/>
```

```tsx
<ImageInput
  src="/send.png"
  alt="Send form"
  width={100}
  height={40}
/>
```

```tsx
<ImageInput
  src="/save.png"
  alt="Save changes"
  disabled={!formValid}
/>
```

## Keyboard Interactions

- Enter: activates the image button
- Space: activates the image button

Note: keyboard interactions are provided natively by the `<input type="image">` element.

## ARIA

No additional ARIA attributes are needed. The native `<input type="image">` element has an implicit `button` role and the `alt` attribute serves as its accessible name.

## References

- MDN input type="image": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/image
