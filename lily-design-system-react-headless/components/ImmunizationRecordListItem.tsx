// ImmunizationRecordListItem: one immunization in an immunization record list, with vaccine, date, dose and status (tasks.md P28-T3, spec/healthcare-ui). Props: ImmunizationRecordListItem.md.
import React from "react";
import { warnMissingProp } from "./dev-warning";

export interface ImmunizationRecordListItemProps {
    className?: string;
    /** whose record it is, when it is not the patient's ("Mother", "Fetus 1"); shown first */
    subjectLabel?: string;
    /** the vaccine given; never truncated */
    vaccine: string;
    /** when it was given, for <time datetime> */
    occurrence?: string;
    occurrenceLabel?: string;
    /** the dose in words ("Dose 2 of 2") */
    doseNumberLabel?: string;
    /** FHIR Immunization status */
    status?: "completed" | "entered-in-error" | "not-done";
    statusLabel?: string;
    /** the vaccine's lot number */
    lotNumber?: string;
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function ImmunizationRecordListItem({
    className = "",
    subjectLabel,
    vaccine,
    occurrence,
    occurrenceLabel,
    doseNumberLabel,
    status,
    statusLabel,
    lotNumber,
    children,
    ...restProps
}: ImmunizationRecordListItemProps) {
    if (status)
        warnMissingProp(
            "ImmunizationRecordListItem",
            "statusLabel",
            statusLabel,
            "a status needs words a person can read, never a code alone.",
        );
    return (
        <li
            className={`immunization-record-list-item ${className}`}
            data-status={status}
            {...restProps}
        >
            {subjectLabel ? (
                <>
                    <span className="immunization-record-list-item-subject">
                        {subjectLabel}
                    </span>{" "}
                </>
            ) : null}
            <span className="immunization-record-list-item-vaccine">{vaccine}</span>
            {occurrenceLabel ? (
                <>
                    {" "}
                    <time
                        className="immunization-record-list-item-occurrence"
                        dateTime={occurrence}
                    >
                        {occurrenceLabel}
                    </time>
                </>
            ) : null}
            {doseNumberLabel ? (
                <>
                    {" "}
                    <span className="immunization-record-list-item-dose-number">
                        {doseNumberLabel}
                    </span>
                </>
            ) : null}
            {statusLabel ? (
                <>
                    {" "}
                    <span className="immunization-record-list-item-status">{statusLabel}</span>
                </>
            ) : null}
            {lotNumber ? (
                <>
                    {" "}
                    <span className="immunization-record-list-item-lot-number">{lotNumber}</span>
                </>
            ) : null}
            {children}
        </li>
    );
}
