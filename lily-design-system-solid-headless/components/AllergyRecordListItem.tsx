// AllergyRecordListItem: one allergy or intolerance in an allergy record list, with substance, reaction, severity, criticality and status (tasks.md P28-T3, spec/healthcare-ui). Props: AllergyRecordListItem.md.
import type { JSX } from "@solidjs/web";
import { merge, omit } from "solid-js";
import { attr } from "./attr";
import { warnMissingProp } from "./dev-warning";

export interface AllergyRecordListItemProps {
    class?: string;
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
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function AllergyRecordListItem(props: AllergyRecordListItemProps) {
    const p = merge({ class: "" as const }, props);
    const restProps = omit(
        p,
        "class",
        "subjectLabel",
        "substance",
        "reaction",
        "severity",
        "severityLabel",
        "criticality",
        "criticalityLabel",
        "clinicalStatus",
        "clinicalStatusLabel",
        "verificationStatus",
        "verificationStatusLabel",
        "typeLabel",
        "categoryLabel",
        "updated",
        "updatedLabel",
        "children",
    );
    if (p.severity)
        warnMissingProp(
            "AllergyRecordListItem",
            "severityLabel",
            p.severityLabel,
            "a status needs words a person can read, never a code alone.",
        );
    if (p.criticality)
        warnMissingProp(
            "AllergyRecordListItem",
            "criticalityLabel",
            p.criticalityLabel,
            "a status needs words a person can read, never a code alone.",
        );
    if (p.clinicalStatus)
        warnMissingProp(
            "AllergyRecordListItem",
            "clinicalStatusLabel",
            p.clinicalStatusLabel,
            "a status needs words a person can read, never a code alone.",
        );
    if (p.verificationStatus)
        warnMissingProp(
            "AllergyRecordListItem",
            "verificationStatusLabel",
            p.verificationStatusLabel,
            "a status needs words a person can read, never a code alone.",
        );
    return (
        <li
            class={`allergy-record-list-item ${p.class}`}
            data-severity={attr(p.severity)}
            data-criticality={attr(p.criticality)}
            data-clinical-status={attr(p.clinicalStatus)}
            data-verification-status={attr(p.verificationStatus)}
            {...restProps}
        >
            {p.subjectLabel ? (
                <>
                    <span class="allergy-record-list-item-subject">{p.subjectLabel}</span>{" "}
                </>
            ) : null}
            <span class="allergy-record-list-item-substance">{p.substance}</span>
            {p.reaction ? (
                <>
                    {" "}
                    <span class="allergy-record-list-item-reaction">{p.reaction}</span>
                </>
            ) : null}
            {p.severityLabel ? (
                <>
                    {" "}
                    <span class="allergy-record-list-item-severity">{p.severityLabel}</span>
                </>
            ) : null}
            {p.criticalityLabel ? (
                <>
                    {" "}
                    <span class="allergy-record-list-item-criticality">{p.criticalityLabel}</span>
                </>
            ) : null}
            {p.clinicalStatusLabel ? (
                <>
                    {" "}
                    <span class="allergy-record-list-item-clinical-status">
                        {p.clinicalStatusLabel}
                    </span>
                </>
            ) : null}
            {p.verificationStatusLabel ? (
                <>
                    {" "}
                    <span class="allergy-record-list-item-verification-status">
                        {p.verificationStatusLabel}
                    </span>
                </>
            ) : null}
            {p.typeLabel ? (
                <>
                    {" "}
                    <span class="allergy-record-list-item-type">{p.typeLabel}</span>
                </>
            ) : null}
            {p.categoryLabel ? (
                <>
                    {" "}
                    <span class="allergy-record-list-item-category">{p.categoryLabel}</span>
                </>
            ) : null}
            {p.updatedLabel ? (
                <>
                    {" "}
                    <time
                        class="allergy-record-list-item-updated"
                        datetime={p.updated}
                    >
                        {p.updatedLabel}
                    </time>
                </>
            ) : null}
            {p.children}
        </li>
    );
}
