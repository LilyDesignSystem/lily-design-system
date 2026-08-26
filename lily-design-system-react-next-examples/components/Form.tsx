// Form component
//
// A form wrapper that wraps a native HTML <form> element with accessible labeling,
// automatic submit default prevention, and reset support. It simplifies form handling
// by intercepting the submit event and calling preventDefault() before passing it to
// the consumer's callback, which is the most common pattern in single-page applications.
//
// Props:
//   className — string, optional. CSS class name.
//   label — string, required. Accessible name for the form via aria-label.
//   onSubmit — function, default undefined. Callback receiving FormEvent (default already prevented).
//   onReset — function, default undefined. Callback receiving Event on form reset.
//   children — ReactNode, required. Form content (inputs, buttons, etc.).
//   ...restProps — additional HTML attributes spread onto the form element.
//
// Syntax:
//   <Form label="Login" onSubmit={handleLogin}>{children}</Form>
//
// Examples:
//
//   <Form label="Login" onSubmit={handleLogin}>
//     <input name="email" />
//     <button type="submit">Sign in</button>
//   </Form>
//
//
//   <Form label="Search filters" onSubmit={applyFilters} onReset={clearFilters}>
//     <input name="query" />
//     <button type="submit">Apply</button>
//     <button type="reset">Clear</button>
//   </Form>
//
// Keyboard:
//   - Enter: Submits the form when a text input is focused (native browser behavior)
//
// Accessibility:
//   - aria-label provides an accessible name for the form, helping screen readers identify its purpose
//
// Internationalization:
//   - The label prop allows localized accessible names; no hardcoded user-facing strings
//   - All content comes through the children prop
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Automatically calls event.preventDefault() on submit before invoking onSubmit
//   - The onReset callback is passed directly without default prevention
//
// References:
//   - MDN form element: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form
//   - WAI Forms Tutorial: https://www.w3.org/WAI/tutorials/forms/

import React from "react";

export interface FormProps {
    className?: string;
    /** Accessible name. */
    label: string;
    /** Submit callback. */
    onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
    /** Reset callback. */
    onReset?: (event: React.FormEvent<HTMLFormElement>) => void;
    /** Form content. */
    children: React.ReactNode;
    [key: string]: unknown;
}

export default function Form({
    className = "",
    label,
    onSubmit = undefined,
    onReset = undefined,
    children,
    ...restProps
}: FormProps) {
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        onSubmit?.(event);
    }

    return (
        <form
            className={`form ${className}`}
            aria-label={label}
            onSubmit={handleSubmit}
            onReset={onReset}
            {...restProps}
        >
            {children}
        </form>
    );
}
