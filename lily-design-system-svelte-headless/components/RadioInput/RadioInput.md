# RadioInput

A radio input provides a bare `<input type="radio">` element without a wrapping label. It is designed for use in custom radio group layouts where labels are provided separately or by a parent component. The component uses `aria-label` to ensure each radio button has an accessible name.

This component is useful in custom-designed radio groups, card selection interfaces, segmented controls, and any layout where the radio button and its label need to be independently positioned or styled. For simple radio groups with adjacent labels, consider wrapping this in a `<label>` element.

## Implementation Notes

- Renders a native `<input type="radio">` element
- Uses `aria-label` for accessible naming (no visible label element included)
- Supports `name` attribute for grouping radio buttons into a mutually exclusive set
- Supports `value` attribute for identifying which option is selected
- Supports `checked` and `disabled` states
- Does not use `$bindable()` for checked state; consumers can use event handlers or bind directly
- Spreads `restProps` for consumer customization (e.g., `onchange`, `id`)

## Props

- `label`: string (required) -- accessible name via `aria-label`
- `name`: string (default: `undefined`) -- radio group name for mutual exclusion
- `value`: string (default: `undefined`) -- the value representing this radio option
- `checked`: boolean (default: `false`) -- whether this radio button is currently selected
- `disabled`: boolean (default: `false`) -- whether the radio button is disabled
- `...restProps`: any additional HTML attributes spread onto the input

## Usage

```svelte
<RadioInput label="Option A" name="choice" value="a" />
```

```svelte
<RadioInput label="Small" name="size" value="small" checked={true} />
<RadioInput label="Medium" name="size" value="medium" />
<RadioInput label="Large" name="size" value="large" />
```

```svelte
<RadioInput label="Unavailable option" name="plan" value="enterprise" disabled={true} />
```

## Keyboard Interactions

Native radio input keyboard behavior is handled by the browser:

- **Tab**: Moves focus to the selected radio in the group (or the first if none selected)
- **Arrow Up / Arrow Left**: Moves selection to the previous radio in the group
- **Arrow Down / Arrow Right**: Moves selection to the next radio in the group
- **Space**: Selects the focused radio button (if not already selected)

## ARIA

- `aria-label={label}` -- provides an accessible name for the radio button since no visible `<label>` element is included

## References

- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/radiobutton/
- MDN input type="radio": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio
