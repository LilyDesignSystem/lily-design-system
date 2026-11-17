// ObservationView: a read-only clinical observation or result, with unit, flag and reference range (spec/healthcare-ui item 1).
// Shows what the consumer decided; computes no flag and no range. Props and rules: ObservationView.md.
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
import { warnMissingProp } from "./dev-warning";

// FHIR statuses with no value to show: the consumer's words replace it (spec/healthcare-ui, tasks.md P28-T5).
const MISSING: readonly string[] = [
    "cancelled",
    "masked",
    "not-recorded",
    "unavailable",
    "not-applicable",
];

export interface ObservationViewProps {
    class?: string;
    /** Hidden text naming the observation, when no visible caption does. */
    label?: string;
    /** The value, formatted by the consumer. */
    value?: string;
    /** The unit, joined to the value by a no-break space. */
    unit?: string;
    /** A FHIR v3 ObservationInterpretation code ("N", "L", "H", "LL", "HH", "A", ...), rendered as data-interpretation. */
    interpretation?: string;
    /** The consumer's words for the flag ("High"). Required when the flag is not normal. */
    flagLabel?: string;
    /** The reference range as text. */
    range?: string;
    /** Further named ranges, each its own -range part with a -range-label. */
    ranges?: { label: string; text: string }[];
    /** A superseded value, shown in a <del>. */
    previousValue?: string;
    /** The consumer's words for it; required with previousValue. */
    previousLabel?: string;
    status?:
        | "final"
        | "preliminary"
        | "amended"
        | "corrected"
        | "entered-in-error"
        | "cancelled"
        | "masked"
        | "not-recorded"
        | "unavailable"
        | "not-applicable";
    /** The consumer's words for a status that is not final; replaces the value when not-recorded or unavailable. */
    statusLabel?: string;
    [key: string]: unknown;
}

export default function ObservationView(props: ObservationViewProps) {
    const p = withDefaults(
        {
            class: "" as const,
            value: "" as const,
            ranges: [] as NonNullable<ObservationViewProps["ranges"]>,
            status: "final" as const,
        },
        props,
    );
    const restProps = omit(
        p,
        "class",
        "label",
        "value",
        "unit",
        "interpretation",
        "flagLabel",
        "range",
        "ranges",
        "previousValue",
        "previousLabel",
        "status",
        "statusLabel",
    );
    if (p.status !== "final")
        warnMissingProp(
            "ObservationView",
            "statusLabel",
            p.statusLabel,
            "A result that is not final must say so in words.",
        );
    if (p.interpretation && p.interpretation !== "N")
        warnMissingProp(
            "ObservationView",
            "flagLabel",
            p.flagLabel,
            "An abnormal flag needs words, not colour alone (WCAG 1.4.1).",
        );
    const missing = () => MISSING.includes(p.status);
    return (
        <span
            class={`observation-view ${p.class}`}
            data-interpretation={attr(p.interpretation || undefined)}
            data-status={attr(p.status)}
            {...restProps}
        >
            {p.label ? <span class="screen-reader-span">{`${p.label} `}</span> : null}
            {missing() ? (
                <span class="observation-view-status">{p.statusLabel}</span>
            ) : (
                <>
                    <span class="observation-view-value">{p.value}</span>
                    {p.unit ? (
                        <>
                            {" "}
                            <span class="observation-view-unit">{p.unit}</span>
                        </>
                    ) : null}
                    {p.flagLabel ? (
                        <>
                            {" "}
                            <span class="observation-view-flag">{p.flagLabel}</span>
                        </>
                    ) : null}
                    {p.range ? (
                        <>
                            {" "}
                            <span class="observation-view-range">{p.range}</span>
                        </>
                    ) : null}
                    {p.ranges.map((named) => (
                        <>
                            {" "}
                            <span class="observation-view-range">
                                <span class="observation-view-range-label">{named.label}</span>{" "}
                                {named.text}
                            </span>
                        </>
                    ))}
                    {p.previousValue ? (
                        <>
                            {" "}
                            <del class="observation-view-previous-value">{p.previousValue}</del>
                            {p.previousLabel ? (
                                <>
                                    {" "}
                                    <span class="observation-view-previous-label">
                                        {p.previousLabel}
                                    </span>
                                </>
                            ) : null}
                        </>
                    ) : null}
                    {p.status !== "final" && p.statusLabel ? (
                        <>
                            {" "}
                            <span class="observation-view-status">{p.statusLabel}</span>
                        </>
                    ) : null}
                </>
            )}
        </span>
    );
}
