// DataFilterForm component
//
// A headless data filter container that wraps filter controls in a semantic <form>
// with role="search" and accessible labelling. It prevents default form submission,
// allowing the consumer's onSubmit callback to handle filter application
// programmatically. Suitable for client-side filtering, AJAX-based search, or any
// scenario where a full page reload is undesirable.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible name for the filter region via aria-label.
//   onSubmit — (event: Event) => void, default undefined. Called when the form is submitted.
//   onReset — (event: Event) => void, default undefined. Called when the form is reset.
//   children — ReactNode, required. Filter controls rendered inside the form.
//   ...restProps — additional HTML attributes spread onto the <form>.
//
// Syntax:
//   <DataFilterForm label="Filter results" onSubmit={applyFilters}>
//     <button type="submit">Apply</button>
//   </DataFilterForm>
//
// Examples:
//
//   <DataFilterForm label="Filter results" onSubmit={applyFilters} onReset={clearFilters}>
//     <label>Category <select>...</select></label>
//     <button type="submit">Apply</button>
//     <button type="reset">Clear</button>
//   </DataFilterForm>
//
// Keyboard:
//   - None — passive container; keyboard behavior is determined by consumer-provided form controls
//
// Accessibility:
//   - role="search" identifies the form as a search landmark for assistive technology
//   - aria-label provides an accessible name for the search region
//
// Internationalization:
//   - The label prop provides the accessible name; no hardcoded strings
//   - All filter controls and button text are provided by consumers
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Form submission is prevented by default; consumer handles logic in onSubmit
//
// References:
//   - WAI-ARIA Landmark Roles: https://www.w3.org/WAI/ARIA/apd/practices/landmark-regions/
//   - ARIA search role: https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/search_role

import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
export interface DataFilterFormProps {
    class?: string;
    /** Accessible name for the filter region. */
    label: string;
    /** Called when the filter form is submitted. */
    onSubmit?: (event: Event) => void;
    /** Called when the filter form is reset. */
    onReset?: (event: Event) => void;
    /** Filter controls rendered inside the form. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function DataFilterForm(props: DataFilterFormProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "onSubmit", "onReset", "children");
    function handleSubmit(event: Event) {
        event.preventDefault();
        p.onSubmit?.(event);
    }

    return (
        <form
            class={`data-filter-form ${p.class}`}
            role="search"
            aria-label={p.label}
            onSubmit={handleSubmit}
            onReset={p.onReset}
            {...restProps}
        >
            {p.children}
        </form>
    );
}
