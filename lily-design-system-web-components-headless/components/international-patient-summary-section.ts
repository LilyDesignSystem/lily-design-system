// <lily-international-patient-summary-section> — one section of an International Patient Summary (HL7 FHIR IPS, ISO 27269):
// a <section> named by its heading, carrying the section's key, LOINC code, status and whether the IPS requires it, as data.
// For any status but "known" the status words are shown under the heading. A child with slot="narrative" goes into a
// <details> after the entries, summarised by narrative-label. See components/international-patient-summary-section.
import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";
import { ipsSectionCode, ipsSectionId, ipsSectionIsRequired } from "../lib/ips-sections.js";

const HANDLED = new Set([
    "section",
    "heading",
    "heading-level",
    "status",
    "status-label",
    "code",
    "required",
    "id",
    "narrative-label",
    "narrative-open",
]);

export interface SectionOptions {
    section: string;
    heading: string;
    headingLevel?: number;
    status?: string;
    statusLabel?: string;
    code?: string;
    required?: boolean;
    id?: string;
    className?: string;
}

/** Build the section element; InternationalPatientSummary uses it for an added, missing required section. */
export function buildIpsSection(o: SectionOptions): HTMLElement {
    const id = ipsSectionId(o.section, o.id);
    const status = o.status || "known";
    const section = document.createElement("section");
    section.className = o.className ?? "international-patient-summary-section";
    section.id = id;
    section.setAttribute("aria-labelledby", `${id}-heading`);
    section.setAttribute("data-section", o.section);
    const code = o.code ?? ipsSectionCode(o.section);
    if (code) section.setAttribute("data-code", code);
    section.setAttribute("data-status", status);
    if (o.required ?? ipsSectionIsRequired(o.section))
        section.setAttribute("data-required", "true");
    const level = [2, 3, 4, 5, 6].includes(o.headingLevel ?? 2) ? (o.headingLevel ?? 2) : 2;
    const heading = document.createElement(`h${level}`);
    heading.id = `${id}-heading`;
    heading.className = "international-patient-summary-section-heading";
    heading.textContent = o.heading;
    section.append(heading);
    if (status !== "known" && o.statusLabel) {
        const p = document.createElement("p");
        p.className = "international-patient-summary-section-status";
        p.textContent = o.statusLabel;
        section.append(p);
    }
    return section;
}

export class InternationalPatientSummarySection extends HTMLElement {
    connectedCallback(): void {
        if (this.querySelector(":scope > section.international-patient-summary-section")) return;
        const required = this.getAttribute("required");
        const section = buildIpsSection({
            section: this.getAttribute("section") ?? "",
            heading: this.getAttribute("heading") ?? "",
            headingLevel: Number(this.getAttribute("heading-level") ?? 2),
            status: this.getAttribute("status") ?? "known",
            statusLabel: this.getAttribute("status-label") ?? "",
            code: this.getAttribute("code") ?? undefined,
            required: required === null ? undefined : required !== "false",
            id: this.getAttribute("id") ?? undefined,
            className: rootClassName(this, "international-patient-summary-section"),
        });
        this.removeAttribute("id");
        passThroughAttributes(this, section, HANDLED);
        const narrative = [...this.children].filter((c) => c.getAttribute("slot") === "narrative");
        for (const n of narrative) n.remove();
        moveChildrenInto(this, section);
        if (narrative.length) {
            const details = document.createElement("details");
            details.className = "international-patient-summary-section-narrative";
            if (this.hasAttribute("narrative-open")) details.open = true;
            const summary = document.createElement("summary");
            summary.textContent = this.getAttribute("narrative-label") ?? "";
            details.append(summary);
            for (const n of narrative) {
                n.removeAttribute("slot");
                details.append(n);
            }
            section.append(details);
        }
        this.appendChild(section);
    }
}
