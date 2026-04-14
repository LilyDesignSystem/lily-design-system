# Button Input

A button input is a form component that wraps the native HTML `<input type="button">` element. Unlike the Button component which uses `<button>` and can contain rich content (icons, formatted text) via children slots, the button input displays its label as the `value` attribute and renders only plain text.

This component is useful in form contexts where the native input semantics are preferred, or when interacting with systems that expect `<input>` elements. It supports disabling, form field naming, and an optional `aria-label` override for screen readers. The button input inherits all standard keyboard interactions from the native element -- Enter and Space to activate.

## Implementation Notes

- Wraps the native `<input type="button">` element for form-native button semantics
- Label is the `value` attribute (plain text only, no rich content)
- Distinguished from the Button component: Button uses `<button>` with children slots
- Uses props rune for prop destructuring
- Spreads `...restProps` on the `<input>` element for consumer extensibility
- Supports `disabled`, `name`, and `onclick` for standard form interactions
- No hardcoded user-facing strings; label text comes through `value` and `label` props

## Props

- `value`: string (required) -- the button label text displayed on the input
- `disabled`: boolean (default: `false`) -- whether the input is disabled
- `name`: string (optional) -- form field name for form submission
- `label`: string (optional) -- accessible label override via `aria-label` for screen readers
- `onclick`: `(event: MouseEvent) => void` (optional) -- click event handler
- `...restProps`: any additional HTML attributes spread onto the `<input>` element

## Usage

Action button with a descriptive label:

```html
<ButtonInput value="Calculate total" onclick={handleCalculate} />
```

Disabled button with conditional state:

```html
<ButtonInput value="Reset filters" onclick={handleReset} disabled={!hasFilters} />
```

Named button with accessible label override:

```html
<ButtonInput value="Save" name="action" label="Save changes" />
```

## Keyboard Interactions

- Tab: Focus the button input
- Enter: Activate the button (native behavior)
- Space: Activate the button (native behavior)

## ARIA

- Implicit `button` role -- provided natively by `<input type="button">`
- `aria-label={label}` -- optional screen reader label override; when provided, screen readers announce this instead of the `value` text
- `aria-disabled` -- implicitly managed by the native `disabled` attribute

## When to Use

- Use when you need a form-native `<input type="button">` element for plain text button labels.
- Use in contexts where form semantics require an input element rather than a button element.
- Use when no rich content (icons, formatted text) is needed inside the button.

## When Not to Use

- Do not use when you need icons, images, or formatted content inside the button -- use Button instead, which supports child elements.
- Do not use for navigation -- use ActionLink or BackLink.
- Do not use for form submission -- use SubmitInput or `<Button type="submit">`.

## Headless

This component provides a native `<input type="button">` with optional `aria-label` override and standard form attributes (`name`, `disabled`), all with zero visual styling. The consumer is responsible for all CSS including colors, padding, border, border-radius, hover states, focus indicators, and disabled appearance.


## Styles

The consumer provides all CSS styling. The component renders with a `.button-input` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<input>` element with class `button-input`
- Verify aria-label={label}` -- optional screen reader label override; when provided, screen readers announce this instead of the `value` text
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Apply the same visual treatment as Button components to maintain consistency. Ensure disabled state has sufficient contrast.
- **Developers**: Use the `label` prop for an `aria-label` override when the `value` text alone is insufficient context for screen reader users. The `name` prop is useful for identifying the button in form submissions.

## References

- MDN input type="button": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button
- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/button/
