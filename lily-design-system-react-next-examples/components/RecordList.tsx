// RecordList: a list of records from one section of a patient's record, whose status is never blank (tasks.md P28-T3, spec/healthcare-ui).
// For any status but "known", statusLabel is the list's one item. Props and rules: RecordList.md.
import React from "react";
import { warnMissingProp } from "./dev-warning";
import { useRecordList } from "./use-record-list";

export interface RecordListProps {
    /** What this list is a view of, in the consumer's words: its window and order, what it leaves out and why, and which sources did not answer. Rendered first, as an item of its own (spec/lessons/zoblocks). */
    coverageLabel?: string;
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

export default function RecordList({
    className = "",
    status,
    statusLabel,
    label,
    conflictLabel,
    coverageLabel,
    children,
    ...restProps
}: RecordListProps) {
    warnMissingProp(
        "RecordList",
        "status",
        status,
        "A record list must say whether records are known, none known, not recorded, unavailable, omitted or not applicable.",
    );
    warnMissingProp(
        "RecordList",
        "statusLabel",
        statusLabel,
        "The status needs words a person can read.",
    );
    const shown = useRecordList(
        "RecordList",
        "record-list",
        { status, statusLabel, conflictLabel, label },
        restProps.ref,
    );
    return (
        <ul
            className={`record-list ${className}`}
            data-status={shown.status}
            aria-label={shown.name}
            {...restProps}
            ref={shown.ref}
        >
            {coverageLabel ? <li className="record-list-coverage">{coverageLabel}</li> : null}
            {shown.showItem ? <li className="record-list-status">{shown.words}</li> : null}
            {children}
        </ul>
    );
}
