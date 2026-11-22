import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "./dev-warning";
import Subject from "./InternationalPatientSummarySection";

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("InternationalPatientSummarySection", () => {
    test("is a section named by its heading, with its key, LOINC code, status and required flag", () => {
        render(
            <Subject
                section="allergies"
                heading="Allergies and intolerances"
            >
                <p>Peanut</p>
            </Subject>,
        );
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
            render(
                <Subject
                    section="problems"
                    heading="Problem list"
                    status={status}
                    statusLabel="In words"
                />,
            );
            const region = screen.getByRole("region", { name: "Problem list" });
            expect(
                region.querySelector(".international-patient-summary-section-status")!.textContent,
            ).toBe("In words");
        },
    );

    test("an optional section is not required, and the heading level is the one asked for", () => {
        render(
            <Subject
                section="results"
                heading="Results"
                headingLevel={3}
            />,
        );
        expect(screen.getByRole("region", { name: "Results" }).hasAttribute("data-required")).toBe(
            false,
        );
        expect(screen.getByRole("heading", { level: 3, name: "Results" })).toBeTruthy();
    });

    test("the narrative sits in a details, open when asked", () => {
        render(
            <Subject
                section="patient-story"
                heading="Patient story"
                narrative={<p>Lives alone.</p>}
                narrativeLabel="Narrative from the document"
                narrativeOpen
            />,
        );
        const details = document.querySelector("details") as HTMLDetailsElement;
        expect(details.open).toBe(true);
        expect(details.querySelector("summary")!.textContent).toBe("Narrative from the document");
    });

    test("warns in development when a status that is not known has no words", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(
            <Subject
                section="problems"
                heading="Problem list"
                status="unavailable"
            />,
        );
        expect(warn).toHaveBeenCalled();
    });

    describe("statusPlacement (P42-T6)", () => {
        const words = (region: HTMLElement) =>
            (region.textContent ?? "").split("In words").length - 1;

        test('"list" leaves the words to the record list: they appear once', () => {
            render(
                <Subject
                    section="problems"
                    heading="Problem list"
                    status="unavailable"
                    statusLabel="In words"
                    statusPlacement="list"
                >
                    <ul class="record-list">
                        <li class="record-list-status">In words</li>
                    </ul>
                </Subject>,
            );
            const region = screen.getByRole("region", { name: "Problem list" });
            expect(words(region)).toBe(1);
            expect(
                region.querySelector(".international-patient-summary-section-status"),
            ).toBeNull();
            expect(region.getAttribute("data-status")).toBe("unavailable");
        });

        test('"heading", the default, still prints the status line', () => {
            render(
                <Subject
                    section="problems"
                    heading="Problem list"
                    status="unavailable"
                    statusLabel="In words"
                />,
            );
            const region = screen.getByRole("region", { name: "Problem list" });
            expect(
                region.querySelector(".international-patient-summary-section-status")!.textContent,
            ).toBe("In words");
        });

        test('"list" needs no statusLabel, so there is no development warning', () => {
            const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
            render(
                <Subject
                    section="problems"
                    heading="Problem list"
                    status="unavailable"
                    statusPlacement="list"
                />,
            );
            expect(warn).not.toHaveBeenCalled();
        });
    });
});
