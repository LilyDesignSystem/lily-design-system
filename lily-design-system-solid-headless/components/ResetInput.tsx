// ResetInput component
//
// A headless form reset button using the native HTML <input type="reset">
// element. When clicked within a form, it resets all sibling form fields to
// their initial default values. Useful in forms where users may want to clear
// all entered data and start over.
//
// Props:
//   class — string, optional. CSS class name.
//   value — string, default "Reset". The visible button text.
//   disabled — boolean, default false. Whether the button is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <ResetInput />
//
// Examples:
//
//   <ResetInput value="Clear form" />
//
//
//   <ResetInput value="Start over" disabled={!formDirty} />
//
// Keyboard:
//   - Enter: activates the reset button (native behavior)
//   - Space: activates the reset button (native behavior)
//
// Accessibility:
//   - Native <input type="reset"> has implicit button role
//   - The value attribute serves as the accessible name
//   - No additional ARIA attributes needed
//
// Internationalization:
//   - The value prop externalizes the button text for localization
//   - Default "Reset" should be overridden in non-English contexts
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Uses native browser form reset behavior, no custom logic
//   - No children prop — button text comes from the value prop
//
// References:
//   - MDN input type="reset": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/reset

import { merge, omit } from "solid-js";
export interface ResetInputProps {
    class?: string;
    /** Button text. */
    value?: string;
    /** Whether disabled. */
    disabled?: boolean;
    [key: string]: unknown;
}

export default function ResetInput(props: ResetInputProps) {
    const p = merge({ class: "" as const, value: "Reset" as const, disabled: false }, props);
    const restProps = omit(p, "class", "value", "disabled");
    return (
        <input
            class={`reset-input ${p.class}`}
            type="reset"
            value={p.value}
            disabled={p.disabled}
            {...restProps}
        />
    );
}
