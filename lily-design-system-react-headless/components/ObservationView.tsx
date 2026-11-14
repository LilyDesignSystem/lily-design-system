// ObservationView: a read-only clinical observation or result, with unit, flag and reference range (spec/healthcare-ui item 1).
// Shows what the consumer decided; computes no flag and no range. Props and rules: ObservationView.md.
import React from "react";
import { warnMissingProp } from "./dev-warning";

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
    status?: "final" | "preliminary" | "not-recorded" | "unavailable";
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
    const missing = status === "not-recorded" || status === "unavailable";
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
                    {status === "preliminary" && statusLabel ? (
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
