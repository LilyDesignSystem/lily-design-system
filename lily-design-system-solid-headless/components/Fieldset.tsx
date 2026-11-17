// Fieldset component
//
// Groups related form elements using the native <fieldset> and <legend> HTML
// elements. Provides both visual grouping and semantic association that screen
// readers announce when users navigate into the group. The disabled prop
// disables all child form controls at once, useful for conditionally editable
// form sections.
//
// Props:
//   class — string, optional. CSS class name.
//   legend — string, required. Text for the <legend> element describing the group.
//   disabled — boolean, default false. Whether all controls in the fieldset are disabled.
//   children — ReactNode, required. Grouped form controls.
//   ...restProps — additional HTML attributes spread onto the <fieldset> element.
//
// Syntax:
//   <Fieldset legend="Contact info">
//     <label>Email <input type="email" /></label>
//   </Fieldset>
//
// Examples:
//
//   <Fieldset legend="Contact info">
//     <label>Email <input type="email" /></label>
//     <label>Phone <input type="tel" /></label>
//   </Fieldset>
//
//
//   <Fieldset legend="Shipping address" disabled={usesBillingAddress}>
//     <label>Street <input type="text" /></label>
//     <label>City <input type="text" /></label>
//   </Fieldset>
//
// Keyboard:
//   - None — passive container; keyboard interactions from consumer-provided child controls
//
// Accessibility:
//   - Native <fieldset> and <legend> provide built-in group semantics and labeling
//   - No custom ARIA attributes required
//   - disabled attribute natively disables all descendant form controls
//
// Internationalization:
//   - The legend prop accepts any string; consumers provide localized text
//
// Claude rules:
//   - Headless: no CSS, no styles — consumer provides all styling
//   - Uses native HTML elements; no custom ARIA needed
//
// References:
//   - HTML Specification fieldset: https://html.spec.whatwg.org/multipage/form-elements.html#the-fieldset-element

import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface FieldsetProps {
    class?: string;
    /** Legend text for the group. */
    legend: string;
    /** Whether all controls are disabled. */
    disabled?: boolean;
    /** Grouped form controls. */
    children: JSX.Element;
    [key: string]: unknown;
}

export default function Fieldset(props: FieldsetProps) {
    const p = withDefaults({ class: "" as const, disabled: false }, props);
    const restProps = omit(p, "class", "legend", "disabled", "children");
    return (
        <fieldset
            class={`fieldset ${p.class}`}
            disabled={p.disabled}
            {...restProps}
        >
            <legend>{p.legend}</legend>
            {p.children}
        </fieldset>
    );
}
