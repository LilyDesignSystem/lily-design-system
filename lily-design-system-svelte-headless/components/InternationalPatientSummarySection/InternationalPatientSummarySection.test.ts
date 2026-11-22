import { render, screen } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import { afterEach, describe, expect, test, vi } from "vitest";

import { resetDevWarnings } from "../dev-warning";
import Subject from "./InternationalPatientSummarySection.svelte";

const html = (markup: string) => createRawSnippet(() => ({ render: () => markup }));

afterEach(() => {
    vi.restoreAllMocks();
    resetDevWarnings();
});

describe("InternationalPatientSummarySection", () => {
    test("is a section named by its heading, carrying its key, LOINC code, status and required flag", () => {
        render(Subject, {
            props: {
                section: "allergies",
                heading: "Allergies and intolerances",
                children: html("<ul><li>Peanut</li></ul>"),
            },
        });
        const region = screen.getByRole("region", { name: "Allergies and intolerances" });
        expect(region.tagName).toBe("SECTION");
        expect(region.getAttribute("class")).toContain("international-patient-summary-section");
        expect(region.id).toBe("international-patient-summary-allergies");
        expect(region.getAttribute("data-section")).toBe("allergies");
        expect(region.getAttribute("data-code")).toBe("48765-2");
        expect(region.getAttribute("data-status")).toBe("known");
        expect(region.getAttribute("data-required")).toBe("true");
        expect(region.textContent).toContain("Peanut");
        expect(region.querySelector(".international-patient-summary-section-status")).toBeNull();
    });

    test("an optional section is not marked required", () => {
        render(Subject, { props: { section: "results", heading: "Results" } });
        expect(screen.getByRole("region", { name: "Results" }).hasAttribute("data-required")).toBe(
            false,
        );
    });

    test.each(["none-known", "not-recorded", "unavailable", "omitted"] as const)(
        "shows the status words under the heading when the status is %s",
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
            expect(region.getAttribute("data-status")).toBe(status);
            expect(
                region.querySelector(".international-patient-summary-section-status")!.textContent,
            ).toBe("In words");
        },
    );

    test("uses the heading level asked for", () => {
        render(Subject, { props: { section: "results", heading: "Results", headingLevel: 3 } });
        expect(screen.getByRole("heading", { level: 3, name: "Results" })).toBeTruthy();
    });

    test("the narrative sits in a details, open when asked", () => {
        render(Subject, {
            props: {
                section: "patient-story",
                heading: "Patient story",
                narrative: html("<p>Lives alone.</p>"),
                narrativeLabel: "Narrative from the document",
                narrativeOpen: true,
            },
        });
        const details = document.querySelector(
            "details.international-patient-summary-section-narrative",
        ) as HTMLDetailsElement;
        expect(details.open).toBe(true);
        expect(details.querySelector("summary")!.textContent).toBe("Narrative from the document");
        expect(details.textContent).toContain("Lives alone.");
    });

    test("a given id and code win over the defaults", () => {
        render(Subject, {
            props: { section: "custom", heading: "Other", id: "mine", code: "12345-6" },
        });
        const region = screen.getByRole("region", { name: "Other" });
        expect(region.id).toBe("mine");
        expect(region.getAttribute("data-code")).toBe("12345-6");
    });

    test("warns in development when a status that is not known has no words", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
        render(Subject, {
            props: { section: "problems", heading: "Problem list", status: "unavailable" },
        });
        expect(warn).toHaveBeenCalled();
    });

    describe("statusPlacement (P42-T6)", () => {
        const words = (region: HTMLElement) =>
            (region.textContent ?? "").split("In words").length - 1;

        test('"list" leaves the words to the record list: they appear once', () => {
            render(Subject, {
                props: {
                    section: "problems",
                    heading: "Problem list",
                    status: "unavailable",
                    statusLabel: "In words",
                    statusPlacement: "list",
                    children: html(
                        '<ul class="record-list"><li class="record-list-status">In words</li></ul>',
                    ),
                },
            });
            const region = screen.getByRole("region", { name: "Problem list" });
            expect(words(region)).toBe(1);
            expect(
                region.querySelector(".international-patient-summary-section-status"),
            ).toBeNull();
            expect(region.getAttribute("data-status")).toBe("unavailable");
        });

        test('"heading", the default, still prints the status line', () => {
            render(Subject, {
                props: {
                    section: "problems",
                    heading: "Problem list",
                    status: "unavailable",
                    statusLabel: "In words",
                },
            });
            const region = screen.getByRole("region", { name: "Problem list" });
            expect(
                region.querySelector(".international-patient-summary-section-status")!.textContent,
            ).toBe("In words");
        });

        test('"list" needs no statusLabel, so there is no development warning', () => {
            const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
            render(Subject, {
                props: {
                    section: "problems",
                    heading: "Problem list",
                    status: "unavailable",
                    statusPlacement: "list",
                },
            });
            expect(warn).not.toHaveBeenCalled();
        });
    });
});
