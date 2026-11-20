// ObservationView: a read-only clinical observation or result, with unit, flag and reference range (spec/healthcare-ui item 1).
// Shows what the consumer decided; computes no flag and no range. Props and rules: ObservationView.md.
import React from "react";
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
    className?: string;
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

export default function ObservationView({
    className = "",
    label,
    value = "",
    unit,
    interpretation,
    flagLabel,
    range,
    ranges = [],
    meterValue,
    meterMin,
    meterMax,
    meterLow,
    meterHigh,
    meterOptimum,
    previousValue,
    previousLabel,
    status = "final",
    statusLabel,
    ...restProps
}: ObservationViewProps) {
    if (status !== "final")
        warnMissingProp(
            "ObservationView",
            "statusLabel",
            statusLabel,
            "A result that is not final must say so in words.",
        );
    if (interpretation && interpretation !== "N")
        warnMissingProp(
            "ObservationView",
            "flagLabel",
            flagLabel,
            "An abnormal flag needs words, not colour alone (WCAG 1.4.1).",
        );
    const missing = MISSING.includes(status);
    return (
        <span
            className={`observation-view ${className}`}
            data-interpretation={interpretation || undefined}
            data-status={status}
            {...restProps}
        >
            {label ? <span className="screen-reader-span">{`${label} `}</span> : null}
            {missing ? (
                <span className="observation-view-status">{statusLabel}</span>
            ) : (
                <>
                    <span className="observation-view-value">{value}</span>
                    {unit ? (
                        <>
                            {" "}
                            <span className="observation-view-unit">{unit}</span>
                        </>
                    ) : null}
                    {flagLabel ? (
                        <>
                            {" "}
                            <span className="observation-view-flag">{flagLabel}</span>
                        </>
                    ) : null}
                    {range ? (
                        <>
                            {" "}
                            <span className="observation-view-range">{range}</span>
                        </>
                    ) : null}
                    {ranges.map((named) => (
                        <React.Fragment key={named.label}>
                            {" "}
                            <span className="observation-view-range">
                                <span className="observation-view-range-label">{named.label}</span>{" "}
                                {named.text}
                            </span>
                        </React.Fragment>
                    ))}
                    {typeof meterValue === "number" &&
                    typeof meterMin === "number" &&
                    typeof meterMax === "number" ? (
                        <>
                            {" "}
                            <meter
                                className="observation-view-meter"
                                aria-hidden="true"
                                value={meterValue}
                                min={meterMin}
                                max={meterMax}
                                low={meterLow}
                                high={meterHigh}
                                optimum={meterOptimum}
                            />
                        </>
                    ) : null}
                    {previousValue ? (
                        <>
                            {" "}
                            <del className="observation-view-previous-value">{previousValue}</del>
                            {previousLabel ? (
                                <>
                                    {" "}
                                    <span className="observation-view-previous-label">
                                        {previousLabel}
                                    </span>
                                </>
                            ) : null}
                        </>
                    ) : null}
                    {status !== "final" && statusLabel ? (
                        <>
                            {" "}
                            <span className="observation-view-status">{statusLabel}</span>
                        </>
                    ) : null}
                </>
            )}
        </span>
    );
}
