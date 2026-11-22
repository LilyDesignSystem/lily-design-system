// <lily-international-patient-summary-section> — one section of an International Patient Summary (HL7 FHIR IPS, ISO 27269):
// a <section> named by its heading, carrying the section's key, LOINC code, status and whether the IPS requires it, as data.
// For any status but "known" the status words are shown under the heading. A child with slot="narrative" goes into a
// <details> after the entries, summarised by narrative-label. Children with slot="meta" and slot="warning" sit between the
// heading and the entries. See components/international-patient-summary-section.
import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";
import {
    ipsSectionCode,
    ipsSectionId,
    ipsSectionIsRequired,
    ipsSectionLevel,
} from "../lib/ips-sections.js";

const HANDLED = new Set([
    "section",
    "heading",
    "heading-level",
    "status",
    "status-label",
    "status-placement",
    "code",
    "required",
    "level",
    "id",
    "narrative-label",
    "narrative-open",
    "id-prefix",
]);

export interface SectionOptions {
    section: string;
    heading: string;
    headingLevel?: number;
    status?: string;
    statusLabel?: string;
    /** Where a status other than "known" is said in words: "heading" (default) prints the status label under the heading; "list" leaves the words to the record list inside, whose own status item says them, so they are not shown twice. */
    statusPlacement?: string;
    code?: string;
    required?: boolean;
    /** The section's level in the IPS: "required", "recommended" or "optional". Default the registry's level for the key; data-level. */
    level?: string;
    id?: string;
    idPrefix?: string;
    className?: string;
}

/** Build the section element; InternationalPatientSummary uses it for an added, missing required section. */
export function buildIpsSection(o: SectionOptions): HTMLElement {
    const id = ipsSectionId(o.section, o.id, o.idPrefix);
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
    const sectionLevel = o.level ?? ipsSectionLevel(o.section);
    if (sectionLevel) section.setAttribute("data-level", sectionLevel);
    const level = [2, 3, 4, 5, 6].includes(o.headingLevel ?? 2) ? (o.headingLevel ?? 2) : 2;
    const heading = document.createElement(`h${level}`);
    heading.id = `${id}-heading`;
    heading.className = "international-patient-summary-section-heading";
    heading.textContent = o.heading;
    section.append(heading);
    if (status !== "known" && o.statusLabel && o.statusPlacement !== "list") {
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
            statusPlacement: this.getAttribute("status-placement") ?? "heading",
            code: this.getAttribute("code") ?? undefined,
            required: required === null ? undefined : required !== "false",
            level: this.getAttribute("level") ?? undefined,
            id: this.getAttribute("id") ?? undefined,
            idPrefix: this.getAttribute("id-prefix") ?? undefined,
            className: rootClassName(this, "international-patient-summary-section"),
        });
        this.removeAttribute("id");
        passThroughAttributes(this, section, HANDLED);
        const slotted = (name: string) =>
            [...this.children].filter((c) => c.getAttribute("slot") === name);
        const narrative = slotted("narrative");
        for (const n of narrative) n.remove();
        // A child with slot="meta" or slot="warning" goes between the heading (and status) and the entries; nothing without one.
        for (const name of ["meta", "warning"]) {
            const parts = slotted(name);
            if (!parts.length) continue;
            const box = document.createElement("div");
            box.className = `international-patient-summary-section-${name}`;
            for (const part of parts) {
                part.removeAttribute("slot");
                box.append(part);
            }
            section.append(box);
        }
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
