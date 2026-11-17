import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { warnMissingName } from "./dev-warning";
// AddressInput component
//
// A group for the parts of a postal address (line 1, line 2, town, postcode, ...). Renders a <div>
// with the `address-input` hook; it adds no role, so pass role="group" through restProps.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, required. Accessible name, rendered as aria-label on the root.
//   children — JSX.Element, required. The content.
//   ...restProps — additional HTML attributes spread onto the root <div>.
//
// Syntax:
//   <AddressInput label="…">…</AddressInput>
//
// Examples:
//   <AddressInput label="Delivery address"><TextInput label="Line 1" /><TextInput label="Postcode" /></AddressInput>
//
// Keyboard:
//   - Tab moves between the inputs inside the group (native)
//
// Accessibility:
//   - aria-label comes from `label` when given
//   - No role is rendered; pass role="group" through restProps so the label is announced
//
// Internationalization:
//   - No hardcoded user-facing strings
//
// Claude rules:
//   - Headless: no CSS, no styles -- consumer provides all styling
//   - Port gap: the Svelte catalog renders role="group"; this React component does not (the Svelte one is canonical)
//
// References:
//   - WAI-ARIA group role: https://www.w3.org/TR/wai-aria-1.2/#group

export interface AddressInputProps {
    class?: string;
    label: string;
    children: JSX.Element;
    [key: string]: unknown;
}

export default function AddressInput(props: AddressInputProps) {
    const p = withDefaults({ class: "" as const }, props);
    const restProps = omit(p, "class", "label", "children");
    warnMissingName("AddressInput", p.label, p["aria-label"], p["aria-labelledby"]);
    return (
        <div
            class={`address-input ${p.class}`}
            role="group"
            aria-label={p.label}
            {...restProps}
        >
            {p.children}
        </div>
    );
}
