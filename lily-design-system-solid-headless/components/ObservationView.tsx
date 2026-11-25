// ObservationView: a read-only clinical observation or result, with unit, flag and reference range (spec/healthcare-ui item 1).
// Shows what the consumer decided; computes no flag and no range. Props and rules: ObservationView.md.
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
import { hasWords } from "./clinical-format";
import { warnMissingProp } from "./dev-warning";

// FHIR statuses with no value to show: the consumer's words replace it (spec/healthcare-ui, tasks.md P28-T5).
const MISSING: readonly string[] = [
    "registered",
    "cancelled",
    "masked",
    "not-recorded",
    "unavailable",
    "not-applicable",
];

/** A result that is not final must say so: statusLabel is required by type for any status but final (P49-T8). */
export type ObservationViewProps = {
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
    /** With meterValue, meterMin and meterMax, a native <meter> part shows where the value sits; aria-hidden, as the words say it. */
    meterValue?: number;
    meterMin?: number;
    meterMax?: number;
    /** The reference range and best value on the meter, for the theme. */
    meterLow?: number;
    meterHigh?: number;
    meterOptimum?: number;
    /** A superseded value, shown in a <del>. */
    previousValue?: string;
    /** The consumer's words for it; required with previousValue. */
    previousLabel?: string;
    /** For an authorised history view: an entered-in-error result's former value, struck through after its words. */
    showWithdrawn?: boolean;
    [key: string]: unknown;
} & (
    | { status?: "final"; statusLabel?: string }
    | {
          status:
              | "registered"
              | "preliminary"
              | "amended"
              | "corrected"
              | "entered-in-error"
              | "cancelled"
              | "unknown"
              | "masked"
              | "not-recorded"
              | "unavailable"
              | "not-applicable";
          /** The consumer's words, required for any status but final: without them no value, flag, range or meter is shown. */
          statusLabel: string;
      }
);

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
        "meterValue",
        "meterMin",
        "meterMax",
        "meterLow",
        "meterHigh",
        "meterOptimum",
        "previousValue",
        "previousLabel",
        "status",
        "statusLabel",
        "showWithdrawn",
    );
    if (p.status !== "final")
        warnMissingProp(
            "ObservationView",
            "statusLabel",
            p.statusLabel,
            "A result that is not final must say so in words; without them its value is not shown.",
        );
    if (p.interpretation && p.interpretation !== "N")
        warnMissingProp(
            "ObservationView",
            "flagLabel",
            p.flagLabel,
            "An abnormal flag needs words, not colour alone (WCAG 1.4.1).",
        );
    const withdrawn = () => p.status === "entered-in-error";
    const withheld = () =>
        MISSING.includes(p.status) ||
        (p.status !== "final" && !hasWords(p.statusLabel)) ||
        (withdrawn() && !p.showWithdrawn);
    return (
        <span
            class={`observation-view ${p.class}`}
            data-interpretation={attr(
                withheld() || withdrawn() ? undefined : p.interpretation || undefined,
            )}
            data-status={attr(p.status)}
            {...restProps}
        >
            {p.label ? <span class="screen-reader-span">{`${p.label} `}</span> : null}
            {withheld() ? (
                <span class="observation-view-status">{p.statusLabel}</span>
            ) : withdrawn() ? (
                <>
                    <span class="observation-view-status">{p.statusLabel}</span>{" "}
                    <del class="observation-view-withdrawn-value">
                        <span class="observation-view-value">{p.value}</span>
                        {p.unit ? (
                            <>
                                {" "}
                                <span class="observation-view-unit">{p.unit}</span>
                            </>
                        ) : null}
                    </del>
                </>
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
                    {typeof p.meterValue === "number" &&
                    typeof p.meterMin === "number" &&
                    typeof p.meterMax === "number" ? (
                        <>
                            {" "}
                            <meter
                                class="observation-view-meter"
                                aria-hidden="true"
                                value={p.meterValue}
                                min={p.meterMin}
                                max={p.meterMax}
                                low={p.meterLow}
                                high={p.meterHigh}
                                optimum={p.meterOptimum}
                            />
                        </>
                    ) : null}
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
