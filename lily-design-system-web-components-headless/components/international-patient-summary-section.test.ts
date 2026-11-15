import { afterEach, describe, expect, test } from "vitest";

import { InternationalPatientSummarySection } from "./international-patient-summary-section.js";

if (!customElements.get("lily-international-patient-summary-section"))
    customElements.define(
        "lily-international-patient-summary-section",
        InternationalPatientSummarySection,
    );

afterEach(() => {
    document.body.innerHTML = "";
});

describe("InternationalPatientSummarySection", () => {
    test("renders a section named by its heading, with its key, LOINC code, status and required flag", () => {
        document.body.innerHTML = `<lily-international-patient-summary-section section="allergies" heading="Allergies and intolerances"><p>Peanut</p></lily-international-patient-summary-section>`;
        const section = document.querySelector(
            "section.international-patient-summary-section",
        ) as HTMLElement;
        const heading = section.querySelector("h2")!;
        expect(section.getAttribute("aria-labelledby")).toBe(heading.id);
        expect(section.id).toBe("international-patient-summary-allergies");
        expect(section.getAttribute("data-code")).toBe("48765-2");
        expect(section.getAttribute("data-status")).toBe("known");
        expect(section.getAttribute("data-required")).toBe("true");
        expect(section.textContent).toContain("Peanut");
    });

    test.each(["none-known", "not-recorded", "unavailable", "omitted"])(
        "shows the status words when the status is %s",
        (status) => {
            document.body.innerHTML = `<lily-international-patient-summary-section section="problems" heading="Problem list" status="${status}" status-label="In words"></lily-international-patient-summary-section>`;
            expect(
                document.querySelector(".international-patient-summary-section-status")!
                    .textContent,
            ).toBe("In words");
        },
    );

    test("an optional section is not required, and the heading level is the one asked for", () => {
        document.body.innerHTML = `<lily-international-patient-summary-section section="results" heading="Results" heading-level="3"></lily-international-patient-summary-section>`;
        expect(document.querySelector("section")!.hasAttribute("data-required")).toBe(false);
        expect(document.querySelector("h3")!.textContent).toBe("Results");
    });

    test("a slot=narrative child sits in a details, open when asked", () => {
        document.body.innerHTML = `<lily-international-patient-summary-section section="patient-story" heading="Patient story" narrative-label="Narrative from the document" narrative-open><p>Entry</p><div slot="narrative"><p>Lives alone.</p></div></lily-international-patient-summary-section>`;
        const details = document.querySelector(
            "details.international-patient-summary-section-narrative",
        ) as HTMLDetailsElement;
        expect(details.open).toBe(true);
        expect(details.querySelector("summary")!.textContent).toBe("Narrative from the document");
        expect(details.textContent).toContain("Lives alone.");
        expect(document.querySelector("section > p")!.textContent).toBe("Entry");
    });
});
