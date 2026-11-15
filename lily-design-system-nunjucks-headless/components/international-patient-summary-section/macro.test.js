import { describe, expect, it } from "vitest";
import { render } from "../../test/render.js";

describe("international-patient-summary-section", () => {
    it("renders a section named by its heading, with its key, LOINC code, status and required flag", () => {
        const { document } = render("international-patient-summary-section", {
            section: "allergies",
            heading: "Allergies and intolerances",
            html: "<p>Peanut</p>",
        });
        const section = document.querySelector("section.international-patient-summary-section");
        const heading = section.querySelector("h2");
        expect(section.getAttribute("aria-labelledby")).toBe(heading.id);
        expect(heading.textContent).toBe("Allergies and intolerances");
        expect(section.id).toBe("international-patient-summary-allergies");
        expect(section.getAttribute("data-code")).toBe("48765-2");
        expect(section.getAttribute("data-status")).toBe("known");
        expect(section.getAttribute("data-required")).toBe("true");
        expect(section.textContent).toContain("Peanut");
        expect(section.querySelector(".international-patient-summary-section-status")).toBeNull();
    });

    it.each(["none-known", "not-recorded", "unavailable", "omitted"])(
        "shows the status words when the status is %s",
        (status) => {
            const { document } = render("international-patient-summary-section", {
                section: "problems",
                heading: "Problem list",
                status,
                statusLabel: "In words",
            });
            expect(
                document.querySelector(".international-patient-summary-section-status").textContent,
            ).toBe("In words");
        },
    );

    it("an optional section is not required, and the heading level is the one asked for", () => {
        const { document } = render("international-patient-summary-section", {
            section: "results",
            heading: "Results",
            headingLevel: 3,
        });
        expect(document.querySelector("section").hasAttribute("data-required")).toBe(false);
        expect(document.querySelector("h3").textContent).toBe("Results");
    });

    it("the narrative sits in a details, open when asked", () => {
        const { document } = render("international-patient-summary-section", {
            section: "patient-story",
            heading: "Patient story",
            narrative: "<p>Lives alone.</p>",
            narrativeLabel: "Narrative from the document",
            narrativeOpen: true,
        });
        const details = document.querySelector(
            "details.international-patient-summary-section-narrative",
        );
        expect(details.hasAttribute("open")).toBe(true);
        expect(details.querySelector("summary").textContent).toBe("Narrative from the document");
        expect(details.textContent).toContain("Lives alone.");
    });
});
