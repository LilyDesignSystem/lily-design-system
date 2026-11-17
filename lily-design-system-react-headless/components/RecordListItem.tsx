// RecordListItem: one record in a record list, with its status and last update around the consumer's content (tasks.md P28-T3, spec/healthcare-ui). Props: RecordListItem.md.
import React from "react";
import { warnMissingProp } from "./dev-warning";

export interface RecordListItemProps {
    className?: string;
    /** whose record it is, when it is not the patient's ("Mother", "Fetus 1"); shown first */
    subjectLabel?: string;
    /** withheld: content not shown, only the words; entered-in-error: content kept in a <del>, with the words. data-entry-state */
    entryState?: "withheld" | "entered-in-error";
    /** That state in the consumer's words; required with entryState. */
    entryStateLabel?: string;
    /** the record's status, as the consumer's code */
    status?: string;
    statusLabel?: string;
    /** when the record was last updated */
    updated?: string;
    updatedLabel?: string;
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function RecordListItem({
    className = "",
    subjectLabel,
    entryState,
    entryStateLabel,
    status,
    statusLabel,
    updated,
    updatedLabel,
    children,
    ...restProps
}: RecordListItemProps) {
    if (status)
        warnMissingProp(
            "RecordListItem",
            "statusLabel",
            statusLabel,
            "a status needs words a person can read, never a code alone.",
        );
    if (entryState)
        warnMissingProp(
            "RecordListItem",
            "entryStateLabel",
            entryStateLabel,
            "a withheld or in-error entry must say so in words.",
        );
    return (
        <li
            className={`record-list-item ${className}`}
            data-status={status}
            data-entry-state={entryState}
            {...restProps}
        >
            {subjectLabel ? (
                <>
                    <span className="record-list-item-subject">{subjectLabel}</span>{" "}
                </>
            ) : null}
            {entryState === "withheld" ? (
                <span className="record-list-item-entry-state">{entryStateLabel}</span>
            ) : entryState === "entered-in-error" ? (
                <>
                    <del className="record-list-item-entry">{children}</del>{" "}
                    <span className="record-list-item-entry-state">{entryStateLabel}</span>
                </>
            ) : (
                children
            )}
            {statusLabel ? (
                <>
                    {" "}
                    <span className="record-list-item-status">{statusLabel}</span>
                </>
            ) : null}
            {updatedLabel ? (
                <>
                    {" "}
                    <time
                        className="record-list-item-updated"
                        dateTime={updated}
                    >
                        {updatedLabel}
                    </time>
                </>
            ) : null}
        </li>
    );
}
