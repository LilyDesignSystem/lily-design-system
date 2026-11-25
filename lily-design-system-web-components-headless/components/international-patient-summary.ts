// <lily-international-patient-summary> — an International Patient Summary (HL7 FHIR IPS, ISO 27269) laid out for a
// clinician: an <article> holding the child with slot="banner", a contents navigation, the sections (the other children) and
// the child with slot="details". Structure only: no FHIR parsing. The `sections` attribute (JSON: [{ key, heading, status?,
// id? }]) lists the sections in document order; for each required section (medications, allergies, problems) it lacks, the
// element adds that section with the heading from `required-headings` (JSON) and `omitted-label`, after the given sections,
// with a contents link to it. See components/international-patient-summary.
import { moveChildrenInto, passThroughAttributes, rootClassName } from "../lib/dom-utils.js";
import { ipsContents } from "../lib/ips-sections.js";
import type { IpsSectionEntry } from "../lib/ips-sections.js";
import { LiveElement, setOrRemove } from "../lib/live-element.js";
import { buildIpsSection } from "./international-patient-summary-section.js";

const HANDLED = new Set([
    "label",
    "sections",
    "required-headings",
    "omitted-label",
    "contents-label",
    "heading-level",
    "id-prefix",
]);

function parseJson<T>(text: string | null, fallback: T): T {
    if (!text) return fallback;
    try {
        return JSON.parse(text) as T;
    } catch {
        return fallback;
    }
}

export class InternationalPatientSummary extends LiveElement {
    // The sections this element added for the required ones the summary lacks.
    #added: HTMLElement[] = [];

    #contents(contents: ReturnType<typeof ipsContents>): HTMLElement | null {
        const label = this.getAttribute("contents-label");
        if (!label) return null;
        const nav = document.createElement("nav");
        nav.className = "international-patient-summary-contents";
        nav.setAttribute("aria-label", label);
        const ol = document.createElement("ol");
        for (const entry of contents) {
            const li = document.createElement("li");
            li.setAttribute("data-section", entry.key);
            li.setAttribute("data-status", entry.status);
            const a = document.createElement("a");
            a.href = `#${entry.id}`;
            a.textContent = entry.heading;
            li.append(a);
            ol.append(li);
        }
        nav.append(ol);
        return nav;
    }

    #omitted(contents: ReturnType<typeof ipsContents>): HTMLElement[] {
        return contents
            .filter((entry) => entry.added)
            .map((entry) =>
                buildIpsSection({
                    section: entry.key,
                    id: entry.id,
                    heading: entry.heading,
                    headingLevel: Number(this.getAttribute("heading-level") ?? 2),
                    status: "omitted",
                    statusLabel: this.text("omitted-label"),
                }),
            );
    }

    static get observedAttributes(): string[] {
        return [...HANDLED, "class"];
    }

    protected update(): void {
        const existing = this.querySelector<HTMLElement>(
            ":scope > article.international-patient-summary",
        );
        const sections = parseJson<IpsSectionEntry[]>(this.getAttribute("sections"), []);
        const headings = parseJson<Record<string, string>>(
            this.getAttribute("required-headings"),
            {},
        );
        const contents = ipsContents(
            sections,
            headings,
            this.getAttribute("id-prefix") ?? undefined,
        );
        const article = existing ?? document.createElement("article");
        article.className = rootClassName(this, "international-patient-summary");
        setOrRemove(article, "aria-label", this.getAttribute("label"));
        if (existing) {
            existing.querySelector(":scope > .international-patient-summary-contents")?.remove();
            const nav = this.#contents(contents);
            const body = existing.querySelector(":scope > .international-patient-summary-sections");
            if (nav) body?.before(nav);
            for (const added of this.#added) added.remove();
            this.#added = this.#omitted(contents);
            body?.append(...this.#added);
            return;
        }
        passThroughAttributes(this, article, HANDLED);

        const bySlot = (name: string) =>
            [...this.children].filter((c) => c.getAttribute("slot") === name);
        const banner = bySlot("banner");
        const details = bySlot("details");
        for (const el of [...banner, ...details]) {
            el.remove();
            el.removeAttribute("slot");
        }

        if (banner.length) {
            const div = document.createElement("div");
            div.className = "international-patient-summary-banner";
            div.append(...banner);
            article.append(div);
        }
        const nav = this.#contents(contents);
        if (nav) article.append(nav);
        const body = document.createElement("div");
        body.className = "international-patient-summary-sections";
        moveChildrenInto(this, body);
        this.#added = this.#omitted(contents);
        body.append(...this.#added);
        article.append(body);
        if (details.length) {
            const div = document.createElement("div");
            div.className = "international-patient-summary-details";
            div.append(...details);
            article.append(div);
        }
        this.appendChild(article);
    }
}
