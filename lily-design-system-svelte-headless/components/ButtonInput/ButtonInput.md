# ButtonInput

A button input is a form component that wraps the native HTML `<input type="button">` element. Unlike the Button component which uses `<button>` and can contain rich content (icons, formatted text) via children snippets, the button input displays its label as the `value` attribute and renders only plain text.

This component is useful in form contexts where the native input semantics are preferred, or when interacting with systems that expect `<input>` elements. It supports disabling, form field naming, and an optional `aria-label` override for screen readers. The button input inherits all standard keyboard interactions from the native element -- Enter and Space to activate.

## Implementation Notes

- Wraps the native `<input type="button">` element for form-native button semantics
- Label is the `value` attribute (plain text only, no rich content)
- Distinguished from the Button component: Button uses `<button>` with children Snippets
- Uses Svelte 5 `$props()` rune for prop destructuring
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

```svelte
<ButtonInput value="Click me" onclick={handleClick} />
```

```svelte
<ButtonInput value="Submit" disabled />
```

```svelte
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

## References

- MDN input type="button": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/button
- WAI-ARIA Button Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/button/
