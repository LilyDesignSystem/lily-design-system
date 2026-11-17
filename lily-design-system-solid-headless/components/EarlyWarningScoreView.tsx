// EarlyWarningScoreView: an early warning score with its band and escalation (spec/healthcare-ui item 5). Display only:
// it computes nothing. Props: EarlyWarningScoreView.md.
import { merge, omit } from "solid-js";
import { attr } from "./attr";
import { warnMissingProp } from "./dev-warning";

export interface EarlyWarningScoreViewProps {
    class?: string;
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

export default function EarlyWarningScoreView(props: EarlyWarningScoreViewProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(
        p,
        "class",
        "label",
        "score",
        "system",
        "band",
        "bandLabel",
        "escalation",
    );
    if (p.band)
        warnMissingProp(
            "EarlyWarningScoreView",
            "bandLabel",
            p.bandLabel,
            "A band needs words, not colour alone (WCAG 1.4.1).",
        );
    return (
        <span
            class={`early-warning-score-view ${p.class}`}
            data-band={attr(p.band)}
            {...restProps}
        >
            {p.label ? <span class="screen-reader-span">{`${p.label} `}</span> : null}
            {p.system ? (
                <>
                    <span class="early-warning-score-view-system">{p.system}</span>{" "}
                </>
            ) : null}
            <span class="early-warning-score-view-score">{p.score}</span>
            {p.bandLabel ? (
                <>
                    {" "}
                    <span class="early-warning-score-view-band">{p.bandLabel}</span>
                </>
            ) : null}
            {p.escalation ? (
                <>
                    {" "}
                    <span class="early-warning-score-view-escalation">{p.escalation}</span>
                </>
            ) : null}
        </span>
    );
}
