// MedicationRecordListItem: one medicine in a medication record list, with its status and when it applies (tasks.md P28-T3, spec/healthcare-ui). Props: MedicationRecordListItem.md.
import React from "react";
import { warnMissingProp } from "./dev-warning";

export interface MedicationRecordListItemProps {
    className?: string;
    /** whose record it is, when it is not the patient's ("Mother", "Fetus 1"); shown first */
    subjectLabel?: string;
    /** FHIR MedicationStatement status */
    status?:
        | "active"
        | "completed"
        | "entered-in-error"
        | "intended"
        | "stopped"
        | "on-hold"
        | "unknown"
        | "not-taken";
    statusLabel?: string;
    /** when the medicine applies, for <time datetime> */
    effective?: string;
    effectiveLabel?: string;
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function MedicationRecordListItem({
    className = "",
    subjectLabel,
    status,
    statusLabel,
    effective,
    effectiveLabel,
    children,
    ...restProps
}: MedicationRecordListItemProps) {
    if (status)
        warnMissingProp(
            "MedicationRecordListItem",
            "statusLabel",
            statusLabel,
            "a status needs words a person can read, never a code alone.",
        );
    return (
        <li
            className={`medication-record-list-item ${className}`}
            data-status={status}
            {...restProps}
        >
            {subjectLabel ? (
                <>
                    <span className="medication-record-list-item-subject">{subjectLabel}</span>{" "}
                </>
            ) : null}
            {children}
            {statusLabel ? (
                <>
                    {" "}
                    <span className="medication-record-list-item-status">{statusLabel}</span>
                </>
            ) : null}
            {effectiveLabel ? (
                <>
                    {" "}
                    <time
                        className="medication-record-list-item-effective"
                        dateTime={effective}
                    >
                        {effectiveLabel}
                    </time>
                </>
            ) : null}
        </li>
    );
}
