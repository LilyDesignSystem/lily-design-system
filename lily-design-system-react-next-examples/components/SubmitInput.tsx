// SubmitInput component
//
// A headless form submission button using the native HTML <input type="submit">
// element. When clicked within a form, it triggers the form's submit event and
// built-in browser validation. The component supports custom button text through
// the value prop and can be disabled to prevent premature submission.
//
// Props:
//   className — string, optional. CSS class name.
//   value — string, default "Submit". The visible button text.
//   disabled — boolean, default false. Whether the button is disabled.
//   ...restProps — additional HTML attributes spread onto the <input>.
//
// Syntax:
//   <SubmitInput />
//
// Examples:
//   
//   <SubmitInput value="Send" />
//
//   
//   <SubmitInput value="Save changes" disabled={!formValid} />
//
// Keyboard:
//   - Enter: activates the submit button (native behavior)
//   - Space: activates the submit button (native behavior)
//
// Accessibility:
//   - Native <input type="submit"> has an implicit button role
//   - The value attribute serves as the accessible name
//   - No additional ARIA attributes needed beyond native semantics
//
// Internationalization:
//   - The value prop externalizes user-facing button text for translation
//   - Default value "Submit" should be overridden with translated text
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - No children prop -- uses value attribute for button text
//
// References:
//   - MDN input type="submit": https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/submit

import React from "react";

export interface SubmitInputProps {
    className?: string;
    /** Button text. */
    value?: string;
    /** Whether disabled. */
    disabled?: boolean;
    [key: string]: unknown;
}

export default function SubmitInput({
    className = "",
    value = "Submit",
    disabled = false,
    ...restProps
}: SubmitInputProps) {
    return (
        <input
        className={`submit-input ${className}`}
        type="submit"
        value={value}
        disabled={disabled}
        {...restProps}
        />
    );
}
