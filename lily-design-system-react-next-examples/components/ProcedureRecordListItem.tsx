// ProcedureRecordListItem: one procedure in a procedure record list, with its status and when it was performed (tasks.md P28-T3, spec/healthcare-ui). Props: ProcedureRecordListItem.md.
import React from "react";
import { warnMissingProp } from "./dev-warning";

export interface ProcedureRecordListItemProps {
    className?: string;
    /** the procedure; never truncated */
    procedure: string;
    /** FHIR Procedure status */
    status?:
        | "preparation"
        | "in-progress"
        | "not-done"
        | "on-hold"
        | "stopped"
        | "completed"
        | "entered-in-error"
        | "unknown";
    statusLabel?: string;
    /** when it was performed, for <time datetime> */
    performed?: string;
    performedLabel?: string;
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function ProcedureRecordListItem({
    className = "",
    procedure,
    status,
    statusLabel,
    performed,
    performedLabel,
    children,
    ...restProps
}: ProcedureRecordListItemProps) {
    if (status)
        warnMissingProp(
            "ProcedureRecordListItem",
            "statusLabel",
            statusLabel,
            "a status needs words a person can read, never a code alone.",
        );
    return (
        <li
            className={`procedure-record-list-item ${className}`}
            data-status={status}
            {...restProps}
        >
            <span className="procedure-record-list-item-procedure">{procedure}</span>
            {statusLabel ? (
                <>
                    {" "}
                    <span className="procedure-record-list-item-status">{statusLabel}</span>
                </>
            ) : null}
            {performedLabel ? (
                <>
                    {" "}
                    <time
                        className="procedure-record-list-item-performed"
                        dateTime={performed}
                    >
                        {performedLabel}
                    </time>
                </>
            ) : null}
            {children}
        </li>
    );
}
