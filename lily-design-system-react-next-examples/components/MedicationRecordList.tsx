// MedicationRecordList: a list of a patient's medicines, whose status is never blank (tasks.md P28-T3, spec/healthcare-ui).
// For any status but "known", statusLabel is the list's one item. Props and rules: MedicationRecordList.md.
import React from "react";
import { warnMissingProp } from "./dev-warning";

export interface MedicationRecordListProps {
    className?: string;
    status: "known" | "none-known" | "not-recorded" | "unavailable" | "omitted";
    /** The consumer's words for the status; names the list, and is its one item unless status is "known". */
    statusLabel: string;
    /** The accessible name, when it should differ from statusLabel. */
    label?: string;
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function MedicationRecordList({
    className = "",
    status,
    statusLabel,
    label,
    children,
    ...restProps
}: MedicationRecordListProps) {
    warnMissingProp(
        "MedicationRecordList",
        "status",
        status,
        "A medication record list must say whether medicines are known, none known, not recorded, unavailable or omitted.",
    );
    warnMissingProp(
        "MedicationRecordList",
        "statusLabel",
        statusLabel,
        "The status needs words a person can read.",
    );
    return (
        <ul
            className={`medication-record-list ${className}`}
            data-status={status}
            aria-label={label ?? statusLabel}
            {...restProps}
        >
            {status !== "known" ? (
                <li className="medication-record-list-status">{statusLabel}</li>
            ) : null}
            {children}
        </ul>
    );
}
