# AccordionCheckbox

A compound disclosure widget that pairs a checkbox option with a revealable panel. The user sees a checkbox option; checking the box reveals an accordion panel of additional content beneath it. Multiple `AccordionCheckbox` instances stacked vertically form a list of independent toggleable options.

Unlike `Details`, which uses a `<summary>` toggle, this component uses a real form control. The `checked` prop is the source of truth and may be controlled or uncontrolled.

## When to use it

- Conditional follow-up questions in a form ("I have additional comments" → textarea)
- Opt-in disclosures that hide non-essential detail until requested
- A vertical list of independent expandable options

## When not to use it

- Use `Details` when the trigger is a non-form summary toggle.
- Use `SwitchButton` when the toggle does not reveal additional content.
- Use `RadioGroup` when only one option may be active.

## Props

| Prop        | Type                          | Default | Description                                                              |
| ----------- | ----------------------------- | ------- | ------------------------------------------------------------------------ |
| `label`     | `string`                      | —       | The checkbox label text. Required.                                       |
| `checked`   | `boolean`                     | `false` | Whether the checkbox is checked. Pass with `onChange` for controlled.    |
| `id`        | `string`                      | auto    | Base id for the checkbox (`<id>-checkbox`) and panel (`<id>-panel`).     |
| `onChange`  | `(checked: boolean) => void`  | —       | Callback fired when the checked state changes.                           |
| `children`  | `ReactNode`                   | —       | Content shown when checked. Required.                                    |
| `className` | `string`                      | `""`    | Extra CSS classes appended to `accordion-checkbox`.                      |

Additional HTML attributes are spread onto the root `<div>`.

## Usage

```tsx
import { useState } from "react";
import AccordionCheckbox from "./AccordionCheckbox";

export function CommentToggle() {
    const [open, setOpen] = useState(false);
    return (
        <AccordionCheckbox label="I have additional comments" checked={open} onChange={setOpen}>
            <textarea aria-label="Your comments" />
        </AccordionCheckbox>
    );
}
```

## Accessibility

- `aria-controls` on the checkbox references the panel id.
- `aria-expanded` on the checkbox reflects the checked state.
- `role="region"` + `aria-labelledby` on the panel announces it as a labeled region tied to the checkbox.
- The native `hidden` attribute removes the panel from the accessibility tree when unchecked.

## Keyboard

- `Tab` — moves focus onto the checkbox.
- `Space` — toggles the checkbox (native), revealing or hiding the panel.

## Related components

- `Details` — disclosure using `<details>` / `<summary>`.
- `Collapsible` — generic collapsible container.
- `CheckboxInput` — single checkbox without a revealable panel.
