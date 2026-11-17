// InternationalPatientSummarySection component
//
// One section of an International Patient Summary (HL7 FHIR IPS, ISO 27269): a <section> named by its heading, carrying the
// section's key, LOINC code, status and whether the IPS requires it, as data. Its entries are the consumer's; its status is
// never blank, and for any status but "known" the consumer's words are shown under the heading. The author's narrative, when
// given, sits in a <details> after the entries. See components/international-patient-summary-section/index.md.
import { dynamic, type JSX } from "@solidjs/web";
import { omit } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
import { warnMissingProp } from "./dev-warning";
import { ipsSectionCode, ipsSectionId, ipsSectionIsRequired } from "./ips-sections";
import type { IpsSectionStatus } from "./ips-sections";

export interface InternationalPatientSummarySectionProps {
    class?: string;
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
    narrative?: JSX.Element;
    narrativeLabel?: string;
    narrativeOpen?: boolean;
    children?: JSX.Element;
    [key: string]: unknown;
}

export default function InternationalPatientSummarySection(
    props: InternationalPatientSummarySectionProps,
) {
    const p = withDefaults(
        { class: "" as const, headingLevel: 2, status: "known" as const, narrativeOpen: false },
        props,
    );
    const restProps = omit(
        p,
        "class",
        "section",
        "heading",
        "headingLevel",
        "status",
        "statusLabel",
        "code",
        "required",
        "id",
        "idPrefix",
        "narrative",
        "narrativeLabel",
        "narrativeOpen",
        "children",
    );
    warnMissingProp(
        "InternationalPatientSummarySection",
        "heading",
        p.heading,
        "A section needs a heading.",
    );
    if (p.status !== "known") {
        warnMissingProp(
            "InternationalPatientSummarySection",
            "statusLabel",
            p.statusLabel,
            "A section that is not known must say why, in words.",
        );
    }
    if (p.narrative) {
        warnMissingProp(
            "InternationalPatientSummarySection",
            "narrativeLabel",
            p.narrativeLabel,
            "The narrative's disclosure needs a summary.",
        );
    }
    const sectionId = () => ipsSectionId(p.section, p.id, p.idPrefix);
    const headingId = () => `${sectionId()}-heading`;
    const isRequired = () => p.required ?? ipsSectionIsRequired(p.section);
    const Heading = dynamic(() => `h${p.headingLevel}` as "h2");
    return (
        <section
            class={`international-patient-summary-section ${p.class}`}
            id={sectionId()}
            aria-labelledby={headingId()}
            data-section={attr(p.section)}
            data-code={attr(p.code ?? ipsSectionCode(p.section))}
            data-status={attr(p.status)}
            data-required={attr(isRequired() ? "true" : undefined)}
            {...restProps}
        >
            <Heading
                id={headingId()}
                class="international-patient-summary-section-heading"
            >
                {p.heading}
            </Heading>
            {p.status !== "known" && p.statusLabel ? (
                <p class="international-patient-summary-section-status">{p.statusLabel}</p>
            ) : null}
            {p.children}
            {p.narrative ? (
                <details
                    class="international-patient-summary-section-narrative"
                    open={p.narrativeOpen}
                >
                    <summary>{p.narrativeLabel}</summary>
                    {p.narrative}
                </details>
            ) : null}
        </section>
    );
}
