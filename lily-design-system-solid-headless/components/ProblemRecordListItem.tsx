// ProblemRecordListItem: one problem or condition in a problem record list, with its clinical and verification status, severity, onset and resolution (tasks.md P28-T3, spec/healthcare-ui). Props: ProblemRecordListItem.md.
import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
import { attr } from "./attr";
import { warnMissingProp } from "./dev-warning";

export interface ProblemRecordListItemProps {
    class?: string;
    /** whose record it is, when it is not the patient's ("Mother", "Fetus 1"); shown first */
    subjectLabel?: string;
    /** the problem or condition; never truncated */
    condition: string;
    /** FHIR Condition clinicalStatus */
    clinicalStatus?: "active" | "recurrence" | "relapse" | "inactive" | "remission" | "resolved";
    clinicalStatusLabel?: string;
    /** FHIR Condition verificationStatus; a refuted or entered-in-error record must never read as a confirmed one */
    verificationStatus?:
        | "unconfirmed"
        | "provisional"
        | "differential"
        | "confirmed"
        | "refuted"
        | "entered-in-error";
    verificationStatusLabel?: string;
    /** the severity in words */
    severityLabel?: string;
    /** when it began, for <time datetime> */
    onset?: string;
    onsetLabel?: string;
    /** when it resolved, for <time datetime> */
    abatement?: string;
    abatementLabel?: string;
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function ProblemRecordListItem(props: ProblemRecordListItemProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(
        p,
        "class",
        "subjectLabel",
        "condition",
        "clinicalStatus",
        "clinicalStatusLabel",
        "verificationStatus",
        "verificationStatusLabel",
        "severityLabel",
        "onset",
        "onsetLabel",
        "abatement",
        "abatementLabel",
        "children",
    );
    if (p.clinicalStatus)
        warnMissingProp(
            "ProblemRecordListItem",
            "clinicalStatusLabel",
            p.clinicalStatusLabel,
            "a status needs words a person can read, never a code alone.",
        );
    if (p.verificationStatus)
        warnMissingProp(
            "ProblemRecordListItem",
            "verificationStatusLabel",
            p.verificationStatusLabel,
            "a status needs words a person can read, never a code alone.",
        );
    return (
        <li
            class={`problem-record-list-item ${p.class}`}
            data-clinical-status={attr(p.clinicalStatus)}
            data-verification-status={attr(p.verificationStatus)}
            {...restProps}
        >
            {p.subjectLabel ? (
                <>
                    <span class="problem-record-list-item-subject">{p.subjectLabel}</span>{" "}
                </>
            ) : null}
            <span class="problem-record-list-item-condition">{p.condition}</span>
            {p.clinicalStatusLabel ? (
                <>
                    {" "}
                    <span class="problem-record-list-item-clinical-status">
                        {p.clinicalStatusLabel}
                    </span>
                </>
            ) : null}
            {p.verificationStatusLabel ? (
                <>
                    {" "}
                    <span class="problem-record-list-item-verification-status">
                        {p.verificationStatusLabel}
                    </span>
                </>
            ) : null}
            {p.severityLabel ? (
                <>
                    {" "}
                    <span class="problem-record-list-item-severity">{p.severityLabel}</span>
                </>
            ) : null}
            {p.onsetLabel ? (
                <>
                    {" "}
                    <time
                        class="problem-record-list-item-onset"
                        datetime={p.onset}
                    >
                        {p.onsetLabel}
                    </time>
                </>
            ) : null}
            {p.abatementLabel ? (
                <>
                    {" "}
                    <time
                        class="problem-record-list-item-abatement"
                        datetime={p.abatement}
                    >
                        {p.abatementLabel}
                    </time>
                </>
            ) : null}
            {p.children}
        </li>
    );
}
