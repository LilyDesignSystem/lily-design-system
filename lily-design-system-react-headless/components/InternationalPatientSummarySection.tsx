// InternationalPatientSummarySection component
//
// One section of an International Patient Summary (HL7 FHIR IPS, ISO 27269): a <section> named by its heading, carrying the
// section's key, LOINC code, status and whether the IPS requires it, as data. Its entries are the consumer's; its status is
// never blank, and for any status but "known" the consumer's words are shown under the heading. The author's narrative, when
// given, sits in a <details> after the entries. See components/international-patient-summary-section/index.md.
import React from "react";
import { warnMissingProp } from "./dev-warning";
import { ipsSectionCode, ipsSectionId, ipsSectionIsRequired } from "./ips-sections";
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
    /** The LOINC code; default the IPS code for the key. */
    code?: string;
    /** Default whether the IPS requires the section. */
    required?: boolean;
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
    code,
    required,
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
    if (status !== "known") {
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
    return (
        <section
            className={`international-patient-summary-section ${className}`}
            id={sectionId}
            aria-labelledby={headingId}
            data-section={section}
            data-code={code ?? ipsSectionCode(section)}
            data-status={status}
            data-required={isRequired ? "true" : undefined}
            {...restProps}
        >
            <Heading
                id={headingId}
                className="international-patient-summary-section-heading"
            >
                {heading}
            </Heading>
            {status !== "known" && statusLabel ? (
                <p className="international-patient-summary-section-status">{statusLabel}</p>
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
