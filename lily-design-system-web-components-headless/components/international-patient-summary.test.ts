import { afterEach, describe, expect, test } from "vitest";

import { InternationalPatientSummary } from "./international-patient-summary.js";
import { InternationalPatientSummarySection } from "./international-patient-summary-section.js";

if (!customElements.get("lily-international-patient-summary"))
    customElements.define("lily-international-patient-summary", InternationalPatientSummary);
if (!customElements.get("lily-international-patient-summary-section"))
    customElements.define(
        "lily-international-patient-summary-section",
        InternationalPatientSummarySection,
    );

const headings = JSON.stringify({
    medications: "Medication summary",
    allergies: "Allergies and intolerances",
    problems: "Problem list",
});

function mount(sections: object[], extra = "") {
    document.body.innerHTML = `<lily-international-patient-summary label="Patient summary" omitted-label="Section missing from document" required-headings='${headings}' sections='${JSON.stringify(sections)}' ${extra}><p slot="banner">Banner</p><section class="given">Entries</section><p slot="details">Details</p></lily-international-patient-summary>`;
    return document.querySelector("article.international-patient-summary") as HTMLElement;
}

afterEach(() => {
    document.body.innerHTML = "";
});

describe("InternationalPatientSummary", () => {
    test("renders an article named by its label, banner first and details last", () => {
        const article = mount([
            { key: "medications", heading: "Medication summary" },
            { key: "allergies", heading: "Allergies and intolerances" },
            { key: "problems", heading: "Problem list" },
        ]);
        expect(article.getAttribute("aria-label")).toBe("Patient summary");
        const parts = [...article.children].map((c) => c.getAttribute("class"));
        expect(parts[0]).toBe("international-patient-summary-banner");
        expect(parts[parts.length - 1]).toBe("international-patient-summary-details");
        expect(
            article.querySelector(".international-patient-summary-sections .given"),
        ).toBeTruthy();
        expect(article.querySelectorAll('section[data-status="omitted"]')).toHaveLength(0);
    });

    test("HC-C10: adds each missing required section, in words, after the given sections", () => {
        const article = mount([{ key: "problems", heading: "Problem list", status: "none-known" }]);
        const added = [...article.querySelectorAll('section[data-status="omitted"]')];
        expect(added.map((s) => s.getAttribute("data-section"))).toEqual([
            "medications",
            "allergies",
        ]);
        for (const s of added) {
            expect(s.getAttribute("data-required")).toBe("true");
            expect(s.textContent).toContain("Section missing from document");
        }
    });

    test("the contents follow the list, then the missing required sections, and only with contents-label", () => {
        expect(mount([]).querySelector("nav")).toBeNull();
        const article = mount(
            [
                { key: "allergies", heading: "Allergies and intolerances" },
                { key: "results", heading: "Results", status: "not-recorded" },
            ],
            'contents-label="Contents"',
        );
        const links = [...article.querySelectorAll("nav.international-patient-summary-contents a")];
        expect(links.map((a) => a.textContent)).toEqual([
            "Allergies and intolerances",
            "Results",
            "Medication summary",
            "Problem list",
        ]);
        expect(links[1].getAttribute("href")).toBe("#international-patient-summary-results");
        expect(links[2].closest("li")!.getAttribute("data-status")).toBe("omitted");
    });

    test("id-prefix gives the added sections and the contents links their own ids", () => {
        const article = mount([], 'contents-label="Contents" id-prefix="second"');
        expect(article.querySelector("#second-medications")!.getAttribute("data-status")).toBe(
            "omitted",
        );
        expect(article.querySelector("nav a")!.getAttribute("href")).toBe("#second-medications");
    });
});
