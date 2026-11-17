// Form component
//
// A form wrapper that wraps a native HTML <form> element with accessible labeling,
// automatic submit default prevention, and reset support. It simplifies form handling
// by intercepting the submit event and calling preventDefault() before passing it to
// the consumer's callback, which is the most common pattern in single-page applications.
//
// Props:
//   class — string, optional. CSS class name.
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

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface FormProps {
    class?: string;
    /** Accessible name. */
    label: string;
    /** Submit callback. */
    onSubmit?: (event: Event) => void;
    /** Reset callback. */
    onReset?: (event: Event) => void;
    /** Form content. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function Form(props: FormProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "onSubmit", "onReset", "children");
    function handleSubmit(event: Event) {
        event.preventDefault();
        p.onSubmit?.(event);
    }

    return (
        <form
            class={`form ${p.class}`}
            aria-label={p.label}
            onSubmit={handleSubmit}
            onReset={p.onReset}
            {...restProps}
        >
            {p.children}
        </form>
    );
}
