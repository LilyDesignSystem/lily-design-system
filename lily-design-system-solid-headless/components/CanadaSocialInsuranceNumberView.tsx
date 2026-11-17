// CanadaSocialInsuranceNumberView component
//
// A headless display component for showing Canada's
// Social Insurance Number (SIN) in a read-only format.
// Format: Nine digits, usually displayed in three groups of three (NNN NNN NNN). The leading digit denotes the region of registration (1 Atlantic, 2-3 Quebec, 4-5 Ontario, 6 Prairies, 7 Pacific, 9 temporary residents), the following seven digits are a serial number, and the final digit is a Luhn (Modulus-10) check digit over the first eight.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <CanadaSocialInsuranceNumberView label="Social Insurance Number (SIN)" value={value} />
//
// Accessibility:
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//
// References:
//   - https://en.wikipedia.org/wiki/Social_Insurance_Number

import { merge, omit } from "solid-js";
export interface CanadaSocialInsuranceNumberViewProps {
    class?: string;
    /** Accessible label for screen readers */
    label?: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function CanadaSocialInsuranceNumberView(
    props: CanadaSocialInsuranceNumberViewProps,
) {
    const p = merge({ class: "" as const, value: "" as const }, props);
    const restProps = omit(p, "class", "label", "value");
    return (
        <span
            class={`canada-social-insurance-number-view ${p.class}`}
            {...restProps}
        >
            {p.label ? <span class="screen-reader-span">{`${p.label} `}</span> : null}
            {p.value}
        </span>
    );
}
