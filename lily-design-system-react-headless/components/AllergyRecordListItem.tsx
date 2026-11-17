// AllergyRecordListItem: one allergy or intolerance in an allergy record list, with substance, reaction, severity, criticality and status (tasks.md P28-T3, spec/healthcare-ui). Props: AllergyRecordListItem.md.
import React from "react";
import { warnMissingProp } from "./dev-warning";

export interface AllergyRecordListItemProps {
    className?: string;
    /** whose record it is, when it is not the patient's ("Mother", "Fetus 1"); shown first */
    subjectLabel?: string;
    /** what the patient reacts to; never truncated */
    substance: string;
    /** the manifestation */
    reaction?: string;
    /** the reaction's severity (FHIR reaction.severity) */
    severity?: "mild" | "moderate" | "severe";
    severityLabel?: string;
    /** the risk of a future reaction (FHIR criticality), not the severity of a past one */
    criticality?: "low" | "high" | "unable-to-assess";
    criticalityLabel?: string;
    /** FHIR clinicalStatus */
    clinicalStatus?: "active" | "inactive" | "resolved";
    clinicalStatusLabel?: string;
    /** FHIR verificationStatus; a refuted or entered-in-error record must never read as a confirmed one */
    verificationStatus?: "unconfirmed" | "presumed" | "confirmed" | "refuted" | "entered-in-error";
    verificationStatusLabel?: string;
    /** allergy or intolerance, in words (FHIR type) */
    typeLabel?: string;
    /** food, medication, environment or biologic, in words (FHIR category) */
    categoryLabel?: string;
    /** when the record was last updated */
    updated?: string;
    updatedLabel?: string;
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function AllergyRecordListItem({
    className = "",
    subjectLabel,
    substance,
    reaction,
    severity,
    severityLabel,
    criticality,
    criticalityLabel,
    clinicalStatus,
    clinicalStatusLabel,
    verificationStatus,
    verificationStatusLabel,
    typeLabel,
    categoryLabel,
    updated,
    updatedLabel,
    children,
    ...restProps
}: AllergyRecordListItemProps) {
    if (severity)
        warnMissingProp(
            "AllergyRecordListItem",
            "severityLabel",
            severityLabel,
            "a status needs words a person can read, never a code alone.",
        );
    if (criticality)
        warnMissingProp(
            "AllergyRecordListItem",
            "criticalityLabel",
            criticalityLabel,
            "a status needs words a person can read, never a code alone.",
        );
    if (clinicalStatus)
        warnMissingProp(
            "AllergyRecordListItem",
            "clinicalStatusLabel",
            clinicalStatusLabel,
            "a status needs words a person can read, never a code alone.",
        );
    if (verificationStatus)
        warnMissingProp(
            "AllergyRecordListItem",
            "verificationStatusLabel",
            verificationStatusLabel,
            "a status needs words a person can read, never a code alone.",
        );
    return (
        <li
            className={`allergy-record-list-item ${className}`}
            data-severity={severity}
            data-criticality={criticality}
            data-clinical-status={clinicalStatus}
            data-verification-status={verificationStatus}
            {...restProps}
        >
            {subjectLabel ? (
                <>
                    <span className="allergy-record-list-item-subject">{subjectLabel}</span>{" "}
                </>
            ) : null}
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
            {criticalityLabel ? (
                <>
                    {" "}
                    <span className="allergy-record-list-item-criticality">{criticalityLabel}</span>
                </>
            ) : null}
            {clinicalStatusLabel ? (
                <>
                    {" "}
                    <span className="allergy-record-list-item-clinical-status">
                        {clinicalStatusLabel}
                    </span>
                </>
            ) : null}
            {verificationStatusLabel ? (
                <>
                    {" "}
                    <span className="allergy-record-list-item-verification-status">
                        {verificationStatusLabel}
                    </span>
                </>
            ) : null}
            {typeLabel ? (
                <>
                    {" "}
                    <span className="allergy-record-list-item-type">{typeLabel}</span>
                </>
            ) : null}
            {categoryLabel ? (
                <>
                    {" "}
                    <span className="allergy-record-list-item-category">{categoryLabel}</span>
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
