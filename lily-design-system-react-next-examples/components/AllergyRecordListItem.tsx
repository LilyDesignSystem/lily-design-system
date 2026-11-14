// AllergyRecordListItem: one allergy or intolerance in an AllergyRecordList (spec/healthcare-ui item 2). Props: AllergyRecordListItem.md.
import React from "react";

export interface AllergyRecordListItemProps {
    className?: string;
    /** What the patient reacts to. Never truncated. */
    substance: string;
    reaction?: string;
    /** FHIR AllergyIntolerance reaction severity, rendered as data-severity. */
    severity?: "mild" | "moderate" | "severe";
    /** The consumer's words for the severity. */
    severityLabel?: string;
    /** When the record was last updated, for <time datetime>. */
    updated?: string;
    /** That date as the consumer writes it; the <time> is shown only when set. */
    updatedLabel?: string;
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function AllergyRecordListItem({
    className = "",
    substance,
    reaction,
    severity,
    severityLabel,
    updated,
    updatedLabel,
    children,
    ...restProps
}: AllergyRecordListItemProps) {
    return (
        <li
            className={`allergy-record-list-item ${className}`}
            data-severity={severity}
            {...restProps}
        >
            <span className="allergy-record-list-item-substance">{substance}</span>
            {reaction ? (
                <>
                    {" "}
                    <span className="allergy-record-list-item-reaction">{reaction}</span>
                </>
            ) : null}
            {severityLabel ? (
                <>
                    {" "}
                    <span className="allergy-record-list-item-severity">{severityLabel}</span>
                </>
            ) : null}
            {updatedLabel ? (
                <>
                    {" "}
                    <time
                        className="allergy-record-list-item-updated"
                        dateTime={updated}
                    >
                        {updatedLabel}
                    </time>
                </>
            ) : null}
            {children}
        </li>
    );
}
