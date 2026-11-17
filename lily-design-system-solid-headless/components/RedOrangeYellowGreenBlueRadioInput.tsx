// RedOrangeYellowGreenBlueRadioInput component
//
// A headless bare <input type="radio"> element for one choice of a five-level color status, carrying data-value for consumer CSS, without a wrapping label, designed
// for custom radio group layouts where labels are provided separately or by a
// parent component. It uses aria-label for accessible naming. Useful in custom
// card selection interfaces, segmented controls, and layouts where the radio
// button and its label need independent positioning or styling.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible name via aria-label.
//   name — string, optional. Radio group name for mutual exclusion.
//   value — string, optional. The value representing this radio option.
//   checked — boolean, default false. Whether this radio button is selected.
//   disabled — boolean, default false. Whether the radio button is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <RedOrangeYellowGreenBlueRadioInput label="Option A" name="choice" value="a" />
//
// Examples:
//
//   <RedOrangeYellowGreenBlueRadioInput label="Option A" name="choice" value="a" />
//
//
//   <RedOrangeYellowGreenBlueRadioInput label="Small" name="size" value="small" checked />
//   <RedOrangeYellowGreenBlueRadioInput label="Medium" name="size" value="medium" />
//   <RedOrangeYellowGreenBlueRadioInput label="Large" name="size" value="large" />
//
// Keyboard:
//   - Tab: moves focus to the selected radio in the group (or first if none selected)
//   - Arrow Up / Arrow Left: moves selection to the previous radio in the group
//   - Arrow Down / Arrow Right: moves selection to the next radio in the group
//   - Space: selects the focused radio button if not already selected
//
// Accessibility:
//   - aria-label provides an accessible name since no visible <label> is included
//   - Native radio input provides built-in role="radio" semantics
//
// Internationalization:
//   - The label prop is the only user-facing text; no hardcoded strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Do not wrap in a <div> or <label> — renders a bare <input> element
//   - Does not use controlled for checked; consumers use event handlers or bind directly
//
// References:
//   - WAI-ARIA Radio Group Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/radiobutton/
//   - MDN input type="radio": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/radio

import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
export interface RedOrangeYellowGreenBlueRadioInputProps {
    class?: string;
    /** Accessible label. */
    label: string;
    /** Radio group name. */
    name?: string;
    /** Value for this option. */
    value?: string;
    /** Whether checked. */
    checked?: boolean;
    /** Whether disabled. */
    disabled?: boolean;
    /** Callback when checked changes. */
    onChange?: (event: Event) => void;
    [key: string]: unknown;
}

export default function RedOrangeYellowGreenBlueRadioInput(
    props: RedOrangeYellowGreenBlueRadioInputProps,
) {
    const p = withDefaults({ class: "" as const, checked: false, disabled: false }, props);
    const restProps = omit(p, "class", "label", "name", "value", "checked", "disabled", "onChange");
    // Uncontrolled: the browser owns the group's selection, so arrow keys, the
    // one-of-a-group rule and form reset (back to the initial `checked`) all
    // work natively. A per-radio copy of the state drifted from the group.
    const handleChange = (e: Event) => {
        p.onChange?.(e);
    };

    return (
        <input
            class={`red-orange-yellow-green-blue-radio-input ${p.class}`}
            type="radio"
            aria-label={p.label}
            name={p.name}
            value={p.value}
            data-value={attr(p.value)}
            defaultChecked={p.checked}
            disabled={p.disabled}
            onChange={handleChange}
            {...restProps}
        />
    );
}
