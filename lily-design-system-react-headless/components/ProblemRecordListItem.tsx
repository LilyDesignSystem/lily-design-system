// ProblemRecordListItem: one problem or condition in a problem record list, with its clinical and verification status, severity, onset and resolution (tasks.md P28-T3, spec/healthcare-ui). Props: ProblemRecordListItem.md.
import React from "react";
import { warnMissingProp } from "./dev-warning";

export interface ProblemRecordListItemProps {
    className?: string;
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
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function ProblemRecordListItem({
    className = "",
    subjectLabel,
    condition,
    clinicalStatus,
    clinicalStatusLabel,
    verificationStatus,
    verificationStatusLabel,
    severityLabel,
    onset,
    onsetLabel,
    abatement,
    abatementLabel,
    children,
    ...restProps
}: ProblemRecordListItemProps) {
    if (clinicalStatus)
        warnMissingProp(
            "ProblemRecordListItem",
            "clinicalStatusLabel",
            clinicalStatusLabel,
            "a status needs words a person can read, never a code alone.",
        );
    if (verificationStatus)
        warnMissingProp(
            "ProblemRecordListItem",
            "verificationStatusLabel",
            verificationStatusLabel,
            "a status needs words a person can read, never a code alone.",
        );
    return (
        <li
            className={`problem-record-list-item ${className}`}
            data-clinical-status={clinicalStatus}
            data-verification-status={verificationStatus}
            {...restProps}
        >
            {subjectLabel ? (
                <>
                    <span className="problem-record-list-item-subject">{subjectLabel}</span>{" "}
                </>
            ) : null}
            <span className="problem-record-list-item-condition">{condition}</span>
            {clinicalStatusLabel ? (
                <>
                    {" "}
                    <span className="problem-record-list-item-clinical-status">
                        {clinicalStatusLabel}
                    </span>
                </>
            ) : null}
            {verificationStatusLabel ? (
                <>
                    {" "}
                    <span className="problem-record-list-item-verification-status">
                        {verificationStatusLabel}
                    </span>
                </>
            ) : null}
            {severityLabel ? (
                <>
                    {" "}
                    <span className="problem-record-list-item-severity">{severityLabel}</span>
                </>
            ) : null}
            {onsetLabel ? (
                <>
                    {" "}
                    <time
                        className="problem-record-list-item-onset"
                        dateTime={onset}
                    >
                        {onsetLabel}
                    </time>
                </>
            ) : null}
            {abatementLabel ? (
                <>
                    {" "}
                    <time
                        className="problem-record-list-item-abatement"
                        dateTime={abatement}
                    >
                        {abatementLabel}
                    </time>
                </>
            ) : null}
            {children}
        </li>
    );
}
