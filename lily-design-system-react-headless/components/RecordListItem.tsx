// RecordListItem: one record in a record list, with its status and last update around the consumer's content (tasks.md P28-T3, spec/healthcare-ui). Props: RecordListItem.md.
import React from "react";
import { warnMissingProp } from "./dev-warning";

export interface RecordListItemProps {
    className?: string;
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
    return (
        <li
            className={`record-list-item ${className}`}
            data-status={status}
            {...restProps}
        >
            {children}
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
