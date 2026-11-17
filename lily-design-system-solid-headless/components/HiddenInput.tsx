// HiddenInput component
//
// A hidden form input that renders a native <input type="hidden"> element for passing
// data in forms that should not be visible or editable by the user. Useful for including
// hidden form values such as CSRF tokens, record IDs, or other metadata that must be
// submitted with a form but has no visual presence.
//
// Props:
//   class — string, optional. CSS class name.
//   name — string, required. The form field name attribute.
//   value — string, default "". The hidden input value.
//   ...restProps — additional HTML attributes spread onto the input element.
//
// Syntax:
//   <HiddenInput name="csrf" value={token} />
//
// Examples:
//
//   <HiddenInput name="csrf" value={token} />
//
//
//   <HiddenInput name="record_id" value={id} />
//
// Keyboard:
//   - None — hidden inputs are not visible or focusable
//
// Accessibility:
//   - No ARIA attributes needed because hidden inputs are not perceivable by any user
//
// Internationalization:
//   - No user-facing strings; name and value are programmatic data
//
// Claude rules:
//   - Headless: no CSS, no styles — hidden inputs have no visual presence
//   - Uses native <input type="hidden"> element
//   - No ARIA attributes are needed or applied
//
// References:
//   - HTML hidden input: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/hidden

import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface HiddenInputProps {
    class?: string;
    name: string;
    value?: string;
    [key: string]: unknown;
}

export default function HiddenInput(props: HiddenInputProps) {
    const p = withDefaults({ class: "" as const, value: "" as const }, props);
    const restProps = omit(p, "class", "name", "value");
    return (
        <input
            class={`hidden-input ${p.class}`}
            type="hidden"
            name={p.name}
            value={p.value}
            {...restProps}
        />
    );
}
