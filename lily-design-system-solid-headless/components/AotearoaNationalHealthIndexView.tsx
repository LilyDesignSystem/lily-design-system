// AotearoaNationalHealthIndexView component
//
// A headless display component for showing New Zealand's
// National Health Index (NHI) Number in a read-only format.
// Format: Seven-character identifier (three letters, four digits). The legacy AAANNNC format uses a Modulus-11 check digit over the six preceding characters; an expanded AAANNAX format (issued from July 2026) uses a Modulus-23 check digit instead, to extend the identifier space.
//
// Props:
//   class — string, optional. CSS class name.
//   label — string, optional. Hidden text naming the value. Leave it out when a visible caption, such as a dt or a SummaryListItem term, already names it.
//   value — string, default "". The identifier string to display.
//   ...restProps — additional HTML attributes spread onto the <span>.
//
// Syntax:
//   <AotearoaNationalHealthIndexView label="National Health Index (NHI) Number" value={value} />
//
// Accessibility:
//   - A visible caption names the value, or label renders as hidden text; a plain span cannot take aria-label.
//
// References:
//   - https://en.wikipedia.org/wiki/NHI_Number

import { merge, omit } from "solid-js";
export interface AotearoaNationalHealthIndexViewProps {
    class?: string;
    /** Accessible label for screen readers */
    label?: string;
    /** The identifier to display */
    value?: string;
    [key: string]: unknown;
}

export default function AotearoaNationalHealthIndexView(
    props: AotearoaNationalHealthIndexViewProps,
) {
    const p = merge({ class: "" as const, value: "" as const }, props);
    const restProps = omit(p, "class", "label", "value");
    return (
        <span
            class={`aotearoa-national-health-index-view ${p.class}`}
            {...restProps}
        >
            {p.label ? <span class="screen-reader-span">{`${p.label} `}</span> : null}
            {p.value}
        </span>
    );
}
