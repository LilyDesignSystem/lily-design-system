// EarlyWarningScoreView: an early warning score with its band and escalation (spec/healthcare-ui item 5). Display only:
// it computes nothing. Props: EarlyWarningScoreView.md.
import React from "react";
import { warnMissingProp } from "./dev-warning";

export interface EarlyWarningScoreViewProps {
    className?: string;
    label?: string;
    /** The score the consumer computed. */
    score: string | number;
    /** The scoring system's name ("NEWS2"). */
    system?: string;
    /** The consumer's band key, as data-band. */
    band?: string;
    /** The band in words; required with band. */
    bandLabel?: string;
    escalation?: string;
    [key: string]: unknown;
}

export default function EarlyWarningScoreView({
    className = "",
    label,
    score,
    system,
    band,
    bandLabel,
    escalation,
    ...restProps
}: EarlyWarningScoreViewProps) {
    if (band)
        warnMissingProp(
            "EarlyWarningScoreView",
            "bandLabel",
            bandLabel,
            "A band needs words, not colour alone (WCAG 1.4.1).",
        );
    return (
        <span
            className={`early-warning-score-view ${className}`}
            data-band={band}
            {...restProps}
        >
            {label ? <span className="screen-reader-span">{`${label} `}</span> : null}
            {system ? (
                <>
                    <span className="early-warning-score-view-system">{system}</span>{" "}
                </>
            ) : null}
            <span className="early-warning-score-view-score">{score}</span>
            {bandLabel ? (
                <>
                    {" "}
                    <span className="early-warning-score-view-band">{bandLabel}</span>
                </>
            ) : null}
            {escalation ? (
                <>
                    {" "}
                    <span className="early-warning-score-view-escalation">{escalation}</span>
                </>
            ) : null}
        </span>
    );
}
