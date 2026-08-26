// Label component
//
// A headless <label> element that provides a descriptive name or instruction
// for an associated form control such as an input field, checkbox, or radio
// button. When a user clicks the label text, the browser focuses or activates
// the linked form control. Screen readers announce the label when the
// associated control receives focus.
//
// Props:
//   className — string, optional. CSS class name.
//   for — string, optional. The id of the associated form control (HTML for attribute).
//   children — ReactNode, required. The label text content.
//   ...restProps — additional HTML attributes spread onto the <label>.
//
// Syntax:
//   <Label for="email">Email address</Label>
//
// Examples:
//   
//   <Label for="email">Email address</Label>
//   <input id="email" type="email" />
//
//   
//   <Label>
//     Email address
//     <input type="email" />
//   </Label>
//
// Keyboard:
//   - None — clicking the label focuses or activates its associated form
//     control via native browser behavior.
//
// Accessibility:
//   - Native <label> element with for attribute provides an implicit accessible
//     name for the linked form control
//   - No additional ARIA attributes needed; semantic HTML <label> is fully
//     recognized by assistive technology
//
// Internationalization:
//   - All text content comes through the children prop
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - The for prop is mapped from the reserved keyword via for: forProp
//
// References:
//   - WAI Forms Tutorial - Labels: https://www.w3.org/WAI/tutorials/forms/labels/
//   - HTML label element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label

import React from "react";

export interface LabelProps {
    className?: string;
    for?: string;
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function Label({
    className = "",
    for: forProp = undefined,
    children,
    ...restProps
}: LabelProps) {
    return (
        <label
        className={`label ${className}`}
        htmlFor={forProp}
        {...restProps}
        >
        {children}
        </label>
    );
}
