// MedicationRecordList: a list of a patient's medicines, whose status is never blank (tasks.md P28-T3, spec/healthcare-ui).
// For any status but "known", statusLabel is the list's one item. Props and rules: MedicationRecordList.md.
import React from "react";
import { warnMissingProp } from "./dev-warning";
import { useRecordList } from "./use-record-list";

export interface MedicationRecordListProps {
    className?: string;
    status: "known" | "none-known" | "not-recorded" | "unavailable" | "omitted" | "not-applicable";
    /** The consumer's words for the status; names the list, and is its one item unless status is "known". */
    statusLabel: string;
    /** The accessible name, when it should differ from statusLabel. */
    label?: string;
    /** Your words for a list that says none are known and holds an entry, shown instead of `statusLabel`; it never says both. */
    conflictLabel?: string;
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function MedicationRecordList({
    className = "",
    status,
    statusLabel,
    label,
    conflictLabel,
    children,
    ...restProps
}: MedicationRecordListProps) {
    warnMissingProp(
        "MedicationRecordList",
        "status",
        status,
        "A medication record list must say whether medicines are known, none known, not recorded, unavailable, omitted or not applicable.",
    );
    warnMissingProp(
        "MedicationRecordList",
        "statusLabel",
        statusLabel,
        "The status needs words a person can read.",
    );
    const shown = useRecordList(
        "MedicationRecordList",
        "medication-record-list",
        { status, statusLabel, conflictLabel, label },
        restProps.ref,
    );
    return (
        <ul
            className={`medication-record-list ${className}`}
            data-status={shown.status}
            aria-label={shown.name}
            {...restProps}
            ref={shown.ref}
        >
            {shown.showItem ? (
                <li className="medication-record-list-status">{shown.words}</li>
            ) : null}
            {children}
        </ul>
    );
}
