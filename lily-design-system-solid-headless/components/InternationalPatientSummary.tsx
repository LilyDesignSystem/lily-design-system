// InternationalPatientSummary component
//
// An International Patient Summary (HL7 FHIR IPS, ISO 27269) laid out for a clinician: an <article> holding the patient banner,
// a contents navigation, the sections and the document's details. Structure only: Lily parses no FHIR. The root takes the
// sections as plain data too, and adds each missing required section (medications, allergies, problems) with the consumer's
// heading and omittedLabel, after the given sections, with a contents link to it. See
// components/international-patient-summary/index.md.
import type { JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
import { warnMissingName, warnMissingProp } from "./dev-warning";
import { ipsContents } from "./ips-sections";
import type { IpsSectionEntry } from "./ips-sections";
import InternationalPatientSummarySection from "./InternationalPatientSummarySection";

export interface InternationalPatientSummaryProps {
    class?: string;
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
    banner?: JSX.Element;
    details?: JSX.Element;
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function InternationalPatientSummary(props: InternationalPatientSummaryProps) {
    const p = withDefaults(
        {
            class: "" as const,
            sections: [] as NonNullable<InternationalPatientSummaryProps["sections"]>,
            headingLevel: 2 as NonNullable<InternationalPatientSummaryProps["headingLevel"]>,
        },
        props,
    );
    const restProps = omit(
        p,
        "class",
        "label",
        "sections",
        "requiredHeadings",
        "omittedLabel",
        "contentsLabel",
        "headingLevel",
        "idPrefix",
        "banner",
        "details",
        "children",
    );
    warnMissingName("InternationalPatientSummary", p.label, p["aria-label"], p["aria-labelledby"]);
    warnMissingProp(
        "InternationalPatientSummary",
        "omittedLabel",
        p.omittedLabel,
        "A missing required section must be shown in words.",
    );
    warnMissingProp(
        "InternationalPatientSummary",
        "requiredHeadings",
        p.requiredHeadings,
        "A missing required section needs a heading.",
    );
    const contents = () => ipsContents(p.sections, p.requiredHeadings ?? {}, p.idPrefix);
    return (
        <article
            class={`international-patient-summary ${p.class}`}
            aria-label={p.label}
            {...restProps}
        >
            {p.banner ? <div class="international-patient-summary-banner">{p.banner}</div> : null}
            {p.contentsLabel ? (
                <nav
                    class="international-patient-summary-contents"
                    aria-label={p.contentsLabel}
                >
                    <ol>
                        {contents().map((entry) => (
                            <li
                                data-section={attr(entry.key)}
                                data-status={attr(entry.status)}
                            >
                                <a href={`#${entry.id}`}>{entry.heading}</a>
                            </li>
                        ))}
                    </ol>
                </nav>
            ) : null}
            <div class="international-patient-summary-sections">
                {p.children}
                {contents()
                    .filter((entry) => entry.added)
                    .map((entry) => (
                        <InternationalPatientSummarySection
                            section={entry.key}
                            id={entry.id}
                            heading={entry.heading}
                            headingLevel={p.headingLevel}
                            status="omitted"
                            statusLabel={p.omittedLabel}
                        />
                    ))}
            </div>
            {p.details ? (
                <div class="international-patient-summary-details">{p.details}</div>
            ) : null}
        </article>
    );
}
