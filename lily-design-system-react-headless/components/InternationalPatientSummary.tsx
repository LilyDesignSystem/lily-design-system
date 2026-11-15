// InternationalPatientSummary component
//
// An International Patient Summary (HL7 FHIR IPS, ISO 27269) laid out for a clinician: an <article> holding the patient banner,
// a contents navigation, the sections and the document's details. Structure only: Lily parses no FHIR. The root takes the
// sections as plain data too, and adds each missing required section (medications, allergies, problems) with the consumer's
// heading and omittedLabel, after the given sections, with a contents link to it. See
// components/international-patient-summary/index.md.
import React from "react";
import { warnMissingName, warnMissingProp } from "./dev-warning";
import { ipsContents } from "./ips-sections";
import type { IpsSectionEntry } from "./ips-sections";
import InternationalPatientSummarySection from "./InternationalPatientSummarySection";

export interface InternationalPatientSummaryProps {
    className?: string;
    label: string;
    /** The sections the consumer renders, in document order. */
    sections?: IpsSectionEntry[];
    /** Headings for an added, missing required section. */
    requiredHeadings: { medications: string; allergies: string; problems: string };
    /** The words an added section shows, such as "Section missing from document". */
    omittedLabel: string;
    /** Names the contents navigation; without it there is none. */
    contentsLabel?: string;
    headingLevel?: 2 | 3 | 4 | 5 | 6;
    /** Section ids are {idPrefix}-{key}; give each summary on a page its own. */
    idPrefix?: string;
    banner?: React.ReactNode;
    details?: React.ReactNode;
    children?: React.ReactNode;
    [key: string]: unknown;
}

export default function InternationalPatientSummary({
    className = "",
    label,
    sections = [],
    requiredHeadings,
    omittedLabel,
    contentsLabel,
    headingLevel = 2,
    idPrefix,
    banner,
    details,
    children,
    ...restProps
}: InternationalPatientSummaryProps) {
    warnMissingName(
        "InternationalPatientSummary",
        label,
        restProps["aria-label"],
        restProps["aria-labelledby"],
    );
    warnMissingProp(
        "InternationalPatientSummary",
        "omittedLabel",
        omittedLabel,
        "A missing required section must be shown in words.",
    );
    warnMissingProp(
        "InternationalPatientSummary",
        "requiredHeadings",
        requiredHeadings,
        "A missing required section needs a heading.",
    );
    const contents = ipsContents(sections, requiredHeadings ?? {}, idPrefix);
    return (
        <article
            className={`international-patient-summary ${className}`}
            aria-label={label}
            {...restProps}
        >
            {banner ? <div className="international-patient-summary-banner">{banner}</div> : null}
            {contentsLabel ? (
                <nav
                    className="international-patient-summary-contents"
                    aria-label={contentsLabel}
                >
                    <ol>
                        {contents.map((entry) => (
                            <li
                                key={entry.id}
                                data-section={entry.key}
                                data-status={entry.status}
                            >
                                <a href={`#${entry.id}`}>{entry.heading}</a>
                            </li>
                        ))}
                    </ol>
                </nav>
            ) : null}
            <div className="international-patient-summary-sections">
                {children}
                {contents
                    .filter((entry) => entry.added)
                    .map((entry) => (
                        <InternationalPatientSummarySection
                            key={entry.id}
                            section={entry.key}
                            id={entry.id}
                            heading={entry.heading}
                            headingLevel={headingLevel}
                            status="omitted"
                            statusLabel={omittedLabel}
                        />
                    ))}
            </div>
            {details ? (
                <div className="international-patient-summary-details">{details}</div>
            ) : null}
        </article>
    );
}
