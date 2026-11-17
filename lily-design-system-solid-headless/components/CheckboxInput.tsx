// CheckboxInput component
//
// A minimal headless wrapper around the native HTML <input type="checkbox">
// element. Unlike the Checkbox component which includes a wrapping <label>,
// CheckboxInput uses aria-label for accessibility, giving consumers full control
// over label placement and visual presentation. Ideal for custom layouts where
// the label position, custom indicators, or complex form integration requires
// consumer control.
//
// Props:
//   class — string, optional. CSS class name.
//   checked — boolean, default false, bindable. Whether the checkbox is checked.
//   label — string, required. Accessible name applied via aria-label.
//   disabled — boolean, default false. Whether the checkbox is disabled.
//   required — boolean, default false. Whether the checkbox is required for form submission.
//   name — string, optional. Form field name attribute.
//   id — string, optional. Element id attribute.
//   value — string, optional. Value attribute for form submission.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <CheckboxInput label="Accept terms" checked={checked} onChange={setChecked} />
//
// Examples:
//
//   <CheckboxInput label="Subscribe to newsletter" checked={subscribed} onChange={setSubscribed} disabled={!hasEmail} />
//
//
//   <CheckboxInput label="Required field" checked={checked} onChange={setChecked} required name="agree" value="yes" />
//
// Keyboard:
//   - Space: Toggle the checkbox checked state (native browser behavior)
//   - Tab: Move focus to and from the checkbox (native browser behavior)
//
// Accessibility:
//   - aria-label provides an accessible name since there is no visible <label> element
//   - Implicit checkbox role from <input type="checkbox">
//
// Internationalization:
//   - Label text comes through the label prop; no hardcoded strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Uses aria-label instead of <label> — consumer provides their own visible label
//   - Uses controlled for two-way checked state binding
//
// References:
//   - MDN checkbox input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox
//   - WAI-ARIA Checkbox Pattern: https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/

import { omit, createSignal } from "solid-js";
import { withDefaults } from "./defaults";
import { useFormReset } from "./form-reset";
import { warnMissingName } from "./dev-warning";

export interface CheckboxInputProps {
    class?: string;
    checked?: boolean;
    label: string;
    disabled?: boolean;
    required?: boolean;
    name?: string;
    id?: string;
    value?: string;
    /** Callback when checked changes. */
    onChange?: (value: boolean) => void;
    [key: string]: unknown;
}

export default function CheckboxInput(props: CheckboxInputProps) {
    const p = withDefaults(
        { class: "" as const, checked: false, disabled: false, required: false },
        props,
    );
    const restProps = omit(
        p,
        "class",
        "checked",
        "label",
        "disabled",
        "required",
        "name",
        "id",
        "value",
        "onChange",
    );
    warnMissingName("CheckboxInput", p.label, p["aria-label"], p["aria-labelledby"]);
    const [internalChecked, setInternalChecked] = createSignal(() => p.checked);
    const inputRef: { current: HTMLInputElement | null } = { current: null };
    const initialChecked = { current: p.checked };

    // Form reset: restore the initial state and tell the consumer.
    useFormReset(
        () => inputRef.current,
        () => {
            setInternalChecked(initialChecked.current);
            p.onChange?.(initialChecked.current);
        },
    );

    const handleChange = (e: Event & { currentTarget: HTMLInputElement }) => {
        const newChecked = e.currentTarget.checked;
        setInternalChecked(newChecked);
        if (p.onChange) {
            p.onChange(newChecked);
        }
    };

    return (
        <input
            ref={(el) => (inputRef.current = el)}
            class={`checkbox-input ${p.class}`}
            type="checkbox"
            checked={internalChecked()}
            onChange={handleChange}
            aria-label={p.label}
            disabled={p.disabled}
            required={p.required}
            name={p.name}
            id={p.id}
            value={p.value}
            {...restProps}
        />
    );
}
