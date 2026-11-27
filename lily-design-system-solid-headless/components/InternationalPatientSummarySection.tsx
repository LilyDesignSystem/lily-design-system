// InternationalPatientSummarySection component
//
// One section of an International Patient Summary (HL7 FHIR IPS, ISO 27269): a <section> named by its heading, carrying the
// section's key, LOINC code, status and whether the IPS requires it, as data. Its entries are the consumer's; its status is
// never blank, and for any status but "known" the consumer's words are shown under the heading. The author's narrative, when
// given, sits in a <details> after the entries. See components/international-patient-summary-section/index.md.
import { dynamic, type JSX } from "@solidjs/web";
import { createEffect, createSignal, omit } from "solid-js";
import { withDefaults } from "./defaults";
import { attr } from "./attr";
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
    class?: string;
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
    meta?: JSX.Element;
    /** A notice about the entries, after `meta` and before them. Nothing is rendered without it. */
    warning?: JSX.Element;
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
        "statusPlacement",
        "code",
        "required",
        "level",
        "meta",
        "warning",
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
    if (p.status !== "known" && p.statusPlacement !== "list") {
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
    // "None known" is never printed above a record list that holds an entry (HC-C17, tasks.md P50-T29).
    let root: HTMLElement | undefined;
    const [listInConflict, setListInConflict] = createSignal(false);
    createEffect(
        () => p.status,
        (status) => {
            if (status !== "none-known" || !root) {
                setListInConflict(false);
                return;
            }
            return watchConflict(root, setListInConflict);
        },
    );
    return (
        <section
            ref={root}
            class={`international-patient-summary-section ${p.class}`}
            id={sectionId()}
            aria-labelledby={headingId()}
            data-section={attr(p.section)}
            data-code={attr(p.code ?? ipsSectionCode(p.section))}
            data-status={attr(p.status)}
            data-required={attr(isRequired() ? "true" : undefined)}
            data-level={attr(p.level ?? ipsSectionLevel(p.section))}
            {...restProps}
        >
            <Heading
                id={headingId()}
                class="international-patient-summary-section-heading"
            >
                {p.heading}
            </Heading>
            {p.status !== "known" &&
            p.statusLabel &&
            p.statusPlacement !== "list" &&
            !listInConflict() ? (
                <p class="international-patient-summary-section-status">{p.statusLabel}</p>
            ) : null}
            {p.meta ? <div class="international-patient-summary-section-meta">{p.meta}</div> : null}
            {p.warning ? (
                <div class="international-patient-summary-section-warning">{p.warning}</div>
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
