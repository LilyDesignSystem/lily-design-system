// RecordList: a list of records from one section of a patient's record, whose status is never blank (tasks.md P28-T3, spec/healthcare-ui).
// For any status but "known", statusLabel is the list's one item. Props and rules: RecordList.md.
import React from "react";
import { warnMissingProp } from "./dev-warning";

export interface RecordListProps {
    className?: string;
    status: "known" | "none-known" | "not-recorded" | "unavailable" | "omitted";
    /** The consumer's words for the status; names the list, and is its one item unless status is "known". */
    statusLabel: string;
    /** The accessible name, when it should differ from statusLabel. */
    label?: string;
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function RecordList({
    className = "",
    status,
    statusLabel,
    label,
    children,
    ...restProps
}: RecordListProps) {
    warnMissingProp(
        "RecordList",
        "status",
        status,
        "A record list must say whether records are known, none known, not recorded, unavailable or omitted.",
    );
    warnMissingProp(
        "RecordList",
        "statusLabel",
        statusLabel,
        "The status needs words a person can read.",
    );
    return (
        <ul
            className={`record-list ${className}`}
            data-status={status}
            aria-label={label ?? statusLabel}
            {...restProps}
        >
            {status !== "known" ? <li className="record-list-status">{statusLabel}</li> : null}
            {children}
        </ul>
    );
}
