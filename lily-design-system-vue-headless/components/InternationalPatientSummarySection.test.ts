import { render, screen } from "@testing-library/vue";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import Subject from "./InternationalPatientSummarySection.vue";

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("InternationalPatientSummarySection", () => {
    test("is a section named by its heading, with its key, LOINC code, status and required flag", () => {
        render(Subject, {
            props: { section: "allergies", heading: "Allergies and intolerances" },
            slots: { default: "<p>Peanut</p>" },
        });
        const region = screen.getByRole("region", { name: "Allergies and intolerances" });
        expect(region.id).toBe("international-patient-summary-allergies");
        expect(region.getAttribute("data-code")).toBe("48765-2");
        expect(region.getAttribute("data-status")).toBe("known");
        expect(region.getAttribute("data-required")).toBe("true");
        expect(region.textContent).toContain("Peanut");
    });

    test.each(["none-known", "not-recorded", "unavailable", "omitted"] as const)(
        "shows the status words when the status is %s",
        (status) => {
            render(Subject, {
                props: {
                    section: "problems",
                    heading: "Problem list",
                    status,
                    statusLabel: "In words",
                },
            });
            const region = screen.getByRole("region", { name: "Problem list" });
            expect(
                region
                    .querySelector(".international-patient-summary-section-status")!
                    .textContent!.trim(),
            ).toBe("In words");
        },
    );

    test("an optional section is not required, and the heading level is the one asked for", () => {
        render(Subject, { props: { section: "results", heading: "Results", headingLevel: 3 } });
        expect(screen.getByRole("region", { name: "Results" }).hasAttribute("data-required")).toBe(
            false,
        );
        expect(screen.getByRole("heading", { level: 3, name: "Results" })).toBeTruthy();
    });

    test("the narrative sits in a details, open when asked", () => {
        render(Subject, {
            props: {
                section: "patient-story",
                heading: "Patient story",
                narrativeLabel: "Narrative from the document",
                narrativeOpen: true,
            },
            slots: { narrative: "<p>Lives alone.</p>" },
        });
        const details = document.querySelector("details") as HTMLDetailsElement;
        expect(details.open).toBe(true);
        expect(details.querySelector("summary")!.textContent).toBe("Narrative from the document");
        expect(details.textContent).toContain("Lives alone.");
    });

    test("warns in development when a status that is not known has no words", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(Subject, {
            props: { section: "problems", heading: "Problem list", status: "unavailable" },
        });
        expect(warn).toHaveBeenCalled();
    });
});
