// ValidationList component
//
// A live-feedback list of input validation rules with pending, passed, and
// failed states. Inspired by the USWDS Validation component. Renders a <ul>
// with `aria-live="polite"` so that when child rule statuses change, screen
// readers announce the updated text. Each child is typically a
// ValidationListItem.
//
// Props:
//   class — string, optional. CSS class name appended to the root.
//   label     — string, REQUIRED. aria-label for the list.
//   children  — ReactNode, required. ValidationListItem children.
//   ...restProps — additional HTML attributes spread onto the <ul>.
//
// Syntax:
//   <ValidationList label="Password requirements">
//     <ValidationListItem status="passed">At least 8 characters</ValidationListItem>
//     <ValidationListItem status="pending">Contains a number</ValidationListItem>
//   </ValidationList>
//
// Accessibility:
//   - The native <ul> provides list semantics
//   - aria-label provides the accessible name
//   - aria-live="polite" announces status changes to screen readers
//
// Internationalization:
//   - label is consumer-supplied for localized accessible names
//
// Claude rules:
//   - Headless: no CSS, no styles
//   - label is non-optional in the interface
//   - aria-live="polite" is the headless contract for live announcements
//
// References:
//   - USWDS Validation: https://designsystem.digital.gov/components/validation/
//   - WAI-ARIA aria-live: https://www.w3.org/TR/wai-aria-1.2/#aria-live

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface ValidationListProps {
    class?: string;
    /** aria-label for the list (required) */
    label: string;
    /** ValidationListItem children */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function ValidationList(props: ValidationListProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    return (
        <ul
            class={`validation-list ${p.class}`}
            aria-label={p.label}
            aria-live="polite"
            {...restProps}
        >
            {p.children}
        </ul>
    );
}
