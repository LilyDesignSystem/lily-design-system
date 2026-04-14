# Radio Input

A radio input provides a bare `<input type="radio">` element without a wrapping label. It is designed for use in custom radio group layouts where labels are provided separately or by a parent component. The component uses `aria-label` to ensure each radio button has an accessible name.

This component is useful in custom-designed radio groups, card selection interfaces, segmented controls, and any layout where the radio button and its label need to be independently positioned or styled. For simple radio groups with adjacent labels, consider wrapping this in a `<label>` element.

## Implementation Notes

- Renders a native `<input type="radio">` element
- Uses `aria-label` for accessible naming (no visible label element included)
- Supports `name` attribute for grouping radio buttons into a mutually exclusive set
- Supports `value` attribute for identifying which option is selected
- Supports `checked` and `disabled` states
- Does not use two-way binding for checked state; consumers can use event handlers or bind directly
- Spreads `restProps` for consumer customization (e.g., `onchange`, `id`)

## Props

- `label`: string (required) -- accessible name via `aria-label`
- `name`: string (default: `undefined`) -- radio group name for mutual exclusion
- `value`: string (default: `undefined`) -- the value representing this radio option
- `checked`: boolean (default: `false`) -- whether this radio button is currently selected
- `disabled`: boolean (default: `false`) -- whether the radio button is disabled
- `...restProps`: any additional HTML attributes spread onto the input

## Usage

```html
<Fieldset legend="Are you 18 or over?">
  <RadioGroup name="age-check">
    <RadioInput label="Yes" value="yes" />
    <RadioInput label="No" value="no" />
  </RadioGroup>
</Fieldset>

<Fieldset legend="How would you like to receive your results?">
  <RadioGroup name="results-preference">
    <RadioInput label="Email" value="email" hint="We will send results within 24 hours" />
    <RadioInput label="Post" value="post" hint="Results will arrive within 7 working days" />
    <RadioInput label="I do not want my results" value="none" />
  </RadioGroup>
</Fieldset>
```

## Keyboard Interactions

Native radio input keyboard behavior is handled by the browser:

- **Tab**: Moves focus to the selected radio in the group (or the first if none selected)
- **Arrow Up / Arrow Left**: Moves selection to the previous radio in the group
- **Arrow Down / Arrow Right**: Moves selection to the next radio in the group
- **Space**: Selects the focused radio button (if not already selected)

## ARIA

- `aria-label={label}` -- provides an accessible name for the radio button since no visible `<label>` element is included

## When to Use

- Use when users can only select one option from a list of mutually exclusive choices
- Use within a RadioGroup inside a Fieldset with a legend that poses the question
- Use with a "None of these" or "I do not know" option when it is valid for users to decline all options
- Use with Hint on individual radio items when extra context helps users choose

## When Not to Use

- Do not use when users need to select more than one option -- use CheckboxInput within a CheckboxGroup instead
- Do not pre-select a radio option -- users may miss the question or submit the wrong answer
- Do not use for toggling a single setting on or off -- use SwitchButton for immediate-effect toggles
- Do not use for long lists of options -- use Select or Combobox when the list exceeds 6-8 items

## Headless

The RadioInput headless component provides a native `<input type="radio">` with `aria-label` for accessible naming, and supports `name`, `value`, `checked`, and `disabled` attributes. The browser handles all radio group keyboard navigation natively. The consumer provides all visual styling.


## Styles

The consumer provides all CSS styling. The component renders with a `.radio-input` class for targeting. No default styles are included — this is a fully headless component.


## Testing


- Verify the component renders a `<input>` element with class `radio-input`
- Verify aria-label={label}` -- provides an accessible name for the radio button since no visible `<label>` element is included
- Verify keyboard interactions work correctly
- Verify pass-through attributes are applied

## Advice

- **Designers**: Ensure the clickable area around each radio option is large enough for comfortable touch interaction, even when using custom visual designs.
- **Developers**: Always set a consistent `name` attribute across grouped RadioInput components to ensure mutual exclusion, and use `onchange` handlers to update state.

## References

- WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apd/patterns/radiobutton/
- MDN input type="radio": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio
