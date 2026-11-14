// AllergyListItem: one allergy or intolerance in an AllergyList (spec/healthcare-ui item 2). Props: AllergyListItem.md.
import React from "react";

export interface AllergyListItemProps {
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

export default function AllergyListItem({
    className = "",
    substance,
    reaction,
    severity,
    severityLabel,
    updated,
    updatedLabel,
    children,
    ...restProps
}: AllergyListItemProps) {
    return (
        <li
            className={`allergy-list-item ${className}`}
            data-severity={severity}
            {...restProps}
        >
            <span className="allergy-list-item-substance">{substance}</span>
            {reaction ? (
                <>
                    {" "}
                    <span className="allergy-list-item-reaction">{reaction}</span>
                </>
            ) : null}
            {severityLabel ? (
                <>
                    {" "}
                    <span className="allergy-list-item-severity">{severityLabel}</span>
                </>
            ) : null}
            {updatedLabel ? (
                <>
                    {" "}
                    <time
                        className="allergy-list-item-updated"
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
