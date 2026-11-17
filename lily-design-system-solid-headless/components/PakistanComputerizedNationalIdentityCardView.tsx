// PakistanComputerizedNationalIdentityCardView component
//
// A headless display component for showing Pakistan's
// Computerized National Identity Card Number (CNIC) in a read-only format.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <PakistanComputerizedNationalIdentityCardView label="Computerized National Identity Card Number (CNIC)" value={value} />
//
// Accessibility:
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//
// References:
//   - https://en.wikipedia.org/wiki/Computerized_National_Identity_Card

import { omit } from "solid-js";
import { withDefaults } from "./defaults";
export interface PakistanComputerizedNationalIdentityCardViewProps {
    class?: string;
    /** Accessible label for screen readers */
    label?: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function PakistanComputerizedNationalIdentityCardView(
    props: PakistanComputerizedNationalIdentityCardViewProps,
) {
    const p = withDefaults({ class: "" as const, value: "" as const }, props);
    const restProps = omit(p, "class", "label", "value");
    return (
        <span
            class={`pakistan-computerized-national-identity-card-view ${p.class}`}
            {...restProps}
        >
            {p.label ? <span class="screen-reader-span">{`${p.label} `}</span> : null}
            {p.value}
        </span>
    );
}
