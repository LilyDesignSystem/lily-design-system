// InternationalPatientSummarySection component
//
// One section of an International Patient Summary (HL7 FHIR IPS, ISO 27269): a <section> named by its heading, carrying the
// section's key, LOINC code, status and whether the IPS requires it, as data. Its entries are the consumer's; its status is
// never blank, and for any status but "known" the consumer's words are shown under the heading. The author's narrative, when
// given, sits in a <details> after the entries. See components/international-patient-summary-section/index.md.
import React, { useEffect, useRef, useState } from "react";
import { warnMissingProp } from "./dev-warning";
import { watchConflict } from "./record-list-state";
import {
    ipsSectionCode,
    ipsSectionId,
    ipsSectionIsRequired,
    ipsSectionLevel,
} from "./ips-sections";
import type { IpsSectionStatus } from "./ips-sections";

export interface InternationalPatientSummarySectionProps {
    className?: string;
    /** The IPS section key, such as "allergies"; data-section. */
    section: string;
    heading: string;
    headingLevel?: 2 | 3 | 4 | 5 | 6;
    status?: IpsSectionStatus;
    /** The status in words; required for any status but "known". */
    statusLabel?: string;
    /** Where a status other than "known" is said in words: "heading" (default) prints `statusLabel` under the heading; "list" leaves the words to the record list inside, whose own status item says them, so they are not shown twice. */
    statusPlacement?: "heading" | "list";
    /** The LOINC code; default the IPS code for the key. */
    code?: string;
    /** Default whether the IPS requires the section. */
    required?: boolean;
    /** The section's level in the IPS: "required", "recommended" or "optional". Default the registry's level for the key; data-level. */
    level?: "required" | "recommended" | "optional";
    /** What a viewer shows beside the heading, after the heading and status and before the entries. Nothing is rendered without it. */
    meta?: React.ReactNode;
    /** A notice about the entries, after `meta` and before them. Nothing is rendered without it. */
    warning?: React.ReactNode;
    id?: string;
    /** The same as its summary's; ids are {idPrefix}-{section}. */
    idPrefix?: string;
    /** The author's narrative (sanitised by the consumer), in a <details>. */
    narrative?: React.ReactNode;
    narrativeLabel?: string;
    narrativeOpen?: boolean;
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function InternationalPatientSummarySection({
    className = "",
    section,
    heading,
    headingLevel = 2,
    status = "known",
    statusLabel,
    statusPlacement = "heading",
    code,
    required,
    level,
    meta,
    warning,
    id,
    idPrefix,
    narrative,
    narrativeLabel,
    narrativeOpen = false,
    children,
    ...restProps
}: InternationalPatientSummarySectionProps) {
    warnMissingProp(
        "InternationalPatientSummarySection",
        "heading",
        heading,
        "A section needs a heading.",
    );
    if (status !== "known" && statusPlacement !== "list") {
        warnMissingProp(
            "InternationalPatientSummarySection",
            "statusLabel",
            statusLabel,
            "A section that is not known must say why, in words.",
        );
    }
    if (narrative) {
        warnMissingProp(
            "InternationalPatientSummarySection",
            "narrativeLabel",
            narrativeLabel,
            "The narrative's disclosure needs a summary.",
        );
    }
    const sectionId = ipsSectionId(section, id, idPrefix);
    const headingId = `${sectionId}-heading`;
    const isRequired = required ?? ipsSectionIsRequired(section);
    const Heading = `h${headingLevel}` as "h2";
    // "None known" is never printed above a record list that holds an entry (HC-C17, tasks.md P50-T29).
    const root = useRef<HTMLElement>(null);
    const [listInConflict, setListInConflict] = useState(false);
    useEffect(() => {
        if (status !== "none-known" || !root.current) {
            setListInConflict(false);
            return;
        }
        return watchConflict(root.current, setListInConflict);
    }, [status]);
    return (
        <section
            ref={root}
            className={`international-patient-summary-section ${className}`}
            id={sectionId}
            aria-labelledby={headingId}
            data-section={section}
            data-code={code ?? ipsSectionCode(section)}
            data-status={status}
            data-required={isRequired ? "true" : undefined}
            data-level={level ?? ipsSectionLevel(section)}
            {...restProps}
        >
            <Heading
                id={headingId}
                className="international-patient-summary-section-heading"
            >
                {heading}
            </Heading>
            {status !== "known" && statusLabel && statusPlacement !== "list" && !listInConflict ? (
                <p className="international-patient-summary-section-status">{statusLabel}</p>
            ) : null}
            {meta ? <div className="international-patient-summary-section-meta">{meta}</div> : null}
            {warning ? (
                <div className="international-patient-summary-section-warning">{warning}</div>
            ) : null}
            {children}
            {narrative ? (
                <details
                    className="international-patient-summary-section-narrative"
                    open={narrativeOpen}
                >
                    <summary>{narrativeLabel}</summary>
                    {narrative}
                </details>
            ) : null}
        </section>
    );
}
